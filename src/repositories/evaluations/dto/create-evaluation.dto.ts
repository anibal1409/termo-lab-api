import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { CreateEvaluationCriteriaDto } from './create-evaluation-criteria.dto';
import { CreateExternalTreatmentDto } from './create-external-treatment.dto';

/**
 * @description DTO para creación de evaluaciones de tratadores
 * @class CreateEvaluationDto
 */
export class CreateEvaluationDto {
  @ApiProperty({
    description:
      'Tipo de evaluación (internal: tratador registrado, external: tratador externo)',
    enum: ['internal', 'external'],
    example: 'internal',
  })
  @IsEnum(['internal', 'external'])
  evaluationType: 'internal' | 'external';

  @ApiPropertyOptional({
    description:
      'ID del tratamiento registrado en el sistema (requerido para tipo internal)',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  treatmentId?: number;

  @ApiPropertyOptional({
    description:
      'Datos completos de tratador externo (requerido para tipo external)',
    type: CreateExternalTreatmentDto,
  })
  @ValidateNested()
  @Type(() => CreateExternalTreatmentDto)
  @IsOptional()
  externalTreatment?: CreateExternalTreatmentDto;

  @ApiProperty({
    description: 'Fecha y hora de la evaluación (formato ISO 8601)',
    example: '2023-10-27T10:30:00Z',
  })
  @IsDateString()
  evaluationDate: string;

  @ApiPropertyOptional({
    description:
      'Ignorado: la aprobación se calcula a partir de los criterios',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  approved?: boolean;

  @ApiPropertyOptional({
    description: 'Observaciones o comentarios sobre la evaluación',
    example:
      'Cumple con los requisitos mínimos pero requiere monitoreo adicional',
  })
  @IsString()
  @IsOptional()
  comments?: string;

  @ApiProperty({
    description: 'Criterios técnicos evaluados',
    type: [CreateEvaluationCriteriaDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEvaluationCriteriaDto)
  criteria: CreateEvaluationCriteriaDto[];

  @ApiPropertyOptional({
    description: 'ID de la plantilla utilizada (opcional)',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  templateId?: number;

  @ApiPropertyOptional({
    description:
      'Datos de cálculos térmicos realizados durante la evaluación (input, results, complianceWarnings)',
    example: {
      input: {
        diameter: 6.0,
        length: 20.0,
        totalFlow: 500,
        waterFraction: 20,
        apiGravity: 18,
      },
      results: {},
      calculatedAt: '2023-10-27T10:30:00Z',
    },
  })
  @IsOptional()
  thermalCalculations?: any;
}
