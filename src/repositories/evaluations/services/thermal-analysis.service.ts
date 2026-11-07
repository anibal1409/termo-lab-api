import { Injectable } from '@nestjs/common';
import {
  ThermalCalculatorService,
  ThermalTreatmentInput,
  ThermalCalculationResults,
} from './thermal-calculator.service';

// ── Criterion check ────────────────────────────────────────────────

export interface CriterionResult {
  criterion: string;
  value: number;
  limit: string;
  marginPercent: number;
  passes: boolean;
}

export function checkCriteria(r: ThermalCalculationResults): CriterionResult[] {
  return [
    {
      criterion: 'Tiempo de retención',
      value: r.estimatedRetentionTime,
      limit: '≥ 60 min',
      marginPercent: ((r.estimatedRetentionTime - 60) / 60) * 100,
      passes: r.estimatedRetentionTime >= 60,
    },
    {
      criterion: 'Deshidratación',
      value: r.dehydrationPercentage,
      limit: '≥ 85 %',
      marginPercent: ((r.dehydrationPercentage - 85) / 85) * 100,
      passes: r.dehydrationPercentage >= 85,
    },
    {
      criterion: 'Eficiencia de separación',
      value: r.separationEfficiency,
      limit: '≥ 85 %',
      marginPercent: ((r.separationEfficiency - 85) / 85) * 100,
      passes: r.separationEfficiency >= 85,
    },
    {
      criterion: 'Área de gas',
      value: r.requiredGasArea,
      limit: `≤ ${r.gasArea.toFixed(3)} pie²`,
      marginPercent:
        r.gasArea > 0
          ? ((r.gasArea - r.requiredGasArea) / r.gasArea) * 100
          : r.requiredGasArea === 0
            ? 100
            : -100,
      passes: r.requiredGasArea <= r.gasArea,
    },
    {
      criterion: 'Corte de agua a la salida',
      value: effectiveWaterCut(r),
      limit: '≤ 2 %',
      marginPercent: ((2 - effectiveWaterCut(r)) / 2) * 100,
      passes: effectiveWaterCut(r) <= 2,
    },
    {
      criterion: 'Factor Z',
      value: r.gasCompressibilityFactor,
      limit: '0,1 – 2,0',
      marginPercent: zMargin(r.gasCompressibilityFactor),
      passes:
        r.gasCompressibilityFactor >= 0.1 &&
        r.gasCompressibilityFactor <= 2.0,
    },
  ];
}

// ponytail: dehydration > 100% means all water removed; the raw waterCut formula goes negative then wraps positive — clamp to 0
function effectiveWaterCut(r: ThermalCalculationResults): number {
  return r.dehydrationPercentage >= 100
    ? 0
    : Math.max(0, r.waterCutLeavingTreater);
}

function zMargin(z: number): number {
  if (z < 0.1) return ((z - 0.1) / 0.1) * 100;
  if (z > 2.0) return ((2.0 - z) / 2.0) * 100;
  const distLow = z - 0.1;
  const distHigh = 2.0 - z;
  const closest = Math.min(distLow, distHigh);
  const ref = distLow < distHigh ? 0.1 : 2.0;
  return (closest / ref) * 100;
}

function allPass(criteria: CriterionResult[]): boolean {
  return criteria.every((c) => c.passes);
}

// ── Design variables for detective / tornado ───────────────────────

interface DesignVar {
  key: keyof ThermalTreatmentInput;
  label: string;
  unit: string;
  lo: number;
  hi: number;
}

const DESIGN_VARS: DesignVar[] = [
  { key: 'diameter', label: 'Diámetro', unit: 'pies', lo: 1, hi: 20 },
  { key: 'length', label: 'Longitud', unit: 'pies', lo: 5, hi: 60 },
  {
    key: 'treatmentTemperature',
    label: 'Temperatura de tratamiento',
    unit: '°F',
    lo: 80,
    hi: 250,
  },
];

// ── Diagnose (detective) ───────────────────────────────────────────

export interface Suggestion {
  variable: string;
  currentValue: number;
  requiredValue: number;
  changePercent: number;
  unit: string;
}

export interface DiagnoseResult {
  criteria: CriterionResult[];
  compliant: boolean;
  suggestions: Suggestion[];
}

