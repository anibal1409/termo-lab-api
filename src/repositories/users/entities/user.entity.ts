import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { BeforeInsert, Column, Entity } from 'typeorm';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IdEntity } from '../../base';

/**
 * Enum para los roles de usuario disponibles en el sistema.
 */
export enum UserRole {
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

/**
 * Entidad Usuario que hereda de IdEntity.
 * Representa a los usuarios del sistema con sus datos personales.
 * La contraseña se genera automáticamente al crear el usuario.
 */
@Entity('users')
export class User extends IdEntity {
  /**
   * Nombre completo del usuario.
   */
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 2,
    maxLength: 100,
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /**
   * Fecha de nacimiento del usuario.
   */
  @ApiProperty({
    description: 'Fecha de nacimiento del usuario',
    example: '1990-01-15',
  })
  @Column({ type: 'date' })
  birthDate: Date;

  /**
   * Rol del usuario en el sistema (admin o operator).
   */
  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: UserRole,
    example: UserRole.OPERATOR,
  })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OPERATOR,
  })
  role: UserRole;

  /**
   * Correo electrónico del usuario (debe ser único).
   */
  @ApiProperty({
    description: 'Correo electrónico del usuario (único)',
    example: 'usuario@example.com',
  })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  /**
   * Contraseña generada automáticamente (se almacena hasheada).
   * No se incluye en las respuestas por seguridad.
   */
  @Column({
    type: 'varchar',
    length: 255,
    select: false,
    default: () => "'temp'", // Valor temporal, se actualiza en @BeforeInsert
  })
  password: string;

  /**
   * Fecha de la última vez que el usuario inició sesión.
   */
  @ApiPropertyOptional({
    description: 'Fecha del último inicio de sesión',
    example: '2023-10-27T10:30:00Z',
  })
  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @Column({ type: 'float', array: true, nullable: true, select: false })
  faceEmbedding?: number[];

  /** Puede operar el quemador/firetube (escribir salidas, comandos, PID). */
  @ApiProperty({ description: 'Puede operar firetube / duty del quemador' })
  @Column({ type: 'boolean', default: false })
  allowFiretube: boolean;

  /** Puede descargar flight recorder / telemetría de ensayos. */
  @ApiProperty({ description: 'Puede descargar flight recorder / telemetría' })
  @Column({ type: 'boolean', default: false })
  allowFlightRecorder: boolean;

  @ApiProperty({ description: 'Exigir enrolamiento facial en el primer login' })
  @Column({ type: 'boolean', default: true })
  enrollOnFirstLogin: boolean;

  /** Derivado de faceEmbedding; se mantiene al enrolar/desenrolar para no cargar el vector. */
  @ApiProperty({ description: 'Tiene rostro enrolado' })
  @Column({ type: 'boolean', default: false })
  faceEnrolled: boolean;

  /** Tokens emitidos antes de esta fecha son inválidos (logout, cambio de contraseña). */
  @Column({ type: 'timestamptz', nullable: true, select: false })
  tokensValidAfter?: Date | null;

  /** SHA-256 del token de un solo uso para definir contraseña (alta / reenvío). */
  @Column({ type: 'varchar', length: 64, nullable: true, select: false })
  passwordTokenHash?: string | null;

  @Column({ type: 'timestamptz', nullable: true, select: false })
  passwordTokenExpires?: Date | null;

  /**
   * Genera y hashea una contraseña aleatoria antes de insertar.
   */
  @BeforeInsert()
  async handlePassword() {
    if (this.password === 'temp' || !this.password) {
      // Genera contraseña aleatoria solo si no se proporcionó una
      const randomPassword = randomBytes(8).toString('hex');
      this.password = await this.hashPassword(randomPassword);
    } else {
      // Hashea la contraseña proporcionada
      this.password = await this.hashPassword(this.password);
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Método para verificar la contraseña.
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
