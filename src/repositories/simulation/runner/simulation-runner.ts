import { Stream, createInletStream, InletFeedParams } from './stream';
import { calculateSeparator } from '../equipment/separator';
import { calculateHeatExchanger } from '../equipment/heat-exchanger';
import { calculateStorageTank } from '../equipment/storage-tank';
import { calculateThermalTreater } from '../equipment/thermal-treater';

export type EquipmentType = 'separator' | 'heat-exchanger' | 'storage-tank' | 'thermal-treater';

export interface PipelineStep {
  name?: string;
  type: EquipmentType;
  config: Record<string, any>;
}

export interface PipelineInput {
  feed: InletFeedParams;
  steps: PipelineStep[];
  /**
   * Si true, redimensiona equipos no conformes (quita D/L fijos y sube retenciones)
   * hasta allCompliant o agotar intentos.
   */
  designForCompliance?: boolean;
}

export interface StepResult {
  step: number;
  name: string;
  type: EquipmentType;
  inputStream: Stream;
  outputStream: Stream;
  equipmentResult: any;
}

export interface PipelineResult {
  feed: Stream;
  steps: StepResult[];
  finalStream: Stream;
  summary: {
    totalSteps: number;
    allCompliant: boolean;
    warnings: string[];
    designPasses?: number;
    redesigned?: boolean;
  };
}

export function runPipeline(input: PipelineInput): PipelineResult {
  let workingSteps = input.steps.map((s) => ({
    ...s,
    config: { ...s.config },
  }));
  let result = runOnce({ ...input, steps: workingSteps });
  if (!input.designForCompliance || result.summary.allCompliant) {
    return result;
  }

  let passes = 0;
  const maxPasses = 3;
  while (!result.summary.allCompliant && passes < maxPasses) {
    passes++;
    workingSteps = redesignSteps(workingSteps, result);
    result = runOnce({ ...input, steps: workingSteps });
  }

  return {
    ...result,
    summary: {
      ...result.summary,
      designPasses: passes,
      redesigned: true,
    },
  };
}

function runOnce(input: PipelineInput): PipelineResult {
  let stream = createInletStream(input.feed);
  const results: StepResult[] = [];
  const allWarnings: string[] = [];
  let allCompliant = true;

  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    const inputStream = { ...stream };

    const cfg = applyAutoDimension(step.config);
    const merged = mergeStreamIntoConfig(stream, step.type, cfg);
    const eqResult = runEquipment(step.type, merged);

    if (eqResult.compliance === false || eqResult.adequate === false) {
      allCompliant = false;
    }
    if (eqResult.warnings?.length) {
      allWarnings.push(
        ...eqResult.warnings.map(
          (w: string) => `[${step.name ?? step.type}] ${w}`,
        ),
      );
    }

    stream = transformStream(stream, step.type, eqResult, i + 1, step.name);

    results.push({
      step: i + 1,
      name: step.name ?? `${step.type}-${i + 1}`,
      type: step.type,
      inputStream,
      outputStream: { ...stream },
      equipmentResult: eqResult,
    });
  }

  return {
    feed: createInletStream(input.feed),
    steps: results,
    finalStream: stream,
    summary: {
      totalSteps: input.steps.length,
      allCompliant,
      warnings: allWarnings,
    },
  };
}

