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
  ambientTemperature: number; // T3 en °F
  operatingPressure: number; // Presión en psig
  oilDensity?: number; // Densidad del crudo lb/pie³
  waterDensity?: number; // Densidad del agua lb/pie³
  oilViscosity?: number; // Viscosidad del crudo cP
  factorK?: number; // Factor K
  lowLowWaterLevel?: number; // Nivel bajo bajo de agua en pulgadas
  waterOilInterfaceLevel?: number; // Nivel de interfase en pulgadas
  highHighOilLevel?: number; // Nivel alto alto de crudo en pulgadas
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

  @ApiProperty({ description: 'Área desde el fondo al nivel bajo bajo de agua en pie²' })
  lowWaterArea: number;

  @ApiProperty({ description: 'Área total del recipiente en pie²' })
  totalVesselArea: number;

  @ApiProperty({ description: 'Área disponible para el gas en pie²' })
  gasArea: number;

  @ApiProperty({ description: 'Altura libre para el gas en pies' })
  freeHeightForGas: number;

  @ApiProperty({ description: 'Volumen de retención de agua en pie³' })
  waterRetentionVolume: number;

  @ApiProperty({ description: 'Corte de agua del crudo saliendo del tratador (%)' })
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

  @ApiProperty({ description: 'Velocidad de decantación de la fase pesada en pie/min' })
  heavyPhaseSettlingVelocity: number;

  @ApiProperty({ description: 'Tiempo de decantación de la fase pesada en minutos' })
  heavyPhaseSettlingTime: number;

  @ApiProperty({ description: 'Tiempo de decantación de la fase liviana en minutos' })
  lightPhaseSettlingTime: number;

  @ApiProperty({ description: 'Calor total requerido en BTU/h' })
  totalHeatRequired: number;

  @ApiProperty({ description: 'Caudal de agua libre entrando al tratador en BPD' })
  freeWaterFlowEntering: number;

  @ApiProperty({ description: 'Caudal de agua emulsionada entrando al tratador en BPD' })
  emulsifiedWaterFlowEntering: number;

  @ApiProperty({ description: 'Cantidad de agua total a ser manejada por el tratador en BPD' })
  totalWaterToBeHandled: number;

  @ApiProperty({ description: 'Fracción volumétrica del agua en la corriente de entrada' })
  volumetricWaterFraction: number;

  @ApiProperty({ description: 'Gravedad específica del crudo (adimensional)' })
  oilSpecificGravity: number;

  @ApiProperty({ description: 'Densidad del crudo calculada en lb/pie³' })
  calculatedOilDensity: number;

  @ApiProperty({ description: 'Densidad del agua calculada en lb/pie³' })
  calculatedWaterDensity: number;
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

  /**
   * Calcula todos los resultados térmicos según la metodología del PDF
   * @param input Datos de entrada del tratador térmico
   * @returns Resultados completos de cálculos
   */
  calculateThermalResults(input: ThermalTreatmentInput): ThermalCalculationResults {
    // Validar datos de entrada
    this.validateInput(input);

    const results = new ThermalCalculationResults();

    // 1. Calcular gravedad específica del crudo (Ecuación 1.32)
    results.oilSpecificGravity = this.calculateOilSpecificGravity(input.apiGravity);

    // 2. Calcular densidades (Ecuaciones 1.35, 1.36)
    results.calculatedOilDensity = this.calculateOilDensity(
      results.oilSpecificGravity,
      input.inletTemperature
    );
    results.calculatedWaterDensity = this.calculateWaterDensity(input.inletTemperature);

    // 3. Calcular calor específico del crudo (Ecuación 1.33)
    const oilSpecificHeat = input.oilSpecificHeat || this.calculateOilSpecificHeat(
      results.oilSpecificGravity,
      input.inletTemperature
    );

    // 4. Calcular calor específico del agua (Ecuación 1.34)
    const waterSpecificHeat = input.waterSpecificHeat || this.calculateWaterSpecificHeat(
      input.inletTemperature
    );

    // 5. Calcular porcentaje de agua libre y sedimento (Ecuación 1.26)
    results.freeWaterAndSedimentPercentage = this.calculateFreeWaterAndSedimentPercentage(
      input.totalFlow,
      input.waterFraction,
      input.freeWaterRemovalPercentage || 85
    );

    // 6. Calcular porcentaje de agua emulsionada (Ecuación 1.27)
    results.emulsifiedWaterPercentage = input.waterFraction - results.freeWaterAndSedimentPercentage;

    // 7. Calcular flujo volumétrico de fluidos (Ecuación 1.29)
    results.volumetricFlowRate = input.totalFlow;

    // 8. Calcular densidades y peso molecular del gas (Ecuación 1.31)
    results.gasDensity = this.calculateGasDensity(input.operatingPressure, input.inletTemperature);
    results.gasMolecularWeight = this.calculateGasMolecularWeight();

    // 9. Calcular área total del recipiente (Ecuación 1.10)
    results.totalVesselArea = this.calculateTotalVesselArea(input.diameter);

    // 10. Calcular área desde el fondo al nivel bajo bajo de agua (Ecuación 1.9)
    results.lowWaterArea = this.calculateLowWaterArea(
      input.diameter,
      input.lowLowWaterLevel || 2,
      results.totalVesselArea
    );

    // 11. Calcular área ocupada por el agua (Ecuación 1.17)
    results.waterArea = this.calculateWaterArea(
      input.diameter,
      input.waterOilInterfaceLevel || 12,
      results.lowWaterArea,
      results.totalVesselArea
    );

    // 12. Calcular área ocupada por el crudo (Ecuación 1.4)
    results.oilArea = this.calculateOilArea(
      input.diameter,
      input.highHighOilLevel || 24,
      results.totalVesselArea,
      results.waterArea,
      results.lowWaterArea
    );

    // 13. Calcular volúmenes de retención (Ecuaciones 1.5, 1.12)
    results.oilRetentionVolume = results.oilArea * input.length;
    results.waterRetentionVolume = results.waterArea * input.length;

    // 14. Calcular caudales (Ecuaciones 1.6, 1.7)
    results.waterFlowRate = this.calculateWaterFlowRate(
      input.totalFlow,
      input.waterFraction / 100
    );
    results.dryOilFlowRate = input.totalFlow - results.waterFlowRate;

    // 15. Calcular tiempo de retención estimado (Ecuación 1.8)
    results.estimatedRetentionTime = this.calculateEstimatedRetentionTime(
      results.oilRetentionVolume,
      results.dryOilFlowRate
    );

    // 16. Calcular altura libre para el gas
    results.freeHeightForGas = 0.5; // Factor K * 12

    // 17. Calcular área disponible para el gas (Ecuación 1.11)
    results.gasArea = this.calculateGasArea(
      input.diameter,
      results.freeHeightForGas,
      results.totalVesselArea
    );

    // 18. Calcular velocidad permisible para el gas (Ecuación 1.14)
    results.allowableGasVelocity = this.calculateAllowableGasVelocity(
      input.factorK || 0.5,
      results.calculatedOilDensity,
      results.gasDensity
    );

    // 19. Calcular área requerida para el gas (Ecuación 1.15)
    results.requiredGasArea = this.calculateRequiredGasArea(
      results.allowableGasVelocity,
      input.inletTemperature,
      input.operatingPressure
    );

    // 20. Calcular cantidad de agua saliendo con el crudo (Ecuación 1.18)
    results.waterLeavingWithOil = this.calculateWaterLeavingWithOil(
      results.freeWaterAndSedimentPercentage,
      results.waterFlowRate
    );

    // 21. Calcular corte de agua del crudo saliendo del tratador (Ecuación 1.13)
    results.waterCutLeavingTreater = this.calculateWaterCutLeavingTreater(
      results.waterLeavingWithOil,
      results.dryOilFlowRate
    );

    // 22. Calcular porcentaje de deshidratación del equipo (Ecuación 1.19)
    results.dehydrationPercentage = this.calculateDehydrationPercentage(
      results.waterRetentionVolume,
      results.freeWaterAndSedimentPercentage,
      results.waterFlowRate,
      input.waterDropSize || 150
    );

    // 23. Calcular flujos másicos (Ecuaciones 1.20, 1.21)
    results.oilMassFlow = this.calculateOilMassFlow(
      results.dryOilFlowRate,
      results.oilSpecificGravity
    );
    results.waterMassFlow = this.calculateWaterMassFlow(
      results.waterFlowRate,
      input.waterSpecificGravity || 1.0
    );

    // 24. Calcular velocidad de decantación de la fase pesada (Ecuación 1.22)
    results.heavyPhaseSettlingVelocity = this.calculateHeavyPhaseSettlingVelocity(
      input.waterDropSize || 150,
      results.calculatedWaterDensity,
      results.calculatedOilDensity,
      input.oilViscosity || 15.5
    );

    // 25. Calcular tiempo de decantación de la fase pesada (Ecuación 1.23)
    results.heavyPhaseSettlingTime = this.calculateHeavyPhaseSettlingTime(
      input.highHighOilLevel || 24,
      input.waterOilInterfaceLevel || 12,
      results.heavyPhaseSettlingVelocity
    );

    // 26. Calcular tiempo de decantación de la fase liviana (Ecuación 1.24)
    results.lightPhaseSettlingTime = results.heavyPhaseSettlingTime / 60;

    // 27. Calcular calor total requerido
    results.totalHeatRequired = this.calculateTotalHeatRequired(
      input.totalFlow,
      input.waterFraction,
      input.inletTemperature,
      input.ambientTemperature,
      oilSpecificHeat,
      waterSpecificHeat
    );

    // 28. Calcular caudales de entrada (Ecuaciones 1.26, 1.27)
    results.freeWaterFlowEntering = this.calculateFreeWaterFlowEntering(
      results.freeWaterAndSedimentPercentage,
      results.waterFlowRate,
      input.freeWaterRemovalPercentage || 85
    );
    results.emulsifiedWaterFlowEntering = results.waterFlowRate - results.freeWaterFlowEntering;

    // 29. Calcular cantidad de agua total a ser manejada (Ecuación 1.28)
    results.totalWaterToBeHandled = results.freeWaterFlowEntering + results.emulsifiedWaterFlowEntering;

    // 30. Calcular fracción volumétrica del agua (Ecuación 1.29)
    results.volumetricWaterFraction = results.totalWaterToBeHandled / results.volumetricFlowRate;

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
  private calculateOilDensity(specificGravity: number, temperature: number): number {
    return (specificGravity * 62.4) / (1 + 0.00065 * (temperature - this.STANDARD_TEMPERATURE));
  }

  // Ecuación 1.36: Densidad del agua
  private calculateWaterDensity(temperature: number): number {
    return 62.4 - 0.013 * (temperature - this.STANDARD_TEMPERATURE);
  }

  // Ecuación 1.33: Calor específico del crudo
  private calculateOilSpecificHeat(specificGravity: number, temperature: number): number {
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
    removalPercentage: number
  ): number {
    return (waterFraction * removalPercentage) / 100;
  }

  // Ecuación 1.10: Área total del recipiente
  private calculateTotalVesselArea(diameter: number): number {
    return (Math.PI * Math.pow(diameter, 2)) / 4;
  }

  // Ecuación 1.9: Área desde el fondo al nivel bajo bajo de agua
  private calculateLowWaterArea(diameter: number, lowWaterLevel: number, totalArea: number): number {
    const ratio = (2 * lowWaterLevel) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    return (angle - Math.sin(angle)) * totalArea / (2 * Math.PI);
  }

  // Ecuación 1.17: Área ocupada por el agua
  private calculateWaterArea(
    diameter: number,
    interfaceLevel: number,
    lowWaterArea: number,
    totalArea: number
  ): number {
    const ratio = (2 * interfaceLevel) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    const interfaceArea = (angle - Math.sin(angle)) * totalArea / (2 * Math.PI);
    return interfaceArea - lowWaterArea;
  }

  // Ecuación 1.4: Área ocupada por el crudo
  private calculateOilArea(
    diameter: number,
    highOilLevel: number,
    totalArea: number,
    waterArea: number,
    lowWaterArea: number
  ): number {
    const ratio = (2 * highOilLevel) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    const highOilArea = (angle - Math.sin(angle)) * totalArea / (2 * Math.PI);
    return highOilArea - waterArea - lowWaterArea;
  }

  // Ecuación 1.6: Caudal de agua
  private calculateWaterFlowRate(totalFlow: number, waterFraction: number): number {
    return totalFlow * waterFraction;
  }

  // Ecuación 1.8: Tiempo de retención estimado
  private calculateEstimatedRetentionTime(oilVolume: number, oilFlowRate: number): number {
    return (oilVolume / 5.6146) * 24 * 60 / oilFlowRate;
  }

  // Ecuación 1.11: Área disponible para el gas
  private calculateGasArea(diameter: number, freeHeight: number, totalArea: number): number {
    const ratio = (2 * freeHeight * 12) / (diameter * 12);
    const angle = 2 * Math.acos(1 - ratio);
    return (angle - Math.sin(angle)) * totalArea / (2 * Math.PI);
  }

  // Ecuación 1.14: Velocidad permisible para el gas
  private calculateAllowableGasVelocity(factorK: number, oilDensity: number, gasDensity: number): number {
    return factorK * Math.sqrt((oilDensity - gasDensity) / gasDensity);
  }

  // Ecuación 1.15: Área requerida para el gas
  private calculateRequiredGasArea(
    allowableVelocity: number,
    temperature: number,
    pressure: number
  ): number {
    // Esta es una simplificación - la ecuación completa requiere más parámetros
    return 1.7 * 0.994 / (allowableVelocity * 24 * 3600);
  }

  // Ecuación 1.18: Cantidad de agua saliendo con el crudo
  private calculateWaterLeavingWithOil(removalPercentage: number, waterFlow: number): number {
    return waterFlow * (100 - removalPercentage) / 100;
  }

  // Ecuación 1.13: Corte de agua del crudo saliendo del tratador
  private calculateWaterCutLeavingTreater(waterLeaving: number, dryOilFlow: number): number {
    return (waterLeaving / (waterLeaving + dryOilFlow)) * 100;
  }

  // Ecuación 1.19: Porcentaje de deshidratación del equipo
  private calculateDehydrationPercentage(
    waterVolume: number,
    freeWaterPercentage: number,
    waterFlow: number,
    dropSize: number
  ): number {
    // Simplificación de la ecuación compleja
    return 100 * (waterVolume / 5.6146) / (waterFlow * freeWaterPercentage / 100);
  }

  // Ecuación 1.20: Flujo másico del crudo
  private calculateOilMassFlow(oilFlowRate: number, specificGravity: number): number {
    return 14.58 * oilFlowRate * specificGravity;
  }

  // Ecuación 1.21: Flujo másico de agua
  private calculateWaterMassFlow(waterFlowRate: number, specificGravity: number): number {
    return 14.58 * waterFlowRate * specificGravity;
  }

  // Ecuación 1.22: Velocidad de decantación de la fase pesada
  private calculateHeavyPhaseSettlingVelocity(
    dropSize: number,
    waterDensity: number,
    oilDensity: number,
    oilViscosity: number
  ): number {
    return (18.4663 * Math.pow(dropSize, 2) * (waterDensity - oilDensity)) / oilViscosity;
  }

  // Ecuación 1.23: Tiempo de decantación de la fase pesada
  private calculateHeavyPhaseSettlingTime(
    highOilLevel: number,
    interfaceLevel: number,
    settlingVelocity: number
  ): number {
    return ((highOilLevel - interfaceLevel) / 12) / settlingVelocity;
  }

  // Cálculo de calor total requerido (simplificado)
  private calculateTotalHeatRequired(
    totalFlow: number,
    waterFraction: number,
    inletTemp: number,
    ambientTemp: number,
    oilSpecificHeat: number,
    waterSpecificHeat: number
  ): number {
    const deltaT = inletTemp - ambientTemp;
    const oilFlow = totalFlow * (100 - waterFraction) / 100;
    const waterFlow = totalFlow * waterFraction / 100;
    
    return (oilFlow * oilSpecificHeat + waterFlow * waterSpecificHeat) * deltaT;
  }

  // Ecuación 1.26: Caudal de agua libre entrando al tratador
  private calculateFreeWaterFlowEntering(
    freeWaterPercentage: number,
    waterFlow: number,
    removalPercentage: number
  ): number {
    return waterFlow * (100 - freeWaterPercentage) * (100 - removalPercentage) / (100 * 100);
  }

  // Ecuación 1.31: Densidad del gas
  private calculateGasDensity(pressure: number, temperature: number): number {
    const molecularWeight = this.calculateGasMolecularWeight();
    const absolutePressure = pressure + this.STANDARD_PRESSURE;
    const absoluteTemperature = temperature + 459.67;
    
    return (absolutePressure * molecularWeight) / (this.GAS_CONSTANT * absoluteTemperature);
  }

  // Ecuación 1.31: Peso molecular del gas (simplificado)
  private calculateGasMolecularWeight(): number {
    return 20.0; // lb/mol - valor promedio para gas natural
  }
}
