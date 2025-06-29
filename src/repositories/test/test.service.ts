import { FindManyOptions, Raw, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto, QueryBaseDto } from '../../common/pagination/dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { normalizeText } from '../../common/utlis/string.utils';
import { CreateTestDto, TestResponseDto, UpdateTestDto } from './dto';
import { Test } from './entities';

/**
 * Servicio responsable de la lógica de negocio para la entidad Test.
 * Interactúa con el repositorio de TypeORM para realizar operaciones CRUD
 * (Crear, Leer, Actualizar, Eliminar) en la tabla de Tests.
 * Implementa lógica para manejar entidades "válidas" (no eliminadas lógicamente).
 * Implementa la interfaz CrudRepository para proporcionar un contrato estándar.
 * Los métodos que devuelven entidades ahora retornan DTOs de respuesta o DTOs de paginación.
 */
@Injectable()
export class TestService implements CrudRepository<Test> {
  // Implementa la interfaz CrudRepository<Test>
  /**
   * Constructor del servicio Test.
   * Inyecta el repositorio de la entidad Test proporcionado por TypeORM.
   * @param testRepository Repositorio de la entidad Test.
   */
  constructor(
    @InjectRepository(Test) // Inyecta el repositorio de la entidad Test
    private readonly testRepository: Repository<Test>,
  ) {}

  /**
   * Crea un nuevo registro de Test en la base de datos.
   * Mapea la entidad creada a un DTO de respuesta antes de retornarla.
   * @param createTestDto El DTO con los datos para crear el Test.
   * @returns Una promesa que resuelve con el Test creado como TestResponseDto.
   */
  async create(createTestDto: CreateTestDto): Promise<TestResponseDto> {
    // Crea una nueva instancia de la entidad Test con los datos del DTO
    const newTest = this.testRepository.create(createTestDto);
    // Guarda la nueva entidad en la base de datos
    const createdTest = await this.testRepository.save(newTest);
    // Mapea la entidad creada a un DTO de respuesta
    return new TestResponseDto(createdTest);
  }

  /**
   * Obtiene todos los registros de Test "válidos" (no eliminados lógicamente) de la base de datos.
   * Este método ya no se usa directamente para la lista completa en el controlador principal,
   * en su lugar se usa findPaginated. Se mantiene por si es necesario internamente.
   * @returns Una promesa que resuelve con un array de entidades Test.
   */
  async findAll(): Promise<Test[]> {
    // Este método retorna entidades, no DTOs paginados
    // Busca todos los Tests que no estén marcados como eliminados
    return this.testRepository.find({ where: { deleted: false } });
  }

  /**
   * Obtiene registros de Test "válidos" (no eliminados lógicamente) de forma paginada.
   * Aplica filtrado por término, paginación y ordenamiento según los parámetros de consulta.
   * Mapea las entidades encontradas a DTOs de respuesta antes de retornarlas en un DTO de paginación.
   * @param query Los parámetros de consulta para paginación, búsqueda y ordenamiento.
   * @returns Una promesa que resuelve con un objeto PaginationDto<TestResponseDto>.
   */
  async findPaginated(query: QueryBaseDto): Promise<PaginationDto<TestResponseDto>> {
    const { term, page = 1, size = 10, sort = 'createdAt', order = 'DESC' } = query;

    // Configuración base para la consulta
    const findOptions: FindManyOptions<Test> = {
      where: { deleted: false },
      take: size,
      skip: (page - 1) * size,
      order: { [sort]: order },
    };

    if (term) {
      const normalizedTerm = normalizeText(term);
      findOptions.where = {
        ...findOptions.where,
        name: Raw((alias) => `unaccent(LOWER(${alias})) LIKE unaccent(LOWER(:value))`, {
          value: `%${normalizedTerm}%`,
        }),
      };
    }

    const [tests, total] = await this.testRepository.findAndCount(findOptions);
    const testResponseDtos = tests.map((test) => new TestResponseDto(test));

    return pagination(page, size, testResponseDtos, total);
  }

