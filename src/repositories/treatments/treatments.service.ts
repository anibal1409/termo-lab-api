import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { pagination } from '../../common/pagination/pagination';
import { CrudRepository } from '../../common/use-case';
import { normalizeText } from '../../common/utlis/string.utils';
import { TreatmentOption } from '../treatment-options/entities/treatment-option.entity';
import { User } from '../users/entities/user.entity';
import { CalculateTreatmentDto, TreatmentCalculationsDto } from './dto';
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
  ) {}

  /**
   * Busca un tratamiento válido por su ID
   * @param id - ID del tratamiento (número o string)
   * @param userId - ID del usuario actual (opcional, si se proporciona valida que el tratamiento pertenezca al usuario)
   * @returns Tratamiento encontrado
   * @throws NotFoundException si el tratamiento no existe, está eliminado o no pertenece al usuario
   */
  async findValid(id: number | string, userId?: number): Promise<Treatment> {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (isNaN(numericId)) {
      throw new NotFoundException(`ID de tratamiento inválido: ${id}`);
    }

    const whereCondition: any = { id: numericId, deleted: false };
    if (userId !== undefined) {
      whereCondition.createdBy = { id: userId };
    }

    const treatment = await this.treatmentRepository.findOne({
      where: whereCondition,
      relations: ['createdBy'],
    });

    if (!treatment) {
      const message =
        userId !== undefined
          ? `Tratamiento con ID ${id} no encontrado, no válido o no pertenece al usuario actual`
          : `Tratamiento con ID ${id} no encontrado o no válido`;
      throw new NotFoundException(message);
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
    const responseDto = new TreatmentResponseDto(savedTreatment);

    return responseDto;
  }

  /**
   * Obtiene todos los tratamientos activos del usuario actual
   * @param userId - ID del usuario actual
   * @returns Lista de tratamientos del usuario convertidos a DTO
   */
  async findAll(userId: number): Promise<TreatmentResponseDto[]> {
    const treatments = await this.treatmentRepository.find({
      where: { createdBy: { id: userId }, deleted: false },
      relations: ['createdBy'],
    });
    return treatments.map((treatment) => new TreatmentResponseDto(treatment));
  }

  /**
   * Obtiene tratamientos paginados con filtros avanzados del usuario actual
   * @param query - Parámetros de paginación y filtrado
   * @param userId - ID del usuario actual
   * @returns Objeto con datos paginados y metadatos
   */
  async findPaginated(
    query: QueryTreatmentDto,
    userId: number,
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
      minCreatedAt,
      maxCreatedAt,
    } = query;

    const queryBuilder = this.treatmentRepository
      .createQueryBuilder('treatment')
      .leftJoinAndSelect('treatment.createdBy', 'createdBy')
      .where('treatment.deleted = :deleted', { deleted })
      .andWhere('createdBy.id = :userId', { userId });

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
    // Nota: createdById se ignora ya que siempre filtramos por el usuario actual
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
   * Obtiene un tratamiento por su ID del usuario actual
   * @param id - ID del tratamiento
   * @param userId - ID del usuario actual
   * @returns Tratamiento encontrado convertido a DTO
   * @throws NotFoundException si el tratamiento no existe, está eliminado o no pertenece al usuario
   */
  async findOne(id: number, userId: number): Promise<TreatmentResponseDto> {
    const treatment = await this.findValid(id, userId);
    return new TreatmentResponseDto(treatment);
  }

  /**
   * Actualiza un tratamiento existente del usuario actual
   * @param id - ID del tratamiento a actualizar
   * @param updateTreatmentDto - Datos a actualizar
   * @param userId - ID del usuario actual
   * @returns Tratamiento actualizado convertido a DTO
   * @throws NotFoundException si el tratamiento no existe, está eliminado o no pertenece al usuario
   */
  async update(
    id: number,
    updateTreatmentDto: UpdateTreatmentDto,
    userId: number,
  ): Promise<TreatmentResponseDto> {
    const treatment = await this.findValid(id, userId);
    const updatedTreatment = await this.treatmentRepository.save({
      ...treatment,
      ...updateTreatmentDto,
    });
    return new TreatmentResponseDto(updatedTreatment);
  }

  /**
   * Elimina lógicamente un tratamiento del usuario actual
   * @param id - ID del tratamiento a eliminar
   * @param userId - ID del usuario actual
   * @returns Mensaje de confirmación
   * @throws NotFoundException si el tratamiento no existe, ya está eliminado o no pertenece al usuario
   */
  async remove(id: number, userId: number): Promise<{ message: string }> {
    const treatment = await this.findValid(id, userId);
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
  /**
   * Calcula parámetros de tratamiento según fórmulas API-12L
   * @param data - Datos de entrada para el cálculo
   * @returns Resultados completos del cálculo según API-12L
   */
  async calculateParameters(
    data: CalculateTreatmentDto,
  ): Promise<TreatmentCalculationsDto> {
    // 1. Calcular flujos según API-12L
    const oilFlow = this.calculateOilFlow(data);
    const waterFlow = this.calculateWaterFlow(data);

    // 2. Calcular volúmenes de retención según API-12L
    const retentionVolumes = this.calculateRetentionVolumes(data);
    const oilRetentionVolume = retentionVolumes.oilRetentionVolume;
    const waterRetentionVolume = retentionVolumes.waterRetentionVolume;

    // 3. Calcular calor requerido según API-12L
    const requiredHeat = this.calculateRequiredHeat(data);

    // 4. Buscar tratadores candidatos
    const candidateTreaters = await this.findSuitableTreaters(
      requiredHeat,
      oilRetentionVolume,
      waterRetentionVolume,
    );

    // 5. Para cada candidato, calcular pérdidas de calor y seleccionar el mejor
    let bestTreater = null;
    let minTotalHeat = 0;
    let heatLoss = 0;

    if (candidateTreaters.length > 0) {
      minTotalHeat = Infinity;
      for (let i = 0; i < candidateTreaters.length; i++) {
        const treater = candidateTreaters[i];
        heatLoss = this.calculateHeatLoss(
          data,
          treater.diameter,
          treater.length,
        );
        const totalHeat = requiredHeat + heatLoss; // Qtotal = Q + Qpérdida según API-12L

        if (totalHeat < minTotalHeat) {
          minTotalHeat = totalHeat;
          bestTreater = { ...treater, totalHeat, heatLoss };
        }
      }
    } else {
      // Si no hay tratadores candidatos, usar valores por defecto
      minTotalHeat = requiredHeat;
      heatLoss = 0;
    }

    // 6. Calcular tiempo de residencia estimado
    const maxRetentionVolume = Math.max(
      oilRetentionVolume,
      waterRetentionVolume,
    );
    const estimatedResidenceTime = (maxRetentionVolume * 1440) / data.totalFlow;

    // 7. Validar cumplimiento API-12L
    const complianceResult = this.validateAPI12LCompliance({
      oilFlow,
      waterFlow,
      oilRetentionVolume,
      waterRetentionVolume,
      estimatedResidenceTime,
      requiredHeat,
      apiGravity: data.apiGravity,
    });

    // 8. Preparar respuesta
    const result: TreatmentCalculationsDto = {
      calculatedOilFlow: oilFlow,
      calculatedWaterFlow: waterFlow,
      oilRetentionVolume,
      waterRetentionVolume,
      requiredHeatCapacity: requiredHeat,
      heatLoss: bestTreater?.heatLoss || heatLoss,
      totalHeat: minTotalHeat,
      recommendedDiameter: bestTreater?.diameter || 0,
      recommendedLength: bestTreater?.length || 0,
      recommendedPressure: bestTreater?.designPressure || 0,
      recommendedTreaters: (candidateTreaters || []).map(
        (t) =>
          `Tratador ${t.type} ${t.diameter}ft - LSS ${t.length} - ${t.minHeatCapacity} BTU/hr`,
      ),
      requiredRetentionVolume: maxRetentionVolume,
      estimatedResidenceTime,
      api12lCompliance: complianceResult.compliant,
      complianceWarnings: complianceResult.warnings,
      separationEfficiency: this.calculateSeparationEfficiency(
        estimatedResidenceTime,
        oilRetentionVolume,
        waterRetentionVolume,
      ),
    };

    return result;
  }

  /**
   * Calcula flujo de petróleo según API-12L: Wo = W × (100 - X) / 100
   */
  private calculateOilFlow(data: CalculateTreatmentDto): number {
    return (data.totalFlow * (100 - data.waterFraction)) / 100;
  }

  /**
   * Calcula flujo de agua según API-12L: Ww = W × X / 100
   */
  private calculateWaterFlow(data: CalculateTreatmentDto): number {
    return (data.totalFlow * data.waterFraction) / 100;
  }

  /**
   * Calcula volúmenes de retención según API-12L
   * Vp = Wo × (to / 1440) - Volumen retención petróleo
   * Vw = Ww × (tw / 1440) - Volumen retención agua
   */
  private calculateRetentionVolumes(data: CalculateTreatmentDto): {
    oilRetentionVolume: number;
    waterRetentionVolume: number;
  } {
    const oilFlow = this.calculateOilFlow(data);
    const waterFlow = this.calculateWaterFlow(data);

    // Vp = Wo × (to / 1440) - Volumen retención petróleo
    const oilRetentionVolume = oilFlow * (data.oilRetentionTime / 1440);

    // Vw = Ww × (tw / 1440) - Volumen retención agua
    const waterRetentionVolume = waterFlow * (data.waterRetentionTime / 1440);

    return { oilRetentionVolume, waterRetentionVolume };
  }

  /**
   * Calcula calor requerido según API-12L usando flujos másicos y calores específicos
   * Q = (Wo × Cpo + Ww × Cpw) × (T2 - T1)
   * Donde:
   * - Wo = flujo másico del crudo (lb/h)
   * - Ww = flujo másico del agua (lb/h)
   * - Cpo = calor específico del crudo (BTU/(lb·°F))
   * - Cpw = calor específico del agua (BTU/(lb·°F))
   */
  private calculateRequiredHeat(data: CalculateTreatmentDto): number {
    // Calcular flujos másicos
    const oilFlow = this.calculateOilFlow(data);
    const waterFlow = this.calculateWaterFlow(data);

    // Calcular gravedad específica del crudo
    const oilSpecificGravity = 141.5 / (data.apiGravity + 131.5);

    // Calcular calores específicos según API-12L
    const oilSpecificHeat = this.calculateOilSpecificHeat(
      oilSpecificGravity,
      data.inletTemperature,
    );
    const waterSpecificHeat = this.calculateWaterSpecificHeat(
      data.inletTemperature,
    );

    // Calcular flujos másicos (Ecuaciones 1.20, 1.21)
    const oilMassFlow = 14.58 * oilFlow * oilSpecificGravity; // lb/h
    const waterMassFlow = 14.58 * waterFlow * 1.0; // lb/h (gravedad específica del agua = 1.0)

    // Calcular calor requerido
    const deltaT = data.targetTemperature - data.inletTemperature;
    return (
      (oilMassFlow * oilSpecificHeat + waterMassFlow * waterSpecificHeat) *
      deltaT
    );
  }

  /**
   * Calcula calor específico del crudo según API-12L (Ecuación 1.33)
   * Cpo = (0.388 + 0.00045 × T) / √GE
   */
  private calculateOilSpecificHeat(
    specificGravity: number,
    temperature: number,
  ): number {
    return (0.388 + 0.00045 * temperature) / Math.sqrt(specificGravity);
  }

  /**
   * Calcula calor específico del agua según API-12L (Ecuación 1.34)
   * Cpw = 1.0 - 0.000117 × (T - 60)
   */
  private calculateWaterSpecificHeat(temperature: number): number {
    return 1.0 - 0.000117 * (temperature - 60);
  }

  /**
   * Calcula pérdidas de calor según API-12L: Qpérdida = K × D × L × (T2 - T3)
   */
  private calculateHeatLoss(
    data: CalculateTreatmentDto,
    diameter: number,
    length: number,
  ): number {
    const K = this.getWindConstant(data.windSpeed);

    return (
      K * diameter * length * (data.targetTemperature - data.ambientTemperature)
    );
  }

  /**
   * Obtiene constante K según velocidad del viento (API-12L)
   */
  private getWindConstant(windSpeed: number): number {
    if (windSpeed <= 5) return 8.5;
    if (windSpeed <= 10) return 10.2;
    if (windSpeed <= 15) return 13.2;
    if (windSpeed <= 20) return 16.8;
    return 21.0; // > 20 mph
  }

  /**
   * Calcula volumen interno del tratador en bbl
   */
  private calculateInternalVolume(diameter: number, length: number): number {
    // V = π × (D/2)² × L × 0.1781 (conversión a bbl)
    return Math.PI * Math.pow(diameter / 2, 2) * length * 0.1781;
  }

  /**
   * Busca tratadores adecuados según API-12L
   */
  private async findSuitableTreaters(
    heatRequired: number,
    oilRetentionVolume: number,
    waterRetentionVolume: number,
  ): Promise<TreatmentOption[]> {
    const maxRetentionVolume = Math.max(
      oilRetentionVolume,
      waterRetentionVolume,
    );

    if (!this.treatmentOptionRepository) {
      throw new Error('treatmentOptionRepository no está disponible');
    }

    // Redondear heatRequired a entero porque minHeatCapacity es int en la BD
    // Usamos Math.ceil() para redondear hacia arriba (mejor tener margen de seguridad)
    const heatRequiredInt = Math.ceil(heatRequired);

    const queryBuilder = this.treatmentOptionRepository
      .createQueryBuilder('option')
      .where('option.minHeatCapacity >= :heat', { heat: heatRequiredInt })
      .andWhere('option.deleted = false')
      .orderBy('option.minHeatCapacity', 'ASC')
      .addOrderBy('option.diameter', 'ASC');

    const candidates = await queryBuilder.getMany();

    if (candidates.length === 0) {
      return [];
    }

    // Filtrar por volumen interno
    const filtered = candidates.filter((option) => {
      try {
        const internalVolume = this.calculateInternalVolume(
          option.diameter,
          option.length,
        );
        return internalVolume >= maxRetentionVolume;
      } catch {
        return false;
      }
    });

    return filtered;
  }

  /**
   * Valida el cumplimiento con la norma API-12L
   */
  private validateAPI12LCompliance(data: {
    oilFlow: number;
    waterFlow: number;
    oilRetentionVolume: number;
    waterRetentionVolume: number;
    estimatedResidenceTime: number;
    requiredHeat: number;
    apiGravity: number;
  }): {
    compliant: boolean;
    warnings: string[];
  } {
    const warnings: string[] = [];
    let compliant = true;

    // Validar tiempo de retención mínimo (60 minutos)
    if (data.estimatedResidenceTime < 60) {
      warnings.push(
        `Tiempo de retención insuficiente: ${data.estimatedResidenceTime.toFixed(1)} min < 60 min requeridos`,
      );
      compliant = false;
    }

    // Validar gravedad API (entre 10 y 50)
    if (data.apiGravity < 10 || data.apiGravity > 50) {
      warnings.push(
        `Gravedad API fuera de rango: ${data.apiGravity}°API (debe estar entre 10 y 50)`,
      );
      compliant = false;
    }

    // Validar relación agua/crudo (máximo 50%)
    const waterFraction =
      (data.waterFlow / (data.oilFlow + data.waterFlow)) * 100;
    if (waterFraction > 50) {
      warnings.push(
        `Fracción de agua excesiva: ${waterFraction.toFixed(1)}% > 50% máximo`,
      );
      compliant = false;
    }

    // Validar volumen de retención mínimo
    const minRetentionVolume = Math.max(
      data.oilRetentionVolume,
      data.waterRetentionVolume,
    );
    if (minRetentionVolume < 10) {
      // 10 bbl mínimo
      warnings.push(
        `Volumen de retención insuficiente: ${minRetentionVolume.toFixed(1)} bbl < 10 bbl mínimo`,
      );
      compliant = false;
    }

    return { compliant, warnings };
  }

  /**
   * Calcula la eficiencia de separación
   */
  private calculateSeparationEfficiency(
    residenceTime: number,
    oilVolume: number,
    waterVolume: number,
  ): number {
    // Eficiencia basada en tiempo de retención y volúmenes
    const timeFactor = Math.min(residenceTime / 60, 1.0); // Normalizar a 60 min
    const volumeFactor = Math.min((oilVolume + waterVolume) / 20, 1.0); // Normalizar a 20 bbl

    return timeFactor * volumeFactor * 100;
  }
}
