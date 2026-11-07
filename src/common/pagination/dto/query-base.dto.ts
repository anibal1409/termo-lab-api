import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Data Transfer Object (DTO) base para parámetros de consulta comunes.
 * Utilizado para manejar la paginación, búsqueda, ordenamiento y filtrado
 * en endpoints que listan colecciones de recursos.
 */
export class QueryBaseDto {
  /**
   * Término de búsqueda opcional para filtrar resultados.
   * Permite buscar coincidencias en campos relevantes de la entidad.
   */
  @ApiPropertyOptional({
    description: 'Término de búsqueda opcional.',
    example: 'ejemplo', // Ejemplo de un término de búsqueda
  })
  @IsOptional() // Indica que este campo es opcional
  @IsString() // Valida que el campo sea una cadena si está presente
  term?: string;

  /**
   * Número de página para la paginación.
   * Indica qué página de resultados se desea obtener.
   * Se transforma automáticamente a número.
   */
  @ApiPropertyOptional({
    description: 'Número de página para la paginación (base 1).',
    example: 1, // Ejemplo del número de página
    type: Number, // Especifica el tipo como Number para Swagger
  })
  @Type(() => Number) // Transforma el valor de la query string a número
  @IsOptional() // Indica que este campo es opcional
  @IsNumber() // Valida que el campo sea un número si está presente
  page?: number;

  /**
   * Tamaño de la página para la paginación.
   * Indica cuántos resultados por página se desean obtener.
   * Se transforma automáticamente a número.
   */
  @ApiPropertyOptional({
    description: 'Número de elementos por página.',
    example: 10, // Ejemplo del tamaño de la página
    type: Number, // Especifica el tipo como Number para Swagger
  })
  @Type(() => Number) // Transforma el valor de la query string a número
  @IsOptional() // Indica que este campo es opcional
  @IsNumber() // Valida que el campo sea un número si está presente
  size?: number;

  /**
   * Campo por el cual ordenar los resultados.
   * Debe ser un nombre de campo válido de la entidad.
   */
  @ApiPropertyOptional({
    description: 'Campo por el cual ordenar los resultados.',
    example: 'createdAt', // Ejemplo de un campo de ordenamiento
  })
  @IsOptional() // Indica que este campo es opcional
  @IsString() // Valida que el campo sea una cadena si está presente
  sort?: string;

  /**
   * Dirección del ordenamiento.
   * Puede ser 'ASC' (ascendente) o 'DESC' (descendente).
   */
  @ApiPropertyOptional({
    description: 'Dirección del ordenamiento (ASC o DESC).',
    type: String,
    enum: ['ASC', 'DESC'], // Especifica las opciones permitidas
    example: 'DESC', // Ejemplo de la dirección
  })
  @IsOptional() // Indica que este campo es opcional
  @IsIn(['ASC', 'DESC'], {
    message: 'La dirección de ordenamiento debe ser ASC o DESC.',
  }) // Valida que el valor esté dentro del enum
  order?: 'ASC' | 'DESC';
}
