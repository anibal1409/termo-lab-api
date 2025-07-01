import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  EvaluationCriteriaResponseDto,
} from './evaluation-criteria-response.dto';
import {
  ExternalTreatmentResponseDto,
} from './external-treatment-response.dto';

/**
 * @description DTO para respuesta de evaluaciones
 * @class EvaluationResponseDto
 */
export class EvaluationResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único de la evaluación',
  })
  id: number;

  @ApiPropertyOptional({
    type: Number,
    description: 'ID del tratamiento relacionado (solo para tipo internal)',
    example: 1,
  })
  treatmentId?: number;

  @ApiPropertyOptional({
    type: ExternalTreatmentResponseDto,
    description: 'Datos de tratador externo (solo para tipo external)',
  })
  externalTreatment?: ExternalTreatmentResponseDto;

  @ApiProperty({
    enum: ['internal', 'external'],
    example: 'internal',
    description: 'Tipo de evaluación',
  })
  evaluationType: string;

  @ApiProperty({
    example: '2023-10-27T10:30:00Z',
    description: 'Fecha de evaluación',
  })
  evaluationDate: string;

  @ApiProperty({
    example: true,
    description: 'Resultado de evaluación',
  })
  approved: boolean;

  @ApiPropertyOptional({
    example: 'Cumple con los requisitos',
    description: 'Comentarios adicionales',
  })
  comments?: string;

  @ApiProperty({
    type: [EvaluationCriteriaResponseDto],
    description: 'Criterios evaluados',
  })
  criteria: EvaluationCriteriaResponseDto[];

  @ApiProperty({
    example: '2023-10-27T10:00:00Z',
    description: 'Fecha de creación',
  })
  createdAt: string;

  @ApiProperty({
    example: '2023-10-27T10:30:00Z',
    description: 'Fecha de última actualización',
  })
  updatedAt: string;

  constructor(data: Partial<EvaluationResponseDto>) {
    this.id = data.id || 0;
    this.treatmentId = data.treatmentId;
    this.evaluationType = data.evaluationType || '';
    this.evaluationDate = data.evaluationDate || '';
    this.approved = data.approved || false;
    this.comments = data.comments;
    this.createdAt = data.createdAt || '';
    this.updatedAt = data.updatedAt || '';

    this.criteria = data.criteria
      ? data.criteria.map((c) => new EvaluationCriteriaResponseDto(c))
      : [];

    this.externalTreatment = data.externalTreatment
      ? new ExternalTreatmentResponseDto(data.externalTreatment)
      : undefined;
  }
}
