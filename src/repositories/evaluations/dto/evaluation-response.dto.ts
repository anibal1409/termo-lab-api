import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import {
  TreatmentResponseDto,
} from '../../treatments/dto/treatment-response.dto';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { User } from '../../users/entities';
import { Evaluation } from '../entities';
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
    description: 'Usuario que realizó la evaluación',
    type: UserResponseDto,
  })
  evaluatedBy: UserResponseDto;

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
    example: 'Evaluación API-12L',
    description: 'Nombre de la plantilla utilizada',
  })
  templateName: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'Versión de la plantilla utilizada',
  })
  templateVersion: string;

  @ApiPropertyOptional({
    example: 85.5,
    description: 'Puntaje calculado de la evaluación',
  })
  score?: number;

  @ApiPropertyOptional({
    description: 'Tratamiento relacionado (solo para tipo internal)',
    type: TreatmentResponseDto,
  })
  treatment?: TreatmentResponseDto;

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

  constructor(data: Partial<Evaluation> & { evaluatedBy?: User }) {
    this.id = data.id || 0;
    this.treatmentId = data.treatment?.id;
    this.evaluationType = data.evaluationType || '';
    this.evaluationDate = data.evaluationDate?.toISOString() || '';
    this.approved = data.approved || false;
    this.comments = data.comments;
    this.templateName = data.templateName || '';
    this.templateVersion = data.templateVersion || '';
    this.score = data.score;
    this.createdAt = data.createdAt?.toISOString() || '';
    this.updatedAt = data.updatedAt?.toISOString() || '';

    // Manejar evaluatedBy de forma segura
    this.evaluatedBy = data.evaluatedBy
      ? new UserResponseDto(data.evaluatedBy)
      : new UserResponseDto({} as User); // O proporciona un objeto User vacío

    // Manejar criteria de forma segura
    this.criteria = (data.criteria || []).map(
      (c) => new EvaluationCriteriaResponseDto(c)
    );

    // Manejar externalTreatment de forma segura
    this.externalTreatment = data.externalTreatment
      ? new ExternalTreatmentResponseDto(data.externalTreatment)
      : undefined;

    // Manejar treatment de forma segura
    this.treatment = data.treatment
      ? new TreatmentResponseDto(data.treatment)
      : undefined;
  }
}
