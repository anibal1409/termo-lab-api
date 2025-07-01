import {
  Column,
  Entity,
} from 'typeorm';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { IdEntity } from '../../base';

/**
 * @description Entidad para tratadores no registrados en el sistema.
 * Almacena todos los datos técnicos necesarios para evaluar un tratador externo.
 */
@Entity('external_treatments')
export class ExternalTreatment extends IdEntity {
  /**
   * @description Nombre identificador del tratador externo
   */
  @ApiProperty({
    description: 'Nombre o identificador del tratador externo',
    example: 'Tratador Field X-102',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * @description Tipo de tratador (vertical/horizontal)
   */
  @ApiProperty({
    description: 'Configuración física del tratador',
    enum: ['vertical', 'horizontal'],
    example: 'horizontal',
  })
  @Column({ type: 'varchar', length: 20 })
  type: string;

  /**
   * @description Flujo total de emulsión
   */
  @ApiProperty({
    description: 'Flujo total de emulsión en barriles por día (bpd)',
    example: 500,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  totalFlow: number;

  /**
   * @description Porcentaje de agua en la emulsión
   */
  @ApiPropertyOptional({
    description: 'Porcentaje de agua en la emulsión (%)',
    example: 20,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  waterFraction?: number;

  /**
   * @description Gravedad API del crudo
   */
  @ApiPropertyOptional({
    description: 'Gravedad API del crudo procesado',
    example: 18,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  apiGravity?: number;

  /**
   * @description Tiempo de retención de petróleo
   */
  @ApiPropertyOptional({
    description: 'Tiempo de retención de petróleo en minutos',
    example: 60,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  oilRetentionTime?: number;
}
