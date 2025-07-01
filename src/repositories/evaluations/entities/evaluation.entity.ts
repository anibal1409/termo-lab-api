import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { IdEntity } from '../../base';
import { Treatment } from '../../treatments/entities/treatment.entity';
import { User } from '../../users/entities/user.entity';
import { EvaluationCriteria } from './evaluation-criteria.entity';
import { ExternalTreatment } from './external-treatment.entity';

/**
 * @description Entidad principal para evaluaciones de tratadores térmicos.
 * Registra los resultados de las evaluaciones realizadas tanto para tratadores
 * registrados en el sistema como para tratadores externos.
 */
@Entity('evaluations')
export class Evaluation extends IdEntity {
  /**
   * @description Tratador registrado en el sistema (opcional)
   */
  @ApiPropertyOptional({
    description:
      'Tratador registrado en el sistema (solo para evaluaciones internas)',
    type: () => Treatment,
  })
  @ManyToOne(() => Treatment, { nullable: true })
  @JoinColumn({ name: 'treatment_id' })
  treatment?: Treatment;

  /**
   * @description Datos de tratador no registrado (opcional)
   */
  @ApiPropertyOptional({
    description:
      'Datos completos de tratador externo (solo para evaluaciones externas)',
    type: () => ExternalTreatment,
  })
  @ManyToOne(() => ExternalTreatment, { nullable: true })
  @JoinColumn({ name: 'external_treatment_id' })
  externalTreatment?: ExternalTreatment;

  /**
   * @description Usuario que realizó la evaluación
   */
  @ApiProperty({
    description: 'Usuario que realizó la evaluación',
    type: () => User,
  })
  @ManyToOne(() => User)
  @JoinColumn({ name: 'evaluated_by' })
  evaluatedBy: User;

  /**
   * @description Tipo de evaluación (internal/external)
   */
  @ApiProperty({
    description:
      'Tipo de evaluación (internal: tratador registrado, external: tratador externo)',
    enum: ['internal', 'external'],
    example: 'internal',
  })
  @Column({ type: 'enum', enum: ['internal', 'external'] })
  evaluationType: 'internal' | 'external';

  /**
   * @description Fecha y hora de la evaluación
   */
  @ApiProperty({
    description:
      'Fecha y hora en que se realizó la evaluación (formato ISO 8601)',
    example: '2023-10-27T10:30:00Z',
  })
  @Column({ type: 'timestamp' })
  evaluationDate: Date;

  /**
   * @description Resultado general de la evaluación
   */
  @ApiProperty({
    description: 'Indica si el tratador aprobó la evaluación general',
    example: true,
  })
  @Column({ type: 'boolean' })
  approved: boolean;

  /**
   * @description Comentarios adicionales sobre la evaluación
   */
  @ApiPropertyOptional({
    description: 'Comentarios u observaciones adicionales sobre la evaluación',
    example:
      'Cumple con los requisitos mínimos pero requiere monitoreo adicional',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ type: 'decimal', nullable: true })
  @ApiPropertyOptional({
    example: 85.5,
    description: 'Puntaje calculado de la evaluación',
    required: false,
  })
  score?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    example: '1.0.0',
    description: 'Versión de la plantilla usada (si aplica)',
    required: false,
  })
  templateVersion?: string;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    example: 'Evaluación API-12L',
    description: 'Nombre de la plantilla usada (si aplica)',
    required: false,
  })
  templateName?: string;

  /**
   * @description Lista de criterios evaluados
   */
  @ApiProperty({
    description: 'Lista detallada de todos los criterios evaluados',
    type: () => [EvaluationCriteria],
  })
  @OneToMany(() => EvaluationCriteria, (criteria) => criteria.evaluation, {
    cascade: true,
  })
  criteria: EvaluationCriteria[];
}
