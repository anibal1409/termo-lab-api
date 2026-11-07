import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Interfaz para datos de entrada del tratador térmico
 */
export interface ThermalTreatmentInput {
  // Variables de entrada según Tabla 4-1 del PDF
  diameter: number; // D en pies
  length: number; // L en pies
  totalFlow: number; // Caudal total en BPD
  waterFraction: number; // Porcentaje de agua y sedimento
  freeWaterRemovalPercentage?: number; // Porcentaje de agua libre retirada
  waterDropSize?: number; // Tamaño de gota de agua en µm
  waterSpecificGravity?: number; // Gravedad específica del agua
  apiGravity: number; // Gravedad API del crudo
  oilSpecificHeat?: number; // Calor específico del crudo BTU/(lb·°F)
  waterSpecificHeat?: number; // Calor específico del agua BTU/(lb·°F)
  inletTemperature: number; // T1 en °F
  treatmentTemperature?: number; // T2 en °F (temperatura de tratamiento)
  ambientTemperature: number; // T3 en °F
  operatingPressure: number; // Presión en psig
  oilDensity?: number; // Densidad del crudo lb/pie³
  waterDensity?: number; // Densidad del agua lb/pie³
  oilViscosity?: number; // Viscosidad del crudo cP
  factorK?: number; // Factor K (por defecto 0.5)
  lowLowWaterLevel?: number; // Nivel bajo bajo de agua en pulgadas
  waterOilInterfaceLevel?: number; // Nivel de interfase en pulgadas
  highHighOilLevel?: number; // Nivel alto alto de crudo en pulgadas

  // Nuevas variables según guía API
  oilRetentionTime?: number; // Tiempo de retención del petróleo en minutos
  waterRetentionTime?: number; // Tiempo de retención del agua en minutos
  windSpeed?: number; // Velocidad del viento en MPH

  // Variables de operación extendidas
  maxTotalFlow?: number; // Caudal total máximo en BPD
  maxWaterFraction?: number; // Porcentaje de agua y sedimento en condiciones máximas
  gasFlowRate?: number; // Flujo de gas natural en operación normal (MMSCFD)
  maxGasFlowRate?: number; // Flujo de gas natural máximo (MMSCFD)
  vesselOrientation?: 'horizontal' | 'vertical'; // Orientación del tratador (por defecto: horizontal)

  // Variables de gas natural según Tabla 4-3
  gasComposition?: {
    methane?: number; // % de metano
    ethane?: number; // % de etano
    propane?: number; // % de propano
    butane?: number; // % de butano
    pentane?: number; // % de pentano
    hexane?: number; // % de hexano
    heptane?: number; // % de heptano
    octane?: number; // % de octano
    nonane?: number; // % de nonano
    decane?: number; // % de decano
    co2?: number; // % de CO2
    nitrogen?: number; // % de nitrógeno
    h2s?: number; // % de H2S
  };
}

/**
 * @description Resultados de cálculos térmicos
 */
export class ThermalCalculationResults {
  @ApiProperty({ description: 'Porcentaje de agua libre y sedimento' })
  freeWaterAndSedimentPercentage: number;

  @ApiProperty({ description: 'Porcentaje de agua emulsionada' })
  emulsifiedWaterPercentage: number;

  @ApiProperty({ description: 'Flujo volumétrico de fluidos en BPD' })
  volumetricFlowRate: number;

  @ApiProperty({ description: 'Densidad del gas en lb/pie³' })
  gasDensity: number;

  @ApiProperty({ description: 'Peso molecular del gas en lb/mol' })
  gasMolecularWeight: number;

  @ApiProperty({ description: 'Área ocupada por el crudo en pie²' })
  oilArea: number;

  @ApiProperty({ description: 'Volumen de retención del crudo en pie³' })
  oilRetentionVolume: number;

  @ApiProperty({ description: 'Caudal de agua en BPD' })
  waterFlowRate: number;

  @ApiProperty({ description: 'Caudal de crudo seco en BPD' })
  dryOilFlowRate: number;

  @ApiProperty({ description: 'Tiempo de retención estimado en minutos' })
  estimatedRetentionTime: number;

  @ApiProperty({
    description: 'Área desde el fondo al nivel bajo bajo de agua en pie²',
  })
  lowWaterArea: number;

  @ApiProperty({ description: 'Área total del recipiente en pie²' })
  totalVesselArea: number;

  @ApiProperty({ description: 'Área disponible para el gas en pie²' })
  gasArea: number;

  @ApiProperty({ description: 'Altura libre para el gas en pies' })
  freeHeightForGas: number;

  @ApiProperty({ description: 'Volumen de retención de agua en pie³' })
  waterRetentionVolume: number;

  @ApiProperty({
    description: 'Corte de agua del crudo saliendo del tratador (%)',
  })
  waterCutLeavingTreater: number;

  @ApiProperty({ description: 'Velocidad permisible para el gas en pie/s' })
  allowableGasVelocity: number;

  @ApiProperty({ description: 'Área requerida para el gas en pie²' })
  requiredGasArea: number;

  @ApiProperty({ description: 'Área ocupada por el agua en pie²' })
  waterArea: number;

  @ApiProperty({ description: 'Cantidad de agua saliendo con el crudo en BPD' })
  waterLeavingWithOil: number;

  @ApiProperty({ description: 'Porcentaje de deshidratación del equipo (%)' })
  dehydrationPercentage: number;

  @ApiProperty({ description: 'Flujo másico del crudo en lb/h' })
  oilMassFlow: number;

  @ApiProperty({ description: 'Flujo másico de agua en lb/h' })
  waterMassFlow: number;

  @ApiProperty({
    description: 'Velocidad de decantación de la fase pesada en pie/min',
  })
  heavyPhaseSettlingVelocity: number;

  @ApiProperty({
    description: 'Tiempo de decantación de la fase pesada en minutos',
  })
  heavyPhaseSettlingTime: number;

  @ApiProperty({
    description: 'Tiempo de decantación de la fase liviana en minutos',
  })
  lightPhaseSettlingTime: number;

  @ApiProperty({ description: 'Calor total requerido en BTU/h' })
  totalHeatRequired: number;

  @ApiProperty({
    description: 'Caudal de agua libre entrando al tratador en BPD',
  })
  freeWaterFlowEntering: number;

  @ApiProperty({
    description: 'Caudal de agua emulsionada entrando al tratador en BPD',
  })
  emulsifiedWaterFlowEntering: number;

  @ApiProperty({
    description: 'Cantidad de agua total a ser manejada por el tratador en BPD',
  })
  totalWaterToBeHandled: number;

  @ApiProperty({
    description: 'Fracción volumétrica del agua en la corriente de entrada',
  })
  volumetricWaterFraction: number;

  @ApiProperty({ description: 'Gravedad específica del crudo (adimensional)' })
  oilSpecificGravity: number;

  @ApiProperty({ description: 'Densidad del crudo calculada en lb/pie³' })
  calculatedOilDensity: number;

  @ApiProperty({ description: 'Densidad del agua calculada en lb/pie³' })
  calculatedWaterDensity: number;

  @ApiProperty({
    description:
      'Densidad de la mezcla en la boquilla de entrada para flujo máximo en lb/pie³',
  })
  inletMixtureDensityMaximum: number;

