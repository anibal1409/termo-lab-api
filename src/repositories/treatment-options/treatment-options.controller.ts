import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { QueryBaseDto } from '../../common/pagination/dto';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import {
  CreateTreatmentOptionDto,
  TreatmentOptionListDto,
  TreatmentOptionResponseDto,
  UpdateTreatmentOptionDto,
} from './dto';
import { TreatmentOptionService } from './treatment-options.service';

@ApiTags('treatment-options')
@Controller('treatment-options')
export class TreatmentOptionController {
  constructor(
    private readonly treatmentOptionService: TreatmentOptionService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear una nueva opción de tratamiento' })
  @ApiResponse({
    status: 201,
    description: 'Opción creada exitosamente',
    type: TreatmentOptionResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  async create(
    @Body() createTreatmentOptionDto: CreateTreatmentOptionDto,
  ): Promise<TreatmentOptionResponseDto> {
    return this.treatmentOptionService.create(createTreatmentOptionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las opciones de tratamiento paginadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de opciones',
    type: PaginationDto<TreatmentOptionListDto>,
  })
  async findAll(
    @Query() query: QueryBaseDto,
  ): Promise<PaginationDto<TreatmentOptionListDto>> {
    return this.treatmentOptionService.findPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una opción de tratamiento por ID' })
  @ApiResponse({
    status: 200,
    description: 'Opción encontrada',
    type: TreatmentOptionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Opción no encontrada' })
  async findOne(@Param('id') id: number): Promise<TreatmentOptionResponseDto> {
    return this.treatmentOptionService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una opción de tratamiento existente' })
  @ApiResponse({
    status: 200,
    description: 'Opción actualizada',
    type: TreatmentOptionResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Opción no encontrada' })
  async update(
    @Param('id') id: number,
    @Body() updateTreatmentOptionDto: UpdateTreatmentOptionDto,
  ): Promise<TreatmentOptionResponseDto> {
    return this.treatmentOptionService.update(id, updateTreatmentOptionDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar lógicamente una opción de tratamiento' })
  @ApiResponse({
    status: 200,
    description: 'Opción marcada como eliminada',
  })
  @ApiResponse({ status: 404, description: 'Opción no encontrada' })
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    return this.treatmentOptionService.remove(id);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Obtener opciones por tipo (vertical/horizontal)' })
  @ApiResponse({
    status: 200,
    description: 'Lista de opciones del tipo especificado',
    type: [TreatmentOptionResponseDto],
  })
  async findByType(
    @Param('type') type: string,
  ): Promise<TreatmentOptionResponseDto[]> {
    const options = await this.treatmentOptionService.findByType(type);
    return options.map((option) => new TreatmentOptionResponseDto(option));
  }

  @Get('best-match')
  @ApiOperation({
    summary: 'Encontrar la mejor opción basada en parámetros técnicos',
  })
  @ApiResponse({
    status: 200,
    description: 'Mejor opción encontrada o null',
    type: TreatmentOptionResponseDto,
  })
  async findBestOption(
    @Query('heat') heatRequired: number,
    @Query('volume') volumeRequired: number,
  ): Promise<TreatmentOptionResponseDto | null> {
    const option = await this.treatmentOptionService.findBestOption(
      heatRequired,
      volumeRequired,
    );
    return option ? new TreatmentOptionResponseDto(option) : null;
  }
}
