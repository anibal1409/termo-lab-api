import { BadRequestException, Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

interface CalculationCriteria {
  approved: boolean;
  complianceMargin: number;
  isCritical?: boolean;
  weight?: number;
}

export type ComparisonOperator = 'min' | 'max' | 'range';

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

@Injectable()
export class EvaluationCalculatorService {
  calculateEvaluationResult(
    criteria: CalculationCriteria[],
  ): EvaluationCalculationResult {
    if (!criteria || criteria.length === 0) {
      throw new BadRequestException('No criteria provided for calculation');
    }

    const processedCriteria = criteria.map((c) => ({
      approved: c.approved,
      complianceMargin: c.complianceMargin,
      isCritical: c.isCritical ?? false,
      weight: c.weight ?? 1,
    }));

    const criticalCriteria = processedCriteria.filter((c) => c.isCritical);
    const criticalFailures = criticalCriteria.filter((c) => !c.approved).length;

    const totalCompliance = criteria.reduce(
      (sum, c) => sum + c.complianceMargin,
      0,
    );
    const averageCompliance = totalCompliance / criteria.length;

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

  resolveComparisonOperator(criteria: {
    comparisonOperator?: ComparisonOperator;
    requiredValue?: number;
    maxValue?: number;
  }): ComparisonOperator {
    if (criteria.comparisonOperator) {
      return criteria.comparisonOperator;
    }
    if (
      criteria.maxValue != null &&
      criteria.requiredValue != null &&
      criteria.maxValue !== criteria.requiredValue
    ) {
      return 'range';
    }
    if (
      criteria.maxValue != null &&
      (criteria.requiredValue == null ||
        criteria.maxValue === criteria.requiredValue)
    ) {
      return 'max';
    }
    return 'min';
  }

  calculateComplianceMargin(
    actualValue: number,
    requiredValue: number,
    comparisonOperator: ComparisonOperator = 'min',
  ): number {
    if (requiredValue === 0) return 100;
    if (comparisonOperator === 'max') {
      if (actualValue === 0) return 100;
      return (requiredValue / actualValue) * 100;
    }
    return (actualValue / requiredValue) * 100;
  }

  isCriteriaApproved(
    actualValue: number,
    requiredValue: number,
    comparisonOperator: ComparisonOperator = 'min',
    maxValue?: number,
  ): boolean {
    switch (comparisonOperator) {
      case 'min':
        return actualValue >= requiredValue;
      case 'max':
        return actualValue <= requiredValue;
      case 'range':
        if (maxValue === undefined) {
          throw new BadRequestException(
            'maxValue is required for range comparison',
          );
        }
        return actualValue >= requiredValue && actualValue <= maxValue;
      default:
        throw new BadRequestException(
          `Invalid comparison operator: ${comparisonOperator}`,
        );
    }
  }
}