  @ApiProperty({
    description:
      'Densidad de la mezcla en la boquilla de entrada para flujo operativo en lb/pie³',
  })
  inletMixtureDensityOperational: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de entrada para flujo máximo (pie/s)',
  })
  inletNozzleVelocityMaximum: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de entrada para flujo operativo (pie/s)',
  })
  inletNozzleVelocityOperational: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de entrada para flujo máximo (pulgadas)',
  })
  inletNozzleDiameterMaximum: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de entrada para flujo operativo (pulgadas)',
  })
  inletNozzleDiameterOperational: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de salida de crudo para flujo máximo (pie/s)',
  })
  oilOutletNozzleVelocityMaximum: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de salida de crudo para flujo operativo (pie/s)',
  })
  oilOutletNozzleVelocityOperational: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de salida de crudo para flujo máximo (pulgadas)',
  })
  oilOutletNozzleDiameterMaximum: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de salida de crudo para flujo operativo (pulgadas)',
  })
  oilOutletNozzleDiameterOperational: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de salida de agua para flujo máximo (pie/s)',
  })
  waterOutletNozzleVelocityMaximum: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de salida de agua para flujo operativo (pie/s)',
  })
  waterOutletNozzleVelocityOperational: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de salida de agua para flujo máximo (pulgadas)',
  })
  waterOutletNozzleDiameterMaximum: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de salida de agua para flujo operativo (pulgadas)',
  })
  waterOutletNozzleDiameterOperational: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de salida de gas para flujo máximo (pie/s)',
  })
  gasOutletNozzleVelocityMaximum: number;

  @ApiProperty({
    description:
      'Velocidad en la boquilla de salida de gas para flujo operativo (pie/s)',
  })
  gasOutletNozzleVelocityOperational: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de salida de gas para flujo máximo (pulgadas)',
  })
  gasOutletNozzleDiameterMaximum: number;

  @ApiProperty({
    description:
      'Diámetro requerido de la boquilla de salida de gas para flujo operativo (pulgadas)',
  })
  gasOutletNozzleDiameterOperational: number;

  // ===== NUEVAS PROPIEDADES SEGÚN API-12L =====

  @ApiProperty({ description: 'Factor de compresibilidad del gas (Z)' })
  gasCompressibilityFactor: number;

  @ApiProperty({ description: 'Composición del gas natural (%)' })
  gasComposition: {
    methane: number;
    ethane: number;
    propane: number;
    butane: number;
    pentane: number;
  };

  @ApiProperty({
    description: 'Calor específico del crudo calculado en BTU/(lb·°F)',
  })
  calculatedOilSpecificHeat: number;

  @ApiProperty({
    description: 'Calor específico del agua calculado en BTU/(lb·°F)',
  })
  calculatedWaterSpecificHeat: number;

  @ApiProperty({ description: 'Eficiencia de separación según API-12L (%)' })
  separationEfficiency: number;

  @ApiProperty({ description: 'Cumplimiento con límites API-12L' })
  api12lCompliance: boolean;

  @ApiProperty({ description: 'Advertencias de cumplimiento' })
  complianceWarnings: string[];

  // ===== NUEVAS PROPIEDADES SEGÚN GUÍA API =====

  @ApiProperty({ description: 'Tiempo de retención del petróleo en minutos' })
  oilRetentionTime: number;

  @ApiProperty({ description: 'Tiempo de retención del agua en minutos' })
  waterRetentionTime: number;

  @ApiProperty({ description: 'Velocidad del viento en MPH' })
  windSpeed: number;

  @ApiProperty({ description: 'Pérdidas de calor en BTU/h' })
  heatLosses: number;

  @ApiProperty({ description: 'Calor absorbido por el proceso en BTU/h' })
  processHeatDuty: number;

  @ApiProperty({ description: 'Diámetro recomendado según API-12L en pies' })
  recommendedDiameter: number;

  @ApiProperty({ description: 'Longitud recomendada según API-12L en pies' })
  recommendedLength: number;

  @ApiProperty({ description: 'Presión de diseño recomendada en psig' })
  recommendedDesignPressure: number;

  @ApiProperty({ description: 'Orientación del tratador recomendada (horizontal o vertical)' })
  recommendedVesselOrientation: 'horizontal' | 'vertical';

  @ApiProperty({ description: 'Área mínima de cámara de combustión en pie²' })
  minimumFireboxArea: number;

  @ApiProperty({ description: 'Capacidad calorífica mínima en BTU/h' })
  minimumHeatCapacity: number;

  @ApiProperty({ description: 'Clasificación de cámara de combustión' })
  fireboxClassification: string;

  @ApiProperty({ description: 'Cumplimiento con dimensiones API-12L' })
  dimensionalCompliance: boolean;

  @ApiProperty({ description: 'Cumplimiento con presiones de diseño' })
  pressureCompliance: boolean;

  @ApiProperty({ description: 'Cumplimiento con capacidades caloríficas' })
  heatCapacityCompliance: boolean;

  @ApiProperty({ description: 'Recomendaciones de optimización' })
  optimizationRecommendations: string[];

  @ApiProperty({ description: 'Datos para gráficas de simulación' })
  simulationData: {
    flowRates: { oil: number; water: number; total: number }[];
    retentionVolumes: { oil: number; water: number; total: number }[];
    heatRequirements: { process: number; losses: number; total: number }[];
    temperatures: { inlet: number; treatment: number; ambient: number }[];
  };
}

/**
 * @description Servicio para cálculos térmicos según metodología del PDF
 * Implementa todas las fórmulas de la Tabla 4-2 y metodología de cálculo
 */
@Injectable()
export class ThermalCalculatorService {
  private readonly GAS_CONSTANT = 10.7316; // Constante de los gases
  private readonly STANDARD_TEMPERATURE = 60; // °F
  private readonly STANDARD_PRESSURE = 14.7; // psia
  private readonly BARREL_TO_CUBIC_FEET = 5.6146;
  private readonly SECONDS_PER_DAY = 86400;
  private readonly STANDARD_TEMPERATURE_RANKINE = 520;

