/**
 * Modelo de separadores bifásicos horizontales y verticales.
 *
 * Calcula:
 * - Capacidad de gas (Souders-Brown) con densidad de gas de cromatografía
 * - Retención de líquido
 * - Retiro de agua libre/emulsionada vs °API (~80 % típico)
 * - Decantación Stokes + gota Stewart (2008)
 * - Autodimensionamiento
 *
 * Referencia: API 12J, GPSA Cap. 7, Stewart (2008)
 */

import {
  stewartDropRange,
  stokesSettlingVelocity_fts,
  estimateOilViscosity_cP,
  kgm3ToLbft3,
  separatorWaterRemovalEfficiency,
} from '../thermo/settling';

export type SeparatorOrientation = 'horizontal' | 'vertical';

export interface SeparatorCriterion {
  criterion: string;
  value: number;
  limit: string;
  passes: boolean;
}

export interface SeparatorInput {
  orientation: SeparatorOrientation;
  liquidFlowBPD: number;
  gasFlowMMSCFD?: number;
  /** Fracción de agua total (0-1) */
  waterFraction: number;
  /** Fracción libre (0-1); default split interno */
  freeWaterFraction?: number;
  /** Fracción emulsionada (0-1) */
  emulsifiedWaterFraction?: number;
  temperature: number;
  pressure: number;
  liquidDensity: number;
  gasDensity?: number;
  diameter?: number;
  length?: number;
  /** Retención de líquido requerida (min) */
  retentionTime?: number;
  apiGravity?: number;
  kFactor?: number;
  /** Override diámetro de gota µm (default Stewart 2008) */
  dropDiameter_um?: number;
}

export interface SeparatorResult {
  orientation: SeparatorOrientation;
  dimensions: {
    diameter_m: number;
    diameter_ft: number;
    length_m: number;
    length_ft: number;
    ldRatio: number;
    volume_m3: number;
  };
  gasCapacity: {
    maxGasFlow_MMSCFD: number;
    actualGasFlow_MMSCFD: number;
    criticalVelocity_ms: number;
    actualVelocity_ms: number;
    utilizationPct: number;
  };
  liquidCapacity: {
    liquidVolume_m3: number;
    retentionTime_min: number;
    requiredRetentionTime_min: number;
    adequate: boolean;
  };
  waterSection?: {
    waterVolume_m3: number;
    waterRetentionTime_min: number;
    freeWaterIn_pct: number;
    emulsifiedWaterIn_pct: number;
    freeRemovalEfficiency: number;
    emulsifiedRemovalEfficiency: number;
    outletWaterFraction: number;
    outletBSW_pct: number;
  };
  settling: {
    dropDiameter_um: number;
    source: string;
    crudeClass?: string;
    stewartRange_um?: { min: number; max: number; avg: number };
    velocityHeavyInLight_fts: number;
    velocityHeavyInLight_ms: number;
    oilViscosity_cP: number;
  };
  /** true si diameter/length fueron calculados (no fijados por el usuario) */
  autoDimensioned: boolean;
  operating: {
    temperature_C: number;
    pressure_kPa: number;
    pressure_psi: number;
  };
  criteria: SeparatorCriterion[];
  compliance: boolean;
  warnings: string[];
}

const M_TO_FT = 3.28084;
const BPD_TO_M3S = 1.84013e-6;
const MMSCFD_TO_M3S = 0.3278;
const FT_S_TO_M_S = 0.3048;

