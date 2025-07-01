import { Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';

import { Treatment } from '../../treatments/entities/treatment.entity';
import { User } from '../../users/entities/user.entity';
import {
  CreateEvaluationCriteriaDto,
  CreateEvaluationDto,
  CreateExternalTreatmentDto,
  UpdateEvaluationDto,
} from '../dto';
import { EvaluationResponseDto } from '../dto/evaluation-response.dto';
import {
  Evaluation,
  EvaluationCriteria,
  EvaluationTemplate,
  ExternalTreatment,
} from '../entities';
import { EvaluationCalculatorService } from './evaluation-calculator.service';

/**
 * @description Interfaz extendida para DTO de criterios con maxValue
 */
interface ExtendedCriteriaDto extends CreateEvaluationCriteriaDto {
  maxValue?: number;
}

/**
 * @description Servicio para manejar operaciones de evaluaciones
 * @ApiTags Evaluations
 */
@ApiTags('Evaluations')
@Injectable()
export class EvaluationsService {
  constructor(
    @InjectRepository(Evaluation)
    private readonly evaluationRepository: Repository<Evaluation>,
    @InjectRepository(EvaluationCriteria)
    private readonly criteriaRepository: Repository<EvaluationCriteria>,
    @InjectRepository(ExternalTreatment)
    private readonly externalTreatmentRepository: Repository<ExternalTreatment>,
    @InjectRepository(Treatment)
    private readonly treatmentRepository: Repository<Treatment>,
    @InjectRepository(EvaluationTemplate)
    private readonly templateRepository: Repository<EvaluationTemplate>,
    private readonly calculatorService: EvaluationCalculatorService,
  ) {}

  /**
   * @description Crea una nueva evaluación completa
   * @ApiOperation Crear evaluación
   * @ApiResponse 201 - Evaluación creada exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   * @ApiResponse 404 - Tratamiento no encontrado
   * @ApiResponse 500 - Error interno del servidor
   */
  @ApiOperation({ summary: 'Crear una nueva evaluación' })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Tratamiento no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async createEvaluation(
    createDto: CreateEvaluationDto,
    user: User,
  ): Promise<Evaluation> {
    try {
      const evaluation = new Evaluation();
      evaluation.evaluatedBy = user;
      evaluation.evaluationType = createDto.evaluationType;
      evaluation.evaluationDate = new Date(createDto.evaluationDate);
      evaluation.comments = createDto.comments;

      await this.handleTreatmentAssignment(createDto, evaluation);

      // Calcular aprobación basada en criterios
      const criteriaForCalculation = (
        createDto.criteria as ExtendedCriteriaDto[]
      ).map((c) => ({
        approved: this.calculatorService.isCriteriaApproved(
          c.actualValue,
          c.requiredValue,
          c.maxValue ? 'range' : 'min',
          c.maxValue,
        ),
        complianceMargin: this.calculatorService.calculateComplianceMargin(
          c.actualValue,
          c.requiredValue,
        ),
        isCritical: c.isCritical || false,
        weight: c.weight || 1,
      }));

      const calculatedApproval =
        this.calculatorService.calculateEvaluationResult(
          criteriaForCalculation,
        );

      evaluation.approved = calculatedApproval.approved;
      (evaluation as any).score = calculatedApproval.score; // Temporal hasta actualizar entidad

      const savedEvaluation = await this.evaluationRepository.save(evaluation);
      await this.saveEvaluationCriteria(createDto.criteria, savedEvaluation);

      return this.getFullEvaluation(savedEvaluation.id);
    } catch (error) {
      this.handleEvaluationError(error);
    }
  }

  /**
   * @description Crea evaluación desde plantilla
   * @ApiOperation Crear evaluación desde plantilla
   * @ApiResponse 201 - Evaluación creada exitosamente
   * @ApiResponse 400 - Plantilla inactiva o datos inválidos
   * @ApiResponse 404 - Plantilla no encontrada
   */
  @ApiOperation({ summary: 'Crear evaluación desde plantilla' })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: EvaluationResponseDto,
  })
  async createFromTemplate(
    templateId: number,
    treatmentData: {
      id?: number;
      externalTreatment?: CreateExternalTreatmentDto;
    },
    user: User,
  ): Promise<Evaluation> {
    try {
      const template = await this.getTemplateWithCriteria(templateId);
      const evaluation = await this.initializeEvaluationFromTemplate(
        template,
        user,
      );

      await this.assignTreatmentToEvaluation(treatmentData, evaluation);
      await this.evaluationRepository.save(evaluation);
      await this.createCriteriaFromTemplate(template, evaluation);

      return this.getFullEvaluation(evaluation.id);
    } catch (error) {
      this.handleEvaluationError(error);
    }
  }

  /**
   * @description Obtiene evaluación por ID
   * @ApiOperation Obtener evaluación por ID
   * @ApiResponse 200 - Evaluación encontrada
   * @ApiResponse 404 - Evaluación no encontrada
   */
  @ApiOperation({ summary: 'Obtener evaluación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación encontrada',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  async getEvaluationById(id: number): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
      relations: [
        'treatment',
        'externalTreatment',
        'criteria',
        'evaluatedBy',
        'treatment.createdBy',
      ],
    });

    if (!evaluation) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }

    return evaluation;
  }

  /**
   * @description Calcula resultado de evaluación
   * @ApiOperation Calcular resultado de evaluación
   * @ApiResponse 200 - Resultado calculado
   * @ApiResponse 400 - Evaluación sin criterios
   * @ApiResponse 404 - Evaluación no encontrada
   */
  @ApiOperation({ summary: 'Calcular resultado de evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Resultado calculado',
    type: EvaluationResponseDto,
  })
  async calculateEvaluationResult(evaluationId: number): Promise<Evaluation> {
    const evaluation = await this.getFullEvaluation(evaluationId);

    if (!evaluation.criteria || evaluation.criteria.length === 0) {
      throw new BadRequestException(
        'La evaluación no tiene criterios para calcular',
      );
    }

    // Mapear los criterios a CalculationCriteria asegurando los valores requeridos
    const calculationCriteria = evaluation.criteria.map((criteria) => ({
      approved: criteria.approved,
      complianceMargin: criteria.complianceMargin,
      isCritical: criteria.isCritical ?? false, // Valor por defecto si es undefined
      weight: criteria.weight ?? 1, // Valor por defecto si es undefined
    }));

    const calculation =
      this.calculatorService.calculateEvaluationResult(calculationCriteria);

    evaluation.approved = calculation.approved;
    evaluation.score = calculation.score;

    return this.evaluationRepository.save(evaluation);
  }

  /**
   * @description Actualiza una evaluación existente
   * @param id ID de la evaluación a actualizar
   * @param updateDto Datos para actualizar
   * @returns Evaluación actualizada
   */
  @ApiOperation({ summary: 'Actualizar evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación actualizada exitosamente',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  async update(
    id: number,
    updateDto: UpdateEvaluationDto,
  ): Promise<Evaluation> {
    try {
      const evaluation = await this.getFullEvaluation(id);

      // Actualizar campos permitidos
      if (updateDto.comments !== undefined) {
        evaluation.comments = updateDto.comments;
      }

      if (updateDto.approved !== undefined) {
        evaluation.approved = updateDto.approved;
      }

      // Si se actualizan criterios, recalcular resultado
      if (updateDto.criteria) {
        await this.updateEvaluationCriteria(id, updateDto.criteria);
        return this.calculateEvaluationResult(id);
      }

      return this.evaluationRepository.save(evaluation);
    } catch (error) {
      this.handleEvaluationError(error);
    }
  }

  /**
   * @description Elimina una evaluación (soft delete)
   * @param id ID de la evaluación a eliminar
   * @returns Resultado de la operación
   */
  @ApiOperation({ summary: 'Eliminar evaluación' })
  @ApiResponse({ status: 200, description: 'Evaluación eliminada' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  async remove(id: number): Promise<{ affected?: number }> {
    try {
      const result = await this.evaluationRepository.softDelete(id);

      if (result.affected === 0) {
        throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
      }

      return { affected: result.affected };
    } catch (error) {
      this.handleEvaluationError(error);
    }
  }

  /**
   * @description Obtiene todas las evaluaciones
   * @returns Lista de evaluaciones
   */
  @ApiOperation({ summary: 'Obtener todas las evaluaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones obtenida',
    type: [EvaluationResponseDto],
  })
  async findAll(): Promise<Evaluation[]> {
    return this.evaluationRepository.find({
      relations: ['treatment', 'externalTreatment', 'evaluatedBy'],
      withDeleted: false,
    });
  }

  // ==================== MÉTODOS PRIVADOS ====================

  private async handleTreatmentAssignment(
    createDto: CreateEvaluationDto,
    evaluation: Evaluation,
  ): Promise<void> {
    if (createDto.evaluationType === 'internal') {
      if (!createDto.treatmentId) {
        throw new BadRequestException(
          'Se requiere ID de tratamiento para evaluaciones internas',
        );
      }
      evaluation.treatment = await this.getTreatmentById(createDto.treatmentId);
    } else {
      if (!createDto.externalTreatment) {
        throw new BadRequestException(
          'Se requieren datos de tratador externo para evaluaciones externas',
        );
      }
      evaluation.externalTreatment = await this.createExternalTreatment(
        createDto.externalTreatment,
      );
    }
  }

  private async getTreatmentById(id: number): Promise<Treatment> {
    const treatment = await this.treatmentRepository.findOneBy({ id });
    if (!treatment) {
      throw new NotFoundException(`Tratamiento con ID ${id} no encontrado`);
    }
    return treatment;
  }

  private async createExternalTreatment(
    data: CreateExternalTreatmentDto,
  ): Promise<ExternalTreatment> {
    const externalTreatment = this.externalTreatmentRepository.create(data);
    return this.externalTreatmentRepository.save(externalTreatment);
  }

  private async saveEvaluationCriteria(
    criteriaDtos: CreateEvaluationCriteriaDto[],
    evaluation: Evaluation,
  ): Promise<void> {
    if (criteriaDtos?.length > 0) {
      const criteria = (criteriaDtos as ExtendedCriteriaDto[]).map((dto) => {
        const criteria = new EvaluationCriteria();
        criteria.evaluation = evaluation;
        criteria.name = dto.name;
        criteria.description = dto.description;
        criteria.requiredValue = dto.requiredValue;
        criteria.actualValue = dto.actualValue;
        criteria.approved = this.calculatorService.isCriteriaApproved(
          dto.actualValue,
          dto.requiredValue,
          (dto as any).maxValue ? 'range' : 'min',
          (dto as any).maxValue,
        );
        criteria.complianceMargin =
          this.calculatorService.calculateComplianceMargin(
            dto.actualValue,
            dto.requiredValue,
          );
        criteria.isCritical = dto.isCritical || false;
        criteria.weight = dto.weight || 1;
        return criteria;
      });

      await this.criteriaRepository.save(criteria);
    }
  }
  private async getFullEvaluation(id: number): Promise<Evaluation> {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id },
      relations: ['treatment', 'externalTreatment', 'criteria', 'evaluatedBy'],
    });

    if (!evaluation) {
      throw new NotFoundException(`Evaluación con ID ${id} no encontrada`);
    }

    return evaluation;
  }

  private async getTemplateWithCriteria(
    templateId: number,
  ): Promise<EvaluationTemplate> {
    const template = await this.templateRepository.findOne({
      where: { id: templateId },
      relations: ['criteria'],
    });

    if (!template) {
      throw new NotFoundException(
        `Plantilla con ID ${templateId} no encontrada`,
      );
    }

    if (!template.isActive) {
      throw new BadRequestException(
        `La plantilla con ID ${templateId} no está activa`,
      );
    }

    return template;
  }

  private async initializeEvaluationFromTemplate(
    template: EvaluationTemplate,
    user: User,
  ): Promise<Evaluation> {
    const evaluation = new Evaluation();
    evaluation.evaluatedBy = user;
    evaluation.evaluationDate = new Date();
    evaluation.templateVersion = template.version;
    evaluation.templateName = template.name;
    return evaluation;
  }

  private async assignTreatmentToEvaluation(
    treatmentData: {
      id?: number;
      externalTreatment?: CreateExternalTreatmentDto;
    },
    evaluation: Evaluation,
  ): Promise<void> {
    if (treatmentData.id) {
      evaluation.treatment = await this.getTreatmentById(treatmentData.id);
      evaluation.evaluationType = 'internal';
    } else if (treatmentData.externalTreatment) {
      evaluation.externalTreatment = await this.createExternalTreatment(
        treatmentData.externalTreatment,
      );
      evaluation.evaluationType = 'external';
    } else {
      throw new BadRequestException(
        'Se requiere ID de tratamiento o datos de tratador externo',
      );
    }
  }

  private async createCriteriaFromTemplate(
    template: EvaluationTemplate,
    evaluation: Evaluation,
  ): Promise<void> {
    const criteria = template.criteria.map((tc) => {
      const criteria = new EvaluationCriteria();
      criteria.evaluation = evaluation;
      criteria.name = tc.name;
      criteria.description = tc.description;
      criteria.requiredValue = tc.minValue;
      criteria.maxValue = tc.maxValue;
      criteria.isCritical = tc.isCritical;
      criteria.weight = tc.weight;
      criteria.unit = tc.unit;
      return criteria;
    });

    await this.criteriaRepository.save(criteria);
  }

  private handleEvaluationError(error: Error): never {
    if (
      error instanceof NotFoundException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }
    console.error('Error en evaluación:', error);
    throw new InternalServerErrorException('Error al procesar la evaluación');
  }

  /**
   * @private
   * @description Actualiza los criterios de una evaluación
   */
  private async updateEvaluationCriteria(
    evaluationId: number,
    criteriaDtos: CreateEvaluationCriteriaDto[],
  ): Promise<void> {
    // Primero eliminar criterios existentes
    await this.criteriaRepository.delete({ evaluation: { id: evaluationId } });

    // Luego crear los nuevos
    const evaluation = await this.getFullEvaluation(evaluationId);
    await this.saveEvaluationCriteria(criteriaDtos, evaluation);
  }
}