  /**
   * Calcula todos los resultados térmicos según la metodología del PDF
   * @param input Datos de entrada del tratador térmico
   * @returns Resultados completos de cálculos
   */
  calculateThermalResults(
    input: ThermalTreatmentInput,
  ): ThermalCalculationResults {
    // Validar datos de entrada
    this.validateInput(input);

    const results = new ThermalCalculationResults();
    const treatmentTemperature =
      input.treatmentTemperature || input.inletTemperature + 65;

    // 1. Calcular gravedad específica del crudo (Ecuación 1.32)
    results.oilSpecificGravity = this.calculateOilSpecificGravity(
      input.apiGravity,
    );

    // 2. Calcular densidades (Ecuaciones 1.35, 1.36)
    results.calculatedOilDensity = this.calculateOilDensity(
      results.oilSpecificGravity,
      input.inletTemperature,
    );
    results.calculatedWaterDensity = this.calculateWaterDensity(
      input.inletTemperature,
    );

    // 3. Calcular calor específico del crudo (Ecuación 1.33)
    const oilSpecificHeat =
      input.oilSpecificHeat ||
      this.calculateOilSpecificHeat(
        results.oilSpecificGravity,
        input.inletTemperature,
      );

    // 4. Calcular calor específico del agua (Ecuación 1.34)
    const waterSpecificHeat =
      input.waterSpecificHeat ||
      this.calculateWaterSpecificHeat(input.inletTemperature);

    // 5. Calcular porcentaje de agua libre y sedimento (Ecuación 1.26)
    results.freeWaterAndSedimentPercentage =
      this.calculateFreeWaterAndSedimentPercentage(
        input.totalFlow,
        input.waterFraction,
        input.freeWaterRemovalPercentage || 85,
      );

    // 6. Calcular porcentaje de agua emulsionada (Ecuación 1.27)
    results.emulsifiedWaterPercentage =
      input.waterFraction - results.freeWaterAndSedimentPercentage;

    // 7. Calcular flujo volumétrico de fluidos (Ecuación 1.29)
    results.volumetricFlowRate = input.totalFlow;

    // 8. Calcular densidades y peso molecular del gas (Ecuación 1.31)
    results.gasDensity = this.calculateGasDensity(
      input.operatingPressure,
      input.inletTemperature,
    );
    results.gasMolecularWeight = this.calculateGasMolecularWeight();

    // 9. Calcular área total del recipiente (Ecuación 1.10)
    results.totalVesselArea = this.calculateTotalVesselArea(input.diameter);

    // 10. Calcular área desde el fondo al nivel bajo bajo de agua (Ecuación 1.9)
    results.lowWaterArea = this.calculateLowWaterArea(
      input.diameter,
      input.lowLowWaterLevel || 2,
      results.totalVesselArea,
    );

    // 11. Calcular área ocupada por el agua (Ecuación 1.17)
    results.waterArea = this.calculateWaterArea(
      input.diameter,
      input.waterOilInterfaceLevel || 12,
      results.lowWaterArea,
      results.totalVesselArea,
    );

    // 12. Calcular área ocupada por el crudo (Ecuación 1.4)
    results.oilArea = this.calculateOilArea(
      input.diameter,
      input.highHighOilLevel || 24,
      results.totalVesselArea,
      results.waterArea,
      results.lowWaterArea,
    );

    // 13. Calcular volúmenes de retención (Ecuaciones 1.5, 1.12)
    results.oilRetentionVolume = results.oilArea * input.length;
    results.waterRetentionVolume = results.waterArea * input.length;

    // 14. Calcular caudales (Ecuaciones 1.6, 1.7)
    results.waterFlowRate = this.calculateWaterFlowRate(
      input.totalFlow,
      input.waterFraction / 100,
    );
    results.dryOilFlowRate = input.totalFlow - results.waterFlowRate;

    // 15. Calcular tiempo de retención estimado (Ecuación 1.8)
    results.estimatedRetentionTime = this.calculateEstimatedRetentionTime(
      results.oilRetentionVolume,
      results.dryOilFlowRate,
    );

    // 16. Calcular altura libre para el gas
    results.freeHeightForGas = 0.5; // Factor K * 12

    // 17. Calcular área disponible para el gas (Ecuación 1.11)
    results.gasArea = this.calculateGasArea(
      input.diameter,
      results.freeHeightForGas,
      results.totalVesselArea,
    );

    // 18. Calcular velocidad permisible para el gas (Ecuación 1.14)
    results.allowableGasVelocity = this.calculateAllowableGasVelocity(
      input.factorK || 0.5,
      results.calculatedOilDensity,
      results.gasDensity,
    );

    // 19. Calcular área requerida para el gas (Ecuación 1.15)
    const gasVolumetricFlowForArea = this.calculateGasVolumetricFlow(
      input.gasFlowRate ?? 0,
      input.operatingPressure,
      treatmentTemperature,
    );
    results.requiredGasArea = this.calculateRequiredGasArea(
      results.allowableGasVelocity,
      gasVolumetricFlowForArea,
    );

    // 27. Calcular caudales de entrada (Ecuaciones 35, 36) - MOVIDO ANTES para calcular deshidratación
    results.freeWaterFlowEntering = this.calculateFreeWaterFlowEntering(
      results.freeWaterAndSedimentPercentage,
      results.waterFlowRate,
      input.freeWaterRemovalPercentage || 85,
    );
    results.emulsifiedWaterFlowEntering =
      this.calculateEmulsifiedWaterFlowEntering(
        results.emulsifiedWaterPercentage,
        results.waterFlowRate,
      );

    // 29. Calcular cantidad de agua total a ser manejada (Ecuación 37) - MOVIDO ANTES
    results.totalWaterToBeHandled = this.calculateTotalWaterToBeHandled(
      results.freeWaterFlowEntering,
      results.emulsifiedWaterFlowEntering,
    );

    // 22. Calcular porcentaje de deshidratación del equipo (Ec. 28)
    // Usa los caudales de entrada calculados en Ec. 35 y 36 (cAL y CAE)
    results.dehydrationPercentage = this.calculateDehydrationPercentage(
      results.waterRetentionVolume,
      results.freeWaterFlowEntering, // cAL de Ec. 35
      results.emulsifiedWaterFlowEntering, // CAE de Ec. 36
      input.waterDropSize || 150,
      input.highHighOilLevel || 24,
      input.waterOilInterfaceLevel || 12,
      results.calculatedWaterDensity,
      results.calculatedOilDensity,
      input.oilViscosity || 15.5,
    );

    // 20. Calcular cantidad de agua saliendo con el crudo (Ec. 27)
    // FAT es el flujo total de agua a ser manejado (totalWaterToBeHandled)
    // PD es el porcentaje de deshidratación
    results.waterLeavingWithOil = this.calculateWaterLeavingWithOil(
      results.dehydrationPercentage,
      results.totalWaterToBeHandled,
    );

    // 21. Calcular corte de agua del crudo saliendo del tratador (Ec. 23)
    results.waterCutLeavingTreater = this.calculateWaterCutLeavingTreater(
      results.waterLeavingWithOil,
      results.dryOilFlowRate,
    );

    // 23. Calcular flujos másicos (Ecuaciones 1.20, 1.21)
    results.oilMassFlow = this.calculateOilMassFlow(
      results.dryOilFlowRate,
      results.oilSpecificGravity,
    );
    results.waterMassFlow = this.calculateWaterMassFlow(
      results.waterFlowRate,
      input.waterSpecificGravity || 1.0,
    );

    const maxTotalFlow = input.maxTotalFlow ?? input.totalFlow;
    const maxWaterFraction = input.maxWaterFraction ?? input.waterFraction;
    const maxWaterFlowRate = maxTotalFlow * (maxWaterFraction / 100);
    const maxOilFlowRate = maxTotalFlow - maxWaterFlowRate;

    const maxOilMassFlow = this.calculateOilMassFlow(
      maxOilFlowRate,
      results.oilSpecificGravity,
    );
    const maxWaterMassFlow = this.calculateWaterMassFlow(
      maxWaterFlowRate,
      input.waterSpecificGravity || 1.0,
    );

    const operationalGasFlowRate = input.gasFlowRate ?? 0;
    const maxGasFlowRate = input.maxGasFlowRate ?? operationalGasFlowRate;

    const operationalGasVolumetricFlow = this.calculateGasVolumetricFlow(
      operationalGasFlowRate,
      input.operatingPressure,
      treatmentTemperature,
    );
    const maxGasVolumetricFlow = this.calculateGasVolumetricFlow(
      maxGasFlowRate,
      input.operatingPressure,
      treatmentTemperature,
    );

    const operationalLiquidVolumetricFlow =
      this.convertBarrelsPerDayToCubicFeetPerSecond(results.volumetricFlowRate);
    const maxLiquidVolumetricFlow =
      this.convertBarrelsPerDayToCubicFeetPerSecond(maxTotalFlow);

    const operationalLiquidMassFlow =
      (results.oilMassFlow + results.waterMassFlow) / 3600;
    const maxLiquidMassFlow = (maxOilMassFlow + maxWaterMassFlow) / 3600;

    const operationalGasMassFlow =
      results.gasDensity * operationalGasVolumetricFlow;
    const maxGasMassFlow = results.gasDensity * maxGasVolumetricFlow;

    results.inletMixtureDensityOperational = this.calculateMixtureDensity(
      operationalLiquidMassFlow,
      operationalGasMassFlow,
      operationalLiquidVolumetricFlow,
      operationalGasVolumetricFlow,
    );

    results.inletMixtureDensityMaximum = this.calculateMixtureDensity(
      maxLiquidMassFlow,
      maxGasMassFlow,
      maxLiquidVolumetricFlow,
      maxGasVolumetricFlow,
    );

    results.inletNozzleVelocityOperational = this.calculateNozzleVelocity(
      results.inletMixtureDensityOperational,
    );
    results.inletNozzleVelocityMaximum = this.calculateNozzleVelocity(
      results.inletMixtureDensityMaximum,
    );

    results.inletNozzleDiameterOperational = this.calculateNozzleDiameter(
      operationalLiquidVolumetricFlow + operationalGasVolumetricFlow,
      results.inletNozzleVelocityOperational,
    );
    results.inletNozzleDiameterMaximum = this.calculateNozzleDiameter(
      maxLiquidVolumetricFlow + maxGasVolumetricFlow,
      results.inletNozzleVelocityMaximum,
    );

    const oilOutletVelocity = this.calculateNozzleVelocity(
      results.calculatedOilDensity,
    );
    results.oilOutletNozzleVelocityOperational = oilOutletVelocity;
    results.oilOutletNozzleVelocityMaximum = oilOutletVelocity;

    const oilVolumetricFlowOperational =
      this.convertBarrelsPerDayToCubicFeetPerSecond(results.dryOilFlowRate);
    const oilVolumetricFlowMaximum =
      this.convertBarrelsPerDayToCubicFeetPerSecond(maxOilFlowRate);

    results.oilOutletNozzleDiameterOperational = this.calculateNozzleDiameter(
      oilVolumetricFlowOperational,
      oilOutletVelocity,
    );
    results.oilOutletNozzleDiameterMaximum = this.calculateNozzleDiameter(
      oilVolumetricFlowMaximum,
      oilOutletVelocity,
    );

    const waterOutletVelocity = this.calculateNozzleVelocity(
      results.calculatedWaterDensity,
    );
    results.waterOutletNozzleVelocityOperational = waterOutletVelocity;
    results.waterOutletNozzleVelocityMaximum = waterOutletVelocity;

    const waterVolumetricFlowOperational =
      this.convertBarrelsPerDayToCubicFeetPerSecond(results.waterFlowRate);
    const waterVolumetricFlowMaximum =
      this.convertBarrelsPerDayToCubicFeetPerSecond(maxWaterFlowRate);

    results.waterOutletNozzleDiameterOperational = this.calculateNozzleDiameter(
      waterVolumetricFlowOperational,
      waterOutletVelocity,
    );
    results.waterOutletNozzleDiameterMaximum = this.calculateNozzleDiameter(
      waterVolumetricFlowMaximum,
      waterOutletVelocity,
    );

    const gasOutletVelocity = this.calculateNozzleVelocity(results.gasDensity);
    results.gasOutletNozzleVelocityOperational = gasOutletVelocity;
    results.gasOutletNozzleVelocityMaximum = gasOutletVelocity;

    results.gasOutletNozzleDiameterOperational = this.calculateNozzleDiameter(
      operationalGasVolumetricFlow,
      gasOutletVelocity,
    );
    results.gasOutletNozzleDiameterMaximum = this.calculateNozzleDiameter(
      maxGasVolumetricFlow,
      gasOutletVelocity,
    );

    // 24. Calcular velocidad de decantación de la fase pesada (Ecuación 1.22)
    results.heavyPhaseSettlingVelocity =
      this.calculateHeavyPhaseSettlingVelocity(
        input.waterDropSize || 150,
        results.calculatedWaterDensity,
        results.calculatedOilDensity,
        input.oilViscosity || 15.5,
      );

    // 25. Calcular tiempo de decantación de la fase pesada (Ecuación 1.23)
    results.heavyPhaseSettlingTime = this.calculateHeavyPhaseSettlingTime(
      input.highHighOilLevel || 24,
      input.waterOilInterfaceLevel || 12,
      results.heavyPhaseSettlingVelocity,
    );

    // 26. Calcular tiempo de decantación de la fase liviana (Ec. 32)
    results.lightPhaseSettlingTime = results.heavyPhaseSettlingTime / 60;

    // 30. Calcular fracción volumétrica del agua (Ec. 38)
    results.volumetricWaterFraction =
      results.totalWaterToBeHandled / results.volumetricFlowRate;

    // 31. Calcular nuevas propiedades según API-12L
    results.gasCompressibilityFactor = this.calculateZFactor(
      input.operatingPressure + this.STANDARD_PRESSURE,
      input.inletTemperature + 459.67,
    );

    results.gasComposition = {
      methane: 85,
      ethane: 8,
      propane: 4,
      butane: 2,
      pentane: 1,
    };

    results.calculatedOilSpecificHeat = oilSpecificHeat;
    results.calculatedWaterSpecificHeat = waterSpecificHeat;

    // 32. Calcular eficiencia de separación
    results.separationEfficiency = this.calculateSeparationEfficiency(results);

    // 33. Calcular tiempos de retención según guía API
    results.oilRetentionTime =
      input.oilRetentionTime ||
      this.calculateOilRetentionTime(
        results.oilRetentionVolume,
        results.dryOilFlowRate,
      );
    results.waterRetentionTime =
      input.waterRetentionTime ||
      this.calculateWaterRetentionTime(
        results.waterRetentionVolume,
        results.waterFlowRate,
      );

    // 34. Calcular pérdidas de calor según velocidad del viento
    results.windSpeed = input.windSpeed || 15; // MPH por defecto
    results.heatLosses = this.calculateHeatLosses(
      input.diameter,
      input.length,
      treatmentTemperature, // T2 por defecto
      input.ambientTemperature,
      results.windSpeed,
    );

    // 35. Calcular calor absorbido por el proceso
    results.processHeatDuty = this.calculateProcessHeatDuty(
      results.oilMassFlow,
      results.waterMassFlow,
      input.inletTemperature,
      treatmentTemperature,
      oilSpecificHeat,
      waterSpecificHeat,
    );

    results.totalHeatRequired = this.calculateTotalHeatRequired(
      results.processHeatDuty,
      results.heatLosses,
    );

    // 36. Seleccionar dimensiones recomendadas según API-12L
    const vesselOrientation = input.vesselOrientation || 'horizontal';
    const dimensionalRecommendation = this.selectOptimalDimensions(
      results.totalHeatRequired,
      results.oilRetentionVolume,
      results.waterRetentionVolume,
      vesselOrientation,
    );
    results.recommendedDiameter = dimensionalRecommendation.diameter;
    results.recommendedLength = dimensionalRecommendation.length;
    results.recommendedDesignPressure = dimensionalRecommendation.pressure;
    results.recommendedVesselOrientation = vesselOrientation;

    // 37. Calcular clasificación de cámara de combustión
    const fireboxData = this.calculateFireboxClassification(
      results.totalHeatRequired,
    );
    results.minimumFireboxArea = fireboxData.area;
    results.minimumHeatCapacity = fireboxData.capacity;
    results.fireboxClassification = fireboxData.classification;

    // 38. Validar cumplimiento API-12L
    const complianceResult = this.validateAPI12LCompliance(results);
    results.api12lCompliance = complianceResult.compliant;
    results.complianceWarnings = complianceResult.warnings;
    results.dimensionalCompliance = complianceResult.dimensionalCompliant;
    results.pressureCompliance = complianceResult.pressureCompliant;
    results.heatCapacityCompliance = complianceResult.heatCapacityCompliant;

    // 39. Generar recomendaciones de optimización
    results.optimizationRecommendations =
      this.generateOptimizationRecommendations(results);

    // 40. Generar datos para gráficas de simulación
    results.simulationData = this.generateSimulationData(input, results);

    return results;
  }

