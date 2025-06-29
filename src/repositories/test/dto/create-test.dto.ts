import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { BaseEntityDto } from '../../base';

/**
 * Data Transfer Object (DTO) para la creación de una nueva entidad Test.
 * Define la estructura de los datos esperados en el cuerpo de una solicitud
 * al crear un nuevo registro de Test.
 */
export class CreateTestDto extends BaseEntityDto {
  /**
   * El nombre de la entidad de prueba.
   * Es un campo obligatorio y debe ser una cadena de texto
   * con una longitud máxima de 255 caracteres, según la definición de la entidad.
   */
  @ApiProperty({
    description: 'Nombre de la entidad de prueba.',
    example: 'Nueva prueba de ejemplo', // Ejemplo para la documentación de Swagger
    maxLength: 255, // Especifica la longitud máxima para la documentación
  })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' }) // Valida que el campo no esté vacío
  @IsString({ message: 'El nombre debe ser una cadena de texto.' }) // Valida que el campo sea una cadena
  @MaxLength(255, {
    message: 'El nombre no puede tener más de 255 caracteres.',
  }) // Valida la longitud máxima
  name: string;

  // No incluimos 'id', 'createdAt', 'updatedAt', 'status', 'deleted'
  // ya que son generados automáticamente o tienen valores por defecto definidos en IdEntity.
}
