import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

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

  @ApiProperty({
    description: 'Indica si el valor actual cumple con el requerimiento',
    example: true,
  })
  @IsBoolean()
  approved: boolean;

  @ApiProperty({
    description:
      'Porcentaje de cumplimiento respecto al valor requerido (100% = cumplimiento exacto)',
    example: 104.17,
  })
  @IsNumber()
  @Min(0)
  @Max(200)
  complianceMargin: number;

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
}