  // ===== MÉTODOS PRIVADOS DE CÁLCULO =====

  private validateInput(input: ThermalTreatmentInput): void {
    if (!input.diameter || input.diameter <= 0) {
      throw new Error('Diámetro debe ser mayor a 0');
    }
    if (!input.length || input.length <= 0) {
      throw new Error('Longitud debe ser mayor a 0');
    }
    if (!input.totalFlow || input.totalFlow <= 0) {
      throw new Error('Flujo total debe ser mayor a 0');
    }
    if (!input.apiGravity || input.apiGravity <= 0) {
      throw new Error('Gravedad API debe ser mayor a 0');
    }
  }

  // Ecuación 1.32: Gravedad específica del crudo
  private calculateOilSpecificGravity(apiGravity: number): number {
    return 141.5 / (apiGravity + 131.5);
  }

  // Ecuación 1.35: Densidad del crudo
  private calculateOilDensity(
    specificGravity: number,
    temperature: number,
  ): number {
    return (
      (specificGravity * 62.4) /
      (1 + 0.00065 * (temperature - this.STANDARD_TEMPERATURE))
    );
  }

  // Ecuación 1.36: Densidad del agua
  private calculateWaterDensity(temperature: number): number {
    return 62.4 - 0.013 * (temperature - this.STANDARD_TEMPERATURE);
  }

