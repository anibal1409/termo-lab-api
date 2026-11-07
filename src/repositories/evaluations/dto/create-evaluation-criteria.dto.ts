import {
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * @description DTO para creación de criterios de evaluación
 * @class CreateEvaluationCriteriaDto
 */
export class CreateEvaluationCriteriaDto {
  @ApiProperty({
    description: 'Nombre descriptivo del parámetro evaluado',
    example: 'Retención de petróleo',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description:
      'Explicación detallada del criterio y metodología de evaluación',
    example:
      'Tiempo mínimo requerido: 60 minutos según norma API-12L sección 4.5',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Valor de referencia según normativa aplicable',
    example: 60.0,
  })
  @IsNumber()
  @Min(0)
  requiredValue: number;

  @ApiProperty({
    description: 'Valor real obtenido durante la evaluación',
    example: 62.5,
  })
  @IsNumber()
  actualValue: number;

  @ApiPropertyOptional({
    description: 'Calculado en servidor si se omite',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  approved?: boolean;

  @ApiPropertyOptional({
    description: 'Calculado en servidor si se omite',
    example: 104.17,
  })
  @IsNumber()
  @Min(0)
  @Max(200)
  @IsOptional()
  complianceMargin?: number;

  @ApiPropertyOptional({
    description:
      'Si es verdadero, el incumplimiento de este criterio rechaza automáticamente la evaluación',
    example: true,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isCritical?: boolean;

  @ApiPropertyOptional({
    description: 'Ponderación del criterio en la evaluación global (1-100)',
    example: 30,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo permitido (si aplica)',
    example: 120,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxValue?: number;

  @ApiPropertyOptional({
    description: 'Operador de comparación del criterio',
    enum: ['min', 'max', 'range'],
    example: 'min',
  })
  @IsIn(['min', 'max', 'range'])
  @IsOptional()
  comparisonOperator?: 'min' | 'max' | 'range';

  @ApiPropertyOptional({
    description: 'Unidad de medida del valor',
    example: 'minutos',
    maxLength: 20,
  })
  @IsString()
  @IsOptional()
  unit?: string;
}
