import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) para la creación de una nueva opción de tratamiento.
 * Define la estructura de los datos esperados al crear una nueva configuración estándar.
 */
export class CreateTreatmentOptionDto {
  /**
   * Tipo de tratador (vertical/horizontal)
   */
  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
  })
  @IsString({ message: 'El tipo debe ser una cadena de texto.' })
  @IsIn(['vertical', 'horizontal'], {
    message: 'El tipo debe ser "vertical" u "horizontal"',
  })
  @IsNotEmpty({ message: 'El tipo no puede estar vacío.' })
  type: string;

  /**
   * Diámetro exterior en pies
   */
  @ApiProperty({
    description: 'Diámetro exterior (ft)',
    example: 4,
  })
  @IsNumber({}, { message: 'El diámetro debe ser un número.' })
  @Min(1, { message: 'El diámetro mínimo es 1 ft.' })
  @Max(20, { message: 'El diámetro máximo es 20 ft.' })
  @IsNotEmpty({ message: 'El diámetro no puede estar vacío.' })
  diameter: number;

  /**
   * Longitud estándar en pies
   */
  @ApiProperty({
    description: 'Longitud estándar (ft)',
    example: 15,
  })
  @IsNumber({}, { message: 'La longitud debe ser un número.' })
  @Min(5, { message: 'La longitud mínima es 5 ft.' })
  @Max(40, { message: 'La longitud máxima es 40 ft.' })
  @IsNotEmpty({ message: 'La longitud no puede estar vacía.' })
  length: number;

  /**
   * Presión de diseño en psig
   */
  @ApiProperty({
    description: 'Presión de diseño (psig)',
    example: 50,
  })
  @IsNumber({}, { message: 'La presión de diseño debe ser un número.' })
  @IsNotEmpty({ message: 'La presión de diseño no puede estar vacía.' })
  designPressure: number;

  /**
   * Capacidad mínima de calor en BTU/hr
   */
  @ApiProperty({
    description: 'Capacidad mínima de calor (BTU/hr)',
    example: 250000,
  })
  @IsNumber({}, { message: 'La capacidad de calor debe ser un número.' })
  @IsNotEmpty({ message: 'La capacidad de calor no puede estar vacía.' })
  minHeatCapacity: number;

  /**
   * Notas adicionales sobre la configuración
   */
  @ApiProperty({
    description: 'Notas adicionales',
    example: 'Para crudos entre 15-25°API',
    required: false,
  })
  @IsString({ message: 'Las notas deben ser una cadena de texto.' })
  @IsOptional()
  notes?: string;
}
