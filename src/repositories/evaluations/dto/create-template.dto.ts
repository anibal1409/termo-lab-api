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
 * @description DTO para crear un criterio de plantilla de evaluación
 * @class CreateTemplateCriteriaDto
 */
export class CreateTemplateCriteriaDto {
  @ApiProperty({
    description: 'Nombre técnico del criterio',
    example: 'Retención de petróleo',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción técnica del criterio',
    example: 'Tiempo mínimo requerido: 60 minutos según API-12L sección 4.5',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Valor mínimo requerido para cumplir el criterio',
    example: 60,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  minValue: number;

  @ApiPropertyOptional({
    description: 'Valor máximo permitido (si aplica)',
    example: 120,
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  maxValue?: number;

  @ApiProperty({
    description: 'Unidad de medida del valor',
    example: 'minutos',
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiProperty({
    description:
      'Si es true, el criterio debe aprobarse para que la evaluación sea exitosa',
    example: true,
  })
  @IsBoolean()
  isCritical: boolean;

  @ApiProperty({
    description: 'Peso relativo del criterio en la evaluación (1-100)',
    example: 30,
    minimum: 1,
    maximum: 100,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  weight: number;
}
