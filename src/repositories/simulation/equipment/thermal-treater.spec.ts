import {
  calculateThermalTreater,
  FILL_OIL,
  FILL_WATER,
} from './thermal-treater';
import { runPipeline } from '../runner/simulation-runner';
import { calculateHeatExchanger } from './heat-exchanger';

describe('calculateThermalTreater', () => {
  const base = {
    totalFlow: 5000,
    apiGravity: 22,
    waterFraction: 0.09,
    inletTemperature: 80,
    treatmentTemperature: 140,
    ambientTemperature: 30,
    operatingPressure: 500,
  };

  it('autodimensiona con el mismo fill 40/30 que usa al verificar retención', () => {
    const result = calculateThermalTreater(base);
    const Qoil = base.totalFlow * (1 - base.waterFraction);
    const Voil = result.dimensions.volume_bbl * FILL_OIL;
    const retOil = (Voil / Qoil) * 1440;
    expect(result.retention.oilRetention_min).toBeCloseTo(retOil, 0);
    expect(result.retention.oilAdequate).toBe(true);
    expect(result.retention.waterAdequate).toBe(true);
    expect(FILL_OIL).toBe(0.4);
    expect(FILL_WATER).toBe(0.3);
  });

  it('incluye criteria[] API 12L + BSW<1% + capacidad nominal', () => {
    const result = calculateThermalTreater({
      ...base,
      diameter: 8,
      length: 32,
    });
    expect(Array.isArray(result.criteria)).toBe(true);
    expect(result.criteria.length).toBeGreaterThanOrEqual(6);
    expect(result.criteria.some((c) => c.criterion.includes('BSW'))).toBe(true);
    expect(result.separation.bswSpec_pct).toBe(1);
    expect(result.thermal.nominalCapacity_BTUh).toBeGreaterThan(0);
    expect(result.settling.source).toContain('Stewart');
    expect(result.settling.stewartRange_um?.avg).toBe(
      result.settling.dropDiameter_um,
    );
    expect(result.autoDimensioned).toBe(false);
    expect(typeof result.compliance).toBe('boolean');
  });

  it('autodimensiona si no hay D×L', () => {
    const result = calculateThermalTreater(base);
    expect(result.autoDimensioned).toBe(true);
    expect(result.dimensions.diameter_ft).toBeGreaterThan(0);
  });
});

describe('runPipeline — agua libre/emulsionada y diseño', () => {
  it('acepta bsw + free/emulsified y propaga BSW % tras separador', () => {
    const result = runPipeline({
      feed: {
        totalFlow_BPD: 5000,
        apiGravity: 22,
        bsw: 30,
        freeWaterPct: 20,
        emulsifiedWaterPct: 10,
        temperature: 80,
        pressure: 500,
      },
      steps: [
        { name: 'Sep', type: 'separator', config: { orientation: 'horizontal' } },
      ],
    });
    expect(result.feed.bsw).toBeCloseTo(30, 0);
    expect(result.feed.freeWaterFraction).toBeCloseTo(0.2, 2);
    expect(result.steps[0].equipmentResult.waterSection.outletBSW_pct).toBeLessThan(30);
    expect(result.steps[0].outputStream.bsw).toBe(
      result.steps[0].equipmentResult.waterSection.outletBSW_pct,
    );
    expect(result.feed.gasMW).toBeGreaterThan(10);
    expect(result.feed.gasFlow_MMSCFD).toBeGreaterThan(0);
    expect(result.feed.gor).toBeGreaterThan(0);
    expect(result.feed.chromatography?.components?.length).toBeGreaterThan(0);
    expect(result.steps[0].equipmentResult.autoDimensioned).toBe(true);
    expect(result.steps[0].equipmentResult.settling.dropDiameter_um).toBe(400); // Stewart avg mediano
  });

  it('calcula gas desde GOR y acepta cromatografía cargada', () => {
    const result = runPipeline({
      feed: {
        totalFlow_BPD: 1000,
        apiGravity: 35,
        bsw: 10,
        temperature: 60,
        pressure: 500,
        gor: 800,
        useChromatography: true,
      },
      steps: [{ type: 'separator', config: { orientation: 'vertical', autoDimension: true } }],
    });
    // oil = 900 BPD → gas = 900*800/1e6 = 0.72 MMSCFD
    expect(result.feed.gasFlow_MMSCFD).toBeCloseTo(0.72, 2);
    expect(result.feed.gasFlowSource).toBe('from_gor');
  });

  it('designForCompliance intenta redimensionar equipos no conformes', () => {
    const result = runPipeline({
      feed: {
        totalFlow_BPD: 8000,
        apiGravity: 18,
        bsw: 25,
        freeWaterPct: 15,
        emulsifiedWaterPct: 10,
        temperature: 70,
        pressure: 400,
      },
      designForCompliance: true,
      steps: [
        {
          name: 'Sep chico',
          type: 'separator',
          config: { orientation: 'horizontal', diameter: 0.5, length: 1 },
        },
        { name: 'Tratador', type: 'thermal-treater', config: {} },
      ],
    });
    expect(result.summary.redesigned).toBe(true);
    expect(result.summary.designPasses).toBeGreaterThanOrEqual(1);
  });
});

describe('runPipeline — correcciones de integración', () => {
  const feed = {
    totalFlow_BPD: 5000,
    apiGravity: 22,
    waterFraction: 0.3,
    temperature: 80,
    pressure: 500,
  };

  it('pipeline Separador→Tratador→Tanque: tratador autodimensionado cumple retención', () => {
    const result = runPipeline({
      feed,
      steps: [
        { name: 'Separador', type: 'separator', config: { orientation: 'horizontal' } },
        { name: 'Tratador', type: 'thermal-treater', config: {} },
        { name: 'Tanque', type: 'storage-tank', config: { storageTime_hours: 48 } },
      ],
    });
    const treater = result.steps.find((s) => s.type === 'thermal-treater');
    expect(treater?.equipmentResult.retention.oilAdequate).toBe(true);
    expect(result.finalStream.pressure).toBeCloseTo(101.325, 2);
  });

  it('heat-exchanger con config vacío no propaga T imposibles', () => {
    const hex = calculateHeatExchanger({
      arrangement: 'counterflow',
      hot: { massFlow_kgs: 0.01, inletTemp: 80, cp: 2.1 },
      cold: { massFlow_kgs: 10, inletTemp: 25, outletTemp: 60, cp: 4.18 },
    });
    expect(hex.temperatures.hotOutlet).toBeGreaterThanOrEqual(
      hex.temperatures.coldInlet - 1e-6,
    );
    expect(hex.compliance).toBe(false);

    const pipe = runPipeline({
      feed,
      steps: [
        { name: 'HEX', type: 'heat-exchanger', config: {} },
        { name: 'Tanque', type: 'storage-tank', config: {} },
      ],
    });
    expect(pipe.summary.allCompliant).toBe(false);
    // T de salida del HEX no baja a valores absurdos en la corriente
    expect(pipe.steps[0].outputStream.temperature).toBeGreaterThan(-50);
  });

  it('allCompliant usa adequate del tanque', () => {
    const result = runPipeline({
      feed: { ...feed, totalFlow_BPD: 50000 },
      steps: [
        {
          name: 'Tanque chico',
          type: 'storage-tank',
          config: { diameter: 1, height: 1, storageTime_hours: 720 },
        },
      ],
    });
    expect(result.steps[0].equipmentResult.adequate).toBe(false);
    expect(result.summary.allCompliant).toBe(false);
  });
});
