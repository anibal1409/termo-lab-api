import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { normalizeText } from '../../common/utlis/string.utils';
import {
  TreatmentOption,
} from '../treatment-options/entities/treatment-option.entity';
import { User } from '../users/entities/user.entity';
import {
  CalculateTreatmentDto,
  TreatmentCalculationsDto,
} from './dto';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { QueryTreatmentDto } from './dto/query-treatment.dto';
import { TreatmentResponseDto } from './dto/treatment-response.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { Treatment } from './entities/treatment.entity';

/**
 * Servicio que maneja la lógica de negocio para los tratamientos
 * Implementa CrudRepository para operaciones CRUD básicas
 *
 * @remarks
 * Este servicio proporciona métodos para:
 * - Crear, leer, actualizar y eliminar tratamientos
 * - Recuperar listados paginados y completos de tratamientos
 * - Manejar tratamientos específicos por usuario
 * - Implementar búsquedas avanzadas con múltiples filtros
 */
@Injectable()
export class TreatmentsService implements CrudRepository<Treatment> {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TreatmentOption)
    private readonly treatmentOptionRepository: Repository<TreatmentOption>,
  ) { }

  /**
   * Busca un tratamiento válido por su ID
   * @param id - ID del tratamiento (número o string)
   * @returns Tratamiento encontrado
   * @throws NotFoundException si el tratamiento no existe o está eliminado
   */
  async findValid(id: number | string): Promise<Treatment> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      throw new NotFoundException(`ID de tratamiento inválido: ${id}`);
    }

    const treatment = await this.treatmentRepository.findOne({
      where: { id: numericId, deleted: false },
      relations: ['createdBy'],
    });

    if (!treatment) {
      throw new NotFoundException(
        `Tratamiento con ID ${id} no encontrado o no válido`,
      );
    }

    return treatment;
  }

  /**
   * Crea un nuevo tratamiento en el sistema
   * @param createTreatmentDto - Datos para crear el tratamiento
   * @param userId - ID del usuario creador
   * @returns Tratamiento creado convertido a DTO
   * @throws NotFoundException si el usuario no existe
   */
  async create(
    createTreatmentDto: CreateTreatmentDto,
    userId: number,
  ): Promise<TreatmentResponseDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const treatment = this.treatmentRepository.create({
      ...createTreatmentDto,
      createdBy: user,
    });

    const savedTreatment = await this.treatmentRepository.save(treatment);
    return new TreatmentResponseDto(savedTreatment);
  }

  /**
   * Obtiene todos los tratamientos activos
   * @returns Lista de tratamientos convertidos a DTO
   */
  async findAll(): Promise<TreatmentResponseDto[]> {
    const treatments = await this.treatmentRepository.find({
      where: { deleted: false },
      relations: ['createdBy'],
    });
    return treatments.map((treatment) => new TreatmentResponseDto(treatment));
  }

  /**
   * Obtiene tratamientos paginados con filtros avanzados
   * @param query - Parámetros de paginación y filtrado
   * @returns Objeto con datos paginados y metadatos
   */
  async findPaginated(
    query: QueryTreatmentDto,
  ): Promise<PaginationDto<TreatmentResponseDto>> {
    const {
      page = 1,
      size = 10,
      term,
      order = 'DESC',
      sort = 'createdAt',
      type,
      minTotalFlow,
      maxTotalFlow,
      minWaterFraction,
      maxWaterFraction,
      minApiGravity,
      maxApiGravity,
      deleted = false,
      createdById,
      minCreatedAt,
      maxCreatedAt,
    } = query;

    const queryBuilder = this.treatmentRepository
      .createQueryBuilder('treatment')
      .leftJoinAndSelect('treatment.createdBy', 'createdBy')
      .where('treatment.deleted = :deleted', { deleted });

    if (term) {
      const normalizedTerm = normalizeText(term);
      queryBuilder.andWhere(
        '(unaccent(LOWER(treatment.name)) LIKE unaccent(LOWER(:term)) OR ' +
        'unaccent(LOWER(treatment.description)) LIKE unaccent(LOWER(:term)) OR ' +
        'unaccent(LOWER(treatment.type)) LIKE unaccent(LOWER(:term)))',
        { term: `%${normalizedTerm}%` },
      );
    }

    // Aplicar todos los filtros específicos
    if (type) queryBuilder.andWhere('treatment.type = :type', { type });
    if (minTotalFlow !== undefined)
      queryBuilder.andWhere('treatment.totalFlow >= :minTotalFlow', {
        minTotalFlow,
      });
    if (maxTotalFlow !== undefined)
      queryBuilder.andWhere('treatment.totalFlow <= :maxTotalFlow', {
        maxTotalFlow,
      });
    if (minWaterFraction !== undefined)
      queryBuilder.andWhere('treatment.waterFraction >= :minWaterFraction', {
        minWaterFraction,
      });
    if (maxWaterFraction !== undefined)
      queryBuilder.andWhere('treatment.waterFraction <= :maxWaterFraction', {
        maxWaterFraction,
      });
    if (minApiGravity !== undefined)
      queryBuilder.andWhere('treatment.apiGravity >= :minApiGravity', {
        minApiGravity,
      });
    if (maxApiGravity !== undefined)
      queryBuilder.andWhere('treatment.apiGravity <= :maxApiGravity', {
        maxApiGravity,
      });
    if (createdById)
      queryBuilder.andWhere('createdBy.id = :createdById', { createdById });
    if (minCreatedAt)
      queryBuilder.andWhere('treatment.createdAt >= :minCreatedAt', {
        minCreatedAt: new Date(minCreatedAt),
      });
    if (maxCreatedAt)
      queryBuilder.andWhere('treatment.createdAt <= :maxCreatedAt', {
        maxCreatedAt: new Date(maxCreatedAt),
      });

    if (sort && order) {
      queryBuilder.orderBy(`treatment.${sort}`, order);
    }

    const [treatments, total] = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return pagination(
      page,
      size,
      treatments.map((treatment) => new TreatmentResponseDto(treatment)),
      total,
    );
  }

  /**
   * Obtiene un tratamiento por su ID
   * @param id - ID del tratamiento
   * @returns Tratamiento encontrado convertido a DTO
   * @throws NotFoundException si el tratamiento no existe o está eliminado
   */
  async findOne(id: number): Promise<TreatmentResponseDto> {
    const treatment = await this.findValid(id);
    return new TreatmentResponseDto(treatment);
  }

  /**
   * Actualiza un tratamiento existente
   * @param id - ID del tratamiento a actualizar
   * @param updateTreatmentDto - Datos a actualizar
   * @returns Tratamiento actualizado convertido a DTO
   * @throws NotFoundException si el tratamiento no existe o está eliminado
   */
  async update(
    id: number,
    updateTreatmentDto: UpdateTreatmentDto,
  ): Promise<TreatmentResponseDto> {
    const treatment = await this.findValid(id);
    const updatedTreatment = await this.treatmentRepository.save({
      ...treatment,
      ...updateTreatmentDto,
    });
    return new TreatmentResponseDto(updatedTreatment);
  }

  /**
   * Elimina lógicamente un tratamiento
   * @param id - ID del tratamiento a eliminar
   * @returns Mensaje de confirmación
   * @throws NotFoundException si el tratamiento no existe o ya está eliminado
   */
  async remove(id: number): Promise<{ message: string }> {
    const treatment = await this.findValid(id);
    treatment.deleted = true;
    await this.treatmentRepository.save(treatment);
    return { message: 'Tratamiento eliminado correctamente' };
  }

  /**
   * Obtiene todos los tratamientos de un usuario específico
   * @param userId - ID del usuario
   * @returns Lista de tratamientos del usuario convertidos a DTO
   * @throws NotFoundException si el usuario no existe
   */
  async findAllByUser(userId: number): Promise<TreatmentResponseDto[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const treatments = await this.treatmentRepository.find({
      where: { createdBy: { id: userId }, deleted: false },
      relations: ['createdBy'],
    });

    return treatments.map((treatment) => new TreatmentResponseDto(treatment));
  }

  /**
   * Obtiene tratamientos paginados de un usuario específico
   * @param userId - ID del usuario
   * @param query - Parámetros de paginación/filtrado
   * @returns Tratamientos paginados del usuario
   * @throws NotFoundException si el usuario no existe
   */
  async findPaginatedByUser(
    userId: number,
    query: QueryTreatmentDto,
  ): Promise<PaginationDto<TreatmentResponseDto>> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const {
      page = 1,
      size = 10,
      term,
      order = 'DESC',
      sort = 'createdAt',
      // Filtros específicos
      type,
      minTotalFlow,
      maxTotalFlow,
    } = query;

    const queryBuilder = this.treatmentRepository
      .createQueryBuilder('treatment')
      .leftJoinAndSelect('treatment.createdBy', 'createdBy')
      .where('treatment.createdBy.id = :userId', { userId })
      .andWhere('treatment.deleted = :deleted', { deleted: false });

    if (term) {
      const normalizedTerm = normalizeText(term);
      queryBuilder.andWhere(
        '(unaccent(LOWER(treatment.name)) LIKE unaccent(LOWER(:term))',
        { term: `%${normalizedTerm}%` },
      );
    }

    if (type) queryBuilder.andWhere('treatment.type = :type', { type });
    if (minTotalFlow !== undefined)
      queryBuilder.andWhere('treatment.totalFlow >= :minTotalFlow', {
        minTotalFlow,
      });
    if (maxTotalFlow !== undefined)
      queryBuilder.andWhere('treatment.totalFlow <= :maxTotalFlow', {
        maxTotalFlow,
      });
    if (sort && order) queryBuilder.orderBy(`treatment.${sort}`, order);

    const [treatments, total] = await queryBuilder
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();

    return pagination(
      page,
      size,
      treatments.map((treatment) => new TreatmentResponseDto(treatment)),
      total,
    );
  }

  // Métodos adicionales requeridos por CrudRepository
  async save(entity: Treatment): Promise<Treatment> {
    return this.treatmentRepository.save(entity);
  }

  async count(): Promise<number> {
    return this.treatmentRepository.count({ where: { deleted: false } });
  }

  async delete(id: number): Promise<void> {
    await this.treatmentRepository.delete(id);
  }

  async softDelete(id: number): Promise<void> {
    await this.treatmentRepository.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.treatmentRepository.restore(id);
  }
  async calculateParameters(
    data: CalculateTreatmentDto,
  ): Promise<TreatmentCalculationsDto> {
    // 1. Calcular capacidad de calor requerida
    const heatCapacity = this.calculateHeatCapacity(data);

    // 2. Calcular volumen de retención requerido
    const retentionVolume = this.calculateRetentionVolume(data);

    // 3. Calcular tiempo de residencia
    const residenceTime = this.calculateResidenceTime(data, retentionVolume);

    // 4. Buscar tratadores adecuados
    const recommendedTreaters = await this.findSuitableTreaters(
      heatCapacity,
      retentionVolume,
    );

    return {
      requiredHeatCapacity: heatCapacity,
      requiredRetentionVolume: retentionVolume,
      estimatedResidenceTime: residenceTime,
      recommendedTreaters: recommendedTreaters.map(
        (t) => t.notes || `${t.type} ${t.diameter}ft - LSS ${t.length}`,
      ),
    };
  }

  private calculateHeatCapacity(data: CalculateTreatmentDto): number {
    // Constantes para el cálculo
    const OIL_SPECIFIC_HEAT = 0.5; // BTU/lb-°F
    const WATER_SPECIFIC_HEAT = 1.0; // BTU/lb-°F
    const OIL_DENSITY = 141.5 / (131.5 + data.apiGravity); // lb/gal

    // Convertir flujo a lb/hr
    const oilFlow =
      (data.totalFlow * (1 - data.waterFraction) * OIL_DENSITY * 24) / 24;
    const waterFlow = (data.totalFlow * data.waterFraction * 8.34 * 24) / 24;

    // Calcular capacidad de calor
    const deltaT = data.targetTemperature - data.inletTemperature;
    return (
      (oilFlow * OIL_SPECIFIC_HEAT + waterFlow * WATER_SPECIFIC_HEAT) * deltaT
    );
  }

  private calculateRetentionVolume(data: CalculateTreatmentDto): number {
    // Tiempo de residencia estándar (30-60 minutos para deshidratación)
    const STANDARD_RESIDENCE_TIME = 30; // minutos

    // Convertir a bbl (1 bbl = 42 galones)
    return (data.totalFlow * STANDARD_RESIDENCE_TIME) / (24 * 60);
  }

  private calculateResidenceTime(
    data: CalculateTreatmentDto,
    volume: number,
  ): number {
    // Tiempo en minutos = (Volumen * 42) / (Flujo / 24 / 60)
    return (volume * 42) / (data.totalFlow / 24 / 60);
  }

  private async findSuitableTreaters(
    heatRequired: number,
    volumeRequired: number,
  ): Promise<TreatmentOption[]> {
    return this.treatmentOptionRepository
      .createQueryBuilder('option')
      .where('option.minHeatCapacity >= :heat', { heat: heatRequired })
      .andWhere(
        '(PI() * POWER(option.diameter/2, 2) * option.length * 0.1781 >= :volume',
        {
          volume: volumeRequired,
        },
      )
      .andWhere('option.deleted = false')
      .orderBy('option.minHeatCapacity', 'ASC')
      .addOrderBy('option.diameter', 'ASC')
      .getMany();
  }
}
