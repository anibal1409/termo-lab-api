import { Injectable } from '@nestjs/common';
import {
  ThermalCalculationResults,
  ThermalTreatmentInput,
} from './thermal-calculator.service';

/**
 * @description Interfaz para datos del reporte de evaluación
 */
export interface EvaluationReportData {
  // Datos de entrada
  inputData: {
    diameter: number;
    length: number;
    totalFlow: number;
    waterFraction: number;
    apiGravity: number;
    inletTemperature: number;
    treatmentTemperature: number;
    ambientTemperature: number;
    operatingPressure: number;
    oilRetentionTime: number;
    waterRetentionTime: number;
    windSpeed: number;
  };

  // Resultados calculados
  calculatedResults: {
    oilFlowRate: number;
    waterFlowRate: number;
    oilRetentionVolume: number;
    waterRetentionVolume: number;
    processHeatDuty: number;
    heatLosses: number;
    totalHeatRequired: number;
    recommendedDiameter: number;
    recommendedLength: number;
    recommendedPressure: number;
  };

  // Cumplimiento API-12L
  compliance: {
    api12lCompliant: boolean;
    dimensionalCompliant: boolean;
    pressureCompliant: boolean;
    heatCapacityCompliant: boolean;
    warnings: string[];
    recommendations: string[];
  };

  // Metadatos del reporte
  metadata: {
    generatedAt: Date;
    version: string;
    methodology: string;
  };
}

/**
 * @description Servicio para generar reportes de evaluación según Paso 9 del documento
 */
@Injectable()
export class ReportGeneratorService {
  private readonly VERSION = '1.0.0';
  private readonly METHODOLOGY = 'API-12L Standard for Thermal Treatment';

  /**
   * Genera un reporte completo de evaluación según el formato del Paso 9
   * @param input Datos de entrada del tratador
   * @param results Resultados de cálculos térmicos
   * @returns Datos estructurados para el reporte
   */
  generateEvaluationReport(
    input: ThermalTreatmentInput,
    results: ThermalCalculationResults,
  ): EvaluationReportData {
    return {
      inputData: {
        diameter: input.diameter,
        length: input.length,
        totalFlow: input.totalFlow,
        waterFraction: input.waterFraction,
        apiGravity: input.apiGravity,
        inletTemperature: input.inletTemperature,
        treatmentTemperature:
          input.treatmentTemperature || input.inletTemperature + 65,
        ambientTemperature: input.ambientTemperature,
        operatingPressure: input.operatingPressure,
        oilRetentionTime: input.oilRetentionTime || results.oilRetentionTime,
        waterRetentionTime:
          input.waterRetentionTime || results.waterRetentionTime,
        windSpeed: input.windSpeed || results.windSpeed,
      },
      calculatedResults: {
        oilFlowRate: results.dryOilFlowRate,
        waterFlowRate: results.waterFlowRate,
        oilRetentionVolume: results.oilRetentionVolume,
        waterRetentionVolume: results.waterRetentionVolume,
        processHeatDuty: results.processHeatDuty,
        heatLosses: results.heatLosses,
        totalHeatRequired: results.totalHeatRequired,
        recommendedDiameter: results.recommendedDiameter,
        recommendedLength: results.recommendedLength,
        recommendedPressure: results.recommendedDesignPressure,
      },
      compliance: {
        api12lCompliant: results.api12lCompliance,
        dimensionalCompliant: results.dimensionalCompliance,
        pressureCompliant: results.pressureCompliance,
        heatCapacityCompliant: results.heatCapacityCompliance,
        warnings: results.complianceWarnings,
        recommendations: results.optimizationRecommendations,
      },
      metadata: {
        generatedAt: new Date(),
        version: this.VERSION,
        methodology: this.METHODOLOGY,
      },
    };
  }

