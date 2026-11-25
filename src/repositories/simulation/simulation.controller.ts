import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SimulationService } from './simulation.service';
import {
  ChromatographyInputDto,
  FlashInputDto,
  FluidPropertiesInputDto,
} from './dto/simulation.dto';
import { RunPipelineDto } from './dto/runner.dto';
import { RunnerService } from './runner/runner.service';

@ApiTags('Simulation')
@Controller('simulation')
export class SimulationController {
  constructor(
    private readonly service: SimulationService,
    private readonly runner: RunnerService,
  ) {}

  @Get('components')
  @ApiOperation({
    summary: 'Listar componentes disponibles',
    description:
      'Devuelve la base de datos de componentes puros (C1-C36+, H2O, N2, CO2, H2S) con propiedades críticas.',
  })
  getComponents() {
    return this.service.getComponents();
  }

  @Post('chromatography')
  @ApiOperation({
    summary: 'Generar o cargar cromatografía + caudales',
    description:
      'Genera C1–C36+ desde °API (Whitson) o acepta composición cargada. ' +
      'Con totalFlow_BPD (bruto) y BSW calcula aceite; el gas MMSCFD se obtiene automáticamente con GOR ' +
      '(GOR de entrada, o de gas/aceite, o estimado por °API).',
  })
  @ApiBody({ type: ChromatographyInputDto })
  @ApiOkResponse({
    description:
      'Cromatografía + oilFlow_BPD, gasFlow_MMSCFD, gor y orígenes (user/estimated)',
  })
  chromatography(@Body() dto: ChromatographyInputDto) {
    return this.service.chromatographyWithRates(dto);
  }

  @Post('flash')
  @ApiOperation({
    summary: 'Flash PT (separación de fases)',
    description:
      'Calcula equilibrio vapor-líquido a T y P dados usando Peng-Robinson o SRK con Rachford-Rice.',
  })
  @ApiBody({ type: FlashInputDto })
  @ApiOkResponse({
    description: 'Resultado del flash con composiciones por fase y Ki',
  })
  flash(@Body() dto: FlashInputDto) {
    return this.service.flash(
      dto.apiGravity,
      dto.temperature,
      dto.pressure,
      dto.eos ?? 'PR',
      dto.gor,
      dto.waterMolFrac,
      dto.customComposition,
    );
  }

  @Post('fluid-properties')
  @ApiOperation({
    summary: 'Propiedades del fluido',
    description:
      'Calcula densidad, viscosidad, factor Z y propiedades PVT del crudo a condiciones dadas.',
  })
  @ApiBody({ type: FluidPropertiesInputDto })
  @ApiOkResponse({
    description: 'Propiedades termodinámicas completas del fluido',
  })
  fluidProperties(@Body() dto: FluidPropertiesInputDto) {
    return this.service.fluidProperties(
      dto.apiGravity,
      dto.temperature,
      dto.pressure,
      dto.eos ?? 'PR',
      dto.gor,
    );
  }

  @Post('run')
  @ApiOperation({
    summary: 'Ejecutar pipeline de simulación',
    description:
      'Feed: bruto BPD, BSW/libre/emulsionada, useChromatography + chromatography[] opcional; gas se calcula con GOR automáticamente. ' +
      'Equipos: dimensiones opcionales (autoDimension default true). Separador: orientation H/V, dropDiameter_um (Stewart avg si omitido). ' +
      'Tratador: BSW<1%, capacidad nominal, API 12L. designForCompliance=true = rediseño bidireccional.',
  })
  @ApiBody({ type: RunPipelineDto })
  @ApiOkResponse({
    description:
      'Resultado completo del pipeline con streams intermedios y reporte por equipo',
  })
  runPipeline(@Body() dto: RunPipelineDto) {
    return this.runner.run(dto);
  }

  @Get('treatments')
  @ApiOperation({
    summary: 'Listar tratadores guardados disponibles para simulación',
    description:
      'Devuelve tratadores térmicos guardados en BD con sus dimensiones, para usar como treatmentId en pasos del pipeline.',
  })
  getTreatments() {
    return this.runner.getAvailableTreatments();
  }
}
