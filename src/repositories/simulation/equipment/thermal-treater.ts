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
  API12L_MAX_HEAT_FLUX,
  API12L_MAX_OIL_VISCOSITY_CP,
  api12lFirebox,
  api12lWindK,
} from '../../evaluations/services/api12l.tables';
import { ThermalCalculatorService } from '../../evaluations/services/thermal-calculator.service';
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
    /** Q proceso + pérdidas (Apéndice D), BTU/h */
    totalHeatRequired_BTUh: number;
    /** Flujo de calor firetube BTU/h·ft² (límite 5.3: 10 000) */
    heatFlux_BTUh_ft2: number;
    burnerEfficiency: number;
    deltaT: number;
    capacityAdequate: boolean;
    /** Unidades en paralelo si Q total supera el máximo Tabla 3 */
    unitsNeeded: number;
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

const thermalCalculator = new ThermalCalculatorService();

export function calculateThermalTreater(
  input: ThermalTreaterInput,
): ThermalTreaterResult {
  const warnings: string[] = [];

  const sg = 141.5 / (input.apiGravity + 131.5);
  // Apéndice D / Ejemplo E: retención típica 30–100 min crudo, 15–30 min agua
  const retOil = clamp(input.oilRetentionTime ?? 60, 30, 100);
  const retWater = clamp(input.waterRetentionTime ?? 30, 15, 30);
  if (input.oilRetentionTime != null && input.oilRetentionTime !== retOil) {
    warnings.push(
      `Retención de crudo ajustada a rango API 12L Ap. D (30–100 min): ${retOil} min`,
    );
  }
  if (input.waterRetentionTime != null && input.waterRetentionTime !== retWater) {
    warnings.push(
      `Retención de agua ajustada a rango API 12L Ap. D (15–30 min): ${retWater} min`,
    );
  }
  const windSpeed = input.windSpeed ?? 10;
  const eta = input.burnerEfficiency ?? 0.7; // Ap. H / ej. 5.4 usa η≈0.70

  const Qoil = input.totalFlow * (1 - input.waterFraction);
  const Qwater = input.totalFlow * input.waterFraction;
  const VoilReq = (Qoil * retOil) / 1440; // Ap. D: V = W·R/1440
  const VwaterReq = (Qwater * retWater) / 1440;

  const toF = (c: number) => (c * 9) / 5 + 32;
  const T2_F = toF(input.treatmentTemperature);
  const Ta_F = toF(input.ambientTemperature);
  const heatLossFor = (d: number, l: number) =>
    api12lWindK(windSpeed) * d * l * (T2_F - Ta_F);

  // Estimación preliminar de Q proceso (Ap. D) para filtrar Tabla 3 al autodimensionar
  const processHeatEst = estimateProcessHeat_BTUh(
    Qoil,
    Qwater,
    sg,
    toF(input.inletTemperature),
    T2_F,
  );

  let D_ft: number;
  let L_ft: number;
  let oilBblTable: number;
  let waterBblTable: number;
  const autoDimensioned = !(input.diameter && input.length);

  if (input.diameter && input.length) {
    D_ft = input.diameter;
    L_ft = input.length;
    const match =
      API12L_HORIZONTAL_SIZES.find(
        (s) => s.diameter === D_ft && s.length === L_ft,
      ) ?? null;
    oilBblTable = match?.oilBbl ?? 0.1399 * D_ft * D_ft * L_ft * FILL_OIL;
    waterBblTable = match?.waterBbl ?? 0.1399 * D_ft * D_ft * L_ft * FILL_WATER;
  } else {
    // Apéndice E: menor tamaño Tabla E-1 con Vo/Vw y Q+Ql ≤ Tabla 3
    const fitting = [...API12L_HORIZONTAL_SIZES]
      .filter((s) => {
        const duty = api12lFirebox(s.diameter, 'horizontal')?.duty ?? 0;
        return (
          s.oilBbl >= VoilReq &&
          s.waterBbl >= VwaterReq &&
          processHeatEst + heatLossFor(s.diameter, s.length) <= duty
        );
      })
      .sort((a, b) => a.oilBbl + a.waterBbl - (b.oilBbl + b.waterBbl));

    const byRetention = [...API12L_HORIZONTAL_SIZES]
      .filter((s) => s.oilBbl >= VoilReq && s.waterBbl >= VwaterReq)
      .sort((a, b) => a.oilBbl + a.waterBbl - (b.oilBbl + b.waterBbl));

    const std =
      fitting[0] ??
      byRetention[0] ??
      API12L_HORIZONTAL_SIZES[API12L_HORIZONTAL_SIZES.length - 1];
    D_ft = input.diameter ?? std.diameter;
    L_ft = input.length ?? std.length;
    oilBblTable = std.oilBbl;
    waterBblTable = std.waterBbl;
    if (!fitting.length) {
      warnings.push(
        'Ningún tamaño Tabla E-1 + Tabla 3 cubre retención y calor; se usa el mayor disponible (valorar varias unidades)',
      );
    }
  }

  const D_m = D_ft * FT_TO_M;
  const L_m = L_ft * FT_TO_M;
  const Vbbl = 0.1399 * D_ft * D_ft * L_ft;
  const Vm3 = Vbbl * BBL_TO_M3;

  // Retención real con volúmenes de Tabla E-1 (Ap. D: R = 1440·V/W)
  const retOilActual = Qoil > 0 ? (oilBblTable / Qoil) * 1440 : 999;
  const retWaterActual = Qwater > 0 ? (waterBblTable / Qwater) * 1440 : 999;

  const deltaT = input.treatmentTemperature - input.inletTemperature;
  const firebox = api12lFirebox(D_ft, 'horizontal');
  const nominalCapacity = firebox?.duty ?? 0;
  const fireboxArea = firebox?.area ?? 0;

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
    oilViscosity: mu,
  });
  // Ap. D: Q = (Wo·Co + Ww·Cw)·(T2−T1); Ql = K·D·L·(T2−Ta)
  const Qheat = apiResults.processHeatDuty;
  const Qloss = apiResults.heatLosses;
  const Qtotal = Qheat + Qloss;
  const Qburner = Qtotal / eta;
  // Ap. E / Tabla 3: Q+Ql ≤ rating; si no alcanza, N unidades en paralelo
  const unitsNeeded =
    nominalCapacity > 0 ? Math.max(1, Math.ceil(Qtotal / nominalCapacity)) : 1;
  const capacityOk = Qtotal <= nominalCapacity;
  const heatFlux =
    fireboxArea > 0 ? (capacityOk ? Qtotal : nominalCapacity) / fireboxArea : 0;
  const fluxOk = fireboxArea <= 0 || heatFlux <= API12L_MAX_HEAT_FLUX + 1e-6;
  const viscosityOk = mu <= API12L_MAX_OIL_VISCOSITY_CP;

  if (!capacityOk) {
    warnings.push(
      `Calor requerido (${r(Qtotal / 1e6, 2)} MMBTU/h) > rating Tabla 3 (${r(nominalCapacity / 1e6, 2)} MMBTU/h) → ${unitsNeeded} unidades en paralelo`,
    );
  }
  if (!fluxOk) {
    warnings.push(
      `Flujo de calor firetube ${r(heatFlux, 0)} BTU/h·ft² > ${API12L_MAX_HEAT_FLUX} (API 12L §5.3)`,
    );
  }
  if (!viscosityOk) {
    warnings.push(
      `Viscosidad ${r(mu, 1)} cP > ${API12L_MAX_OIL_VISCOSITY_CP} cP a T de tratamiento (Ap. D ≈150 SSU)`,
    );
  }

  // Alinear criterios genéricos del calculador con Ap. D / Tabla E-1 (evita R≠1440·V_E1/W).
  const dehydration = apiResults.dehydrationPercentage;
  const apiCriteria = checkCriteria(apiResults)
    .map((c): CriterionResult => {
      if (c.criterion === 'Tiempo de retención') {
        return {
          criterion: 'Tiempo de retención crudo (Ap. D / Tabla E-1)',
          value: retOilActual,
          limit: `≥ ${retOil} min (típico 30–100; ej. E = 60)`,
          marginPercent: ((retOilActual - retOil) / retOil) * 100,
          passes: oilOk,
        };
      }
      if (c.criterion === 'Eficiencia de separación') {
        // API 12L no define η_sep%; se reporta deshidratación del proceso.
        return {
          criterion: 'Deshidratación del proceso',
          value: dehydration,
          limit: '≥ 85 %',
          marginPercent: ((dehydration - 85) / 85) * 100,
          passes: Number.isFinite(dehydration) && dehydration >= 85,
        };
      }
      return c;
    })
    // Evitar duplicar "Deshidratación" si ya la reescribimos desde eficiencia
    .filter((c, i, arr) =>
      c.criterion !== 'Deshidratación'
        ? true
        : !arr.some(
            (x, j) => j < i && x.criterion === 'Deshidratación del proceso',
          ),
    );

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
      criterion: 'Capacidad firebox Tabla 3 (Ap. E)',
      value: Qtotal,
      limit: `≤ ${nominalCapacity} BTU/h`,
      marginPercent:
        ((nominalCapacity - Qtotal) / Math.max(nominalCapacity, 1)) * 100,
      passes: capacityOk,
    },
    {
      criterion: 'Flujo calor firetube §5.3',
      value: heatFlux,
      limit: `≤ ${API12L_MAX_HEAT_FLUX} BTU/h·ft²`,
      marginPercent:
        ((API12L_MAX_HEAT_FLUX - heatFlux) / API12L_MAX_HEAT_FLUX) * 100,
      passes: fluxOk,
    },
    {
      criterion: 'Viscosidad crudo Ap. D',
      value: mu,
      limit: `≤ ${API12L_MAX_OIL_VISCOSITY_CP} cP (aviso si falla)`,
      marginPercent:
        ((API12L_MAX_OIL_VISCOSITY_CP - mu) / API12L_MAX_OIL_VISCOSITY_CP) * 100,
      passes: viscosityOk,
    },
    {
      criterion: 'Retención agua Tabla E-1 (Ap. D)',
      value: retWaterActual,
      limit: `≥ ${retWater} min`,
      marginPercent: ((retWaterActual - retWater) / retWater) * 100,
      passes: waterOk,
    },
  ];

  // Cumplimiento normativo API 12L del tratador (viscosidad solo advierte, como en el calculador).
  const hardFail = simCriteria.filter(
    (c) =>
      !c.passes &&
      c.criterion !== 'Viscosidad crudo Ap. D',
  );
  const apiCompliant = hardFail.length === 0;
  for (const c of hardFail) {
    warnings.push(
      `Criterio · ${c.criterion}: ${typeof c.value === 'number' ? r(c.value, 2) : c.value} (límite ${c.limit})`,
    );
  }
  if (!viscosityOk) {
    warnings.push(
      `Aviso · Viscosidad ${r(mu, 1)} cP > ${API12L_MAX_OIL_VISCOSITY_CP} cP (Ap. D)`,
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
      totalHeatRequired_BTUh: r(Qtotal, 0),
      heatFlux_BTUh_ft2: r(heatFlux, 0),
      burnerEfficiency: eta,
      deltaT,
      capacityAdequate: capacityOk,
      unitsNeeded,
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
    compliance: apiCompliant,
    warnings,
  };
}

/** Heat duty de Tabla 3 API-12L para el diámetro (horizontal); 0 si no hay rating. */
export function lookupNominalHeat_BTUh(D_ft: number): number {
  return api12lFirebox(D_ft, 'horizontal')?.duty ?? 0;
}

/**
 * Estimación Ap. D / fórmula simplificada 35 °API:
 * Q ≈ W·(6.44 + 8.14·X)·(T2−T1), ajustada por SG del crudo.
 */
function estimateProcessHeat_BTUh(
  oilBpd: number,
  waterBpd: number,
  oilSg: number,
  t1F: number,
  t2F: number,
): number {
  const dT = Math.max(0, t2F - t1F);
  const W = oilBpd + waterBpd;
  if (!(W > 0) || dT <= 0) return 0;
  const X = waterBpd / W;
  // Base 35 °API (sg≈0.85); escala masa de crudo por SG relativo
  const sgFactor = oilSg / 0.85;
  return W * (6.44 * sgFactor + 8.14 * X) * dT;
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

function clamp(v: number, lo: number, hi: number): number {
  if (!Number.isFinite(v)) return lo;
  return Math.max(lo, Math.min(hi, v));
}

function r(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
