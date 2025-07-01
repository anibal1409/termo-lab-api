import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @description Interfaz para criterios de evaluación mínimos requeridos para cálculo
 */
interface CalculationCriteria {
  approved: boolean;
  complianceMargin: number;
  isCritical?: boolean; // Hacer opcional
  weight?: number; // Hacer opcional
}

/**
 * @description Resultado del cálculo de evaluación
 */
export class EvaluationCalculationResult {
  @ApiProperty({
    example: true,
    description: 'Indica si la evaluación está aprobada globalmente',
  })
  approved: boolean;

  @ApiProperty({
    example: 85.5,
    description: 'Puntaje general de la evaluación (0-100)',
    required: false,
  })
  score?: number;

  @ApiProperty({
    example: 2,
    description: 'Número de criterios críticos no aprobados',
  })
  criticalFailures: number;

  @ApiProperty({
    example: 90.3,
    description: 'Porcentaje promedio de cumplimiento',
  })
  averageCompliance: number;
}

/**
 * @description Servicio para calcular resultados de evaluaciones
 * @class EvaluationCalculatorService
 */
@Injectable()
export class EvaluationCalculatorService {
  /**
   * Calcula el resultado general de una evaluación basado en sus criterios
   * @param criteria Lista de criterios de evaluación
   * @returns Resultado del cálculo
   */
  calculateEvaluationResult(
    criteria: CalculationCriteria[],
  ): EvaluationCalculationResult {
    if (!criteria || criteria.length === 0) {
      throw new Error('No criteria provided for calculation');
    }

    // Asegurar valores por defecto
    const processedCriteria = criteria.map((c) => ({
      approved: c.approved,
      complianceMargin: c.complianceMargin,
      isCritical: c.isCritical ?? false,
      weight: c.weight ?? 1,
    }));

    const criticalCriteria = processedCriteria.filter((c) => c.isCritical);
    const criticalFailures = criticalCriteria.filter((c) => !c.approved).length;

    // Calcular promedio de cumplimiento
    const totalCompliance = criteria.reduce(
      (sum, c) => sum + c.complianceMargin,
      0,
    );
    const averageCompliance = totalCompliance / criteria.length;

    // Calcular puntaje ponderado si hay pesos definidos
    const hasWeights = criteria.some((c) => c.weight && c.weight > 0);
    let score: number | undefined;

    if (hasWeights) {
      const totalWeight = criteria.reduce((sum, c) => sum + (c.weight || 0), 0);
      const weightedSum = criteria.reduce((sum, c) => {
        return sum + c.complianceMargin * (c.weight || 0);
      }, 0);
      score = totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    return {
      approved: criticalFailures === 0,
      score,
      criticalFailures,
      averageCompliance,
    };
  }

  /**
   * Calcula el margen de cumplimiento para un criterio
   * @param actualValue Valor medido/obtenido
   * @param requiredValue Valor requerido
   * @returns Porcentaje de cumplimiento (puede ser mayor a 100% si supera el requerimiento)
   */
  calculateComplianceMargin(
    actualValue: number,
    requiredValue: number,
  ): number {
    if (requiredValue === 0) return 100; // Evitar división por cero
    return (actualValue / requiredValue) * 100;
  }

  /**
   * Determina si un criterio individual está aprobado
   * @param actualValue Valor medido
   * @param requiredValue Valor requerido
   * @param comparisonOperator Operador de comparación ('min', 'max', 'range')
   * @param maxValue Valor máximo (solo para comparación de rango)
   * @returns Verdadero si cumple con los requisitos
   */
  isCriteriaApproved(
    actualValue: number,
    requiredValue: number,
    comparisonOperator: 'min' | 'max' | 'range' = 'min',
    maxValue?: number,
  ): boolean {
    switch (comparisonOperator) {
      case 'min':
        return actualValue >= requiredValue;
      case 'max':
        return actualValue <= requiredValue;
      case 'range':
        if (maxValue === undefined) {
          throw new Error('maxValue is required for range comparison');
        }
        return actualValue >= requiredValue && actualValue <= maxValue;
      default:
        throw new Error(`Invalid comparison operator: ${comparisonOperator}`);
    }
  }
}
