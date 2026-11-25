/**
 * Modelo de tanque de almacenamiento de crudo.
 *
 * Calcula:
 * - Volumen requerido por tiempo de residencia
 * - Capacidad nominal vs operativa (80% fill)
 * - Pérdidas evaporativas estimadas
 * - Autodimensionamiento según API 650
 *
 * Referencia: API 650 (tanques atmosféricos), API 620 (baja presión)
 */

export interface StorageTankInput {
  /** Caudal de entrada en BPD */
  flowBPD: number;
  /** Tiempo de almacenamiento requerido en horas */
  storageTime_hours: number;
  /** Temperatura del fluido °C */
  temperature: number;
  /** °API del crudo */
  apiGravity: number;
  /** Fracción de agua remanente (0-1) */
  waterFraction?: number;
  /** Diámetro del tanque metros (opcional) */
  diameter?: number;
  /** Altura del tanque metros (opcional) */
  height?: number;
  /** Presión de operación kPa (default 101.325 = atmosférico) */
  pressure?: number;
  /** Tipo de techo */
  roofType?: 'fixed' | 'floating' | 'internal-floating';
}

export interface StorageTankResult {
  dimensions: {
    diameter_m: number;
    diameter_ft: number;
    height_m: number;
    height_ft: number;
    hdRatio: number;
  };
  capacity: {
    nominal_m3: number;
    nominal_bbl: number;
    operative_m3: number;
    operative_bbl: number;
    fillPercent: number;
  };
  operating: {
    flowIn_BPD: number;
    storageTime_hours: number;
    requiredVolume_m3: number;
    requiredVolume_bbl: number;
    temperature_C: number;
    pressure_kPa: number;
  };
  fluid: {
    apiGravity: number;
    density_kgm3: number;
    waterFraction: number;
    totalMass_kg: number;
  };
  losses: {
    breathingLoss_bblDay: number;
    standingLoss_bblDay: number;
    roofType: string;
  };
  adequate: boolean;
  /** Alias de adequate para el resumen del pipeline (allCompliant). */
  compliance: boolean;
  warnings: string[];
}

const BBL_TO_M3 = 0.158987;
const M_TO_FT = 3.28084;

export function calculateStorageTank(input: StorageTankInput): StorageTankResult {
  const warnings: string[] = [];
  const pressure = input.pressure ?? 101.325;
  const waterFrac = input.waterFraction ?? 0;
  const roofType = input.roofType ?? 'fixed';

  // Densidad del crudo
  const sg = 141.5 / (input.apiGravity + 131.5);
  const rho = sg * 1000; // kg/m³

  // Volumen requerido
  const flowM3s = input.flowBPD * BBL_TO_M3 / 86400;
  const requiredVol = flowM3s * input.storageTime_hours * 3600; // m³
  const operativeFill = 0.80; // 80% máximo

  // Autodimensionamiento
  let D: number, H: number;
  if (input.diameter && input.height) {
    D = input.diameter;
    H = input.height;
  } else {
    // Volumen nominal = requerido / 0.80
    const Vnom = requiredVol / operativeFill;
    // H/D típico 0.5-1.0 para tanques API 650
    const hdRatio = 0.6;
    // V = π/4 · D² · H = π/4 · D² · (hdRatio · D)
    D = input.diameter ?? Math.pow(4 * Vnom / (Math.PI * hdRatio), 1 / 3);
    // Redondear a siguiente metro
    D = Math.ceil(D * 2) / 2;
    H = input.height ?? D * hdRatio;
    H = Math.ceil(H * 2) / 2;
  }

  const nominalVol = Math.PI / 4 * D * D * H;
  const operativeVol = nominalVol * operativeFill;
  const adequate = operativeVol >= requiredVol;

  if (!adequate) {
    warnings.push(`Volumen operativo (${r(operativeVol, 1)}m³) menor al requerido (${r(requiredVol, 1)}m³)`);
  }

  // H/D ratio
  const hdRatio = H / D;
  if (hdRatio > 1.2) warnings.push('Relación H/D > 1.2 (considerar tanque más ancho)');
  if (hdRatio < 0.3) warnings.push('Relación H/D < 0.3 (tanque muy achatado)');

  // Pérdidas evaporativas (EPA AP-42, simplificado)
  const reidVaporPressure = estimateRVP(input.apiGravity, input.temperature);
  const breathingLoss = roofType === 'floating' || roofType === 'internal-floating'
    ? 0.001 * D * D // mínima con techo flotante
    : 0.0226 * Math.pow(D * M_TO_FT, 1.73) * Math.pow(reidVaporPressure, 1.0) * 0.159; // bbl/day

  const standingLoss = roofType === 'fixed'
    ? breathingLoss * 0.3
    : breathingLoss * 0.1;

  // Presión - validar
  if (pressure > 103 && roofType === 'fixed') {
    warnings.push('Presión > atmosférica con techo fijo: considerar techo presurizado (API 620)');
  }

  const totalMass = operativeVol * rho;

  return {
    dimensions: {
      diameter_m: r(D, 2),
      diameter_ft: r(D * M_TO_FT, 2),
      height_m: r(H, 2),
      height_ft: r(H * M_TO_FT, 2),
      hdRatio: r(hdRatio, 3),
    },
    capacity: {
      nominal_m3: r(nominalVol, 2),
      nominal_bbl: r(nominalVol / BBL_TO_M3, 0),
      operative_m3: r(operativeVol, 2),
      operative_bbl: r(operativeVol / BBL_TO_M3, 0),
      fillPercent: operativeFill * 100,
    },
    operating: {
      flowIn_BPD: input.flowBPD,
      storageTime_hours: input.storageTime_hours,
      requiredVolume_m3: r(requiredVol, 2),
      requiredVolume_bbl: r(requiredVol / BBL_TO_M3, 0),
      temperature_C: input.temperature,
      pressure_kPa: pressure,
    },
    fluid: {
      apiGravity: input.apiGravity,
      density_kgm3: r(rho, 1),
      waterFraction: waterFrac,
      totalMass_kg: r(totalMass, 0),
    },
    losses: {
      breathingLoss_bblDay: r(breathingLoss, 3),
      standingLoss_bblDay: r(standingLoss, 3),
      roofType,
    },
    adequate,
    compliance: adequate,
    warnings,
  };
}

function estimateRVP(api: number, tempC: number): number {
  // Reid vapor pressure estimada en psi
  // Crudos pesados: RVP bajo; livianos: RVP alto
  const base = 0.5 + (api - 10) * 0.15;
  const tempFactor = 1 + (tempC - 25) * 0.01;
  return Math.max(0.5, base * tempFactor);
}

function r(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
