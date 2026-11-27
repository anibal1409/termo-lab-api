import { api12lFirebox, api12lWindK } from './api12l.tables';
import { ThermalCalculatorService } from './thermal-calculator.service';

describe('API-12L (valores de la norma)', () => {
  it('K de viento según Apéndice D', () => {
    expect(api12lWindK(0)).toBe(9.3);
    expect(api12lWindK(5)).toBe(9.8);
    expect(api12lWindK(10)).toBe(13.2);
    expect(api12lWindK(20)).toBe(15.7);
    expect(api12lWindK(15)).toBeCloseTo(14.45, 5); // interpolado 10–20
    expect(api12lWindK(40)).toBe(15.7); // sin extrapolar
  });

  it('Tabla 3 depende de la orientación', () => {
    expect(api12lFirebox(3, 'horizontal')).toMatchObject({
      area: 15,
      duty: 150_000,
    });
    expect(api12lFirebox(3, 'vertical')).toMatchObject({
      area: 10,
      duty: 100_000,
    });
    expect(api12lFirebox(8, 'horizontal')?.duty).toBe(750_000);
    expect(api12lFirebox(10, 'horizontal')?.duty).toBe(2_000_000);
    expect(api12lFirebox(12, 'vertical')).toBeNull();
    // diámetro no estándar → estándar inmediatamente menor
    expect(api12lFirebox(5, 'horizontal')?.diameter).toBe(4);
  });

  describe('Apéndice E (ejemplo de la norma)', () => {
    const calc = new ThermalCalculatorService();
    // W=400 bpd, X=0.1, T1=70, T2=120, Ro=60, Rw=30, Ta=30 °F, viento 10 mph
    const base = {
      totalFlow: 400,
      waterFraction: 10,
      apiGravity: 35,
      oilSpecificHeat: 0.52,
      waterSpecificHeat: 1.0,
      inletTemperature: 70,
      treatmentTemperature: 120,
      ambientTemperature: 30,
      operatingPressure: 50,
      oilRetentionTime: 60,
      waterRetentionTime: 30,
      windSpeed: 10,
    };

    it('horizontal: pérdida 71 280 BTU/h y selección 4 × 15', () => {
      const r = calc.calculateThermalResults({
        ...base,
        diameter: 4,
        length: 15,
        vesselOrientation: 'horizontal',
      });
      expect(r.heatLosses).toBeCloseTo(71_280, 0);
      // Q = W(6.44 + 8.14X)(T2−T1) = 145 080 (la norma redondea las constantes)
      expect(Math.abs(r.processHeatDuty / 145_080 - 1)).toBeLessThan(0.001);
      expect([r.recommendedDiameter, r.recommendedLength]).toEqual([4, 15]);
      expect(r.minimumHeatCapacity).toBe(250_000);
      expect(r.heatCapacityCompliance).toBe(true);
    });

    it('vertical: pérdida 95 040 BTU/h y selección 4 × 20', () => {
      const r = calc.calculateThermalResults({
        ...base,
        diameter: 4,
        length: 20,
        vesselOrientation: 'vertical',
      });
      expect(r.heatLosses).toBeCloseTo(95_040, 0);
      expect([r.recommendedDiameter, r.recommendedLength]).toEqual([4, 20]);
    });

    it('aislado: pérdida = 10 % del desnudo', () => {
      const r = calc.calculateThermalResults({
        ...base,
        diameter: 4,
        length: 15,
        insulated: true,
      });
      expect(r.heatLosses).toBeCloseTo(7_128, 0);
    });
  });
});

describe('API-12L: dimensionamiento a caudal máximo (Apéndice D)', () => {
  const calc = new ThermalCalculatorService();
  const base = {
    diameter: 4,
    length: 15,
    totalFlow: 400,
    waterFraction: 10,
    apiGravity: 35,
    inletTemperature: 70,
    treatmentTemperature: 120,
    ambientTemperature: 30,
    operatingPressure: 50,
    oilRetentionTime: 60,
    waterRetentionTime: 30,
    windSpeed: 10,
  };

  it('un pico de caudal exige un tratador mayor', () => {
    const normal = calc.calculateThermalResults(base);
    const peak = calc.calculateThermalResults({ ...base, maxTotalFlow: 1200 });
    expect(peak.recommendedDiameter * peak.recommendedLength).toBeGreaterThan(
      normal.recommendedDiameter * normal.recommendedLength,
    );
  });

  it('advierte fuera de rangos típicos sin hacer fallar', () => {
    const r = calc.calculateThermalResults({
      ...base,
      treatmentTemperature: 90,
      oilRetentionTime: 20,
    });
    const w = r.complianceWarnings.join(' | ');
    expect(w).toContain('100–250 °F');
    expect(w).toContain('30–100 min');
  });
});
