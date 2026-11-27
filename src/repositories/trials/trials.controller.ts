import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/guards';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../users/entities';
import {
  TrialsService,
  CreateTrialDto,
  AddSampleDto,
  StopTrialDto,
  UpdateTrialDto,
  SimulateTwinDto,
  CalibrateTwinDto,
  TwinPointDto,
  CalibrationResultDto,
  CalibrationStatusDto,
  TrialReportDto,
} from './trials.service';
import { Trial, TrialSample } from './entities';
import { createHash } from 'crypto';

import { canonicalJson, PdfService } from '../../common/pdf';
import { SettingsService } from '../settings/settings.service';
import {
  ThermalTwinService,
  TwinParams,
} from '../evaluations/services/thermal-twin.service';

@ApiTags('Trials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trials')
export class TrialsController {
  constructor(
    private readonly trialsService: TrialsService,
    private readonly twinService: ThermalTwinService,
    private readonly settings: SettingsService,
    private readonly pdf: PdfService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar ensayos' })
  @ApiOkResponse({ type: [Trial] })
  findAll(): Promise<Trial[]> {
    return this.trialsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener ensayo por ID' })
  @ApiOkResponse({ type: Trial })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Trial> {
    return this.trialsService.findOne(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Crear ensayo' })
  @ApiOkResponse({ type: Trial })
  create(@Body() dto: CreateTrialDto): Promise<Trial> {
    return this.trialsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Actualizar ensayo' })
  @ApiOkResponse({ type: Trial })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrialDto,
  ): Promise<Trial> {
    return this.trialsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Eliminar ensayo' })
  @ApiOkResponse({ description: 'Ensayo eliminado' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.trialsService.remove(id);
  }

  // ── Lifecycle ───────────────────────────────────────────

  @Post(':id/start')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Iniciar ensayo' })
  @ApiOkResponse({ type: Trial })
  start(@Param('id', ParseIntPipe) id: number): Promise<Trial> {
    return this.trialsService.start(id);
  }

  @Post(':id/stop')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Detener ensayo' })
  @ApiOkResponse({ type: Trial })
  stop(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: StopTrialDto,
  ): Promise<Trial> {
    return this.trialsService.stop(id, body.state);
  }

  // ── Samples ─────────────────────────────────────────────

  @Post(':id/samples')
  @ApiOperation({ summary: 'Registrar muestra manual' })
  @ApiOkResponse({ type: TrialSample })
  addSample(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddSampleDto,
    @CurrentUser() user: User,
  ): Promise<TrialSample> {
    return this.trialsService.addSample(id, dto, user.id);
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Exportar muestras del ensayo a CSV' })
  @ApiProduces('text/csv')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  async exportCsv(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.trialsService.exportCsv(id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ensayo-${id}.csv`,
    );
    res.send(csv);
  }

  /** Datos del informe + calificación del gemelo según /settings. */
  private async ratedReport(id: number) {
    const data = await this.trialsService.reportData(id);
    const settings = await this.settings.get();
    const rmse = data.calibration.calibrationRmse;
    const rating =
      rmse == null
        ? 'Sin calibrar'
        : rmse <= (settings.twinRmseExcellentMax ?? 1)
          ? 'Excelente'
          : rmse <= (settings.twinRmseAcceptableMax ?? 3)
            ? 'Aceptable'
            : 'Fuera de tolerancia';
    return { data, rating };
  }

  @Get(':id/report.json')
  @ApiOperation({
    summary: 'Informe técnico del ensayo (JSON)',
    description:
      'Mismo contenido que report.pdf, tipado. sha256 coincide con el X-Report-SHA256 del PDF.',
  })
  @ApiOkResponse({ type: TrialReportDto })
  @ApiResponse({ status: 404, description: 'Ensayo inexistente' })
  @ApiResponse({ status: 409, description: 'Ensayo en draft (sin corrida)' })
  @ApiResponse({ status: 422, description: 'Faltan datos mínimos' })
  async reportJson(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TrialReportDto> {
    const { data, rating } = await this.ratedReport(id);
    const sha256 = createHash('sha256')
      .update(canonicalJson(data))
      .digest('hex');
    return { ...data, calibrationRating: rating, sha256 };
  }

  @Get(':id/report.pdf')
  @ApiOperation({
    summary: 'Informe técnico PDF del ensayo',
    description:
      'Identidad, geometría del piloto, muestras y calibración del gemelo. El header X-Report-SHA256 y el pie llevan el hash del contenido.',
  })
  @ApiProduces('application/pdf')
  @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
  @ApiResponse({ status: 404, description: 'Ensayo inexistente' })
  @ApiResponse({ status: 409, description: 'Ensayo en draft (sin corrida)' })
  @ApiResponse({ status: 422, description: 'Faltan datos mínimos' })
  async reportPdf(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const { data, rating } = await this.ratedReport(id);
    const rmse = data.calibration.calibrationRmse;
    const { trial, geometry } = data;

    const { buffer, sha256 } = await this.pdf.render(
      `Informe técnico de ensayo #${trial.id}`,
      `${trial.name} · Generado ${new Date().toISOString()} · Metodología API-12L`,
      [
        {
          heading: 'Identidad',
          fields: [
            ['ID', trial.id],
            ['Nombre', trial.name],
            ['Estado', trial.state],
            ['Inicio', trial.startedAt],
            ['Fin', trial.endedAt],
            ['Duración (min)', trial.durationMin],
            ['Notas', trial.notes],
          ],
        },
        {
          heading: 'Geometría del piloto',
          fields: [
            ['Diámetro (ft)', geometry.pilotDiameter],
            ['Longitud (ft)', geometry.pilotLength],
            ['Potencia calentador (BTU/h)', geometry.heaterPower],
          ],
        },
        {
          heading: 'Muestras',
          table: {
            headers: ['Fecha', 'Etiqueta', 'Valor', 'Unidad'],
            rows: data.samples.map((s) => [s.at, s.label, s.value, s.unit]),
          },
        },
        {
          heading: 'Calibración del gemelo térmico',
          fields: [
            ['Eficiencia η', data.calibration.calibratedEta],
            ['UA (BTU/h·°F)', data.calibration.calibratedUA],
            ['RMSE (°F)', rmse],
            ['Calificación', rating],
          ],
        },
        {
          heading: 'Trazabilidad',
          text: 'El SHA-256 al pie de cada página se calcula sobre el contenido de este informe (JSON canónico) y se repite en el header X-Report-SHA256: cualquier alteración de los datos cambia el hash.',
        },
      ],
      data,
    );
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="trial-${id}-api12l.pdf"`,
    );
    res.setHeader('X-Report-SHA256', sha256);
    res.send(buffer);
  }

  // ── Thermal twin (Phase 4) ──────────────────────────────

  @Post(':id/twin/simulate')
  @ApiOperation({
    summary: 'Simular gemelo térmico',
    description:
      'Ejecuta el modelo transitorio con las series enviadas (temperatura del baño, ambiente y calentador).',
  })
  @ApiOkResponse({ type: [TwinPointDto] })
  async simulate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SimulateTwinDto,
  ): Promise<TwinPointDto[]> {
    const trial = await this.trialsService.findOne(id);

    const { heaterSeries, ambientSeries, realTempSeries } = body;

    const defaults = await this.trialsService.getCalibrationDefaults(
      trial.pilotDiameter,
      trial.pilotLength,
    );
    const mass = this.twinService.pilotMass(
      trial.pilotDiameter,
      trial.pilotLength,
    );
    const params: TwinParams = {
      mass,
      cp: body.cp ?? 1.0,
      eta: body.eta ?? trial.calibratedEta ?? defaults?.eta ?? 0.85,
      ua: body.ua ?? trial.calibratedUA ?? defaults?.ua ?? 5,
      heaterPower: trial.heaterPower,
    };
    const T0 = realTempSeries[0]?.value ?? 75;
    return this.twinService.simulate(
      params,
      T0,
      heaterSeries,
      ambientSeries,
      realTempSeries,
    );
  }

  @Post(':id/twin/calibrate')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Calibrar η y UA con datos del ensayo',
    description:
      'Ajusta por mínimos cuadrados con las series enviadas y guarda en el ensayo.',
  })
  @ApiOkResponse({ type: CalibrationResultDto })
  async calibrateTwin(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CalibrateTwinDto,
  ): Promise<CalibrationResultDto> {
    const trial = await this.trialsService.findOne(id);
    const { realTemp, ambientTemp, heaterState } = body;

    const mass = this.twinService.pilotMass(
      trial.pilotDiameter,
      trial.pilotLength,
    );
    const result = this.twinService.calibrate(
      mass,
      body.cp ?? 1.0,
      trial.heaterPower,
      realTemp,
      ambientTemp,
      heaterState,
    );
    await this.trialsService.saveCalibration(
      id,
      result.eta,
      result.ua,
      result.rmse,
    );
    return result;
  }

  @Get(':id/twin/calibration')
  @ApiOperation({ summary: 'Estado de calibración del ensayo' })
  @ApiOkResponse({ type: CalibrationStatusDto })
  async calibrationStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CalibrationStatusDto> {
    const trial = await this.trialsService.findOne(id);
    const defaults = await this.trialsService.getCalibrationDefaults(
      trial.pilotDiameter,
      trial.pilotLength,
    );
    return {
      eta: trial.calibratedEta ?? defaults?.eta,
      ua: trial.calibratedUA ?? defaults?.ua,
      rmse: trial.calibrationRmse,
      calibratedTrials: defaults?.count ?? 0,
    };
  }
}