  /**
   * Busca una entidad Test "válida" (no eliminada lógicamente) por su ID.
   * Este método implementa el método findValid de la interfaz CrudRepository.
   * Lanza una excepción NotFoundException si el Test no se encuentra o está eliminado lógicamente.
   * @param id El ID del Test a buscar (puede ser número o cadena, aunque TypeORM espera número para PK).
   * @returns Una promesa que resuelve con la entidad Test encontrada.
   * @throws NotFoundException Si el Test con el ID dado no existe o está eliminado lógicamente.
   */
  async findValid(id: number | string): Promise<Test> {
    // Implementación del método findValid
    // Convierte el ID a número si es una cadena, ya que la PK es numérica
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    // Verifica si la conversión fue exitosa y el ID es un número válido
    if (isNaN(numericId)) {
      throw new NotFoundException(`ID de Test inválido: ${id}`);
    }

    // Busca un Test por ID y que no esté marcado como eliminado
    const test = await this.testRepository.findOne({
      where: { id: numericId, deleted: false },
    });

    // Si no se encuentra el Test (incluyendo si está eliminado lógicamente), lanza una excepción
    if (!test) {
      throw new NotFoundException(`Test con ID ${id} no encontrado o no válido.`);
    }

    return test;
  }

  /**
   * Obtiene un registro de Test específico por su ID.
   * Llama a findValid para obtener la entidad y la mapea a un DTO de respuesta.
   * @param id El ID del Test a buscar.
   * @returns Una promesa que resuelve con el Test encontrado como TestResponseDto.
   * @throws NotFoundException Si el Test no se encuentra o está eliminado lógicamente.
   */
  async findOne(id: number): Promise<TestResponseDto> {
    // Llama a findValid para obtener el Test (entidad)
    const test = await this.findValid(id);
    // Mapea la entidad a un DTO de respuesta
    return new TestResponseDto(test);
  }

  /**
   * Actualiza un registro de Test "válido" (no eliminado lógicamente) por su ID.
   * Llama a findValid para obtener la entidad, aplica las actualizaciones y mapea la entidad actualizada a un DTO de respuesta.
   * Lanza una excepción NotFoundException si el Test no se encuentra o está eliminado lógicamente.
   * @param id El ID del Test a actualizar.
   * @param updateTestDto El DTO con los datos para actualizar el Test.
   * @returns Una promesa que resuelve con el Test actualizado como TestResponseDto.
   * @throws NotFoundException Si el Test con el ID dado no existe o está eliminado lógicamente.
   */
  async update(id: number, updateTestDto: UpdateTestDto): Promise<TestResponseDto> {
    // Busca el Test existente y válido por ID utilizando findValid
    const testToUpdate = await this.findValid(id);

    // Aplica las actualizaciones del DTO a la entidad encontrada
    // Object.assign es una forma sencilla de actualizar propiedades
    Object.assign(testToUpdate, updateTestDto);

    // Guarda la entidad actualizada en la base de datos
    const updatedTest = await this.testRepository.save(testToUpdate);
    // Mapea la entidad actualizada a un DTO de respuesta
    return new TestResponseDto(updatedTest);
  }

  /**
   * Marca un registro de Test como eliminado lógicamente por su ID.
   * No elimina físicamente el registro de la base de datos.
   * Lanza una excepción NotFoundException si el Test no se encuentra o ya está eliminado lógicamente.
   * @param id El ID del Test a marcar como eliminado.
   * @returns Una promesa que resuelve con un objeto indicando el éxito de la operación.
   * @throws NotFoundException Si el Test con el ID dado no existe o ya está marcado como eliminado lógicamente.
   */
  async remove(id: number): Promise<{ message: string }> {
    // Busca el Test existente y válido por ID utilizando findValid
    const testToDelete = await this.findValid(id);

    // Marca la entidad como eliminada lógicamente
    testToDelete.deleted = true;

    // Guarda la entidad actualizada (marcada como eliminada)
    await this.testRepository.save(testToDelete);

    // Retorna un mensaje de éxito
    return { message: `Test con ID ${id} marcado como eliminado.` };
  }
}