/** Ajusta configs de pasos no conformes para el siguiente intento de diseño. */
function redesignSteps(
  steps: PipelineStep[],
  prev: PipelineResult,
): PipelineStep[] {
  return steps.map((step, i) => {
    const eq = prev.steps[i]?.equipmentResult;
    if (!eq || (eq.compliance !== false && eq.adequate !== false)) {
      return step;
    }
    const cfg = { ...step.config };
    // Quitar geometría fija → autodimensionamiento
    delete cfg.diameter;
    delete cfg.length;

    if (step.type === 'separator') {
      const req = eq.liquidCapacity?.requiredRetentionTime_min ?? 3;
      cfg.retentionTime = Math.max(cfg.retentionTime ?? req, req) * 1.25;
    }
    if (step.type === 'thermal-treater') {
      cfg.oilRetentionTime = Math.max(cfg.oilRetentionTime ?? 60, 60) * 1.15;
      cfg.waterRetentionTime = Math.max(cfg.waterRetentionTime ?? 30, 30) * 1.15;
      if (eq.separation?.bswMeetsSpec === false) {
        cfg.treatmentTemperature = Math.min(
          (cfg.treatmentTemperature ?? 140) + 10,
          180,
        );
      }
    }
    if (step.type === 'storage-tank') {
      delete cfg.diameter;
      delete cfg.height;
      cfg.storageTime_hours = Math.max(cfg.storageTime_hours ?? 48, 48);
    }
    return { ...step, config: cfg };
  });
}

function mergeStreamIntoConfig(
  s: Stream,
  type: EquipmentType,
  cfg: Record<string, any>,
): any {
  switch (type) {
    case 'separator':
      return {
        orientation: cfg.orientation ?? 'horizontal',
        liquidFlowBPD: cfg.liquidFlowBPD ?? s.liquidFlow_BPD,
        gasFlowMMSCFD: cfg.gasFlowMMSCFD ?? s.gasFlow_MMSCFD,
        waterFraction: cfg.waterFraction ?? s.waterFraction,
        freeWaterFraction: cfg.freeWaterFraction ?? s.freeWaterFraction,
        emulsifiedWaterFraction:
          cfg.emulsifiedWaterFraction ?? s.emulsifiedWaterFraction,
        temperature: cfg.temperature ?? s.temperature,
        pressure: cfg.pressure ?? s.pressure,
        liquidDensity: cfg.liquidDensity ?? s.liquidDensity,
        gasDensity: cfg.gasDensity ?? s.gasDensity,
        apiGravity: cfg.apiGravity ?? s.apiGravity,
        ...pick(cfg, ['diameter', 'length', 'retentionTime', 'dropDiameter_um', 'kFactor']),
      };

    case 'thermal-treater':
      return {
        totalFlow: cfg.totalFlow ?? s.liquidFlow_BPD,
        apiGravity: cfg.apiGravity ?? s.apiGravity,
        waterFraction: cfg.waterFraction ?? s.waterFraction,
        freeWaterFraction: cfg.freeWaterFraction ?? s.freeWaterFraction,
        emulsifiedWaterFraction:
          cfg.emulsifiedWaterFraction ?? s.emulsifiedWaterFraction,
        inletTemperature: cfg.inletTemperature ?? s.temperature,
        treatmentTemperature: cfg.treatmentTemperature ?? 140,
        ambientTemperature: cfg.ambientTemperature ?? 30,
        operatingPressure: cfg.operatingPressure ?? s.pressure,
        gasFlowRate: cfg.gasFlowRate ?? s.gasFlow_MMSCFD,
        ...pick(cfg, [
          'diameter',
          'length',
          'oilRetentionTime',
          'waterRetentionTime',
          'windSpeed',
          'burnerEfficiency',
          'dropDiameter_um',
        ]),
      };

    case 'heat-exchanger':
      return {
        arrangement: cfg.arrangement ?? 'counterflow',
        hot: cfg.hot ?? {
          massFlow_kgs: s.liquidFlow_BPD * s.liquidDensity * 1.84e-6,
          inletTemp: s.temperature,
          cp: 2.1,
        },
        cold: cfg.cold ?? {
          massFlow_kgs: 10,
          inletTemp: 25,
          outletTemp: 60,
          cp: 4.18,
        },
        ...pick(cfg, [
          'U',
          'area',
          'foulingFactor',
          'numberOfTubes',
          'tubeLength',
          'tubeOD',
        ]),
      };

    case 'storage-tank':
      return {
        flowBPD: cfg.flowBPD ?? s.oilFlow_BPD,
        storageTime_hours: cfg.storageTime_hours ?? 48,
        temperature: cfg.temperature ?? s.temperature,
        apiGravity: cfg.apiGravity ?? s.apiGravity,
        waterFraction: cfg.waterFraction ?? s.waterFraction,
        ...pick(cfg, ['diameter', 'height', 'roofType']),
      };
  }
}

