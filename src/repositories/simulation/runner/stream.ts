/**
 * Modelo de corriente (stream) entre equipos.
 */

import {
  gasPropsFromApi,
  gasPropsFromChromatography,
  chromatographyFromComposition,
  MoleFractionItem,
} from '../thermo/gas-props';
import { resolveGasRates } from '../thermo/gas-rates';
import type { ChromatographyResult } from '../thermo/chromatography';

export interface Stream {
  id: string;
  name: string;
  temperature: number;
  pressure: number;
  liquidFlow_BPD: number;
  gasFlow_MMSCFD: number;
  /** GOR efectivo scf/bbl */
  gor: number;
  gorSource?: string;
  gasFlowSource?: string;
  waterFraction: number;
  freeWaterFraction: number;
  emulsifiedWaterFraction: number;
  apiGravity: number;
  liquidDensity: number;
  gasDensity: number;
  gasMW: number;
  gasSG: number;
  bsw: number;
  waterFlow_BPD: number;
  oilFlow_BPD: number;
  phase: 'liquid' | 'two-phase' | 'vapor';
  chromatography?: ChromatographyResult;
}

export interface InletFeedParams {
  totalFlow_BPD: number;
  apiGravity: number;
  waterFraction?: number;
  bsw?: number;
  freeWaterPct?: number;
  emulsifiedWaterPct?: number;
  temperature: number;
  pressure: number;
  gasFlow_MMSCFD?: number;
  gor?: number;
  /**
   * Si true (default), genera o aplica cromatografía para densidades de gas.
   * Si false, solo estima MW≈20 sin composición detallada.
   */
  useChromatography?: boolean;
  /** Composición molar cargada (reemplaza generación desde °API). */
  chromatography?: MoleFractionItem[];
  waterMolFrac?: number;
}

export interface ResolvedWater {
  waterFraction: number;
  freeWaterFraction: number;
  emulsifiedWaterFraction: number;
  bsw: number;
}

export function resolveWaterFractions(params: {
  waterFraction?: number;
  bsw?: number;
  freeWaterPct?: number;
  emulsifiedWaterPct?: number;
  apiGravity?: number;
}): ResolvedWater {
  const hasFree = params.freeWaterPct != null;
  const hasEmul = params.emulsifiedWaterPct != null;

  let free = hasFree ? params.freeWaterPct! / 100 : undefined;
  let emul = hasEmul ? params.emulsifiedWaterPct! / 100 : undefined;

  let water: number;
  if (free != null && emul != null) {
    water = free + emul;
  } else if (params.bsw != null) {
    water = params.bsw / 100;
  } else if (params.waterFraction != null) {
    water = params.waterFraction;
  } else {
    water = 0;
  }
  water = clamp01(water);

  if (free == null || emul == null) {
    const api = params.apiGravity ?? 22;
    const emulsShare = clamp01(0.55 - 0.01 * (api - 10));
    if (free == null && emul == null) {
      emul = water * emulsShare;
      free = water - emul;
    } else if (free == null) {
      free = Math.max(0, water - (emul ?? 0));
      emul = emul ?? 0;
    } else {
      emul = Math.max(0, water - free);
    }
  }

  const sum = free + emul;
  if (sum > 1e-12 && Math.abs(sum - water) > 1e-6) {
    water = clamp01(sum);
  }

  return {
    waterFraction: water,
    freeWaterFraction: clamp01(free),
    emulsifiedWaterFraction: clamp01(emul),
    bsw: water * 100,
  };
}

export function createInletStream(params: InletFeedParams): Stream {
  const w = resolveWaterFractions(params);
  const sg = 141.5 / (params.apiGravity + 131.5);
  const rhoLiq = sg * 1000;
  const oilFlow = params.totalFlow_BPD * (1 - w.waterFraction);
  const waterFlow = params.totalFlow_BPD * w.waterFraction;
  const useChrom = params.useChromatography !== false;

  let gasMW: number;
  let gasSG: number;
  let gasDensity: number;
  let chromatography: ChromatographyResult | undefined;

  if (useChrom && params.chromatography?.length) {
    const chrom = chromatographyFromComposition(
      params.chromatography,
      params.apiGravity,
      params.gor,
    );
    const gp = gasPropsFromChromatography(
      chrom,
      params.temperature,
      params.pressure,
    );
    gasMW = gp.gasMW;
    gasSG = gp.gasSG;
    gasDensity = gp.gasDensity_kgm3;
    chromatography = gp.chromatography;
  } else if (useChrom) {
    const gp = gasPropsFromApi(
      params.apiGravity,
      params.temperature,
      params.pressure,
      params.gor,
      params.waterMolFrac ?? 0,
    );
    gasMW = gp.gasMW;
    gasSG = gp.gasSG;
    gasDensity = gp.gasDensity_kgm3;
    chromatography = gp.chromatography;
  } else {
    const T = params.temperature + 273.15;
    gasMW = 20;
    gasSG = gasMW / 28.97;
    gasDensity = (params.pressure * gasMW) / (8.314 * T);
  }

  const rates = resolveGasRates({
    oilFlow_BPD: oilFlow,
    apiGravity: params.apiGravity,
    gasFlow_MMSCFD: params.gasFlow_MMSCFD,
    gor: params.gor,
    chromEstimatedGor: chromatography?.estimatedGOR,
  });

  return {
    id: 'inlet',
    name: 'Entrada de pozo',
    temperature: params.temperature,
    pressure: params.pressure,
    liquidFlow_BPD: params.totalFlow_BPD,
    gasFlow_MMSCFD: rates.gasFlow_MMSCFD,
    gor: rates.gor,
    gorSource: rates.gorSource,
    gasFlowSource: rates.gasFlowSource,
    waterFraction: w.waterFraction,
    freeWaterFraction: w.freeWaterFraction,
    emulsifiedWaterFraction: w.emulsifiedWaterFraction,
    apiGravity: params.apiGravity,
    liquidDensity: rhoLiq,
    gasDensity,
    gasMW,
    gasSG,
    bsw: w.bsw,
    waterFlow_BPD: waterFlow,
    oilFlow_BPD: oilFlow,
    phase: 'two-phase',
    chromatography,
  };
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}
