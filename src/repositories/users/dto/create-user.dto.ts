import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../entities/user.entity';

/**
 * DTO para la creación de usuarios.
 * No incluye campo de contraseña (se genera automáticamente).
 */
export class CreateUserDto {
  /**
   * Nombre completo del usuario.
   */
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'María González',
    minLength: 2,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @IsString({ message: 'El nombre debe ser una cadena de texto.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  name: string;

  /**
   * Fecha de nacimiento en formato YYYY-MM-DD.
   */
  @ApiProperty({
    description: 'Fecha de nacimiento (YYYY-MM-DD)',
    example: '1985-05-15',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida.' })
  birthDate: string;

  /**
   * Rol del usuario en el sistema.
   */
  @ApiProperty({
    description: 'Rol del usuario',
    enum: UserRole,
    example: UserRole.OPERATOR,
  })
  @IsEnum(UserRole, { message: 'El rol proporcionado no es válido.' })
  role: UserRole;

  /**
   * Correo electrónico único del usuario.
   */
  @ApiProperty({
    description: 'Correo electrónico único',
    example: 'maria.gonzalez@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email: string;
}