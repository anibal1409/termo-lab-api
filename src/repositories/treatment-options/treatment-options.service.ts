import {
  FindManyOptions,
  Raw,
  Repository,
} from 'typeorm';

import { Injectable } from '@nestjs/common/decorators';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';

import {
  PaginationDto,
  QueryBaseDto,
} from '../../common/pagination/dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { normalizeText } from '../../common/utlis/string.utils';
import {
  CreateTreatmentOptionDto,
  TreatmentOptionListDto,
  TreatmentOptionResponseDto,
  UpdateTreatmentOptionDto,
} from './dto';
import { TreatmentOption } from './entities/treatment-option.entity';

/**
 * Servicio responsable de la lógica de negocio para la entidad TreatmentOption.
 * Implementa operaciones CRUD para configuraciones estándar de tratadores térmicos.
 * Sigue el mismo patrón que TestService pero adaptado a TreatmentOption.
 */
@Injectable()
export class TreatmentOptionService implements CrudRepository<TreatmentOption> {
  constructor(
    @InjectRepository(TreatmentOption)
    private readonly treatmentOptionRepository: Repository<TreatmentOption>,
  ) {}

  /**
   * Crea una nueva opción de tratamiento en la base de datos.
   * @param createTreatmentOptionDto Datos para crear la opción de tratamiento
   * @returns Promise<TreatmentOptionResponseDto> La opción creada como DTO de respuesta
   */
  async create(
    createTreatmentOptionDto: CreateTreatmentOptionDto,
  ): Promise<TreatmentOptionResponseDto> {
    const newOption = this.treatmentOptionRepository.create(
      createTreatmentOptionDto,
    );
    const createdOption = await this.treatmentOptionRepository.save(newOption);
    return new TreatmentOptionResponseDto(createdOption);
  }

  /**
   * Obtiene todas las opciones de tratamiento no eliminadas (método interno)
   * @returns Promise<TreatmentOption[]> Lista de entidades TreatmentOption
   */
  async findAll(): Promise<TreatmentOptionResponseDto[]> {
    const treatmentOptions = await this.treatmentOptionRepository.find({ 
      where: { deleted: false },
    });

    return treatmentOptions.map(
      (option) => new TreatmentOptionResponseDto(option),
    );
  }

  /**
   * Obtiene opciones de tratamiento paginadas y filtradas
   * @param query Parámetros de paginación y filtrado
   * @returns Promise<PaginationDto<TreatmentOptionListDto>> Resultados paginados
   */
  async findPaginated(
    query: QueryBaseDto,
  ): Promise<PaginationDto<TreatmentOptionListDto>> {
    const {
      term,
      page = 1,
      size = 10,
      sort = 'createdAt',
      order = 'DESC',
    } = query;

    const findOptions: FindManyOptions<TreatmentOption> = {
      where: { deleted: false },
      take: size,
      skip: (page - 1) * size,
      order: { [sort]: order },
    };

    if (term) {
      const normalizedTerm = normalizeText(term);
      findOptions.where = {
        ...findOptions.where,
        type: Raw(
          (alias) => `unaccent(LOWER(${alias})) LIKE unaccent(LOWER(:value))`,
          {
            value: `%${normalizedTerm}%`,
          },
        ),
      };
    }

    const [options, total] =
      await this.treatmentOptionRepository.findAndCount(findOptions);
    const optionDtos = options.map(
      (option) => new TreatmentOptionListDto(option),
    );

    return pagination(page, size, optionDtos, total);
  }

  /**
   * Busca una opción de tratamiento válida por ID
   * @param id ID de la opción (number o string)
   * @returns Promise<TreatmentOption> La entidad encontrada
   * @throws NotFoundException Si no se encuentra o está eliminada
   */
  async findValid(id: number | string): Promise<TreatmentOption> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      throw new NotFoundException(
        `ID de opción de tratamiento inválido: ${id}`,
      );
    }

    const option = await this.treatmentOptionRepository.findOne({
      where: { id: numericId, deleted: false },
    });

    if (!option) {
      throw new NotFoundException(
        `Opción de tratamiento con ID ${id} no encontrada o no válida.`,
      );
    }

    return option;
  }

  /**
   * Obtiene una opción de tratamiento por ID como DTO de respuesta
   * @param id ID de la opción
   * @returns Promise<TreatmentOptionResponseDto> La opción como DTO de respuesta
   */
  async findOne(id: number): Promise<TreatmentOptionResponseDto> {
    const option = await this.findValid(id);
    return new TreatmentOptionResponseDto(option);
  }

  /**
   * Actualiza una opción de tratamiento existente
   * @param id ID de la opción a actualizar
   * @param updateTreatmentOptionDto Datos de actualización
   * @returns Promise<TreatmentOptionResponseDto> La opción actualizada como DTO
   */
  async update(
    id: number,
    updateTreatmentOptionDto: UpdateTreatmentOptionDto,
  ): Promise<TreatmentOptionResponseDto> {
    const optionToUpdate = await this.findValid(id);
    Object.assign(optionToUpdate, updateTreatmentOptionDto);
    const updatedOption =
      await this.treatmentOptionRepository.save(optionToUpdate);
    return new TreatmentOptionResponseDto(updatedOption);
  }

  /**
   * Elimina lógicamente una opción de tratamiento
   * @param id ID de la opción a eliminar
   * @returns Promise<{ message: string }> Mensaje de confirmación
   */
  async remove(id: number): Promise<{ message: string }> {
    const optionToDelete = await this.findValid(id);
    optionToDelete.deleted = true;
    await this.treatmentOptionRepository.save(optionToDelete);
    return {
      message: `Opción de tratamiento con ID ${id} marcada como eliminada.`,
    };
  }

  /**
   * Busca opciones de tratamiento por tipo (vertical/horizontal)
   * @param type Tipo de tratador (vertical/horizontal)
   * @returns Promise<TreatmentOption[]> Lista de opciones filtradas por tipo
   */
  async findByType(type: string): Promise<TreatmentOption[]> {
    return this.treatmentOptionRepository.find({
      where: {
        type,
        deleted: false,
      },
    });
  }

  /**
   * Busca la mejor opción de diseño basada en parámetros técnicos
   * @param heatRequired BTU/hr requeridos
   * @param volumeRequired Volumen de retención requerido (bbl)
   * @returns Promise<TreatmentOption | null> La mejor opción o null si no hay coincidencia
   */
  async findBestOption(
    heatRequired: number,
    volumeRequired: number,
  ): Promise<TreatmentOption | null> {
    return this.treatmentOptionRepository
      .createQueryBuilder('option')
      .where('option.minHeatCapacity >= :heat', { heat: heatRequired })
      .andWhere('option.deleted = false')
      .orderBy('option.minHeatCapacity', 'ASC')
      .addOrderBy('option.diameter', 'ASC')
      .getOne();
  }
}
