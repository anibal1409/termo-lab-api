/**
 * Modelo de tratador térmico para simulación de procesos.
 *
 * Dimensiona el recipiente con fracciones de llenado coherentes (40 % crudo / 30 % agua),
 * propaga la corriente de proceso y evalúa cumplimiento API 12L vía
 * ThermalCalculatorService + checkCriteria (conversión °C/kPa → °F/psig).
 * BSW de salida en % con especificación de simulación < 1 %.
 *
 * Referencia: API 12L, Stewart (2008), módulo de evaluaciones
 */

import {
  API12L_HORIZONTAL_SIZES,
  ThermalCalculatorService,
} from '../../evaluations/services/thermal-calculator.service';
import {
  checkCriteria,
  CriterionResult,
} from '../../evaluations/services/thermal-analysis.service';
import {
  stewartDropRange,
  stokesSettlingVelocity_fts,
  estimateOilViscosity_cP,
  kgm3ToLbft3,
} from '../thermo/settling';

/** Fracción de volumen del recipiente asignada al crudo (coherente en sizing y check). */
export const FILL_OIL = 0.4;
/** Fracción de volumen del recipiente asignada al agua. */
export const FILL_WATER = 0.3;

/** BSW máximo en crudo tratado (especificación de simulación). */
export const TREATER_BSW_LIMIT_PCT = 1;

export interface ThermalTreaterInput {
  totalFlow: number;
  apiGravity: number;
  waterFraction: number;
  freeWaterFraction?: number;
  emulsifiedWaterFraction?: number;
  inletTemperature: number;
  treatmentTemperature: number;
  ambientTemperature: number;
  operatingPressure: number;
  diameter?: number;
  length?: number;
  oilRetentionTime?: number;
  waterRetentionTime?: number;
  windSpeed?: number;
  burnerEfficiency?: number;
  gasFlowRate?: number;
  dropDiameter_um?: number;
}