function bisect(
  calc: ThermalCalculatorService,
  base: ThermalTreatmentInput,
  varDef: DesignVar,
): Suggestion | null {
  const current = (base[varDef.key] as number) ?? 0;
  if (current <= 0) return null;

  let lo = current;
  let hi = varDef.hi;

  const testVal = (v: number) => {
    const input = { ...base, [varDef.key]: v } as ThermalTreatmentInput;
    try {
      return allPass(checkCriteria(calc.calculateThermalResults(input)));
    } catch {
      return false;
    }
  };

  if (testVal(current)) return null;
  if (!testVal(hi)) {
    // ponytail: also try decreasing for temperature (lower T might help gas density)
    lo = varDef.lo;
    hi = current;
    if (!testVal(lo)) return null;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (testVal(mid)) hi = mid;
      else lo = mid;
    }
  } else {
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      if (testVal(mid)) hi = mid;
      else lo = mid;
    }
  }

  // Round away from current to stay on the passing side
  const factor = hi > current ? 1e4 : -1e4;
  const required = Math.ceil(hi * factor) / factor;
  const change = ((required - current) / current) * 100;
  return {
    variable: varDef.label,
    currentValue: current,
    requiredValue: required,
    changePercent: +change.toFixed(2),
    unit: varDef.unit,
  };
}

// ── Sensitivity (tornado) ──────────────────────────────────────────

export interface SensitivityBar {
  variable: string;
  criterion: string;
  marginAtLow: number;
  marginAtHigh: number;
  swing: number;
}

export interface SensitivityResult {
  deltaPct: number;
  bars: SensitivityBar[];
}

// ── Monte Carlo ────────────────────────────────────────────────────

export interface Distribution {
  type: 'normal' | 'uniform';
  mean?: number;
  stddev?: number;
  min?: number;
  max?: number;
}

export interface MonteCarloInput {
  base: ThermalTreatmentInput;
  distributions?: {
    apiGravity?: Distribution;
    waterFraction?: Distribution;
    oilViscosity?: Distribution;
    waterDropSize?: Distribution;
  };
  runs?: number;
  seed?: number;
}

export interface MonteCarloCriterionStat {
  criterion: string;
  complianceProbability: number;
  p10: number;
  p50: number;
  p90: number;
}

export interface MonteCarloResult {
  runs: number;
  seed: number;
  overallComplianceProbability: number;
  criteria: MonteCarloCriterionStat[];
  percentiles: {
    retentionTime: { p10: number; p50: number; p90: number };
    waterCut: { p10: number; p50: number; p90: number };
    totalHeatRequired: { p10: number; p50: number; p90: number };
  };
}

// Seeded PRNG (mulberry32)
function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function sampleDistribution(rng: () => number, dist: Distribution): number {
  if (dist.type === 'uniform') {
    return dist.min! + rng() * (dist.max! - dist.min!);
  }
  // Box-Muller
  const u1 = rng() || 1e-10;
  const u2 = rng();
  return (
    dist.mean! +
    dist.stddev! * Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  );
}

function percentile(sorted: number[], p: number): number {
  const i = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
}

// ── Service ────────────────────────────────────────────────────────

@Injectable()
export class ThermalAnalysisService {
  constructor(private readonly calc: ThermalCalculatorService) {}

  diagnose(input: ThermalTreatmentInput): DiagnoseResult {
    const results = this.calc.calculateThermalResults(input);
    const criteria = checkCriteria(results);
    const compliant = allPass(criteria);

    const suggestions: Suggestion[] = [];
    if (!compliant) {
      for (const v of DESIGN_VARS) {
        const s = bisect(this.calc, input, v);
        if (s) suggestions.push(s);
      }
      suggestions.sort((a, b) => Math.abs(a.changePercent) - Math.abs(b.changePercent));
      suggestions.splice(3);
    }

    return { criteria, compliant, suggestions };
  }

  sensitivity(
    input: ThermalTreatmentInput,
    deltaPct = 10,
  ): SensitivityResult {
    const delta = deltaPct / 100;
    const bars: SensitivityBar[] = [];

    for (const v of DESIGN_VARS) {
      const current = (input[v.key] as number) ?? 0;
      if (current <= 0) continue;

      const inputLo = { ...input, [v.key]: current * (1 - delta) } as ThermalTreatmentInput;
      const inputHi = { ...input, [v.key]: current * (1 + delta) } as ThermalTreatmentInput;

      let criteriaLo: CriterionResult[];
      let criteriaHi: CriterionResult[];
      try {
        criteriaLo = checkCriteria(this.calc.calculateThermalResults(inputLo));
      } catch {
        continue;
      }
      try {
        criteriaHi = checkCriteria(this.calc.calculateThermalResults(inputHi));
      } catch {
        continue;
      }

      for (let i = 0; i < criteriaLo.length; i++) {
        const mLo = criteriaLo[i].marginPercent;
        const mHi = criteriaHi[i].marginPercent;
        bars.push({
          variable: v.label,
          criterion: criteriaLo[i].criterion,
          marginAtLow: +mLo.toFixed(2),
          marginAtHigh: +mHi.toFixed(2),
          swing: +(mHi - mLo).toFixed(2),
        });
      }
    }

    bars.sort((a, b) => Math.abs(b.swing) - Math.abs(a.swing));
    return { deltaPct, bars };
  }