  // Ecuación 1.33: Calor específico del crudo
  private calculateOilSpecificHeat(
    specificGravity: number,
    temperature: number,
  ): number {
    return (0.388 + 0.00045 * temperature) / Math.sqrt(specificGravity);
  }

  // Ecuación 1.34: Calor específico del agua
  private calculateWaterSpecificHeat(temperature: number): number {
    return 1.0 - 0.000117 * (temperature - this.STANDARD_TEMPERATURE);
  }

  // Ecuación 1.26: Porcentaje de agua libre y sedimento
  private calculateFreeWaterAndSedimentPercentage(
    totalFlow: number,
    waterFraction: number,
    removalPercentage: number,
  ): number {
    return (waterFraction * removalPercentage) / 100;
  }

  // Ecuación 1.10: Área total del recipiente
  private calculateTotalVesselArea(diameter: number): number {
    return (Math.PI * Math.pow(diameter, 2)) / 4;
  }

  // Ecuación 1.9: Área desde el fondo al nivel bajo bajo de agua
  private calculateLowWaterArea(
    diameter: number,
    lowWaterLevel: number,
    totalArea: number,
  ): number {
    const ratio = (2 * lowWaterLevel) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    return ((angle - Math.sin(angle)) * totalArea) / (2 * Math.PI);
  }

  // Ecuación 1.17: Área ocupada por el agua
  // Ec. 26: Área ocupada por el agua
  private calculateWaterArea(
    diameter: number,
    interfaceLevel: number,
    lowWaterArea: number,
    totalArea: number,
  ): number {
    // Ec. 26: [2 * ArcCos(1 - 2 * N / (D * 12)) - sin(2 * ArcCos(1 - 2 * N / (D * 12))*Nr)] - Nb / (2 * π)
    const ratio = (2 * interfaceLevel) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    const interfaceArea =
      ((angle - Math.sin(angle)) * totalArea) / (2 * Math.PI);
    return interfaceArea - lowWaterArea;
  }

  // Ec. 13: Área ocupada por el crudo
  private calculateOilArea(
    diameter: number,
    highOilLevel: number,
    totalArea: number,
    waterArea: number,
    lowWaterArea: number,
  ): number {
    // Ec. 13: [2 * ArcCos(1 - 2 * A / (D * 12)) - sin(2 * ArcCos(1 - 2 * A / (D * 12)))]*B - C - E / (2 * π)
    const ratio = (2 * highOilLevel) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    const highOilArea = ((angle - Math.sin(angle)) * totalArea) / (2 * Math.PI);
    return highOilArea - waterArea - lowWaterArea;
  }

  // Ecuación 1.6: Caudal de agua
  private calculateWaterFlowRate(
    totalFlow: number,
    waterFraction: number,
  ): number {
    return totalFlow * waterFraction;
  }

  // Ecuación 1.8: Tiempo de retención estimado
  private calculateEstimatedRetentionTime(
    oilVolume: number,
    oilFlowRate: number,
  ): number {
    return ((oilVolume / 5.6146) * 24 * 60) / oilFlowRate;
  }

  // Ecuación 1.11: Área disponible para el gas
  private calculateGasArea(
    diameter: number,
    freeHeight: number,
    totalArea: number,
  ): number {
    const ratio = (2 * freeHeight * 12) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    return ((angle - Math.sin(angle)) * totalArea) / (2 * Math.PI);
  }

  // Ec. 24: Velocidad permisible para el gas
  private calculateAllowableGasVelocity(
    factorK: number,
    oilDensity: number,
    gasDensity: number,
  ): number {
    // Ec. 24: Factor K * ((J - L) / L)^0.5
    return factorK * Math.sqrt((oilDensity - gasDensity) / gasDensity);
  }

  // Ec. 25: Área requerida para el gas
  private calculateRequiredGasArea(
    allowableVelocity: number,
    gasVolumetricFlow: number,
  ): number {
    // Ec. 25: Área = Qg / Velocidad permisible
    // (El documento tiene un error de sintaxis, pero la lógica es flujo/velocidad)
    if (allowableVelocity <= 0) {
      return 0;
    }

    return gasVolumetricFlow / allowableVelocity;
  }

  // Ec. 27: Cantidad de agua saliendo con el crudo
  private calculateWaterLeavingWithOil(
    dehydrationPercentage: number,
    totalWaterFlow: number,
  ): number {
    // Ec. 27: FAT - (PD * FAT) / 100
    // donde FAT es el flujo de agua a ser manejado por el tratador (totalWaterToBeHandled)
    // y PD es el porcentaje de deshidratación del equipo
    return totalWaterFlow - (dehydrationPercentage * totalWaterFlow) / 100;
  }

  // Ec. 23: Corte de agua del crudo saliendo del tratador térmico
  private calculateWaterCutLeavingTreater(
    waterLeaving: number,
    dryOilFlow: number,
  ): number {
    // Ec. 23: (Cantidad de agua saliendo con el crudo * 100) / (Cantidad de agua saliendo con el crudo + Caudal de crudo seco)
    return (waterLeaving / (waterLeaving + dryOilFlow)) * 100;
  }

  // Ec. 28: Porcentaje de deshidratación del equipo
  private calculateDehydrationPercentage(
    waterVolume: number,
    freeWaterFlowEntering: number, // cAL de Ec. 35
    emulsifiedWaterFlowEntering: number, // CAE de Ec. 36
    dropSize: number,
    highOilLevel: number,
    interfaceLevel: number,
    waterDensity: number,
    oilDensity: number,
    oilViscosity: number,
  ): number {
    // Ec. 28: 100 * (VA / 5.6146) / ((cAL * 10) / (60 * 24) + (CAE * TDP) / (60 * 24))
    // donde cAL es la cantidad de agua libre entrando (Ec. 35)
    // y CAE es la cantidad de agua emulsionada entrando (Ec. 36)
    const VA = waterVolume; // Volumen de retención de agua
    const CAL = freeWaterFlowEntering; // Agua libre entrando (cAL de Ec. 35)
    const CAE = emulsifiedWaterFlowEntering; // Agua emulsionada entrando (CAE de Ec. 36)
    
    const VDP = this.calculateHeavyPhaseSettlingVelocity(
      dropSize,
      waterDensity,
      oilDensity,
      oilViscosity,
    );
    const TDP = this.calculateHeavyPhaseSettlingTime(
      highOilLevel,
      interfaceLevel,
      VDP,
    );

    const termFreeWater = (CAL * 10) / (60 * 24);
    const termEmulsifiedWater = (CAE * TDP) / (60 * 24);
    const denominator = termFreeWater + termEmulsifiedWater;

    if (denominator === 0) {
      return 0;
    }

    return (100 * (VA / 5.6146)) / denominator;
  }

  // Ecuación 1.20: Flujo másico del crudo
  private calculateOilMassFlow(
    oilFlowRate: number,
    specificGravity: number,
  ): number {
    return 14.58 * oilFlowRate * specificGravity;
  }

  // Ecuación 1.21: Flujo másico de agua
  private calculateWaterMassFlow(
    waterFlowRate: number,
    specificGravity: number,
  ): number {
    return 14.58 * waterFlowRate * specificGravity;
  }

  private calculateMixtureDensity(
    liquidMassFlow: number,
    gasMassFlow: number,
    liquidVolumetricFlow: number,
    gasVolumetricFlow: number,
  ): number {
    const totalVolume = liquidVolumetricFlow + gasVolumetricFlow;
    if (totalVolume <= 0) {
      return 0;
    }

    const totalMassFlow = liquidMassFlow + gasMassFlow;
    return totalMassFlow / totalVolume;
  }

  private calculateNozzleVelocity(density: number): number {
    if (density <= 0) {
      return 0;
    }
    return 100 / Math.sqrt(density);
  }

