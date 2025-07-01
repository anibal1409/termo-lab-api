import {
  Column,
  Entity,
  ManyToOne,
} from 'typeorm';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { IdEntity } from '../../base';
import { Evaluation } from './evaluation.entity';

/**
 * @description Entidad para los criterios específicos de evaluación de tratadores.
 * Registra los detalles técnicos de cada parámetro evaluado en un tratador térmico.
 */
@Entity('evaluation_criteria')
export class EvaluationCriteria extends IdEntity {
  /**
   * @description Evaluación padre a la que pertenece este criterio
   */
  @ApiProperty({
    description: 'Evaluación relacionada a la que pertenece este criterio',
    type: () => Evaluation,
    example: {
      id: 1,
      evaluationType: 'internal',
      evaluationDate: '2023-10-27T10:30:00Z',
    },
  })
  @ManyToOne(() => Evaluation, (evaluation) => evaluation.criteria)
  evaluation: Evaluation;

  /**
   * @description Nombre técnico del criterio evaluado
   */
  @ApiProperty({
    description: 'Nombre descriptivo del parámetro evaluado',
    example: 'Tiempo de retención de petróleo',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /**
   * @description Descripción técnica del criterio
   */
  @ApiProperty({
    description:
      'Explicación detallada del criterio y metodología de evaluación',
    example:
      'Tiempo mínimo requerido: 60 minutos según norma API-12L sección 4.5',
  })
  @Column({ type: 'text' })
  description: string;

  /**
   * @description Valor requerido por estándar
   */
  @ApiProperty({
    description: 'Valor de referencia según normativa aplicable',
    example: 60.0,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  requiredValue: number;

  /**
   * @description Valor medido/calculado
   */
  @ApiProperty({
    description: 'Valor real obtenido durante la evaluación',
    example: 62.5,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  actualValue: number;

  /**
   * @description Cumplimiento del criterio
   */
  @ApiProperty({
    description: 'Indica si el valor actual cumple con el requerimiento',
    example: true,
  })
  @Column({ type: 'boolean' })
  approved: boolean;

  /**
   * @description Margen de cumplimiento
   */
  @ApiProperty({
    description:
      'Porcentaje de cumplimiento respecto al valor requerido (100% = cumplimiento exacto)',
    example: 104.17,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  complianceMargin: number;

  /**
   * @description Indica si es crítico para la aprobación
   */
  @ApiPropertyOptional({
    description:
      'Si es verdadero, el incumplimiento de este criterio rechaza automáticamente la evaluación',
    example: true,
    default: false,
  })
  @Column({ type: 'boolean', default: false })
  isCritical?: boolean;

  /**
   * @description Peso en el cálculo final
   */
  @ApiPropertyOptional({
    description: 'Ponderación del criterio en la evaluación global (1-100)',
    example: 30,
    minimum: 1,
    maximum: 100,
    default: 1
  })
  @Column({ type: 'int', default: 1 })
  weight?: number;

  @Column({ nullable: true })
  @ApiPropertyOptional({
    example: 'minutos',
    description: 'Unidad de medida del criterio',
    required: false,
  })
  unit?: string;

  @Column({ type: 'decimal', nullable: true })
  @ApiPropertyOptional({
    example: 120,
    description: 'Valor máximo permitido (si aplica)',
    required: false,
  })
  maxValue?: number;
}
