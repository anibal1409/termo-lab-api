import { BadRequestException } from '@nestjs/common';

import { ThermalCalculatorService } from './thermal-calculator.service';

describe('ThermalCalculatorService', () => {
  const service = new ThermalCalculatorService();

  const baseInput = {
    diameter: 6,
    length: 20,
    totalFlow: 500,
    waterFraction: 20,
    apiGravity: 18,
    inletTemperature: 75,
    ambientTemperature: 30,
    operatingPressure: 50,
    treatmentTemperature: 140,
    oilRetentionTime: 60,
    waterRetentionTime: 30,
    windSpeed: 15,
    freeWaterRemovalPercentage: 85,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('usa PAT (agua emulsionada) para caudal de agua libre', () => {
    const results = service.calculateThermalResults(baseInput);
    // % libre = 20 * 85 / 100 = 17; emulsionada = 3
    expect(results.freeWaterAndSedimentPercentage).toBeCloseTo(17, 5);
    expect(results.emulsifiedWaterPercentage).toBeCloseTo(3, 5);
    // CAL = ((100-3)*waterFlow/100)*(100-85)/100
    const waterFlow = results.waterFlowRate;
    const expected = ((((100 - 3) * waterFlow) / 100) * (100 - 85)) / 100;
    expect(results.freeWaterFlowEntering).toBeCloseTo(expected, 5);
  });

  it('rechaza niveles fuera de rango', () => {
    expect(() =>
      service.calculateThermalResults({
        ...baseInput,
        highHighOilLevel: 9999,
      }),
    ).toThrow(BadRequestException);
  });

  it('compara volúmenes de dimensión en pie³', () => {
    const results = service.calculateThermalResults(baseInput);
    expect(results.recommendedDiameter).toBeGreaterThan(0);
    expect(results.recommendedLength).toBeGreaterThan(0);
  });

  it('Stokes con gota en µm da velocidad física (pie/min) y TDP en minutos', () => {
    const r = service.calculateThermalResults(baseInput);
    // 150 µm en crudo 18 °API ≈ 1e-2 pie/min, nunca miles de pie/s
    expect(r.heavyPhaseSettlingVelocity).toBeGreaterThan(1e-3);
    expect(r.heavyPhaseSettlingVelocity).toBeLessThan(1);
    expect(r.heavyPhaseSettlingTime).toBeGreaterThan(1);
  });

  it('valida el diámetro real contra API-12L, no solo el recomendado', () => {
    const r = service.calculateThermalResults({ ...baseInput, diameter: 15 });
    expect(r.dimensionalCompliance).toBe(false);
    expect(r.api12lCompliance).toBe(false);
  });

  it('presión de operación sobre la de diseño de tabla no cumple', () => {
    const r = service.calculateThermalResults({
      ...baseInput,
      operatingPressure: 120,
    });
    expect(r.pressureCompliance).toBe(false);
  });
});