  /**
   * Genera un reporte en formato de tabla según el ejemplo del Paso 9
   * @param reportData Datos del reporte
   * @returns Tabla de resultados formateada
   */
  generateResultsTable(reportData: EvaluationReportData): Array<{
    parameter: string;
    value: string;
    unit: string;
    category: string;
  }> {
    const { inputData, calculatedResults } = reportData;

    return [
      // Datos de entrada
      {
        parameter: 'Flujo Total de Emulsión (W)',
        value: inputData.totalFlow.toString(),
        unit: 'Bbls/día',
        category: 'Entrada',
      },
      {
        parameter: 'Fracción de Agua (X)',
        value: inputData.waterFraction.toString(),
        unit: '%',
        category: 'Entrada',
      },
      {
        parameter: 'Temperatura de Entrada (T1)',
        value: inputData.inletTemperature.toString(),
        unit: '°F',
        category: 'Entrada',
      },
      {
        parameter: 'Temperatura de Tratamiento (T2)',
        value: inputData.treatmentTemperature.toString(),
        unit: '°F',
        category: 'Entrada',
      },
      {
        parameter: 'Temperatura Ambiente (T3)',
        value: inputData.ambientTemperature.toString(),
        unit: '°F',
        category: 'Entrada',
      },
      {
        parameter: 'Tiempo de Retención del Petróleo (to)',
        value: inputData.oilRetentionTime.toString(),
        unit: 'minutos',
        category: 'Entrada',
      },
      {
        parameter: 'Tiempo de Retención del Agua (tw)',
        value: inputData.waterRetentionTime.toString(),
        unit: 'minutos',
        category: 'Entrada',
      },
      {
        parameter: 'Velocidad del Viento',
        value: inputData.windSpeed.toString(),
        unit: 'MPH',
        category: 'Entrada',
      },
      {
        parameter: 'Gravedad API',
        value: inputData.apiGravity.toString(),
        unit: '°API',
        category: 'Entrada',
      },

      // Resultados calculados
      {
        parameter: 'Tasa de flujo de petróleo (Wo)',
        value: calculatedResults.oilFlowRate.toFixed(2),
        unit: 'Bbls/día',
        category: 'Calculado',
      },
      {
        parameter: 'Tasa de flujo de agua (Ww)',
        value: calculatedResults.waterFlowRate.toFixed(2),
        unit: 'Bbls/día',
        category: 'Calculado',
      },
      {
        parameter: 'Volumen de retención del petróleo (Vp)',
        value: calculatedResults.oilRetentionVolume.toFixed(2),
        unit: 'Bbl',
        category: 'Calculado',
      },
      {
        parameter: 'Volumen de retención del agua (Vw)',
        value: calculatedResults.waterRetentionVolume.toFixed(2),
        unit: 'Bbl',
        category: 'Calculado',
      },
      {
        parameter: 'Calor requerido (Q)',
        value: calculatedResults.processHeatDuty.toFixed(0),
        unit: 'BTU/hora',
        category: 'Calculado',
      },
      {
        parameter: 'Pérdidas de calor',
        value: calculatedResults.heatLosses.toFixed(0),
        unit: 'BTU/hora',
        category: 'Calculado',
      },
      {
        parameter: 'Calor total (Qtotal)',
        value: calculatedResults.totalHeatRequired.toFixed(0),
        unit: 'BTU/hora',
        category: 'Calculado',
      },
      {
        parameter: 'Diámetro del tratador',
        value: calculatedResults.recommendedDiameter.toString(),
        unit: 'ft',
        category: 'Recomendado',
      },
      {
        parameter: 'Longitud del tratador',
        value: calculatedResults.recommendedLength.toString(),
        unit: 'ft',
        category: 'Recomendado',
      },
    ];
  }

