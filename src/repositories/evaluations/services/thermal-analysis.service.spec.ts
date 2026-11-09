import { ThermalCalculatorService } from './thermal-calculator.service';
import {
  ThermalAnalysisService,
  checkCriteria,
} from './thermal-analysis.service';

const BASE_INPUT = {
  diameter: 6,
  length: 20,
  totalFlow: 500,
  waterFraction: 20,
  apiGravity: 18,
  inletTemperature: 75,
  ambientTemperature: 30,
  operatingPressure: 50,
  treatmentTemperature: 140,
};

describe('ThermalAnalysisService', () => {
  const calc = new ThermalCalculatorService();
  const svc = new ThermalAnalysisService(calc);

  describe('checkCriteria', () => {
    it('returns 6 criteria with value, limit, margin and passes', () => {
      const results = calc.calculateThermalResults(BASE_INPUT);
      const criteria = checkCriteria(results);
      expect(criteria).toHaveLength(6);
      for (const c of criteria) {
        expect(c).toHaveProperty('criterion');
        expect(c).toHaveProperty('value');
        expect(c).toHaveProperty('limit');
        expect(typeof c.marginPercent).toBe('number');
        expect(typeof c.passes).toBe('boolean');
      }
    });

    it('margin is positive when criterion passes', () => {
      const results = calc.calculateThermalResults(BASE_INPUT);
      const criteria = checkCriteria(results);
      for (const c of criteria) {
        if (c.passes) expect(c.marginPercent).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('diagnose', () => {
    it('returns compliant=true and no suggestions when design passes', () => {
      const result = svc.diagnose(BASE_INPUT);
      expect(result.compliant).toBe(true);
      expect(result.suggestions).toHaveLength(0);
    });

    it('gives suggestions for a failing design', () => {
      const failing = { ...BASE_INPUT, diameter: 4, length: 12 };
      const result = svc.diagnose(failing);
      expect(result.compliant).toBe(false);
      expect(result.suggestions.length).toBeGreaterThan(0);
      for (const s of result.suggestions) {
        expect(s.changePercent).not.toBe(0);
        expect(s.unit).toBeTruthy();
      }
    });

    it('applying the first suggestion makes it pass', () => {
      const failing = { ...BASE_INPUT, diameter: 4, length: 12 };
      const result = svc.diagnose(failing);
      if (result.suggestions.length > 0) {
        const s = result.suggestions[0];
        const keyMap: Record<string, string> = {
          Diámetro: 'diameter',
          Longitud: 'length',
          'Temperatura de tratamiento': 'treatmentTemperature',
        };
        const fixed = { ...failing, [keyMap[s.variable]]: s.requiredValue };
        const check = svc.diagnose(fixed);
        expect(check.compliant).toBe(true);
      }
    });
  });

  describe('sensitivity', () => {
    it('returns bars sorted by absolute swing', () => {
      const result = svc.sensitivity(BASE_INPUT, 10);
      expect(result.deltaPct).toBe(10);
      expect(result.bars.length).toBeGreaterThan(0);
      for (let i = 1; i < result.bars.length; i++) {
        expect(Math.abs(result.bars[i - 1].swing)).toBeGreaterThanOrEqual(
          Math.abs(result.bars[i].swing),
        );
      }
    });
  });

  describe('monteCarlo', () => {
    it('with zero stddev returns 0% or 100% matching deterministic', () => {
      const mc = svc.monteCarlo({
        base: BASE_INPUT,
        distributions: {
          apiGravity: {
            type: 'normal',
            mean: BASE_INPUT.apiGravity,
            stddev: 0,
          },
          waterFraction: {
            type: 'normal',
            mean: BASE_INPUT.waterFraction,
            stddev: 0,
          },
          oilViscosity: { type: 'normal', mean: 15.5, stddev: 0 },
          waterDropSize: { type: 'normal', mean: 150, stddev: 0 },
        },
        runs: 100,
        seed: 1,
      });
      const deterministic = svc.diagnose(BASE_INPUT);
      if (deterministic.compliant) {
        expect(mc.overallComplianceProbability).toBe(100);
      } else {
        expect(mc.overallComplianceProbability).toBe(0);
      }
    });

    it('is reproducible with same seed', () => {
      const opts = { base: BASE_INPUT, runs: 200, seed: 99 };
      const a = svc.monteCarlo(opts);
      const b = svc.monteCarlo(opts);
      expect(a.overallComplianceProbability).toBe(
        b.overallComplianceProbability,
      );
    });

    it('respects max 20000 runs', () => {
      const mc = svc.monteCarlo({ base: BASE_INPUT, runs: 50000, seed: 1 });
      expect(mc.runs).toBeLessThanOrEqual(20000);
    });
  });
});
