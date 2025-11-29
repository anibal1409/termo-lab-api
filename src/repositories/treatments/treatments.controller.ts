import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser, Public } from '../../auth/decorators';
import { User } from '../users/entities/user.entity';

import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { QueryBaseDto } from '../../common/pagination/dto/query-base.dto';
import { QueryTreatmentDto, TreatmentCalculationsDto } from './dto';
import { CalculateTreatmentDto } from './dto/calculate-treatment.dto';
import { CreateTreatmentDto } from './dto/create-treatment.dto';
import { TreatmentResponseDto } from './dto/treatment-response.dto';
import { UpdateTreatmentDto } from './dto/update-treatment.dto';
import { CalculateTreatmentValidationPipe } from './pipes';
import { TreatmentsService } from './treatments.service';

/**
 * Controlador para gestionar operaciones CRUD de tratamientos
 *
 * @ApiTags - Agrupa los endpoints en Swagger bajo el tag 'Treatments'
 */
@ApiTags('Treatments')
@Controller('treatments')
export class TreatmentsController {
  constructor(private readonly treatmentsService: TreatmentsService) {}

  /**
   * Endpoint para crear un nuevo tratamiento
   */
  @Post()
  @ApiOperation({ summary: 'Crear un nuevo tratamiento' })
  @ApiBody({
    type: CreateTreatmentDto,
    description: 'Datos requeridos para crear un tratamiento',
  })
  @ApiCreatedResponse({
    description: 'Tratamiento creado exitosamente',
    type: TreatmentResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  async create(
    @Body() createTreatmentDto: CreateTreatmentDto,
    @CurrentUser() user: User,
  ): Promise<TreatmentResponseDto> {
    return this.treatmentsService.create(createTreatmentDto, user.id);
  }

  @Public() // ✅ Endpoint público - No requiere autenticación para cálculos
  @Post('calculate')
  @ApiOperation({
    summary: 'Calcular parámetros de tratamiento',
    description:
      'Calcula los requerimientos técnicos para un tratamiento térmico basado en parámetros de flujo y composición',
  })
  @ApiBody({
    type: CalculateTreatmentDto,
    description: 'Datos de entrada para cálculo de tratamiento',
  })
  @ApiOkResponse({
    description: 'Resultados del cálculo técnico',
    type: TreatmentCalculationsDto,
  })
  @ApiBadRequestResponse({
    description: 'Datos de entrada inválidos o fuera de rango',
  })
  async calculate(
    @Body(new CalculateTreatmentValidationPipe()) data: CalculateTreatmentDto,
  ): Promise<TreatmentCalculationsDto> {
    return this.treatmentsService.calculateParameters(data);
  }

  /**
   * Endpoint para obtener todos los tratamientos activos del usuario actual
   */
  @Get('all')
  @ApiOperation({ summary: 'Obtener todos los tratamientos activos del usuario actual' })
  @ApiOkResponse({
    description: 'Lista de tratamientos activos del usuario',
    type: [TreatmentResponseDto],
  })
  async findAll(@CurrentUser() user: User): Promise<TreatmentResponseDto[]> {
    return this.treatmentsService.findAll(user.id);
  }

  /**
   * Endpoint para obtener tratamientos paginados del usuario actual
   */
  @Get()
  @ApiOperation({ summary: 'Obtener tratamientos paginados del usuario actual' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Número de página',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Límite de resultados por página',
    example: 10,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Texto para búsqueda',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    description: 'Dirección de ordenamiento (ASC/DESC)',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    description: 'Campo por el cual ordenar',
  })
  @ApiOkResponse({
    description: 'Tratamientos paginados del usuario',
    type: PaginationDto<TreatmentResponseDto>,
  })
  async findPaginated(
    @Query() query: QueryBaseDto,
    @CurrentUser() user: User,
  ): Promise<PaginationDto<TreatmentResponseDto>> {
    return this.treatmentsService.findPaginated(query, user.id);
  }

  /**
   * Endpoint para obtener un tratamiento por ID del usuario actual
   */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un tratamiento por ID del usuario actual' })
  @ApiParam({
    name: 'id',
    description: 'ID del tratamiento',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Tratamiento encontrado',
    type: TreatmentResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Tratamiento no encontrado o no pertenece al usuario actual' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<TreatmentResponseDto> {
    return this.treatmentsService.findOne(id, user.id);
  }

  /**
   * Obtiene todos los tratamientos de un usuario específico
   */
  @Get('user/:userId/all')
  @ApiOperation({ summary: 'Obtener todos los tratamientos de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Lista de tratamientos del usuario',
    type: [TreatmentResponseDto],
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findAllByUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<TreatmentResponseDto[]> {
    return this.treatmentsService.findAllByUser(userId);
  }

  /**
   * Obtiene tratamientos paginados de un usuario específico
   */
  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener tratamientos paginados de un usuario' })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Tratamientos paginados del usuario',
    type: PaginationDto<TreatmentResponseDto>,
  })
  @ApiNotFoundResponse({ description: 'Usuario no encontrado' })
  async findPaginatedByUser(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() query: QueryTreatmentDto,
  ): Promise<PaginationDto<TreatmentResponseDto>> {
    return this.treatmentsService.findPaginatedByUser(userId, query);
  }

  /**
   * Endpoint para actualizar un tratamiento del usuario actual
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un tratamiento del usuario actual' })
  @ApiParam({
    name: 'id',
    description: 'ID del tratamiento a actualizar',
    type: Number,
  })
  @ApiBody({
    type: UpdateTreatmentDto,
    description: 'Datos a actualizar',
  })
  @ApiOkResponse({
    description: 'Tratamiento actualizado',
    type: TreatmentResponseDto,
  })
  @ApiNotFoundResponse({ description: 'Tratamiento no encontrado o no pertenece al usuario actual' })
  @ApiBadRequestResponse({ description: 'Datos de entrada inválidos' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTreatmentDto: UpdateTreatmentDto,
    @CurrentUser() user: User,
  ): Promise<TreatmentResponseDto> {
    return this.treatmentsService.update(id, updateTreatmentDto, user.id);
  }

  /**
   * Endpoint para eliminar lógicamente un tratamiento del usuario actual
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un tratamiento del usuario actual (soft delete)' })
  @ApiParam({
    name: 'id',
    description: 'ID del tratamiento a eliminar',
    type: Number,
  })
  @ApiOkResponse({
    description: 'Tratamiento eliminado',
    schema: {
      type: 'object',
      properties: { message: { type: 'string' } },
    },
  })
  @ApiNotFoundResponse({ description: 'Tratamiento no encontrado o no pertenece al usuario actual' })
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ): Promise<{ message: string }> {
    return this.treatmentsService.remove(id, user.id);
  }
}