  private calculateNozzleDiameter(
    volumetricFlow: number,
    velocity: number,
  ): number {
    if (volumetricFlow <= 0 || velocity <= 0) {
      return 0;
    }

    const area = volumetricFlow / velocity;
    const diameterFeet = Math.sqrt((4 * area) / Math.PI);
    return diameterFeet * 12;
  }

  private convertBarrelsPerDayToCubicFeetPerSecond(flowBpd: number): number {
    if (flowBpd <= 0) {
      return 0;
    }

    return (flowBpd * this.BARREL_TO_CUBIC_FEET) / this.SECONDS_PER_DAY;
  }

  private calculateGasVolumetricFlow(
    gasFlowMmscfd: number,
    operatingPressure: number,
    operatingTemperature: number,
  ): number {
    if (!gasFlowMmscfd || gasFlowMmscfd <= 0) {
      return 0;
    }

    const standardFlowPerSecond =
      (gasFlowMmscfd * 1_000_000) / this.SECONDS_PER_DAY;
    const absoluteTemperature = operatingTemperature + 459.67;
    const standardTemperature = this.STANDARD_TEMPERATURE_RANKINE;
    const absolutePressure = operatingPressure + this.STANDARD_PRESSURE;
    const standardPressure = this.STANDARD_PRESSURE;

    return (
      standardFlowPerSecond *
      (standardPressure / absolutePressure) *
      (absoluteTemperature / standardTemperature) *
      0.994
    );
  }

  // Ecuación 1.22: Velocidad de decantación de la fase pesada
  private calculateHeavyPhaseSettlingVelocity(
    dropSize: number,
    waterDensity: number,
    oilDensity: number,
    oilViscosity: number,
  ): number {
    return (
      (18.4663 * Math.pow(dropSize, 2) * (waterDensity - oilDensity)) /
      oilViscosity
    );
  }

  // Ecuación 1.23: Tiempo de decantación de la fase pesada
  private calculateHeavyPhaseSettlingTime(
    highOilLevel: number,
    interfaceLevel: number,
    settlingVelocity: number,
  ): number {
    return (highOilLevel - interfaceLevel) / 12 / settlingVelocity;
  }

  private calculateTotalHeatRequired(
    processHeatDuty: number,
    heatLosses: number,
  ): number {
    return processHeatDuty + heatLosses;
  }

  // Ecuación 1.26: Caudal de agua libre entrando al tratador
  private calculateFreeWaterFlowEntering(
    freeWaterPercentage: number,
    waterFlow: number,
    removalPercentage: number,
  ): number {
    // CALT = ((100 - PAT) × CAP / 100) × (100 - PAL) / 100
    const PAT = freeWaterPercentage; // Porcentaje de agua emulsionada en la corriente de entrada
    const CAP = waterFlow; // Caudal de agua producida
    const PAL = removalPercentage; // Porcentaje de agua libre retirada en el separador

    return ((((100 - PAT) * CAP) / 100) * (100 - PAL)) / 100;
  }

  // Ecuación 1.27: Caudal de agua emulsionada entrando al tratador
  private calculateEmulsifiedWaterFlowEntering(
    emulsifiedWaterPercentage: number,
    waterFlow: number,
  ): number {
    // CAET = (CAP × PAE) / 100
    const CAP = waterFlow; // Caudal de agua producida
    const PAE = emulsifiedWaterPercentage; // Porcentaje de agua emulsionada

    return (CAP * PAE) / 100;
  }

  // Ecuación 1.28: Cantidad de agua total a ser manejada por el tratador
  private calculateTotalWaterToBeHandled(
    freeWaterFlow: number,
    emulsifiedWaterFlow: number,
  ): number {
    // CAT = CALT + CAET
    return freeWaterFlow + emulsifiedWaterFlow;
  }

  // Ecuación 1.31: Densidad del gas con factor Z
  private calculateGasDensity(pressure: number, temperature: number): number {
    const molecularWeight = this.calculateGasMolecularWeight();
    const absolutePressure = pressure + this.STANDARD_PRESSURE;
    const absoluteTemperature = temperature + 459.67;
    const zFactor = this.calculateZFactor(
      absolutePressure,
      absoluteTemperature,
    );

    return (
      (absolutePressure * molecularWeight) /
      (zFactor * this.GAS_CONSTANT * absoluteTemperature)
    );
  }

  // Ecuación 1.31: Peso molecular del gas basado en composición
  private calculateGasMolecularWeight(): number {
    // Composición típica de gas natural según Tabla 4-3
    const gasComposition = {
      methane: 0.85, // 85% CH4
      ethane: 0.08, // 8% C2H6
      propane: 0.04, // 4% C3H8
      butane: 0.02, // 2% C4H10
      pentane: 0.01, // 1% C5H12
    };

    const molecularWeights = {
      methane: 16.043,
      ethane: 30.07,
      propane: 44.097,
      butane: 58.123,
      pentane: 72.151,
    };

    return (
      gasComposition.methane * molecularWeights.methane +
      gasComposition.ethane * molecularWeights.ethane +
      gasComposition.propane * molecularWeights.propane +
      gasComposition.butane * molecularWeights.butane +
      gasComposition.pentane * molecularWeights.pentane
    );
  }

  /**
   * Calcula el factor de compresibilidad Z según API-12L
   * Resuelve la ecuación cúbica: Z³ - (1-B)Z² + (A-3B²-2B)Z - (AB-B²-B³) = 0
   * Con coeficientes de la Tabla 4-4
   */
  private calculateZFactor(pressure: number, temperature: number): number {
    // Coeficientes de la Tabla 4-4
    const a = 0.8355419;
    const b = 0.3803384;

    // Calcular A y B según ecuaciones 1.2 y 1.3
    const A =
      (a * pressure) /
      (Math.pow(this.GAS_CONSTANT, 2) * Math.pow(temperature, 2));
    const B = (b * pressure) / (this.GAS_CONSTANT * temperature);

    // Resolver ecuación cúbica usando método de Newton-Raphson
    return this.solveCubicEquation(
      1 - B,
      A - 3 * Math.pow(B, 2) - 2 * B,
      A * B - Math.pow(B, 2) - Math.pow(B, 3),
    );
  }

  /**
   * Resuelve ecuación cúbica usando método de Newton-Raphson
   * x³ + ax² + bx + c = 0
   */
  private solveCubicEquation(a: number, b: number, c: number): number {
    // Convertir a forma estándar: x³ + ax² + bx + c = 0
    const A = a;
    const B = b;
    const C = c;

    // Método de Newton-Raphson
    let x = 0.5; // Valor inicial
    const tolerance = 1e-6;
    const maxIterations = 100;

    for (let i = 0; i < maxIterations; i++) {
      const fx = Math.pow(x, 3) + A * Math.pow(x, 2) + B * x + C;
      const fpx = 3 * Math.pow(x, 2) + 2 * A * x + B;

      if (Math.abs(fpx) < tolerance) break;

      const newX = x - fx / fpx;

      if (Math.abs(newX - x) < tolerance) {
        return Math.max(0.1, Math.min(2.0, newX)); // Limitar entre 0.1 y 2.0
      }

      x = newX;
    }

    return Math.max(0.1, Math.min(2.0, x)); // Limitar entre 0.1 y 2.0
  }

  /**
   * Calcula la eficiencia de separación según API-12L
   */
  private calculateSeparationEfficiency(
    results: ThermalCalculationResults,
  ): number {
    // Eficiencia basada en porcentaje de deshidratación y tiempo de retención
    const dehydrationFactor = Math.min(
      results.dehydrationPercentage / 100,
      1.0,
    );
    const retentionFactor = Math.min(results.estimatedRetentionTime / 60, 1.0); // Normalizar a 60 min

    return dehydrationFactor * retentionFactor * 100;
  }

