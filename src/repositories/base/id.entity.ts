import { Column, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { ApiProperty } from '@nestjs/swagger';

/**
 * @abstract
 * Clase base abstracta para entidades de base de datos.
 * Proporciona campos comunes para la gestión de registros,
 * incluyendo un identificador primario, fechas de creación y actualización,
 * un indicador de estado activo/inactivo y un indicador de borrado lógico.
 * Las entidades específicas de la aplicación deben heredar de esta clase.
 */
export abstract class IdEntity {
  /**
   * Columna que sirve como identificador primario de la entidad.
   * Se genera automáticamente por la base de datos.
   * Utiliza el decorador @PrimaryGeneratedColumn de TypeORM.
   */
  @ApiProperty({
    description: 'Identificador único de la entidad, generado automáticamente.',
    example: 1, // Ejemplo de un ID numérico
  })
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * Columna que almacena la fecha y hora de creación del registro.
   * Se establece automáticamente al momento de crear la entidad.
   * Utiliza el decorador @CreateDateColumn de TypeORM.
   */
  @ApiProperty({
    description: 'Fecha y hora de creación del registro.',
    example: '2023-10-27T10:00:00Z', // Ejemplo de formato ISO 8601
  })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Columna que almacena la fecha y hora de la última actualización del registro.
   * Se actualiza automáticamente cada vez que la entidad es modificada.
   * Utiliza el decorador @UpdateDateColumn de TypeORM.
   */
  @ApiProperty({
    description: 'Fecha y hora de la última actualización del registro.',
    example: '2023-10-27T10:30:00Z', // Ejemplo de formato ISO 8601
  })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Columna para indicar el estado del registro (activo/inactivo).
   * Es opcional (`nullable: true`) y por defecto es verdadero (`default: true`),
   * indicando que el registro está activo por defecto.
   * Utiliza el decorador @Column de TypeORM con opciones.
   */
  @ApiProperty({
    description: 'Estado del registro (activo/inactivo).',
    example: true, // Ejemplo de un valor booleano
    required: false, // Indica que el campo no es obligatorio en las solicitudes (aunque tiene un valor por defecto)
    default: true, // Muestra el valor por defecto en la documentación
  })
  @Column({ nullable: true, default: true })
  status?: boolean;

  /**
   * Columna para implementar borrado lógico (soft delete).
   * Indica si el registro ha sido marcado como borrado en lugar de ser eliminado físicamente.
   * Es opcional (`nullable: true`) y por defecto es falso (`default: false`),
   * indicando que el registro no está borrado por defecto.
   * Utiliza el decorador @Column de TypeORM con opciones.
   */
  @ApiProperty({
    description: 'Indicador de borrado lógico.',
    example: false, // Ejemplo de un valor booleano
    required: false, // Indica que el campo no es obligatorio
    default: false, // Muestra el valor por defecto en la documentación
  })
  @Column({ nullable: true, default: false })
  deleted?: boolean;
}