  monteCarlo(input: MonteCarloInput): MonteCarloResult {
    const runs = Math.min(input.runs ?? 5000, 20000);
    const seed = input.seed ?? 42;
    const rng = mulberry32(seed);
    const dist = input.distributions ?? {};

    const defaults: Record<string, Distribution> = {
      apiGravity: { type: 'normal', mean: input.base.apiGravity, stddev: input.base.apiGravity * 0.05 },
      waterFraction: { type: 'normal', mean: input.base.waterFraction, stddev: input.base.waterFraction * 0.1 },
      oilViscosity: { type: 'normal', mean: input.base.oilViscosity ?? 15.5, stddev: (input.base.oilViscosity ?? 15.5) * 0.15 },
      waterDropSize: { type: 'normal', mean: input.base.waterDropSize ?? 150, stddev: (input.base.waterDropSize ?? 150) * 0.2 },
    };

    const dists = {
      apiGravity: dist.apiGravity ?? defaults.apiGravity,
      waterFraction: dist.waterFraction ?? defaults.waterFraction,
      oilViscosity: dist.oilViscosity ?? defaults.oilViscosity,
      waterDropSize: dist.waterDropSize ?? defaults.waterDropSize,
    };

    const criterionNames = [
      'Tiempo de retención',
      'Deshidratación',
      'Eficiencia de separación',
      'Área de gas',
      'Corte de agua a la salida',
      'Factor Z',
    ];
    const passCount = new Array(criterionNames.length).fill(0);
    const margins: number[][] = criterionNames.map(() => []);
    let allPassCount = 0;

    const retentionTimes: number[] = [];
    const waterCuts: number[] = [];
    const heatReqs: number[] = [];

    for (let i = 0; i < runs; i++) {
      const sampled: ThermalTreatmentInput = {
        ...input.base,
        apiGravity: Math.max(1, sampleDistribution(rng, dists.apiGravity)),
        waterFraction: Math.max(0, Math.min(100, sampleDistribution(rng, dists.waterFraction))),
        oilViscosity: Math.max(0.1, sampleDistribution(rng, dists.oilViscosity)),
        waterDropSize: Math.max(1, sampleDistribution(rng, dists.waterDropSize)),
      };

      let results: ThermalCalculationResults;
      try {
        results = this.calc.calculateThermalResults(sampled);
      } catch {
        continue;
      }

      const criteria = checkCriteria(results);
      let runPasses = true;
      for (let j = 0; j < criteria.length; j++) {
        margins[j].push(criteria[j].marginPercent);
        if (criteria[j].passes) passCount[j]++;
        else runPasses = false;
      }
      if (runPasses) allPassCount++;

      retentionTimes.push(results.estimatedRetentionTime);
      waterCuts.push(results.waterCutLeavingTreater);
      heatReqs.push(results.totalHeatRequired);
    }

    const validRuns = retentionTimes.length || 1;

    const sortedRetention = [...retentionTimes].sort((a, b) => a - b);
    const sortedWaterCut = [...waterCuts].sort((a, b) => a - b);
    const sortedHeat = [...heatReqs].sort((a, b) => a - b);

    const criteriaStats: MonteCarloCriterionStat[] = criterionNames.map(
      (name, j) => {
        const sorted = [...margins[j]].sort((a, b) => a - b);
        return {
          criterion: name,
          complianceProbability: +((passCount[j] / validRuns) * 100).toFixed(2),
          p10: +(percentile(sorted, 10)).toFixed(2),
          p50: +(percentile(sorted, 50)).toFixed(2),
          p90: +(percentile(sorted, 90)).toFixed(2),
        };
      },
    );

    return {
      runs: validRuns,
      seed,
      overallComplianceProbability: +((allPassCount / validRuns) * 100).toFixed(2),
      criteria: criteriaStats,
      percentiles: {
        retentionTime: {
          p10: +(percentile(sortedRetention, 10)).toFixed(2),
          p50: +(percentile(sortedRetention, 50)).toFixed(2),
          p90: +(percentile(sortedRetention, 90)).toFixed(2),
        },
        waterCut: {
          p10: +(percentile(sortedWaterCut, 10)).toFixed(4),
          p50: +(percentile(sortedWaterCut, 50)).toFixed(4),
          p90: +(percentile(sortedWaterCut, 90)).toFixed(4),
        },
        totalHeatRequired: {
          p10: +(percentile(sortedHeat, 10)).toFixed(0),
          p50: +(percentile(sortedHeat, 50)).toFixed(0),
          p90: +(percentile(sortedHeat, 90)).toFixed(0),
        },
      },
    };
  }
}
