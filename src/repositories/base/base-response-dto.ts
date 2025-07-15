import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator'; // Importar decoradores de validación si se usan en respuestas

import { ApiProperty } from '@nestjs/swagger'; // Importar ApiProperty

/**
 * @abstract
 * Data Transfer Object (DTO) base abstracto para respuestas de entidades.
 * Proporciona los campos comunes heredados de IdEntity para ser reutilizados
 * en DTOs de respuesta específicos.
 * Los DTOs de respuesta para entidades que heredan de IdEntity deben heredar de esta clase.
 */
export abstract class BaseResponseDto {
  /**
   * El identificador único de la entidad.
   */
  @ApiProperty({
    description: 'Identificador único de la entidad.',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  id: number;

  /**
   * Fecha y hora de creación del registro.
   */
  @ApiProperty({
    description: 'Fecha y hora de creación del registro.',
    example: '2023-10-27T10:00:00Z', // Ejemplo de formato ISO 8601
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  /**
   * Fecha y hora de la última actualización del registro.
   */
  @ApiProperty({
    description: 'Fecha y hora de la última actualización del registro.',
    example: '2023-10-27T10:30:00Z', // Ejemplo de formato ISO 8601
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  /**
   * Estado del registro (activo/inactivo).
   */
  @ApiProperty({
    description: 'Estado del registro (activo/inactivo).',
    example: true,
    required: false, // Aunque en la entidad tiene default, en la respuesta siempre se envía
  })
  @IsOptional() // Es opcional en la entidad, pero en la respuesta siempre se envía
  @IsBoolean()
  status?: boolean;

  /**
   * Indicador de borrado lógico.
   */
  @ApiProperty({
    description: 'Indicador de borrado lógico.',
    example: false,
    required: false, // Aunque en la entidad tiene default, en la respuesta siempre se envía
  })
  @IsOptional() // Es opcional en la entidad, pero en la respuesta siempre se envía
  @IsBoolean()
  deleted?: boolean;

  /**
   * Constructor para mapear propiedades comunes desde una entidad o objeto.
   * @param data El objeto de origen (entidad o similar) con las propiedades comunes.
   */
  constructor(data: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    status?: boolean;
    deleted?: boolean;
  }) {
    this.id = data?.id || 0;
    this.createdAt = data?.createdAt || new Date();
    this.updatedAt = data?.updatedAt || new Date();
    this.status = data?.status;
    this.deleted = data?.deleted;
  }
}