function runEquipment(type: EquipmentType, config: any): any {
  switch (type) {
    case 'separator':
      return calculateSeparator(config);
    case 'heat-exchanger':
      return calculateHeatExchanger(config);
    case 'storage-tank':
      return calculateStorageTank(config);
    case 'thermal-treater':
      return calculateThermalTreater(config);
  }
}

function transformStream(
  s: Stream,
  type: EquipmentType,
  result: any,
  idx: number,
  name?: string,
): Stream {
  const out: Stream = {
    ...s,
    id: `stream-${idx}`,
    name: name ? `Salida ${name}` : `Stream ${idx}`,
  };

  switch (type) {
    case 'separator': {
      out.gasFlow_MMSCFD = 0;
      out.phase = 'liquid';
      if (result.waterSection) {
        out.waterFraction = result.waterSection.outletWaterFraction;
        out.bsw = result.waterSection.outletBSW_pct;
        // Tras el separador: lo remanente se trata como mayormente emulsionado
        out.freeWaterFraction = out.waterFraction * 0.2;
        out.emulsifiedWaterFraction = out.waterFraction * 0.8;
        out.waterFlow_BPD = out.liquidFlow_BPD * out.waterFraction;
        out.oilFlow_BPD = out.liquidFlow_BPD * (1 - out.waterFraction);
      }
      break;
    }

    case 'thermal-treater':
      out.temperature =
        result.operating?.treatmentTemperature_C ?? s.temperature;
      out.waterFraction =
        result.separation?.outletWaterFraction ?? s.waterFraction * 0.1;
      out.bsw =
        result.separation?.estimatedBSW_pct ?? out.waterFraction * 100;
      out.freeWaterFraction = out.waterFraction * 0.1;
      out.emulsifiedWaterFraction = out.waterFraction * 0.9;
      out.oilFlow_BPD = result.separation?.oilOutFlow_BPD ?? s.oilFlow_BPD;
      out.waterFlow_BPD =
        result.separation?.waterOutFlow_BPD ?? s.waterFlow_BPD;
      out.liquidFlow_BPD = out.oilFlow_BPD + out.waterFlow_BPD;
      out.gasFlow_MMSCFD += result.separation?.gasFlash_MMSCFD ?? 0;
      if (out.gasFlow_MMSCFD > 0) out.phase = 'two-phase';
      break;

    case 'heat-exchanger':
      if (result.compliance === false) {
        out.temperature = s.temperature;
      } else {
        out.temperature = result.temperatures?.hotOutlet ?? s.temperature;
      }
      break;

    case 'storage-tank':
      out.waterFraction = result.fluid?.waterFraction ?? s.waterFraction;
      out.bsw = out.waterFraction * 100;
      out.pressure = result.operating?.pressure_kPa ?? 101.325;
      break;
  }

  return out;
}

/**
 * Dimensiones opcionales: si autoDimension≠false y diameter/length/height
 * están vacíos o ≤0, se omiten para que el equipo autodimensione.
 */
function applyAutoDimension(cfg: Record<string, any>): Record<string, any> {
  const c = { ...cfg };
  const auto = c.autoDimension !== false;
  if (auto) {
    for (const k of ['diameter', 'length', 'height']) {
      const v = c[k];
      if (v == null || v === '' || (typeof v === 'number' && v <= 0)) {
        delete c[k];
      }
    }
  }
  delete c.autoDimension;
  return c;
}

function pick(obj: Record<string, any>, keys: string[]): Record<string, any> {
  const r: Record<string, any> = {};
  for (const k of keys) if (obj[k] !== undefined) r[k] = obj[k];
  return r;
}
