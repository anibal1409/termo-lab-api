import { IsNotEmpty, IsNumber } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * Clase utilizada típicamente como un Data Transfer Object (DTO)
 * para representar una entidad que requiere un identificador existente
 * durante una operación de creación o asociación.
 * Contiene un campo para el ID de la entidad.
 */
export class IdCreateEntity {
  /**
   * El identificador único de la entidad existente.
   * Se espera que este ID ya exista en la base de datos
   * y se utiliza para relacionar o referenciar dicha entidad.
   * Debe ser un número, no estar vacío y es visible en la documentación de la API.
   */
  @ApiProperty({
    description: 'El identificador único de la entidad existente.',
    example: 1, // Un ejemplo de valor para la documentación
  })
  @IsNotEmpty({ message: 'El ID no puede estar vacío.' })
  @IsNumber({}, { message: 'El ID debe ser un número.' })
  id!: number;
}
