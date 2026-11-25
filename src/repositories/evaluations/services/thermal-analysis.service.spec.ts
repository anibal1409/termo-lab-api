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
    it('returns 9 criteria (6 de proceso + 3 de tablas API-12L) with value, limit, margin and passes', () => {
      const results = calc.calculateThermalResults(BASE_INPUT);
      const criteria = checkCriteria(results);
      expect(criteria).toHaveLength(9);
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

    it('caso 8×32 ft / 5000 BPD: deshidratación ≤100 % y valores coherentes', () => {
      // Mismo caso reportado: 9 % agua, 22 °API, 176→284 °F, 72.5 psig, 86 °F amb
      const results = calc.calculateThermalResults({
        diameter: 8,
        length: 32,
        totalFlow: 5000,
        waterFraction: 9,
        apiGravity: 22,
        inletTemperature: 176,
        treatmentTemperature: 284,
        ambientTemperature: 86,
        operatingPressure: 72.5,
        oilRetentionTime: 60,
        waterRetentionTime: 30,
        windSpeed: 10,
        gasFlowRate: 0.5,
      });
      const criteria = checkCriteria(results);
      const dehy = criteria.find((c) => c.criterion === 'Deshidratación')!;
      expect(dehy.value).toBeLessThanOrEqual(100);
      expect(dehy.value).toBeGreaterThanOrEqual(0);

      const gas = criteria.find((c) => c.criterion === 'Área de gas')!;
      expect(results.gasArea).toBeGreaterThan(0);
      // Con gasFlow > 0, required no debería ser un “0 vacío” que aprueba solo
      expect(Number.isFinite(gas.value)).toBe(true);

      const z = criteria.find((c) => c.criterion === 'Factor Z')!;
      expect(Number.isFinite(z.value)).toBe(true);
      // Z no debe estar forzado artificialmente al borde 0.1 si el solver converge
      if (z.passes) {
        expect(z.value).toBeGreaterThanOrEqual(0.1);
        expect(z.value).toBeLessThanOrEqual(2.0);
      }

      const cut = criteria.find(
        (c) => c.criterion === 'Corte de agua a la salida',
      )!;
      expect(cut.value).toBeGreaterThanOrEqual(0);
      expect(cut.value).toBeLessThanOrEqual(100);
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
