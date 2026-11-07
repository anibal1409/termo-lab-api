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
import { ChannelType } from '../control';

const double = { type: 'double precision' as const };

/** Un Arduino conectado por USB a la máquina de la API. */
@Entity('devices')
export class Device extends IdEntity {
  @ApiProperty({ example: 'Tratador piloto' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ example: '/dev/ttyUSB0' })
  @Column({ type: 'varchar', length: 100, unique: true })
  path: string;

  @ApiProperty({ example: 115200 })
  @Column({ type: 'int', default: 115200 })
  baudRate: number;

  @ApiProperty({ description: 'Conectar al arrancar la API', example: true })
  @Column({ default: true })
  autoConnect: boolean;

  @ApiProperty({ type: () => [DeviceChannel] })
  @OneToMany(() => DeviceChannel, (c) => c.device)
  channels: DeviceChannel[];

  /** No es columna: lo rellena el servicio con el estado del puerto. */
  @ApiPropertyOptional({ description: 'Puerto abierto ahora mismo' })
  connected?: boolean;
}

/** Lo que hay conectado en uno o varios pines: relé, sensor, servo... */
@Entity('device_channels')
export class DeviceChannel extends IdEntity {
  @ApiProperty()
  @Column()
  deviceId: number;

  @ManyToOne(() => Device, (d) => d.channels, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'deviceId' })
  device: Device;

  @ApiProperty({ example: 'Temperatura del baño' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty({ enum: ChannelType, example: ChannelType.MAX6675 })
  @Column({ type: 'varchar', length: 20 })
  type: ChannelType;

  @ApiProperty({
    description:
      'Pines. max6675: [cs,sck,so]; ds18b20: [pin,indice]; max31865: [cs,di,do,clk,hilos]; resto: [pin]',
    example: ['10', '13', '12'],
  })
  @Column({ type: 'simple-array' })
  pins: string[];

  @ApiProperty({ description: 'Pull-up interno (digital_in)', default: false })
  @Column({ default: false })
  pullup: boolean;

  @ApiPropertyOptional({ example: '°C' })
  @Column({ type: 'varchar', length: 20, nullable: true })
  unit?: string;

  @ApiProperty({ description: 'valor = crudo * factor + offset', default: 1 })
  @Column({ ...double, default: 1 })
  factor: number;

  @ApiProperty({ default: 0 })
  @Column({ ...double, default: 0 })
  offset: number;

  @ApiProperty({
    description: 'Cada cuántos ms leer (entradas). 0 = no leer automáticamente',
    default: 1000,
  })
  @Column({ type: 'int', default: 1000 })
  pollMs: number;
}

/** Historial de lecturas. Tabla sin IdEntity: es la que más crece. */
@Entity('channel_readings')
@Index(['channelId', 'at'])
export class ChannelReading {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  channelId: number;

  @ManyToOne(() => DeviceChannel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'channelId' })
  channel: DeviceChannel;

  @ApiProperty({ example: 63.5 })
  @Column(double)
  value: number;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  at: Date;
}

/** Automatización: si <source> <operator> <threshold> entonces <target> = onValue. */
@Entity('device_rules')
export class DeviceRule extends IdEntity {
  @ApiProperty({ example: 'Corte por sobretemperatura' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column()
  sourceChannelId: number;

  @ManyToOne(() => DeviceChannel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sourceChannelId' })
  sourceChannel: DeviceChannel;

  @ApiProperty({ enum: ['>', '<'], example: '>' })
  @Column({ type: 'varchar', length: 1 })
  operator: '>' | '<';

  @ApiProperty({ example: 80 })
  @Column(double)
  threshold: number;

  @ApiProperty({ description: 'Margen para desactivar', example: 2 })
  @Column({ ...double, default: 0 })
  hysteresis: number;

  @ApiProperty()
  @Column()
  targetChannelId: number;

  @ManyToOne(() => DeviceChannel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'targetChannelId' })
  targetChannel: DeviceChannel;

  @ApiProperty({ description: 'Valor al activarse', example: 0 })
  @Column(double)
  onValue: number;

  @ApiPropertyOptional({
    description: 'Valor al desactivarse (vacío = no hacer nada)',
    example: 1,
  })
  @Column({ ...double, nullable: true })
  offValue?: number | null;

  @ApiProperty({ default: true })
  @Column({ default: true })
  enabled: boolean;
}

/** Lazo PID: lee inputChannel y regula outputChannel para alcanzar setpoint. */
@Entity('pid_loops')
export class PidLoop extends IdEntity {
  @ApiProperty({ example: 'Control temperatura baño' })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column()
  inputChannelId: number;

  @ManyToOne(() => DeviceChannel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inputChannelId' })
  inputChannel: DeviceChannel;

  @ApiProperty({
    description: 'pwm, servo o digital_out (por ventana de tiempo)',
  })
  @Column()
  outputChannelId: number;

  @ManyToOne(() => DeviceChannel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outputChannelId' })
  outputChannel: DeviceChannel;

  @ApiProperty({ example: 60 })
  @Column(double)
  setpoint: number;

  @ApiProperty({ example: 10 })
  @Column({ ...double, default: 1 })
  kp: number;

  @ApiProperty({ example: 0.1 })
  @Column({ ...double, default: 0 })
  ki: number;

  @ApiProperty({ example: 0 })
  @Column({ ...double, default: 0 })
  kd: number;

  @ApiProperty({ example: 0 })
  @Column({ ...double, default: 0 })
  outMin: number;

  @ApiProperty({ example: 255 })
  @Column({ ...double, default: 255 })
  outMax: number;

  @ApiProperty({
    description: 'Ventana (ms) para salidas digitales on/off',
    default: 10000,
  })
  @Column({ type: 'int', default: 10000 })
  windowMs: number;

  @ApiProperty({ default: false })
  @Column({ default: false })
  enabled: boolean;
}

/** Registro de comandos de escritura: quién, qué y qué respondió el Arduino. */
@Entity('device_command_logs')
export class DeviceCommandLog {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  deviceId: number;

  @ApiPropertyOptional()
  @Column({ nullable: true })
  channelId?: number;

  @ApiPropertyOptional({ description: 'null si lo ejecutó una regla' })
  @Column({ nullable: true })
  userId?: number;

  @ApiProperty({ enum: ['manual', 'rule'] })
  @Column({ type: 'varchar', length: 10 })
  source: 'manual' | 'rule';

  @ApiProperty({ example: 'WRITE 7 1' })
  @Column({ type: 'varchar', length: 60 })
  command: string;

  @ApiProperty({ example: 'OK' })
  @Column({ type: 'varchar', length: 100 })
  response: string;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamptz' })
  at: Date;
}

export const DEVICE_ENTITIES = [
  Device,
  DeviceChannel,
  ChannelReading,
  DeviceRule,
  PidLoop,
  DeviceCommandLog,
];
