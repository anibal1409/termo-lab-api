/**
 * Modelo de intercambiador de calor (shell & tube).
 *
 * Método LMTD (Log Mean Temperature Difference).
 * Calcula: Q transferido, área requerida, eficiencia, temperaturas de salida.
 *
 * Referencia: Kern, "Process Heat Transfer"; TEMA standards.
 */

export type FlowArrangement = 'counterflow' | 'parallel' | 'crossflow';

export interface HeatExchangerInput {
  arrangement: FlowArrangement;
  /** Fluido caliente */
  hot: {
    /** Caudal másico kg/s (o BPD si se indica) */
    massFlow_kgs: number;
    /** Temperatura de entrada °C */
    inletTemp: number;
    /** Temperatura de salida deseada °C (opcional, se calcula si no se da) */
    outletTemp?: number;
    /** Cp en kJ/(kg·°C) */
    cp: number;
  };
  /** Fluido frío */
  cold: {
    massFlow_kgs: number;
    inletTemp: number;
    outletTemp?: number;
    cp: number;
  };
  /** Coeficiente global de transferencia U en W/(m²·°C) (típico 300-800 para crudo/agua) */
  U?: number;
  /** Área de transferencia m² (si se conoce; si no, se calcula) */
  area?: number;
  /** Factor de ensuciamiento total m²·°C/W */
  foulingFactor?: number;
  /** Diámetro de carcasa en metros (para sizing) */
  shellDiameter?: number;
  /** Longitud de tubos en metros */
  tubeLength?: number;
  /** Diámetro exterior de tubos en metros (default 0.01905 = 3/4") */
  tubeOD?: number;
  /** Número de tubos (si se conoce) */
  numberOfTubes?: number;
}

export interface HeatExchangerResult {
  /** Calor transferido en kW */
  duty_kW: number;
  /** LMTD en °C */
  LMTD: number;
  /** Factor de corrección F para LMTD */
  F: number;
  /** Coeficiente global efectivo W/(m²·°C) */
  Ueffective: number;
  /** Área requerida m² */
  requiredArea_m2: number;
  /** Área disponible m² (si se dieron dimensiones) */
  availableArea_m2?: number;
  /** Sobredimensionamiento % */
  overdesignPct?: number;
  /** Temperaturas */
  temperatures: {
    hotInlet: number;
    hotOutlet: number;
    coldInlet: number;
    coldOutlet: number;
  };
  /** Eficiencia térmica (ε) */
  effectiveness: number;
  /** NTU */
  NTU: number;
  sizing?: {
    numberOfTubes: number;
    tubeLength_m: number;
    shellDiameter_m: number;
  };
  /** false si el balance produce temperaturas termodinámicamente imposibles */
  compliance: boolean;
  warnings: string[];
}