export interface ThermalTreaterResult {
  dimensions: {
    diameter_ft: number;
    diameter_m: number;
    length_ft: number;
    length_m: number;
    volume_bbl: number;
    volume_m3: number;
  };
  thermal: {
    heatRequired_BTUh: number;
    heatRequired_kW: number;
    heatLoss_BTUh: number;
    burnerCapacity_BTUh: number;
    /** Capacidad térmica nominal de tabla API 12L / volumetría (BTU/h) */
    nominalCapacity_BTUh: number;
    burnerEfficiency: number;
    deltaT: number;
    capacityAdequate: boolean;
  };
  separation: {
    oilOutFlow_BPD: number;
    waterOutFlow_BPD: number;
    gasFlash_MMSCFD: number;
    outletWaterFraction: number;
    /** BSW salida en % (no fracción) */
    estimatedBSW_pct: number;
    bswSpec_pct: number;
    bswMeetsSpec: boolean;
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
  autoDimensioned: boolean;
  retention: {
    oilRetention_min: number;
    waterRetention_min: number;
    oilRetentionRequired_min: number;
    waterRetentionRequired_min: number;
    oilAdequate: boolean;
    waterAdequate: boolean;
  };
  operating: {
    inletTemperature_C: number;
    treatmentTemperature_C: number;
    pressure_kPa: number;
    pressure_psi: number;
  };
  criteria: CriterionResult[];
  compliance: boolean;
  warnings: string[];
}

const FT_TO_M = 0.3048;
const BTU_TO_KW = 0.000293071;
const BBL_TO_M3 = 0.158987;
const ATM_KPA = 101.325;
const FT_S_TO_M_S = 0.3048;

/** Tabla 4.2 API-12L (horizontales), misma fuente que ThermalCalculatorService. */
const NOMINAL_HEAT_TABLE = API12L_HORIZONTAL_SIZES.map((row) => ({
  d: row.diameter,
  l: row.length,
  maxHeat: row.maxHeat,
}));

const thermalCalculator = new ThermalCalculatorService();

export function calculateThermalTreater(
  input: ThermalTreaterInput,
): ThermalTreaterResult {
  const warnings: string[] = [];

  const sg = 141.5 / (input.apiGravity + 131.5);
  const retOil = input.oilRetentionTime ?? 60;
  const retWater = input.waterRetentionTime ?? 30;
  const windSpeed = input.windSpeed ?? 10;
  const eta = input.burnerEfficiency ?? 0.8;

  const Qoil = input.totalFlow * (1 - input.waterFraction);
  const Qwater = input.totalFlow * input.waterFraction;

  let D_ft: number;
  let L_ft: number;
  const autoDimensioned = !(input.diameter && input.length);

  if (input.diameter && input.length) {
    D_ft = input.diameter;
    L_ft = input.length;
  } else {
    const VoilReq = (Qoil * retOil) / 1440;
    const VwaterReq = (Qwater * retWater) / 1440;
    const Vtotal = Math.max(VoilReq / FILL_OIL, VwaterReq / FILL_WATER);

    // Menor tamaño estándar API-12L (Tabla 4.2) con volumen suficiente
    const vol = (row: { d: number; l: number }) =>
      0.1399 * row.d * row.d * row.l;
    const std =
      [...NOMINAL_HEAT_TABLE]
        .sort((a, b) => vol(a) - vol(b))
        .find((row) => vol(row) >= Vtotal) ??
      NOMINAL_HEAT_TABLE[NOMINAL_HEAT_TABLE.length - 1];
    D_ft = input.diameter ?? std.d;
    L_ft = input.length ?? std.l;
  }

  const D_m = D_ft * FT_TO_M;
  const L_m = L_ft * FT_TO_M;
  const Vbbl = 0.1399 * D_ft * D_ft * L_ft;
  const Vm3 = Vbbl * BBL_TO_M3;

  const VoilActual = Vbbl * FILL_OIL;
  const VwaterActual = Vbbl * FILL_WATER;
  const retOilActual = Qoil > 0 ? (VoilActual / Qoil) * 1440 : 999;
  const retWaterActual = Qwater > 0 ? (VwaterActual / Qwater) * 1440 : 999;

  const deltaT = input.treatmentTemperature - input.inletTemperature;
  const nominalCapacity = lookupNominalHeat_BTUh(D_ft, L_ft);

  // BSW salida % — mejor con más ΔT y retención; más emulsionada de entrada → peor
  const emulIn =
    input.emulsifiedWaterFraction ??
    input.waterFraction * clamp01(0.55 - 0.01 * (input.apiGravity - 10));
  const stewart = stewartDropRange(input.apiGravity, 'treater');
  const drop_um = input.dropDiameter_um ?? stewart.avg_um;
  const mu = estimateOilViscosity_cP(
    input.apiGravity,
    input.treatmentTemperature,
  );
  const vHeavy_fts = stokesSettlingVelocity_fts(
    drop_um,
    kgm3ToLbft3(1000),
    kgm3ToLbft3(sg * 1000),
    mu,
  );

  const bswBase = 0.35 + emulIn * 2.5; // más emulsionada → BSW residual mayor
  const tempFactor = deltaT > 40 ? 0.7 : deltaT > 20 ? 1.0 : 1.4;
  const retFactor =
    retOilActual > retOil ? 0.75 : retOilActual > retOil * 0.5 ? 1.0 : 1.8;
  // Decanta si la gota recorre medio diámetro dentro del tiempo de retención del crudo
  const settleTime_min =
    vHeavy_fts > 0 ? D_ft / 2 / vHeavy_fts / 60 : Number.POSITIVE_INFINITY;
  const settleFactor = settleTime_min <= retOilActual ? 0.9 : 1.2;
  const estimatedBSW = Math.max(
    0.05,
    bswBase * tempFactor * retFactor * settleFactor,
  );
  const bswOk = estimatedBSW < TREATER_BSW_LIMIT_PCT;
  const gasFlash = estimateFlashGas(
    input.apiGravity,
    input.treatmentTemperature,
    input.operatingPressure,
    Qoil,
  );
  const outWaterFrac = estimatedBSW / 100;

  const oilOk = retOilActual >= retOil;
  const waterOk = retWaterActual >= retWater;

  if (!oilOk) {
    warnings.push(
      `Retención de aceite (${r(retOilActual, 1)} min) < requerido (${retOil} min)`,
    );
  }
  if (!waterOk) {
    warnings.push(
      `Retención de agua (${r(retWaterActual, 1)} min) < requerido (${retWater} min)`,
    );
  }
  if (!bswOk) {
    warnings.push(
      `BSW salida (${r(estimatedBSW, 2)} %) ≥ ${TREATER_BSW_LIMIT_PCT} % especificación`,
    );
  }
  if (deltaT > 80) warnings.push('ΔT > 80°C: riesgo de coquización');
  if (input.operatingPressure < 200) {
    warnings.push('Presión baja: mayor pérdida evaporativa');
  }

  const toF = (c: number) => (c * 9) / 5 + 32;
  const toPsig = (kPaAbs: number) => Math.max(0, (kPaAbs - ATM_KPA) * 0.145038);
  const apiResults = thermalCalculator.calculateThermalResults({
    diameter: D_ft,
    length: L_ft,
    totalFlow: input.totalFlow,
    waterFraction: input.waterFraction * 100,
    apiGravity: input.apiGravity,
    inletTemperature: toF(input.inletTemperature),
    treatmentTemperature: toF(input.treatmentTemperature),
    ambientTemperature: toF(input.ambientTemperature),
    operatingPressure: toPsig(input.operatingPressure),
    oilRetentionTime: retOil,
    waterRetentionTime: retWater,
    windSpeed,
    gasFlowRate: input.gasFlowRate ?? gasFlash,
    waterDropSize: drop_um,
  });
  // Calor según API-12L: Q = (mo·cpo + mw·cpw)·ΔT; pérdidas = K(viento)·D·L·(T2−T3)
  const Qheat = apiResults.processHeatDuty;
  const Qloss = apiResults.heatLosses;
  const Qburner = (Qheat + Qloss) / eta;
  const capacityOk = Qburner <= nominalCapacity * 1.05;
  if (!capacityOk) {
    warnings.push(
      `Duty quemador (${r(Qburner / 1e6, 2)} MMBTU/h) > nominal volumétrico (${r(nominalCapacity / 1e6, 2)} MMBTU/h)`,
    );
  }
  if (Qburner > 5e6) {
    warnings.push(
      `Capacidad del quemador (${r(Qburner / 1e6, 2)} MMBTU/h) es alta; considerar múltiples unidades`,
    );
  }
  const apiCriteria = checkCriteria(apiResults);
  const simCriteria: CriterionResult[] = [
    ...apiCriteria,
    {
      criterion: 'BSW crudo tratado',
      value: estimatedBSW,
      limit: `< ${TREATER_BSW_LIMIT_PCT} %`,
      marginPercent:
        ((TREATER_BSW_LIMIT_PCT - estimatedBSW) / TREATER_BSW_LIMIT_PCT) * 100,
      passes: bswOk,
    },
    {
      criterion: 'Capacidad térmica nominal',
      value: Qburner,
      limit: `≤ ${nominalCapacity} BTU/h (tabla D×L)`,
      marginPercent:
        ((nominalCapacity - Qburner) / Math.max(nominalCapacity, 1)) * 100,
      passes: capacityOk,
    },
    {
      criterion: 'Retención aceite (sim)',
      value: retOilActual,
      limit: `≥ ${retOil} min`,
      marginPercent: ((retOilActual - retOil) / retOil) * 100,
      passes: oilOk,
    },
    {
      criterion: 'Retención agua (sim)',
      value: retWaterActual,
      limit: `≥ ${retWater} min`,
      marginPercent: ((retWaterActual - retWater) / retWater) * 100,
      passes: waterOk,
    },
  ];
  const apiCompliant = apiCriteria.every((c) => c.passes);
  for (const c of simCriteria.filter((x) => !x.passes)) {
    warnings.push(
      `Criterio · ${c.criterion}: ${typeof c.value === 'number' ? r(c.value, 2) : c.value} (límite ${c.limit})`,
    );
  }

  return {
    dimensions: {
      diameter_ft: r(D_ft, 1),
      diameter_m: r(D_m, 3),
      length_ft: r(L_ft, 1),
      length_m: r(L_m, 3),
      volume_bbl: r(Vbbl, 1),
      volume_m3: r(Vm3, 2),
    },
    thermal: {
      heatRequired_BTUh: r(Qheat, 0),
      heatRequired_kW: r(Qheat * BTU_TO_KW, 2),
      heatLoss_BTUh: r(Qloss, 0),
      burnerCapacity_BTUh: r(Qburner, 0),
      nominalCapacity_BTUh: r(nominalCapacity, 0),
      burnerEfficiency: eta,
      deltaT,
      capacityAdequate: capacityOk,
    },
    separation: {
      oilOutFlow_BPD: r(Qoil * (1 - outWaterFrac), 1),
      waterOutFlow_BPD: r(Qwater + Qoil * outWaterFrac, 1),
      gasFlash_MMSCFD: r(gasFlash, 4),
      outletWaterFraction: r(outWaterFrac, 4),
      estimatedBSW_pct: r(estimatedBSW, 2),
      bswSpec_pct: TREATER_BSW_LIMIT_PCT,
      bswMeetsSpec: bswOk,
    },
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
      velocityHeavyInLight_fts: r(vHeavy_fts, 6),
      velocityHeavyInLight_ms: r(vHeavy_fts * FT_S_TO_M_S, 6),
      oilViscosity_cP: r(mu, 2),
    },
    autoDimensioned,
    retention: {
      oilRetention_min: r(retOilActual, 1),
      waterRetention_min: r(retWaterActual, 1),
      oilRetentionRequired_min: retOil,
      waterRetentionRequired_min: retWater,
      oilAdequate: oilOk,
      waterAdequate: waterOk,
    },
    operating: {
      inletTemperature_C: input.inletTemperature,
      treatmentTemperature_C: input.treatmentTemperature,
      pressure_kPa: input.operatingPressure,
      pressure_psi: r(input.operatingPressure * 0.145038, 1),
    },
    criteria: simCriteria,
    compliance: oilOk && waterOk && apiCompliant && bswOk && capacityOk,
    warnings,
  };
}

