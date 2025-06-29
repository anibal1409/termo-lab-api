import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base/base-response-dto';
import { Test } from '../entities';

/**
 * Data Transfer Object (DTO) para la respuesta de una entidad Test.
 * Hereda los campos comunes de BaseResponseDto.
 */
export class TestResponseDto extends BaseResponseDto {
  // Hereda de BaseResponseDto
  /**
   * Nombre de la entidad de prueba.
   */
  @ApiProperty({
    description: 'Nombre de la entidad de prueba.',
    example: 'Mi prueba',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  /**
   * Constructor para mapear una entidad Test a un TestResponseDto.
   * @param data La entidad Test de origen.
   */
  constructor(data: Test) {
    super(data); // Llama al constructor de la clase base para mapear los campos comunes
    this.name = data.name; // Mapea los campos específicos de Test
  }
}
