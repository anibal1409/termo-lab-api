import { Observable } from 'rxjs';

/**
 * @interface UseCase
 * Interfaz genérica que define un contrato para un "Caso de Uso" o "Operación"
 * dentro de una aplicación. Representa una acción o tarea de negocio específica.
 *
 * @template T El tipo de dato que el caso de uso devuelve (Output o Result).
 * @template D El tipo de dato que el caso de uso recibe como entrada (Input o Params).
 */
export interface UseCase<T = unknown, D = unknown> {
  /**
   * Método principal que ejecuta la lógica del caso de uso.
   *
   * @param data Los datos necesarios para ejecutar el caso de uso. Su tipo es D.
   * @returns Un Observable, una Promesa, o un valor directo de tipo T o null.
   */
  exec(data: D): Observable<T | null> | Promise<T | null> | T | null;
}
