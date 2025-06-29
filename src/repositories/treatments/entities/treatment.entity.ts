import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { IdEntity } from '../../base';
import { User } from '../../users/entities/user.entity';

/**
 * Entidad para el diseño de tratadores térmicos según norma API-12L.
 * Mantiene el nombre original 'treatments' pero con todos los campos necesarios para el diseño.
 */
@Entity('treatments')
export class Treatment extends IdEntity {
  @ApiProperty({
    description: 'Nombre del diseño del tratador',
    example: 'Tratador horizontal para crudo 18°API',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Descripción del diseño',
    example: 'Diseño para 500 bbl/día con 20% agua',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
  })
  @Column({ type: 'varchar', length: 20 })
  type: string;

  @ApiProperty({
    description: 'Flujo total de emulsión (bpd)',
    example: 500,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  totalFlow: number;

  @ApiProperty({
    description: 'Fracción de agua (%)',
    example: 20,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  waterFraction: number;

  @ApiProperty({
    description: 'Temperatura de entrada (°F)',
    example: 75,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  inputTemperature: number;

  @ApiProperty({
    description: 'Temperatura de tratamiento (°F)',
    example: 140,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  treatmentTemperature: number;

  @ApiProperty({
    description: 'Temperatura ambiente (°F)',
    example: 30,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  ambientTemperature: number;

  @ApiProperty({
    description: 'Tiempo de retención de petróleo (min)',
    example: 60,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  oilRetentionTime: number;

  @ApiProperty({
    description: 'Tiempo de retención de agua (min)',
    example: 30,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  waterRetentionTime: number;

  @ApiProperty({
    description: 'Velocidad del viento (mph)',
    example: 15,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  windSpeed: number;

  @ApiProperty({
    description: 'Gravedad API del crudo',
    example: 18,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  apiGravity: number;

  // Campos calculados
  @ApiProperty({
    description: 'Flujo de petróleo calculado (bpd)',
    example: 400,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  calculatedOilFlow: number;

  @ApiProperty({
    description: 'Flujo de agua calculado (bpd)',
    example: 100,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  calculatedWaterFlow: number;

  @ApiProperty({
    description: 'Volumen de retención de petróleo (bbl)',
    example: 16.67,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  oilRetentionVolume: number;

  @ApiProperty({
    description: 'Volumen de retención de agua (bbl)',
    example: 2.08,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  waterRetentionVolume: number;

  @ApiProperty({
    description: 'Calor requerido (BTU/hr)',
    example: 262210,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  requiredHeat: number;

  @ApiProperty({
    description: 'Pérdidas de calor (BTU/hr)',
    example: 87120,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  heatLoss: number;

  @ApiProperty({
    description: 'Calor total (BTU/hr)',
    example: 349330,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  totalHeat: number;

  @ApiProperty({
    description: 'Diámetro seleccionado (ft)',
    example: 4,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  selectedDiameter: number;

  @ApiProperty({
    description: 'Longitud seleccionada (ft)',
    example: 15,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  selectedLength: number;

  @ApiProperty({
    description: 'Presión de diseño (psig)',
    example: 50,
  })
  @Column('int')
  designPressure: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
