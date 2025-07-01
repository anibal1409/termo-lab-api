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
import { EvaluationTemplate } from './evaluation-template.entity';

/**
 * @description Criterios que componen una plantilla de evaluación
 */
@Entity('evaluation_template_criteria')
export class EvaluationTemplateCriteria extends IdEntity {
  @ApiProperty({
    description: 'Plantilla a la que pertenece este criterio',
    type: () => EvaluationTemplate,
  })
  @ManyToOne(() => EvaluationTemplate, (template) => template.criteria)
  template: EvaluationTemplate;

  @ApiProperty({
    description: 'Nombre técnico del criterio',
    example: 'Tiempo de retención de petróleo',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({
    description: 'Descripción detallada del criterio',
    example:
      'El tiempo mínimo de retención debe ser de 60 minutos según API-12L sección 4.5',
  })
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Valor mínimo requerido',
    example: 60,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  minValue: number;

  @ApiPropertyOptional({
    description: 'Valor máximo permitido (si aplica)',
    example: 120,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxValue?: number;

  @ApiProperty({
    description: 'Unidad de medida del criterio',
    example: 'minutos',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @ApiProperty({
    description: 'Indica si es un criterio crítico para la aprobación',
    example: true,
  })
  @Column({ type: 'boolean' })
  isCritical: boolean;

  @ApiProperty({
    description: 'Peso del criterio en la evaluación general (1-100)',
    example: 30,
    minimum: 1,
    maximum: 100
  })
  @Column('int')
  weight: number;
}