  /**
   * Valida el cumplimiento con la norma API-12L
   */
  private validateAPI12LCompliance(results: ThermalCalculationResults): {
    compliant: boolean;
    warnings: string[];
    dimensionalCompliant: boolean;
    pressureCompliant: boolean;
    heatCapacityCompliant: boolean;
  } {
    const warnings: string[] = [];
    let compliant = true;
    let dimensionalCompliant = true;
    let pressureCompliant = true;
    let heatCapacityCompliant = true;

    // Validar tiempo de retención mínimo (60 minutos)
    if (results.estimatedRetentionTime < 60) {
      warnings.push(
        `Tiempo de retención insuficiente: ${results.estimatedRetentionTime.toFixed(1)} min < 60 min requeridos`,
      );
      compliant = false;
    }

    // Validar porcentaje de deshidratación (mínimo 85%)
    if (results.dehydrationPercentage < 85) {
      warnings.push(
        `Porcentaje de deshidratación insuficiente: ${results.dehydrationPercentage.toFixed(1)}% < 85% requerido`,
      );
      compliant = false;
    }

    // Validar eficiencia de separación (mínimo 85%)
    if (results.separationEfficiency < 85) {
      warnings.push(
        `Eficiencia de separación insuficiente: ${results.separationEfficiency.toFixed(1)}% < 85% requerido`,
      );
      compliant = false;
    }

    // Validar velocidad de gas (máximo 0.5 pie/s)
    if (results.allowableGasVelocity > 0.5) {
      warnings.push(
        `Velocidad de gas excesiva: ${results.allowableGasVelocity.toFixed(3)} pie/s > 0.5 pie/s máximo`,
      );
      compliant = false;
    }

    // Validar corte de agua saliente (máximo 2%)
    if (results.waterCutLeavingTreater > 2) {
      warnings.push(
        `Corte de agua saliente excesivo: ${results.waterCutLeavingTreater.toFixed(1)}% > 2% máximo`,
      );
      compliant = false;
    }

    // Validar factor Z (entre 0.1 y 2.0)
    if (
      results.gasCompressibilityFactor < 0.1 ||
      results.gasCompressibilityFactor > 2.0
    ) {
      warnings.push(
        `Factor Z fuera de rango: ${results.gasCompressibilityFactor.toFixed(3)} (debe estar entre 0.1 y 2.0)`,
      );
      compliant = false;
    }

    // Validar dimensiones según Tablas 4.1 y 4.2 de API-12L
    // Tratadores horizontales: diámetros de 3-12 ft
    // Tratadores verticales: diámetros de 3-10 ft
    const maxDiameter =
      results.recommendedVesselOrientation === 'vertical' ? 10 : 12;
    
    if (
      results.recommendedDiameter < 3 ||
      results.recommendedDiameter > maxDiameter
    ) {
      warnings.push(
        `Diámetro fuera de rango API-12L: ${results.recommendedDiameter.toFixed(1)} ft (debe estar entre 3-${maxDiameter} ft para tratador ${results.recommendedVesselOrientation})`,
      );
      dimensionalCompliant = false;
    }

    // Validar presión de diseño según orientación
    // Tratadores horizontales: mínimo 50 psig para todos los diámetros
    // Tratadores verticales: mínimo 50 psig para diámetros 3-6 ft, mínimo 40 psig para 8-10 ft
    const minPressure =
      results.recommendedVesselOrientation === 'vertical' &&
      (results.recommendedDiameter === 8 || results.recommendedDiameter === 10)
        ? 40
        : 50;
    
    if (results.recommendedDesignPressure < minPressure) {
      warnings.push(
        `Presión de diseño insuficiente: ${results.recommendedDesignPressure.toFixed(1)} psig < ${minPressure} psig mínimo para tratador ${results.recommendedVesselOrientation}`,
      );
      pressureCompliant = false;
    }

    // Validar capacidad calorífica mínima
    if (results.minimumHeatCapacity < 100000) {
      warnings.push(
        `Capacidad calorífica insuficiente: ${results.minimumHeatCapacity.toFixed(0)} BTU/h < 100,000 BTU/h mínimo`,
      );
      heatCapacityCompliant = false;
    }

    return {
      compliant,
      warnings,
      dimensionalCompliant,
      pressureCompliant,
      heatCapacityCompliant,
    };
  }

  /**
   * Calcula tiempo de retención del petróleo según guía API
   */
  private calculateOilRetentionTime(
    oilVolume: number,
    oilFlowRate: number,
  ): number {
    return ((oilVolume / 5.6146) * 24 * 60) / oilFlowRate;
  }

  /**
   * Calcula tiempo de retención del agua según guía API
   */
  private calculateWaterRetentionTime(
    waterVolume: number,
    waterFlowRate: number,
  ): number {
    return ((waterVolume / 5.6146) * 24 * 60) / waterFlowRate;
  }

  /**
   * Calcula pérdidas de calor según velocidad del viento
   */
  private calculateHeatLosses(
    diameter: number,
    length: number,
    treatmentTemp: number,
    ambientTemp: number,
    windSpeed: number,
  ): number {
    // Constante K según velocidad del viento (Tabla API-12L)
    const kValues = {
      0: 9.3,
      5: 9.8,
      10: 13.2,
      15: 15.7,
      20: 20.0,
    };

    const k = this.getKValueForWindSpeed(windSpeed, kValues);
    return k * diameter * length * (treatmentTemp - ambientTemp);
  }

  /**
   * Obtiene valor K según velocidad del viento
   */
  private getKValueForWindSpeed(
    windSpeed: number,
    kValues: Record<number, number>,
  ): number {
    const speeds = Object.keys(kValues)
      .map(Number)
      .sort((a, b) => a - b);

    for (let i = 0; i < speeds.length - 1; i++) {
      if (windSpeed >= speeds[i] && windSpeed <= speeds[i + 1]) {
        // Interpolación lineal
        const x1 = speeds[i];
        const x2 = speeds[i + 1];
        const y1 = kValues[x1];
        const y2 = kValues[x2];

        return y1 + ((y2 - y1) * (windSpeed - x1)) / (x2 - x1);
      }
    }

    // Si está fuera del rango, usar el valor más cercano
    if (windSpeed <= speeds[0]) return kValues[speeds[0]];
    return kValues[speeds[speeds.length - 1]];
  }

  /**
   * Calcula calor absorbido por el proceso según guía API
   */
  private calculateProcessHeatDuty(
    oilMassFlow: number,
    waterMassFlow: number,
    inletTemp: number,
    treatmentTemp: number,
    oilSpecificHeat: number,
    waterSpecificHeat: number,
  ): number {
    const deltaT = treatmentTemp - inletTemp;
    return (
      (oilMassFlow * oilSpecificHeat + waterMassFlow * waterSpecificHeat) *
      deltaT
    );
  }

