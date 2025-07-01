import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { IdEntity } from '../../base';
import {
  EvaluationTemplateCriteria,
} from './evaluation-template-criteria.entity';

/**
 * @description Entidad para plantillas de evaluación de tratadores.
 * Permite definir conjuntos estándar de criterios que pueden ser reutilizados
 * en múltiples evaluaciones.
 */
@Entity('evaluation_templates')
export class EvaluationTemplate extends IdEntity {
  @ApiProperty({
    description: 'Nombre descriptivo de la plantilla',
    example: 'Evaluación API-12L para tratadores horizontales',
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del propósito de la plantilla',
    example:
      'Plantilla estándar según norma API-12L para tratadores horizontales con capacidad hasta 1000 bpd',
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Versión de la plantilla',
    example: '1.0.0',
    maxLength: 20,
  })
  @Column({ type: 'varchar', length: 20 })
  version: string;

  @ApiProperty({
    description: 'Tipo de tratador al que aplica',
    enum: ['vertical', 'horizontal', 'ambos'],
    example: 'horizontal',
  })
  @Column({ type: 'varchar', length: 20 })
  applicableTo: string;

  @ApiProperty({
    description: 'Indica si la plantilla está activa para uso',
    example: true,
    default: true,
  })
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Criterios asociados a esta plantilla',
    type: () => [EvaluationTemplateCriteria],
  })
  @OneToMany(
    () => EvaluationTemplateCriteria,
    (criteria) => criteria.template,
    { cascade: true },
  )
  criteria: EvaluationTemplateCriteria[];
}