export function lookupNominalHeat_BTUh(D_ft: number, L_ft: number): number {
  let best = NOMINAL_HEAT_TABLE[0];
  let bestDist = Infinity;
  for (const row of NOMINAL_HEAT_TABLE) {
    const dist = Math.abs(row.d - D_ft) + 0.25 * Math.abs(row.l - L_ft);
    if (dist < bestDist) {
      bestDist = dist;
      best = row;
    }
  }
  // Escala suave por volumen relativo al punto de tabla
  const vTable = 0.1399 * best.d * best.d * best.l;
  const vActual = 0.1399 * D_ft * D_ft * L_ft;
  const scale = vTable > 0 ? vActual / vTable : 1;
  return best.maxHeat * Math.max(0.5, Math.min(1.5, scale));
}

function estimateFlashGas(
  api: number,
  tempC: number,
  pressKpa: number,
  oilBPD: number,
): number {
  const gor = api < 15 ? 30 : api < 25 ? 100 : 300;
  const flashFraction = Math.min(0.3, (tempC - 60) * 0.003);
  const pFactor = Math.min(1.5, 500 / Math.max(pressKpa, 50));
  return (oilBPD * gor * Math.max(0, flashFraction) * pFactor) / 1e6;
}

function clamp01(v: number): number {
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function r(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
