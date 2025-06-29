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
 * Entidad para opciones estándar de tratamientos según API-12L.
 * Representa configuraciones predefinidas para diferentes tipos de tratadores
 * utilizados en procesos de separación y tratamiento de fluidos.
 */
@Entity('treatment_options')
export class TreatmentOption extends IdEntity {
  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
    required: true,
    maxLength: 20,
    type: String,
  })
  @Column({ type: 'varchar', length: 20, nullable: false })
  type: string;

  @ApiProperty({
    description: 'Diámetro exterior en pies (ft)',
    example: 4.0,
    minimum: 1,
    maximum: 20,
    type: Number,
    required: true,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  diameter: number;

  @ApiProperty({
    description: 'Longitud estándar en pies (ft)',
    example: 15.0,
    minimum: 5,
    maximum: 40,
    type: Number,
    required: true,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  length: number;

  @ApiProperty({
    description:
      'Presión de diseño en psig (libras por pulgada cuadrada gauge)',
    example: 50,
    minimum: 10,
    maximum: 5000,
    type: Number,
    required: true,
  })
  @Column({ type: 'int', nullable: false, name: 'design_pressure' })
  designPressure: number;

  @ApiProperty({
    description: 'Capacidad mínima de calor en BTU/hora',
    example: 250000,
    minimum: 10000,
    maximum: 5000000,
    type: Number,
    required: true,
  })
  @Column({ type: 'int', nullable: false, name: 'min_heat_capacity' })
  minHeatCapacity: number;

  @ApiPropertyOptional({
    description: 'Notas adicionales sobre la configuración del tratador',
    example: 'Recomendado para crudos entre 15-25°API en condiciones estándar',
    type: String,
    nullable: true,
  })
  @Column({ type: 'text', nullable: true })
  notes?: string;
}
