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
 * Entidad que representa un tratamiento en el sistema.
 * Hereda de IdEntity para incluir campos comunes como id, createdAt, etc.
 */
@Entity('treatments')
export class Treatment extends IdEntity {
  @ApiProperty({
    description: 'Nombre del tratamiento',
    example: 'Tratamiento de crudo',
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({
    description: 'Descripción del tratamiento',
    example: 'Tratamiento para crudo pesado',
    required: false,
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Tipo de tratamiento',
    example: 'Deshidratación',
  })
  @Column({ type: 'varchar', length: 100 })
  type: string;

  @ApiProperty({ description: 'Flujo total (bpd)', example: 5000 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalFlow: number;

  @ApiProperty({ description: 'Fracción de agua', example: 0.3 })
  @Column('decimal', { precision: 10, scale: 2 })
  waterFraction: number;

  @ApiProperty({ description: 'Temperatura de entrada (°F)', example: 120 })
  @Column('decimal', { precision: 10, scale: 2 })
  inputTemperature: number;

  @ApiProperty({ description: 'Temperatura de tratamiento (°F)', example: 180 })
  @Column('decimal', { precision: 10, scale: 2 })
  treatmentTemperature: number;

  @ApiProperty({
    description: 'Tiempo de retención de aceite (min)',
    example: 30,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  oilRetentionTime: number;

  @ApiProperty({
    description: 'Tiempo de retención de agua (min)',
    example: 20,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  waterRetentionTime: number;

  @ApiProperty({ description: 'Velocidad del viento (mph)', example: 10 })
  @Column('decimal', { precision: 10, scale: 2 })
  windSpeed: number;

  @ApiProperty({ description: 'Gravedad API del crudo', example: 32 })
  @Column('decimal', { precision: 10, scale: 2 })
  apiGravity: number;

  @ApiProperty({
    description: 'Flujo de aceite calculado (bpd)',
    example: 3500,
  })
  @Column('decimal', { precision: 10, scale: 2, name: 'calculated_oil_flow' })
  calculatedOilFlow: number;

  @ApiProperty({ description: 'Flujo de agua calculado (bpd)', example: 1500 })
  @Column('decimal', { precision: 10, scale: 2, name: 'calculated_water_flow' })
  calculatedWaterFlow: number;

  @ApiProperty({
    description: 'Volumen de retención de aceite (bbl)',
    example: 500,
  })
  @Column('decimal', { precision: 10, scale: 2, name: 'oil_retention_volume' })
  oilRetentionVolume: number;

  @ApiProperty({
    description: 'Volumen de retención de agua (bbl)',
    example: 300,
  })
  @Column('decimal', {
    precision: 10,
    scale: 2,
    name: 'water_retention_volume',
  })
  waterRetentionVolume: number;

  @ApiProperty({ description: 'Calor requerido (BTU/hr)', example: 1500000 })
  @Column('decimal', { precision: 10, scale: 2 })
  requiredHeat: number;

  @ApiProperty({ description: 'Pérdida de calor (BTU/hr)', example: 150000 })
  @Column('decimal', { precision: 10, scale: 2 })
  heatLoss: number;

  @ApiProperty({ description: 'Calor total (BTU/hr)', example: 1650000 })
  @Column('decimal', { precision: 10, scale: 2 })
  totalHeat: number;

  @ApiProperty({ description: 'Diámetro seleccionado (pulg)', example: 48 })
  @Column('decimal', { precision: 10, scale: 2 })
  selectedDiameter: number;

  @ApiProperty({ description: 'Longitud seleccionada (pies)', example: 20 })
  @Column('decimal', { precision: 10, scale: 2 })
  selectedLength: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdBy: User;
}
