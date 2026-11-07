import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import {
  ThermalCalculatorService,
  ThermalTreatmentInput,
  ThermalCalculationResults,
} from '../services/thermal-calculator.service';

/**
 * @description Controlador para cálculos térmicos de tratadores
 * Implementa la metodología completa del módulo de evaluación según API-12L
 */
@ApiTags('Thermal Calculations')
@Controller('thermal-calculations')
export class ThermalCalculationsController {
  constructor(
    private readonly thermalCalculatorService: ThermalCalculatorService,
  ) {}

  /**
   * @description Calcula resultados térmicos completos según metodología del PDF
   * @ApiOperation Calcular resultados térmicos
   * @ApiResponse 200 - Resultados calculados exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   */
  @Post('calculate')
  @ApiOperation({
    summary: 'Calcular resultados térmicos completos',
    description:
      'Calcula todos los parámetros térmicos según la metodología del módulo de evaluación y norma API-12L',
  })
  @ApiBody({
    type: Object,
    description:
      'Datos de entrada del tratador térmico según Tabla 4-1 del PDF',
    examples: {
      example1: {
        summary: 'Ejemplo básico',
        value: {
          diameter: 6.0,
          length: 20.0,
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
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resultados de cálculos térmicos calculados exitosamente',
    type: ThermalCalculationResults,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos o incompletos',
  })
  calculateThermalResults(
    @Body() input: ThermalTreatmentInput,
  ): ThermalCalculationResults {
    return this.thermalCalculatorService.calculateThermalResults(input);
  }

  /**
   * @description Valida datos de entrada para cálculos térmicos
   * @ApiOperation Validar datos de entrada
   * @ApiResponse 200 - Datos válidos
   * @ApiResponse 400 - Datos inválidos
   */
  @Post('validate-input')
  @ApiOperation({
    summary: 'Validar datos de entrada',
    description:
      'Valida que los datos de entrada cumplan con los requisitos para cálculos térmicos',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Datos de entrada válidos',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean' },
        errors: { type: 'array', items: { type: 'string' } },
        warnings: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  validateInput(@Body() input: ThermalTreatmentInput): {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } {
    try {
      // Validar datos obligatorios
      const errors: string[] = [];
      const warnings: string[] = [];

      if (!input.diameter || input.diameter <= 0) {
        errors.push('Diámetro debe ser mayor a 0');
      }
      if (!input.length || input.length <= 0) {
        errors.push('Longitud debe ser mayor a 0');
      }
      if (!input.totalFlow || input.totalFlow <= 0) {
        errors.push('Flujo total debe ser mayor a 0');
      }
      if (!input.apiGravity || input.apiGravity <= 0) {
        errors.push('Gravedad API debe ser mayor a 0');
      }
      if (!input.inletTemperature) {
        errors.push('Temperatura de entrada es requerida');
      }
      if (!input.ambientTemperature) {
        errors.push('Temperatura ambiente es requerida');
      }
      if (!input.operatingPressure || input.operatingPressure <= 0) {
        errors.push('Presión de operación debe ser mayor a 0');
      }

      // Validar rangos recomendados
      if (input.diameter && (input.diameter < 3 || input.diameter > 12)) {
        warnings.push(
          'Diámetro fuera del rango recomendado API-12L (3-12 pies)',
        );
      }
      if (
        input.apiGravity &&
        (input.apiGravity < 10 || input.apiGravity > 50)
      ) {
        warnings.push('Gravedad API fuera del rango típico (10-50°API)');
      }
      if (input.operatingPressure && input.operatingPressure < 50) {
        warnings.push(
          'Presión de operación menor a 50 psig recomendado por API-12L',
        );
      }

      return {
        valid: errors.length === 0,
        errors,
        warnings,
      };
    } catch (error) {
      return {
        valid: false,
        errors: ['Error interno en la validación'],
        warnings: [],
      };
    }
  }

  /**
   * @description Obtiene recomendaciones de dimensiones según API-12L
   * @ApiOperation Obtener recomendaciones de dimensiones
   * @ApiResponse 200 - Recomendaciones generadas
   */
  @Post('recommend-dimensions')
  @ApiOperation({
    summary: 'Recomendar dimensiones óptimas',
    description:
      'Genera recomendaciones de dimensiones según las tablas API-12L',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Recomendaciones de dimensiones generadas',
    schema: {
      type: 'object',
      properties: {
        recommendedDiameter: { type: 'number' },
        recommendedLength: { type: 'number' },
        recommendedPressure: { type: 'number' },
        fireboxArea: { type: 'number' },
        fireboxCapacity: { type: 'number' },
        fireboxClassification: { type: 'string' },
        compliance: { type: 'boolean' },
        recommendations: { type: 'array', items: { type: 'string' } },
      },
    },
  })
  recommendDimensions(@Body() input: ThermalTreatmentInput): {
    recommendedDiameter: number;
    recommendedLength: number;
    recommendedPressure: number;
    fireboxArea: number;
    fireboxCapacity: number;
    fireboxClassification: string;
    compliance: boolean;
    recommendations: string[];
  } {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);

    return {
      recommendedDiameter: results.recommendedDiameter,
      recommendedLength: results.recommendedLength,
      recommendedPressure: results.recommendedDesignPressure,
      fireboxArea: results.minimumFireboxArea,
      fireboxCapacity: results.minimumHeatCapacity,
      fireboxClassification: results.fireboxClassification,
      compliance: results.api12lCompliance,
      recommendations: results.optimizationRecommendations,
    };
  }
}