export function calculateSeparator(input: SeparatorInput): SeparatorResult {
  const warnings: string[] = [];
  const isHorizontal = input.orientation === 'horizontal';
  const api = input.apiGravity ?? 22;

  const rhoL = input.liquidDensity;
  const rhoG = input.gasDensity ?? estimateGasDensity(input.pressure, input.temperature);

  const kDefault = isHorizontal ? 0.107 : 0.060;
  const K = input.kFactor ?? kDefault;
  const Vt = K * Math.sqrt(Math.max(0, (rhoL - rhoG) / Math.max(rhoG, 1e-6)));

  const Ql = input.liquidFlowBPD * BPD_TO_M3S;
  const waterFrac = clamp01(input.waterFraction);
  let freeFrac = input.freeWaterFraction;
  let emulFrac = input.emulsifiedWaterFraction;
  if (freeFrac == null || emulFrac == null) {
    const emulsShare = clamp01(0.55 - 0.01 * (api - 10));
    emulFrac = waterFrac * emulsShare;
    freeFrac = waterFrac - emulFrac;
  }
  const Qw = Ql * waterFrac;

  const T = input.temperature + 273.15;
  const Pstd = 101.325;
  const Tstd = 288.15;
  let QgReal: number;
  let actualGasMMSCFD: number;
  if (input.gasFlowMMSCFD != null) {
    actualGasMMSCFD = input.gasFlowMMSCFD;
    QgReal =
      input.gasFlowMMSCFD *
      MMSCFD_TO_M3S *
      (Pstd / input.pressure) *
      (T / Tstd);
  } else {
    const gor = estimateGOR(api);
    const gasStd = Ql * gor * 5.615;
    QgReal =
      (gasStd / 86400) *
      (Pstd / input.pressure) *
      (T / Tstd) *
      0.02832;
    actualGasMMSCFD =
      QgReal / ((Pstd / input.pressure) * (T / Tstd)) / MMSCFD_TO_M3S;
  }

  const retReq = input.retentionTime ?? (isHorizontal ? 3 : 1);

  let D: number;
  let L: number;
  const autoDimensioned = !(input.diameter && input.length);

  if (input.diameter && input.length) {
    D = input.diameter;
    L = input.length;
  } else {
    const AgasMin = Vt > 0 ? QgReal / Vt : 0;
    const DgasMin = Math.sqrt((4 * AgasMin) / Math.PI);
    const VliqMin = Ql * retReq * 60;
    const liquidFillFraction = isHorizontal ? 0.5 : 0.75;
    const ldTarget = isHorizontal ? 4 : 3;
    const DliqMin = Math.pow(
      (4 * VliqMin) / (Math.PI * ldTarget * liquidFillFraction),
      1 / 3,
    );

    D = input.diameter ?? Math.max(DgasMin, DliqMin, 0.3);
    D = Math.ceil((D * M_TO_FT * 12) / 2) * 2 / 12 / M_TO_FT;
    L = input.length ?? D * ldTarget;
    L = Math.ceil(L * 2) / 2;
  }

  const Atotal = (Math.PI / 4) * D * D;
  const Vtotal = Atotal * L;

  const gasAreaFrac = isHorizontal ? 0.5 : 0.25;
  const Agas = Atotal * gasAreaFrac;
  const VgasActual = Agas > 0 ? QgReal / Agas : 0;
  const QgasMax = Vt * Agas;
  const QgasMaxMMSCFD =
    QgasMax / ((Pstd / input.pressure) * (T / Tstd)) / MMSCFD_TO_M3S;

  const liqFillFrac = isHorizontal ? 0.5 : 0.75;
  const Vliq = Vtotal * liqFillFrac;
  const retActual = Ql > 0 ? Vliq / Ql / 60 : 999;

  const Vwater = waterFrac > 0 ? Vliq * 0.3 : 0;
  const retWater = Qw > 0 ? Vwater / Qw / 60 : 0;

  // Stokes + Stewart (promedio del rango si no dan d)
  const stewart = stewartDropRange(api, 'separator');
  const drop_um = input.dropDiameter_um ?? stewart.avg_um;
  const mu = estimateOilViscosity_cP(api, input.temperature);
  const sgOil = 141.5 / (api + 131.5);
  const rhoOilPhase = sgOil * 1000;
  const vHeavy_fts = stokesSettlingVelocity_fts(
    drop_um,
    kgm3ToLbft3(1000),
    kgm3ToLbft3(rhoOilPhase),
    mu,
  );

  // Remoción agua libre / emulsionada
  const eff = separatorWaterRemovalEfficiency(api);
  const freeOut = freeFrac * (1 - eff.free);
  const emulOut = emulFrac * (1 - eff.emulsified);
  const outletWater = clamp01(freeOut + emulOut);
  const outletBSW = outletWater * 100;

  const ldRatio = L / D;
  const gasOk = VgasActual <= Vt;
  const liqOk = retActual >= retReq;

  if (!gasOk) {
    warnings.push(
      `Velocidad de gas (${VgasActual.toFixed(2)} m/s) excede la crítica (${Vt.toFixed(2)} m/s)`,
    );
  }
  if (!liqOk) {
    warnings.push(
      `Tiempo de retención (${retActual.toFixed(1)} min) menor al requerido (${retReq} min)`,
    );
  }
  if (ldRatio < 2) warnings.push('Relación L/D menor a 2 (no recomendado)');
  if (ldRatio > 6) warnings.push('Relación L/D mayor a 6 (considerar reducir)');
  if (isHorizontal && D > 3.66) {
    warnings.push('Diámetro > 12ft (límite de transporte por carretera)');
  }

  const criteria: SeparatorCriterion[] = [
    {
      criterion: 'Retención de líquido',
      value: round(retActual, 2),
      limit: `≥ ${retReq} min`,
      passes: liqOk,
    },
    {
      criterion: 'Velocidad de gas (Souders-Brown)',
      value: round(VgasActual, 3),
      limit: `≤ ${round(Vt, 3)} m/s`,
      passes: gasOk,
    },
    {
      criterion: 'Relación L/D',
      value: round(ldRatio, 2),
      limit: '2 – 6',
      passes: ldRatio >= 2 && ldRatio <= 6,
    },
    {
      criterion: 'BSW salida',
      value: round(outletBSW, 2),
      limit: `< BSW entrada (${round(waterFrac * 100, 1)} %)`,
      passes: outletBSW < waterFrac * 100 + 1e-6 || waterFrac === 0,
    },
  ];

  const compliance = gasOk && liqOk && criteria.every((c) => c.passes);

  return {
    orientation: input.orientation,
    dimensions: {
      diameter_m: round(D, 3),
      diameter_ft: round(D * M_TO_FT, 2),
      length_m: round(L, 2),
      length_ft: round(L * M_TO_FT, 2),
      ldRatio: round(ldRatio, 2),
      volume_m3: round(Vtotal, 3),
    },
    gasCapacity: {
      maxGasFlow_MMSCFD: round(QgasMaxMMSCFD, 3),
      actualGasFlow_MMSCFD: round(actualGasMMSCFD, 3),
      criticalVelocity_ms: round(Vt, 3),
      actualVelocity_ms: round(VgasActual, 3),
      utilizationPct: round((VgasActual / Math.max(Vt, 1e-9)) * 100, 1),
    },
    liquidCapacity: {
      liquidVolume_m3: round(Vliq, 3),
      retentionTime_min: round(retActual, 2),
      requiredRetentionTime_min: retReq,
      adequate: liqOk,
    },
    ...(waterFrac > 0
      ? {
          waterSection: {
            waterVolume_m3: round(Vwater, 3),
            waterRetentionTime_min: round(retWater, 2),
            freeWaterIn_pct: round(freeFrac * 100, 2),
            emulsifiedWaterIn_pct: round(emulFrac * 100, 2),
            freeRemovalEfficiency: round(eff.free * 100, 1),
            emulsifiedRemovalEfficiency: round(eff.emulsified * 100, 1),
            outletWaterFraction: round(outletWater, 4),
            outletBSW_pct: round(outletBSW, 2),
          },
        }
      : {}),
    settling: {
      dropDiameter_um: drop_um,
      source:
        input.dropDiameter_um != null
          ? 'user'
          : `Stewart (2008) avg · ${stewart.crudeClass}`,
      crudeClass: stewart.crudeClass,
      stewartRange_um: {
        min: stewart.min_um,
        max: stewart.max_um,
        avg: stewart.avg_um,
      },
      velocityHeavyInLight_fts: round(vHeavy_fts, 6),
      velocityHeavyInLight_ms: round(vHeavy_fts * FT_S_TO_M_S, 6),
      oilViscosity_cP: round(mu, 2),
    },
    operating: {
      temperature_C: input.temperature,
      pressure_kPa: input.pressure,
      pressure_psi: round(input.pressure * 0.145038, 1),
    },
    criteria,
    compliance,
    autoDimensioned,
    warnings,
  };
}

function estimateGasDensity(pressKpa: number, tempC: number): number {
  const T = tempC + 273.15;
  return (pressKpa * 20) / (8.314 * T);
}

function estimateGOR(api: number): number {
  if (api < 10) return 20;
  if (api < 15) return 50;
  if (api < 22) return 150;
  if (api < 30) return 400;
  if (api < 40) return 800;
  return 1200;
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function round(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
