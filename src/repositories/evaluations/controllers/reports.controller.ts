import { Controller, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import {
  ThermalCalculatorService,
  ThermalTreatmentInput,
} from '../services/thermal-calculator.service';
import { ReportGeneratorService } from '../services/report-generator.service';

/**
 * @description Controlador para generación de reportes de evaluación
 * Implementa el Paso 9 del documento: Generación de reportes
 */
@ApiTags('Evaluation Reports')
@Controller('reports')
export class ReportsController {
  constructor(
    private readonly thermalCalculatorService: ThermalCalculatorService,
    private readonly reportGeneratorService: ReportGeneratorService,
  ) {}

  /**
   * @description Genera un reporte completo de evaluación según Paso 9
   * @ApiOperation Generar reporte completo
   * @ApiResponse 200 - Reporte generado exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   */
  @Post('evaluation-report')
  @ApiOperation({
    summary: 'Generar reporte completo de evaluación',
    description:
      'Genera un reporte completo según el formato del Paso 9 del documento, incluyendo tabla de resultados, resumen ejecutivo y datos para gráficas',
  })
  @ApiBody({
    type: Object,
    description: 'Datos de entrada del tratador térmico',
    examples: {
      example1: {
        summary: 'Ejemplo de evaluación completa',
        value: {
          diameter: 6.0,
          length: 20.0,
          totalFlow: 500,
          waterFraction: 20,
          apiGravity: 18,
          inletTemperature: 75,
          treatmentTemperature: 140,
          ambientTemperature: 30,
          operatingPressure: 50,
          oilRetentionTime: 60,
          waterRetentionTime: 30,
          windSpeed: 15,
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte de evaluación generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        reportData: { type: 'object' },
        resultsTable: { type: 'array' },
        executiveSummary: { type: 'object' },
        simulationCharts: { type: 'object' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de entrada inválidos',
  })
  generateEvaluationReport(@Body() input: ThermalTreatmentInput) {
    // Calcular resultados térmicos
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);

    // Generar reporte completo
    return this.reportGeneratorService.generateCompleteReport(input, results);
  }

  /**
   * @description Genera solo la tabla de resultados según el formato del Paso 9
   * @ApiOperation Generar tabla de resultados
   * @ApiResponse 200 - Tabla generada exitosamente
   */
  @Post('results-table')
  @ApiOperation({
    summary: 'Generar tabla de resultados',
    description:
      'Genera la tabla de resultados según el formato del Paso 9 del documento',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Tabla de resultados generada exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          parameter: { type: 'string' },
          value: { type: 'string' },
          unit: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  })
  generateResultsTable(@Body() input: ThermalTreatmentInput) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);
    const reportData = this.reportGeneratorService.generateEvaluationReport(
      input,
      results,
    );

    return this.reportGeneratorService.generateResultsTable(reportData);
  }

  /**
   * @description Genera resumen ejecutivo del reporte
   * @ApiOperation Generar resumen ejecutivo
   * @ApiResponse 200 - Resumen generado exitosamente
   */
  @Post('executive-summary')
  @ApiOperation({
    summary: 'Generar resumen ejecutivo',
    description: 'Genera un resumen ejecutivo del reporte de evaluación',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumen ejecutivo generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        summary: { type: 'string' },
        keyFindings: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        compliance: { type: 'string' },
      },
    },
  })
  generateExecutiveSummary(@Body() input: ThermalTreatmentInput) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);
    const reportData = this.reportGeneratorService.generateEvaluationReport(
      input,
      results,
    );

    return this.reportGeneratorService.generateExecutiveSummary(reportData);
  }

  /**
   * @description Genera datos para gráficas de simulación
   * @ApiOperation Generar datos para gráficas
   * @ApiResponse 200 - Datos generados exitosamente
   */
  @Post('simulation-charts')
  @ApiOperation({
    summary: 'Generar datos para gráficas de simulación',
    description:
      'Genera datos para las gráficas de simulación según Figuras 4-1, 4-2, 4-3 del documento',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Datos para gráficas generados exitosamente',
    schema: {
      type: 'object',
      properties: {
        flowRatesChart: { type: 'object' },
        retentionVolumesChart: { type: 'object' },
        heatRequirementsChart: { type: 'object' },
      },
    },
  })
  generateSimulationCharts(@Body() input: ThermalTreatmentInput) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);

    return this.reportGeneratorService.generateSimulationChartsData(results);
  }

  /**
   * @description Genera reporte de cumplimiento API-12L
   * @ApiOperation Generar reporte de cumplimiento
   * @ApiResponse 200 - Reporte de cumplimiento generado
   */
  @Post('compliance-report')
  @ApiOperation({
    summary: 'Generar reporte de cumplimiento API-12L',
    description:
      'Genera un reporte detallado del cumplimiento con la norma API-12L',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reporte de cumplimiento generado exitosamente',
    schema: {
      type: 'object',
      properties: {
        compliant: { type: 'boolean' },
        dimensionalCompliant: { type: 'boolean' },
        pressureCompliant: { type: 'boolean' },
        heatCapacityCompliant: { type: 'boolean' },
        warnings: { type: 'array', items: { type: 'string' } },
        recommendations: { type: 'array', items: { type: 'string' } },
        score: { type: 'number' },
      },
    },
  })
  generateComplianceReport(@Body() input: ThermalTreatmentInput) {
    const results =
      this.thermalCalculatorService.calculateThermalResults(input);

    // Calcular puntuación de cumplimiento
    let score = 100;
    if (!results.dimensionalCompliance) score -= 25;
    if (!results.pressureCompliance) score -= 25;
    if (!results.heatCapacityCompliance) score -= 25;
    if (results.complianceWarnings.length > 0)
      score -= results.complianceWarnings.length * 5;

    return {
      compliant: results.api12lCompliance,
      dimensionalCompliant: results.dimensionalCompliance,
      pressureCompliant: results.pressureCompliance,
      heatCapacityCompliant: results.heatCapacityCompliance,
      warnings: results.complianceWarnings,
      recommendations: results.optimizationRecommendations,
      score: Math.max(0, score),
    };
  }
}
