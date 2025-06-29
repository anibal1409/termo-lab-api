import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import {
  BeforeInsert,
  Column,
  Entity,
} from 'typeorm';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

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
    default: () => "'temp'" // Valor temporal, se actualiza en @BeforeInsert
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

  /**
   * Genera y hashea una contraseña aleatoria antes de insertar.
   */
  @BeforeInsert()
  async generateAndHashPassword() {
    // Genera una contraseña aleatoria de 12 caracteres
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const randomPassword = randomBytes(8).toString('hex');
    this.password = await bcrypt.hash(randomPassword, saltRounds);

    // En un sistema real, aquí enviarías el email con la contraseña temporal
    // o un enlace para establecer contraseña
  }

  /**
   * Método para verificar la contraseña.
   */
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}