  /**
   * Genera un resumen ejecutivo del reporte
   * @param reportData Datos del reporte
   * @returns Resumen ejecutivo
   */
  generateExecutiveSummary(reportData: EvaluationReportData): {
    title: string;
    summary: string;
    keyFindings: string[];
    recommendations: string[];
    compliance: string;
  } {
    const { compliance, calculatedResults, inputData } = reportData;

    const keyFindings = [
      `El tratador procesará ${inputData.totalFlow} BPD con ${inputData.waterFraction}% de agua`,
      `Requiere ${calculatedResults.totalHeatRequired.toFixed(0)} BTU/h de calor total`,
      `Dimensiones recomendadas: ${calculatedResults.recommendedDiameter} ft × ${calculatedResults.recommendedLength} ft`,
      `Eficiencia de separación: ${((calculatedResults.oilFlowRate / inputData.totalFlow) * 100).toFixed(1)}%`,
    ];

    const recommendations =
      compliance.recommendations.length > 0
        ? compliance.recommendations
        : ['El diseño cumple con todos los requisitos API-12L'];

    const complianceStatus = compliance.api12lCompliant
      ? 'CUMPLE con la norma API-12L'
      : 'NO CUMPLE con la norma API-12L - Ver advertencias';

    return {
      title: 'Reporte de Evaluación de Tratador Térmico',
      summary:
        `Evaluación completa del tratador térmico según metodología API-12L. ` +
        `El sistema procesará ${inputData.totalFlow} BPD de emulsión con ` +
        `${inputData.waterFraction}% de contenido de agua, requiriendo ` +
        `${calculatedResults.totalHeatRequired.toFixed(0)} BTU/h de calor total.`,
      keyFindings,
      recommendations,
      compliance: complianceStatus,
    };
  }

  /**
   * Genera datos para gráficas de simulación según Figuras 4-1, 4-2, 4-3
   * @param results Resultados de cálculos térmicos
   * @returns Datos estructurados para gráficas
   */
  generateSimulationChartsData(results: ThermalCalculationResults): {
    flowRatesChart: {
      title: string;
      data: Array<{ x: number; oil: number; water: number; total: number }>;
    };
    retentionVolumesChart: {
      title: string;
      data: Array<{ x: number; oil: number; water: number; total: number }>;
    };
    heatRequirementsChart: {
      title: string;
      data: Array<{
        x: number;
        process: number;
        losses: number;
        total: number;
      }>;
    };
  } {
    const { simulationData } = results;

    return {
      flowRatesChart: {
        title: 'Tasas de Flujo de Petróleo y Agua',
        data: simulationData.flowRates.map((point, index) => ({
          x: index + 1,
          oil: point.oil,
          water: point.water,
          total: point.total,
        })),
      },
      retentionVolumesChart: {
        title: 'Volúmenes de Retención',
        data: simulationData.retentionVolumes.map((point, index) => ({
          x: index + 1,
          oil: point.oil,
          water: point.water,
          total: point.total,
        })),
      },
      heatRequirementsChart: {
        title: 'Calor Requerido para el Tratamiento',
        data: simulationData.heatRequirements.map((point, index) => ({
          x: index + 1,
          process: point.process,
          losses: point.losses,
          total: point.total,
        })),
      },
    };
  }

  /**
   * Genera un reporte completo en formato JSON
   * @param input Datos de entrada
   * @param results Resultados de cálculos
   * @returns Reporte completo en formato JSON
   */
  generateCompleteReport(
    input: ThermalTreatmentInput,
    results: ThermalCalculationResults,
  ): {
    reportData: EvaluationReportData;
    resultsTable: Array<{
      parameter: string;
      value: string;
      unit: string;
      category: string;
    }>;
    executiveSummary: {
      title: string;
      summary: string;
      keyFindings: string[];
      recommendations: string[];
      compliance: string;
    };
    simulationCharts: {
      flowRatesChart: any;
      retentionVolumesChart: any;
      heatRequirementsChart: any;
    };
  } {
    const reportData = this.generateEvaluationReport(input, results);

    return {
      reportData,
      resultsTable: this.generateResultsTable(reportData),
      executiveSummary: this.generateExecutiveSummary(reportData),
      simulationCharts: this.generateSimulationChartsData(results),
    };
  }
}
