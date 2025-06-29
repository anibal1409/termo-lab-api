import { ApiProperty } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) que contiene los metadatos de paginación.
 * Proporciona información sobre el estado actual de la paginación de una colección.
 */
export class PaginationDataDto {
  /**
   * El número total de elementos en la colección completa (sin paginar).
   */
  @ApiProperty({
    description: 'El número total de elementos en la colección completa.',
    example: 100, // Ejemplo del total de elementos
  })
  total!: number;

  /**
   * El número de la página actual que se está visualizando (base 1).
   */
  @ApiProperty({
    description: 'El número de la página actual (base 1).',
    example: 1, // Ejemplo del número de página actual
  })
  currentPage!: number;

  /**
   * El número de la última página disponible.
   */
  @ApiProperty({
    description: 'El número de la última página disponible.',
    example: 10, // Ejemplo del número de la última página
  })
  lastPage!: number;

  /**
   * El número de elementos por página.
   */
  @ApiProperty({
    description: 'El número de elementos por página.',
    example: 10, // Ejemplo del tamaño de la página
  })
  pageSize!: number;

  /**
   * El número total de páginas disponibles.
   * Este campo es redundante si se tiene `total` y `pageSize`, pero puede ser útil.
   */
  @ApiProperty({
    description: 'El número total de páginas disponibles.',
    example: 10, // Ejemplo del total de páginas
  })
  totalPages!: number;

  /**
   * Indica si hay una página siguiente disponible.
   */
  @ApiProperty({
    description: 'Indica si hay una página siguiente disponible.',
    example: true, // Ejemplo de valor booleano
  })
  hasNextPage!: boolean;

  /**
   * Indica si hay una página anterior disponible.
   */
  @ApiProperty({
    description: 'Indica si hay una página anterior disponible.',
    example: false, // Ejemplo de valor booleano
  })
  hasPrevPage!: boolean;
}

/**
 * Data Transfer Object (DTO) genérico para respuestas paginadas.
 * Contiene los datos de la colección paginada y los metadatos de paginación.
 * @template T El tipo de los elementos dentro del array de datos.
 */
export class PaginationDto<T> {
  /**
   * Un array que contiene los elementos de la colección para la página actual.
   * El tipo de los elementos depende del parámetro genérico T.
   */
  @ApiProperty({
    description: 'Array de elementos para la página actual.',
    // En Swagger, para arrays genéricos, a menudo se especifica el tipo de los ítems
    // Si T es una entidad o DTO específico (ej. UserDto), se usaría type: [UserDto]
    // Como es genérico, podemos indicar que es un array, y la herramienta Swagger
    // inferirá el tipo de los ítems cuando se use PaginationDto<SpecificDto>.
    type: 'array',
    items: {
      // Aquí podrías especificar el tipo de los ítems si fuera conocido,
      // por ejemplo: type: UserDto, o un tipo primitivo como type: String
      // Al ser genérico, lo dejamos flexible.
      // Puedes añadir un ejemplo de ítem si es relevante.
      // example: { id: 1, name: 'Ejemplo' } // Ejemplo de un ítem si T fuera un objeto
    },
  })
  data!: T[];

  /**
   * Objeto que contiene los metadatos de paginación.
   */
  @ApiProperty({
    description: 'Metadatos de paginación.',
    type: PaginationDataDto, // Referencia al DTO de metadatos de paginación
  })
  paginationData!: PaginationDataDto;
}
