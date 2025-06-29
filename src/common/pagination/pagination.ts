import { PaginationDto } from './dto/pagination.dto';

/**
 * Función utilitaria genérica para calcular los metadatos de paginación y estructurar la respuesta.
 * @template T El tipo de los elementos individuales dentro del array de datos paginados.
 * @param page El número de la página actual solicitada por el cliente (generalmente base 1).
 * @param size El número de elementos que deben incluirse en cada página.
 * @param data El array de elementos de la entidad (de tipo T) correspondiente a la página actual.
 * @param total El número total de elementos disponibles en la colección completa.
 * @returns Un objeto PaginationDto<T> con los datos paginados y los metadatos de paginación.
 */
export function pagination<T>(page: number, size: number, data: T[], total: number): PaginationDto<T> {
  const currentPage = page;
  const lastPage = Math.ceil(total / size);
  const hasNextPage = currentPage < lastPage;
  const hasPrevPage = currentPage > 1;
  const totalPages = lastPage; // totalPages es lo mismo que lastPage en esta implementación
  const pageSize = size;

  return {
    data, // Los datos de la página actual
    paginationData: {
      // Los metadatos de paginación calculados
      total,
      currentPage,
      lastPage,
      pageSize,
      totalPages,
      hasNextPage,
      hasPrevPage,
    },
  };
}
