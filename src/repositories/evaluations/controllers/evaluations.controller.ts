import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
import { User } from '../../users/entities/user.entity';
import { CreateExternalTreatmentDto } from '../dto';
import { CreateEvaluationDto } from '../dto/create-evaluation.dto';
import { EvaluationResponseDto } from '../dto/evaluation-response.dto';
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
   * @description Obtiene todas las evaluaciones
   * @ApiOperation Listar evaluaciones
   * @ApiResponse 200 - Lista de evaluaciones obtenida
   * @ApiResponse 401 - No autorizado
   */
  @Get()
  @ApiOperation({ summary: 'Obtener todas las evaluaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de evaluaciones obtenida',
    type: [EvaluationResponseDto],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll() {
    return this.evaluationsService.findAll();
  }

  /**
   * @description Obtiene una evaluación por ID
   * @ApiOperation Obtener evaluación por ID
   * @ApiResponse 200 - Evaluación encontrada
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener evaluación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación encontrada',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  findOne(@Param('id') id: string) {
    return this.evaluationsService.getEvaluationById(+id);
  }

  /**
   * @description Actualiza una evaluación existente
   * @ApiOperation Actualizar evaluación
   * @ApiResponse 200 - Evaluación actualizada
   * @ApiResponse 400 - Datos de entrada inválidos
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar evaluación existente' })
  @ApiResponse({
    status: 200,
    description: 'Evaluación actualizada',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
  ) {
    return this.evaluationsService.update(+id, updateEvaluationDto);
  }

  /**
   * @description Elimina una evaluación
   * @ApiOperation Eliminar evaluación
   * @ApiResponse 200 - Evaluación eliminada
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar evaluación' })
  @ApiResponse({ status: 200, description: 'Evaluación eliminada' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  remove(@Param('id') id: string) {
    return this.evaluationsService.remove(+id);
  }

  /**
   * @description Calcula el resultado de una evaluación
   * @ApiOperation Calcular resultado de evaluación
   * @ApiResponse 200 - Resultado calculado
   * @ApiResponse 400 - Evaluación sin criterios
   * @ApiResponse 401 - No autorizado
   * @ApiResponse 404 - Evaluación no encontrada
   */
  @Post(':id/calculate')
  @ApiOperation({ summary: 'Calcular resultado de evaluación' })
  @ApiResponse({
    status: 200,
    description: 'Resultado calculado',
    type: EvaluationResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Evaluación sin criterios' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evaluación no encontrada' })
  calculateResult(@Param('id') id: string) {
    return this.evaluationsService.calculateEvaluationResult(+id);
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