export function calculateHeatExchanger(input: HeatExchangerInput): HeatExchangerResult {
  const warnings: string[] = [];

  const { hot, cold, arrangement } = input;
  const Cph = hot.massFlow_kgs * hot.cp * 1000; // W/°C
  const Cpc = cold.massFlow_kgs * cold.cp * 1000;
  const Cmin = Math.min(Cph, Cpc);
  const Cmax = Math.max(Cph, Cpc);
  const Cr = Cmin / Cmax;

  // Determinar temperaturas de salida si no se dan ambas
  let Tho = hot.outletTemp;
  let Tco = cold.outletTemp;

  if (Tho != null && Tco == null) {
    // Balance: Cph(Thi - Tho) = Cpc(Tco - Tci)
    const Q = Cph * (hot.inletTemp - Tho);
    Tco = cold.inletTemp + Q / Cpc;
  } else if (Tco != null && Tho == null) {
    const Q = Cpc * (Tco - cold.inletTemp);
    Tho = hot.inletTemp - Q / Cph;
  } else if (Tho == null && Tco == null) {
    // Sin temperaturas de salida: usar área dada o asumir efectividad 0.6
    if (input.area && input.U) {
      const UA = input.U * input.area;
      const NTU = UA / Cmin;
      const eff = calcEffectiveness(NTU, Cr, arrangement);
      const Qmax = Cmin * (hot.inletTemp - cold.inletTemp);
      const Q = eff * Qmax;
      Tho = hot.inletTemp - Q / Cph;
      Tco = cold.inletTemp + Q / Cpc;
    } else {
      const eff = 0.6;
      const Qmax = Cmin * (hot.inletTemp - cold.inletTemp);
      const Q = eff * Qmax;
      Tho = hot.inletTemp - Q / Cph;
      Tco = cold.inletTemp + Q / Cpc;
      warnings.push('Temperaturas de salida estimadas con efectividad=0.6 (no se dieron T salida ni área+U)');
    }
  }

  // Acotar salidas al dominio físico y recalcular Q desde temperaturas válidas
  let compliance = true;
  if (Tho! < cold.inletTemp) {
    warnings.push(
      'Temperatura de salida caliente menor que entrada fría (termodinámicamente imposible); se limita a T_fría_entrada',
    );
    Tho = cold.inletTemp;
    compliance = false;
  }
  if (Tco! > hot.inletTemp) {
    warnings.push(
      'Temperatura de salida fría mayor que entrada caliente (termodinámicamente imposible); se limita a T_caliente_entrada',
    );
    Tco = hot.inletTemp;
    compliance = false;
  }
  // Rebalancear el otro lado si se limitó una salida
  if (!compliance) {
    const Qcap = Cph * (hot.inletTemp - Tho!);
    Tco = cold.inletTemp + Qcap / Cpc;
    if (Tco > hot.inletTemp) Tco = hot.inletTemp;
  }

  const Q = Cph * (hot.inletTemp - Tho!); // W

  // LMTD
  let dT1: number, dT2: number;
  if (arrangement === 'parallel') {
    dT1 = hot.inletTemp - cold.inletTemp;
    dT2 = Tho! - Tco!;
  } else {
    // Contracorriente (y crossflow como aproximación)
    dT1 = hot.inletTemp - Tco!;
    dT2 = Tho! - cold.inletTemp;
  }

  let LMTD: number;
  if (Math.abs(dT1 - dT2) < 0.01) {
    LMTD = dT1; // caso especial: igual
  } else if (dT1 <= 0 || dT2 <= 0) {
    LMTD = Math.abs(dT1 + dT2) / 2;
    warnings.push('LMTD calculado con aproximación (ΔT cruzado)');
  } else {
    LMTD = (dT1 - dT2) / Math.log(dT1 / dT2);
  }

  // Factor de corrección F (1.0 para contracorriente, <1 para otros)
  let F = 1.0;
  if (arrangement === 'parallel') F = 0.85;
  if (arrangement === 'crossflow') F = 0.90;

  // U efectivo con fouling
  const fouling = input.foulingFactor ?? 0.0003; // m²·°C/W típico crudo
  const Uclean = input.U ?? 500; // W/(m²·°C) default
  const Ueff = 1 / (1 / Uclean + fouling);

  // Área requerida
  const Areq = Math.abs(Q) / (Ueff * LMTD * F);

  // Efectividad y NTU
  const Qmax = Cmin * (hot.inletTemp - cold.inletTemp);
  const effectiveness = Qmax > 0 ? Math.abs(Q) / Qmax : 0;
  const NTU = Areq * Ueff / Cmin;

  // Sizing de tubos si no se da área
  let sizing: HeatExchangerResult['sizing'];
  let availableArea: number | undefined;
  let overdesign: number | undefined;

  if (input.area) {
    availableArea = input.area;
    overdesign = (input.area / Areq - 1) * 100;
    if (overdesign < 0) warnings.push(`Área insuficiente: faltan ${(-overdesign).toFixed(1)}%`);
  }

  const tubeOD = input.tubeOD ?? 0.01905; // 3/4"
  if (input.numberOfTubes && input.tubeLength) {
    availableArea = Math.PI * tubeOD * input.tubeLength * input.numberOfTubes;
    overdesign = (availableArea / Areq - 1) * 100;
    sizing = {
      numberOfTubes: input.numberOfTubes,
      tubeLength_m: input.tubeLength,
      shellDiameter_m: input.shellDiameter ?? estimateShellDiameter(input.numberOfTubes, tubeOD),
    };
  } else {
    // Autosizing
    const tubeLengthDefault = input.tubeLength ?? 3.66; // 12ft estándar
    const nTubes = Math.ceil(Areq / (Math.PI * tubeOD * tubeLengthDefault));
    sizing = {
      numberOfTubes: nTubes,
      tubeLength_m: tubeLengthDefault,
      shellDiameter_m: input.shellDiameter ?? estimateShellDiameter(nTubes, tubeOD),
    };
    availableArea = Math.PI * tubeOD * tubeLengthDefault * nTubes;
    overdesign = (availableArea / Areq - 1) * 100;
  }

  return {
    duty_kW: round(Q / 1000, 2),
    LMTD: round(LMTD, 2),
    F,
    Ueffective: round(Ueff, 1),
    requiredArea_m2: round(Areq, 2),
    availableArea_m2: availableArea ? round(availableArea, 2) : undefined,
    overdesignPct: overdesign != null ? round(overdesign, 1) : undefined,
    temperatures: {
      hotInlet: hot.inletTemp,
      hotOutlet: round(Tho!, 2),
      coldInlet: cold.inletTemp,
      coldOutlet: round(Tco!, 2),
    },
    effectiveness: round(effectiveness, 4),
    NTU: round(NTU, 3),
    sizing,
    compliance,
    warnings,
  };
}

function calcEffectiveness(NTU: number, Cr: number, arr: FlowArrangement): number {
  if (Cr === 0) return 1 - Math.exp(-NTU);
  if (arr === 'counterflow') {
    if (Math.abs(Cr - 1) < 0.001) return NTU / (1 + NTU);
    return (1 - Math.exp(-NTU * (1 - Cr))) / (1 - Cr * Math.exp(-NTU * (1 - Cr)));
  }
  // Paralelo
  return (1 - Math.exp(-NTU * (1 + Cr))) / (1 + Cr);
}

function estimateShellDiameter(nTubes: number, tubeOD: number): number {
  const pitch = tubeOD * 1.25; // triangular pitch
  const areaPerTube = pitch * pitch * 0.866;
  const totalArea = nTubes * areaPerTube;
  return round(Math.sqrt(4 * totalArea / Math.PI) * 1.3, 3); // 30% extra para clearance
}

function round(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
