import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../../auth/decorators';
import { JwtAuthGuard } from '../../../auth/guards';
import { PaginationDto } from '../../../common/pagination/dto';
import { User } from '../../users/entities/user.entity';
import { CreateExternalTreatmentDto, QueryEvaluationDto } from '../dto';
import { CreateEvaluationDto } from '../dto/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/evaluation-response.dto';
import { EvaluationTemplateResponseDto } from '../dto/evaluation-template-response.dto';
import { UpdateEvaluationDto } from '../dto/update-evaluation.dto';
import { EvaluationsService } from '../services/evaluations.service';

/**
 * @description Controlador para operaciones CRUD de evaluaciones
 * @ApiTags Evaluations
 * @ApiBearerAuth
 */
@ApiTags('Evaluations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  /**
   * @description Crea una nueva evaluación
   * @ApiOperation Crear evaluación
   * @ApiResponse 201 - Evaluación creada exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   * @ApiResponse 401 - No autorizado
   */
  @Post()
  @ApiOperation({ summary: 'Crear una nueva evaluación' })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  create(
    @Body() createEvaluationDto: CreateEvaluationDto,
    @CurrentUser() user: User,
  ) {
    return this.evaluationsService.createEvaluation(createEvaluationDto, user);
  }

  /**
   * @description Obtiene todas las evaluaciones del usuario actual
   * @ApiOperation Listar evaluaciones del usuario actual
   * @ApiResponse 200 - Lista de evaluaciones del usuario obtenida
   * @ApiResponse 401 - No autorizado
   */
  @Get('all')
  @ApiOperation({ summary: 'Obtener todas las evaluaciones del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones del usuario obtenida',
    type: [EvaluationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@CurrentUser() user: User) {
    return this.evaluationsService.findAll(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener evaluaciones paginadas del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones paginadas del usuario',
    type: PaginationDto<EvaluationResponseDto>,
  })
  async findPaginated(
    @Query() query: QueryEvaluationDto,
    @CurrentUser() user: User,
  ) {
    return this.evaluationsService.findPaginated(query, user.id);
  }

  /**
   * @description Obtiene una evaluación por ID del usuario actual
   * @ApiOperation Obtener evaluación por ID del usuario actual
   * @ApiResponse 200 - Evaluación encontrada
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada o no pertenece al usuario actual
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener evaluación por ID del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación encontrada',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada o no pertenece al usuario actual' })
  findOne(@Param('id') id: number, @CurrentUser() user: User) {
    return this.evaluationsService.getEvaluationById(+id, user.id);
  }

  /**
   * @description Actualiza una evaluación existente del usuario actual
   * @ApiOperation Actualizar evaluación del usuario actual
   * @ApiResponse 200 - Evaluación actualizada
   * @ApiResponse 400 - Datos de entrada inválidos
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada o no pertenece al usuario actual
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evaluación existente del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación actualizada',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada o no pertenece al usuario actual' })
  update(
    @Param('id') id: number,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
    @CurrentUser() user: User,
  ) {
    return this.evaluationsService.update(+id, updateEvaluationDto, user.id);
  }

  /**
   * @description Elimina una evaluación del usuario actual
   * @ApiOperation Eliminar evaluación del usuario actual
   * @ApiResponse 200 - Evaluación eliminada
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada o no pertenece al usuario actual
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evaluación del usuario actual' })
  @ApiResponse({ status: 200, description: 'Evaluación eliminada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada o no pertenece al usuario actual' })
  remove(@Param('id') id: number, @CurrentUser() user: User) {
    return this.evaluationsService.remove(+id, user.id);
  }

  /**
   * @description Calcula el resultado de una evaluación del usuario actual
   * @ApiOperation Calcular resultado de evaluación del usuario actual
   * @ApiResponse 200 - Resultado calculado
   * @ApiResponse 400 - Evaluación sin criterios
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada o no pertenece al usuario actual
   */
  @Post(':id/calculate')
  @ApiOperation({ summary: 'Calcular resultado de evaluación del usuario actual' })
  @ApiResponse({
    status: 200,
    description: 'Resultado calculado',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Evaluación sin criterios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada o no pertenece al usuario actual' })
  calculateResult(@Param('id') id: number, @CurrentUser() user: User) {
    return this.evaluationsService.calculateEvaluationResult(+id, user.id);
  }

  /**
   * @description Obtiene todas las plantillas activas
   * @ApiOperation Obtener plantillas activas
   * @ApiResponse 200 - Lista de plantillas activas
   * @ApiResponse 401 - No autorizado
   */
  @Get('templates/active')
  @ApiOperation({ summary: 'Obtener todas las plantillas activas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de plantillas activas',
    type: [EvaluationTemplateResponseDto],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getActiveTemplates() {
    return this.evaluationsService.getActiveTemplates();
  }

  /**
   * @description Obtiene una plantilla con sus criterios
   * @ApiOperation Obtener plantilla por ID
   * @ApiResponse 200 - Plantilla encontrada
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Plantilla no encontrada
   */
  @Get('templates/:id')
  @ApiOperation({ summary: 'Obtener plantilla por ID con criterios' })
  @ApiResponse({
    status: 200,
    description: 'Plantilla encontrada',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  getTemplateById(@Param('id') id: number) {
    return this.evaluationsService.getTemplateById(+id);
  }

  /**
   * @description Crea evaluación desde plantilla
   * @ApiOperation Crear evaluación desde plantilla
   * @ApiResponse 201 - Evaluación creada exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Plantilla no encontrada
   */
  @Post('from-template/:templateId')
  @ApiOperation({ summary: 'Crear evaluación desde plantilla' })
  @ApiResponse({
    status: 201,
    description: 'Evaluación creada exitosamente',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Plantilla no encontrada' })
  createFromTemplate(
    @Param('templateId') templateId: string,
    @Body()
    treatmentData: {
      id?: number;
      externalTreatment?: CreateExternalTreatmentDto;
    },
    @CurrentUser() user: User,
  ) {
    return this.evaluationsService.createFromTemplate(
      +templateId,
      treatmentData,
      user,
    );
  }
}
