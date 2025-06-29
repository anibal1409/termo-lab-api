import { Column, Entity } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

import { IdEntity } from '../../base';

/**
 * Entidad de ejemplo llamada Test que hereda de la clase base IdEntity.
 * Esta clase representa una tabla en la base de datos
 * y automáticamente incluye los campos id, createdAt, updatedAt, status y deleted
 * definidos en IdEntity.
 * Se utiliza para demostrar la herencia de la clase base.
 */
@Entity('tests') // Decorador @Entity para marcar esta clase como una entidad de base de datos.
// Opcionalmente, puedes especificar el nombre de la tabla ('tests').
export class Test extends IdEntity {
  /**
   * Un campo de ejemplo para la entidad Test.
   * Representa el nombre de la prueba o cualquier otra cadena relevante.
   */
  @ApiProperty({
    description: 'Nombre de la entidad de prueba.',
    example: 'Mi primera prueba', // Ejemplo de un valor de cadena
  })
  @Column({ type: 'varchar', length: 255 }) // Decorador @Column para definir una columna en la base de datos.
  // Especifica el tipo de dato y opcionalmente la longitud.
  name: string;

  // Puedes agregar más propiedades específicas de la entidad Test aquí
  // Por ejemplo:
  // @ApiProperty({ description: 'Descripción detallada de la prueba.', required: false })
  // @Column({ type: 'text', nullable: true })
  // description?: string;
}
