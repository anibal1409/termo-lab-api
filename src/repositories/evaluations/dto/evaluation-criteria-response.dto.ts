import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

/**
 * @description DTO para respuesta de criterios de evaluación
 * @class EvaluationCriteriaResponseDto
 */
export class EvaluationCriteriaResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único del criterio',
  })
  id: number;

  @ApiProperty({
    example: 'Retención de petróleo',
    description: 'Nombre del criterio evaluado',
  })
  name: string;

  @ApiProperty({
    example: 'Tiempo mínimo requerido: 60 minutos',
    description: 'Descripción técnica del criterio',
  })
  description: string;

  @ApiProperty({
    example: 60,
    description: 'Valor requerido por normativa',
  })
  requiredValue: number;

  @ApiProperty({
    example: 62.5,
    description: 'Valor real obtenido en evaluación',
  })
  actualValue: number;

  @ApiProperty({
    example: true,
    description: 'Indica si cumple con el requerimiento',
  })
  approved: boolean;

  @ApiProperty({
    example: 104.17,
    description: 'Porcentaje de cumplimiento (100% = exacto)',
  })
  complianceMargin: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Si es crítico para aprobación global',
  })
  isCritical?: boolean;

  @ApiPropertyOptional({
    example: 30,
    description: 'Peso en evaluación global (1-100)',
  })
  weight?: number;

  @ApiPropertyOptional({
    example: 120,
    description: 'Valor máximo permitido (si aplica)',
  })
  maxValue?: number;

  @ApiPropertyOptional({
    example: 'minutos',
    description: 'Unidad de medida del valor',
  })
  unit?: string;

  constructor(data: Partial<EvaluationCriteriaResponseDto>) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
    this.requiredValue = data.requiredValue || 0;
    this.actualValue = data.actualValue || 0;
    this.approved = data.approved || false;
    this.complianceMargin = data.complianceMargin || 0;
    this.isCritical = data.isCritical;
    this.weight = data.weight;
    this.maxValue = data.maxValue;
    this.unit = data.unit;
  }
}