  /**
   * Selecciona dimensiones óptimas según Tablas 4.1 y 4.2 de API-12L
   * Diferencia entre tratadores horizontales y verticales según documento
   */
  private selectOptimalDimensions(
    totalHeat: number,
    oilVolume: number,
    waterVolume: number,
    orientation: 'horizontal' | 'vertical' = 'horizontal',
  ): { diameter: number; length: number; pressure: number } {
    // Tabla 4.2: Dimensiones para tratadores horizontales
    const horizontalDimensions = [
      { diameter: 3, length: 10, pressure: 50, maxHeat: 100000 },
      { diameter: 3, length: 12, pressure: 50, maxHeat: 120000 },
      { diameter: 3, length: 15, pressure: 50, maxHeat: 150000 },
      { diameter: 4, length: 10, pressure: 50, maxHeat: 200000 },
      { diameter: 4, length: 12, pressure: 50, maxHeat: 240000 },
      { diameter: 4, length: 15, pressure: 50, maxHeat: 300000 },
      { diameter: 6, length: 10, pressure: 50, maxHeat: 400000 },
      { diameter: 6, length: 15, pressure: 50, maxHeat: 600000 },
      { diameter: 6, length: 20, pressure: 50, maxHeat: 800000 },
      { diameter: 8, length: 15, pressure: 50, maxHeat: 800000 },
      { diameter: 8, length: 20, pressure: 50, maxHeat: 1000000 },
      { diameter: 8, length: 25, pressure: 50, maxHeat: 1250000 },
      { diameter: 8, length: 30, pressure: 50, maxHeat: 1500000 },
      { diameter: 10, length: 20, pressure: 50, maxHeat: 1500000 },
      { diameter: 10, length: 30, pressure: 50, maxHeat: 2250000 },
      { diameter: 10, length: 40, pressure: 50, maxHeat: 3000000 },
      { diameter: 10, length: 50, pressure: 50, maxHeat: 3750000 },
      { diameter: 10, length: 60, pressure: 50, maxHeat: 4500000 },
      { diameter: 12, length: 30, pressure: 50, maxHeat: 3000000 },
      { diameter: 12, length: 40, pressure: 50, maxHeat: 4000000 },
      { diameter: 12, length: 50, pressure: 50, maxHeat: 5000000 },
      { diameter: 12, length: 60, pressure: 50, maxHeat: 6000000 },
    ];

    // Tabla 4.1: Dimensiones para tratadores verticales
    const verticalDimensions = [
      { diameter: 3, length: 10, pressure: 50, maxHeat: 100000 },
      { diameter: 3, length: 12, pressure: 50, maxHeat: 120000 },
      { diameter: 3, length: 15, pressure: 50, maxHeat: 150000 },
      { diameter: 4, length: 10, pressure: 50, maxHeat: 200000 },
      { diameter: 4, length: 12, pressure: 50, maxHeat: 240000 },
      { diameter: 4, length: 20, pressure: 50, maxHeat: 400000 },
      { diameter: 4, length: 27.5, pressure: 50, maxHeat: 550000 },
      { diameter: 6, length: 12, pressure: 50, maxHeat: 480000 },
      { diameter: 6, length: 20, pressure: 50, maxHeat: 800000 },
      { diameter: 6, length: 27.5, pressure: 50, maxHeat: 1100000 },
      { diameter: 8, length: 20, pressure: 40, maxHeat: 1000000 },
      { diameter: 8, length: 27.5, pressure: 40, maxHeat: 1375000 },
      { diameter: 10, length: 20, pressure: 40, maxHeat: 1500000 },
      { diameter: 10, length: 27.5, pressure: 40, maxHeat: 2062500 },
    ];

    // Seleccionar la tabla según la orientación
    const dimensions =
      orientation === 'vertical' ? verticalDimensions : horizontalDimensions;

    // Encontrar la configuración más adecuada
    const suitableConfigs = dimensions.filter(
      (config) =>
        config.maxHeat >= totalHeat &&
        this.calculateVolume(config.diameter, config.length) >=
          (oilVolume + waterVolume) / 5.6146,
    );

    if (suitableConfigs.length === 0) {
      // Si no hay configuración adecuada, usar la más grande
      const largest = dimensions[dimensions.length - 1];
      return {
        diameter: largest.diameter,
        length: largest.length,
        pressure: largest.pressure,
      };
    }

    // Seleccionar la configuración más eficiente (menor diámetro que cumpla)
    const selected = suitableConfigs.reduce((prev, current) =>
      current.diameter < prev.diameter ? current : prev,
    );

    return {
      diameter: selected.diameter,
      length: selected.length,
      pressure: selected.pressure,
    };
  }

  /**
   * Calcula volumen de un cilindro
   */
  private calculateVolume(diameter: number, length: number): number {
    return Math.PI * Math.pow(diameter / 2, 2) * length;
  }

  /**
   * Calcula clasificación de cámara de combustión según Tabla 3
   */
  private calculateFireboxClassification(totalHeat: number): {
    area: number;
    capacity: number;
    classification: string;
  } {
    // Tabla 3: Clasificaciones típicas de cámaras de combustión
    const fireboxConfigs = [
      { diameter: 3, area: 10, capacity: 100000, classification: 'Pequeña' },
      { diameter: 4, area: 25, capacity: 250000, classification: 'Mediana' },
      { diameter: 6, area: 50, capacity: 500000, classification: 'Grande' },
      {
        diameter: 8,
        area: 100,
        capacity: 1000000,
        classification: 'Extra Grande',
      },
      {
        diameter: 10,
        area: 125,
        capacity: 1250000,
        classification: 'Industrial',
      },
      {
        diameter: 12,
        area: 320,
        capacity: 3200000,
        classification: 'Industrial Grande',
      },
    ];

    const suitableConfigs = fireboxConfigs.filter(
      (config) => config.capacity >= totalHeat,
    );

    if (suitableConfigs.length === 0) {
      const largest = fireboxConfigs[fireboxConfigs.length - 1];
      return {
        area: largest.area,
        capacity: largest.capacity,
        classification: largest.classification,
      };
    }

    const selected = suitableConfigs.reduce((prev, current) =>
      current.capacity < prev.capacity ? current : prev,
    );

    return {
      area: selected.area,
      capacity: selected.capacity,
      classification: selected.classification,
    };
  }

  /**
   * Genera recomendaciones de optimización
   */
  private generateOptimizationRecommendations(
    results: ThermalCalculationResults,
  ): string[] {
    const recommendations: string[] = [];

    if (results.separationEfficiency < 90) {
      recommendations.push(
        'Considerar aumentar el tiempo de retención para mejorar la eficiencia de separación',
      );
    }

    if (results.dehydrationPercentage < 95) {
      recommendations.push(
        'Optimizar el diseño del separador de agua libre para mejorar la deshidratación',
      );
    }

    if (results.waterCutLeavingTreater > 1) {
      recommendations.push(
        'Revisar la configuración de niveles para reducir el corte de agua saliente',
      );
    }

    if (results.allowableGasVelocity > 0.3) {
      recommendations.push(
        'Considerar aumentar el área disponible para gas para reducir la velocidad',
      );
    }

    if (results.heatLosses > results.processHeatDuty * 0.3) {
      recommendations.push(
        'Mejorar el aislamiento térmico para reducir las pérdidas de calor',
      );
    }

    if (!results.dimensionalCompliance) {
      recommendations.push(
        'Ajustar las dimensiones del tratador según las especificaciones API-12L',
      );
    }

    if (!results.pressureCompliance) {
      recommendations.push(
        'Aumentar la presión de diseño para cumplir con los requisitos API-12L',
      );
    }

    return recommendations;
  }

  /**
   * Genera datos para gráficas de simulación
   */
  private generateSimulationData(
    input: ThermalTreatmentInput,
    results: ThermalCalculationResults,
  ): {
    flowRates: { oil: number; water: number; total: number }[];
    retentionVolumes: { oil: number; water: number; total: number }[];
    heatRequirements: { process: number; losses: number; total: number }[];
    temperatures: { inlet: number; treatment: number; ambient: number }[];
  } {
    // Generar datos para múltiples puntos de simulación
    const points = 20;
    const flowRates = [];
    const retentionVolumes = [];
    const heatRequirements = [];
    const temperatures = [];

    for (let i = 0; i < points; i++) {
      const factor = 0.5 + (i / points) * 1.0; // Factor de 0.5 a 1.5

      flowRates.push({
        oil: results.dryOilFlowRate * factor,
        water: results.waterFlowRate * factor,
        total: results.volumetricFlowRate * factor,
      });

      retentionVolumes.push({
        oil: results.oilRetentionVolume * factor,
        water: results.waterRetentionVolume * factor,
        total:
          (results.oilRetentionVolume + results.waterRetentionVolume) * factor,
      });

      heatRequirements.push({
        process: results.processHeatDuty * factor,
        losses: results.heatLosses * factor,
        total: results.totalHeatRequired * factor,
      });

      temperatures.push({
        inlet: input.inletTemperature,
        treatment: input.treatmentTemperature || input.inletTemperature + 65,
        ambient: input.ambientTemperature,
      });
    }

    return { flowRates, retentionVolumes, heatRequirements, temperatures };
  }
}
