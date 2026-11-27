import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IdEntity } from '../../base';

const double = { type: 'double precision' as const };

export type TrialState = 'draft' | 'running' | 'completed' | 'aborted';

@Entity('trials')
export class Trial extends IdEntity {
  @ApiProperty({ example: 'Ensayo crudo Morichal 18°API' })
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @ApiPropertyOptional({ description: 'Evaluación de diseño de referencia' })
  @Column({ nullable: true })
  evaluationId?: number;

  // ── Geometría del piloto ──────────────────────────────────

  @ApiProperty({ description: 'Diámetro del piloto (pies)', example: 0.5 })
  @Column(double)
  pilotDiameter: number;

  @ApiProperty({ description: 'Longitud del piloto (pies)', example: 2 })
  @Column(double)
  pilotLength: number;

  @ApiProperty({
    description: 'Potencia del calentador (BTU/h)',
    example: 5000,
  })
  @Column(double)
  heaterPower: number;

  // ── Estado ────────────────────────────────────────────────

  @ApiProperty({ enum: ['draft', 'running', 'completed', 'aborted'] })
  @Column({ type: 'varchar', length: 20, default: 'draft' })
  state: TrialState;

  @ApiPropertyOptional()
  @Column({ type: 'timestamptz', nullable: true })
  startedAt?: Date;

  @ApiPropertyOptional()
  @Column({ type: 'timestamptz', nullable: true })
  endedAt?: Date;

  @ApiPropertyOptional()
  @Column({ type: 'text', nullable: true })
  notes?: string;

  // ── Calibración (Fase 4) ──────────────────────────────────

  @ApiPropertyOptional({ description: 'Eficiencia del calentador calibrada' })
  @Column({ ...double, nullable: true })
  calibratedEta?: number;

  @ApiPropertyOptional({
    description: 'Coef. de pérdida de calor calibrado (BTU/h·°F)',
  })
  @Column({ ...double, nullable: true })
  calibratedUA?: number;

  @ApiPropertyOptional({ description: 'RMSE de la calibración (°F)' })
  @Column({ ...double, nullable: true })
  calibrationRmse?: number;

  @OneToMany(() => TrialSample, (s) => s.trial)
  samples: TrialSample[];
}

@Entity('trial_samples')
@Index(['trialId', 'at'])
export class TrialSample {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  trialId: number;

  @ManyToOne(() => Trial, (t) => t.samples, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'trialId' })
  trial: Trial;

  @ApiProperty({ example: 'BSW salida' })
  @Column({ type: 'varchar', length: 100 })
  label: string;

  @ApiProperty({ example: 1.8 })
  @Column(double)
  value: number;

  @ApiPropertyOptional({ example: '%' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  unit?: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  at: Date;

  @ApiPropertyOptional({ description: 'Usuario que registró la muestra' })
  @Column({ type: 'integer', nullable: true })
  createdById?: number;
}

export const TRIAL_ENTITIES = [Trial, TrialSample];
