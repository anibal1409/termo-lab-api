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
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAuthGuard } from '../../auth/guards';
import { AdminGuard } from '../../auth/guards/admin.guard';
import {
  TrialsService,
  CreateTrialDto,
  AddSampleDto,
  FlightRecorderRow,
} from './trials.service';
import { Trial, TrialSample } from './entities';
import {
  ThermalTwinService,
  TwinParams,
  TwinPoint,
  CalibrationResult,
  TimeSeries,
  pilotMass,
} from '../evaluations/services/thermal-twin.service';

@ApiTags('Trials')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('trials')
export class TrialsController {
  constructor(
    private readonly trialsService: TrialsService,
    private readonly twinService: ThermalTwinService,
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
    @Body() dto: Partial<CreateTrialDto>,
  ): Promise<Trial> {
    return this.trialsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Eliminar ensayo' })
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
    @Body() body: { state?: 'completed' | 'aborted' },
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
  ): Promise<TrialSample> {
    return this.trialsService.addSample(id, dto);
  }

  // ── Flight recorder ─────────────────────────────────────

  @Get(':id/flight-recorder')
  @ApiOperation({ summary: 'Reproducir ensayo (lecturas y comandos)' })
  flightRecorder(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FlightRecorderRow[]> {
    return this.trialsService.flightRecorder(id);
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Exportar ensayo a CSV' })
  async exportCsv(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    const csv = await this.trialsService.exportCsv(id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=ensayo-${id}.csv`);
    res.send(csv);
  }

  // ── Thermal twin (Phase 4) ──────────────────────────────

  @Post(':id/twin/simulate')
  @ApiOperation({
    summary: 'Simular gemelo térmico',
    description: 'Ejecuta el modelo transitorio con los datos del ensayo.',
  })
  async simulate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      eta?: number;
      ua?: number;
      cp?: number;
      heaterSeries?: TimeSeries[];
      ambientSeries?: TimeSeries[];
      realTempSeries?: TimeSeries[];
    },
  ): Promise<TwinPoint[]> {
    const trial = await this.trialsService.findOne(id);

    // Auto-load from channel readings when series not provided
    const from = trial.startedAt;
    const to = trial.endedAt ?? new Date();
    const heaterSeries = body.heaterSeries
      ?? (trial.heaterChannelId && from ? await this.trialsService.getChannelSeries(trial.heaterChannelId, from, to) : []);
    const ambientSeries = body.ambientSeries
      ?? (trial.ambientTempChannelId && from ? await this.trialsService.getChannelSeries(trial.ambientTempChannelId, from, to) : []);
    const realTempSeries = body.realTempSeries
      ?? (trial.bathTempChannelId && from ? await this.trialsService.getChannelSeries(trial.bathTempChannelId, from, to) : []);

    const defaults = await this.trialsService.getCalibrationDefaults(
      trial.pilotDiameter,
      trial.pilotLength,
    );
    const mass = this.twinService.pilotMass(trial.pilotDiameter, trial.pilotLength);
    const params: TwinParams = {
      mass,
      cp: body.cp ?? 1.0,
      eta: body.eta ?? trial.calibratedEta ?? defaults?.eta ?? 0.85,
      ua: body.ua ?? trial.calibratedUA ?? defaults?.ua ?? 5,
      heaterPower: trial.heaterPower,
    };
    const T0 = realTempSeries[0]?.value ?? 75;
    return this.twinService.simulate(
      params, T0,
      heaterSeries,
      ambientSeries,
      realTempSeries,
    );
  }

  @Post(':id/twin/calibrate')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Calibrar η y UA con datos del ensayo',
    description: 'Ajusta por mínimos cuadrados y guarda en el ensayo.',
  })
  async calibrateTwin(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: {
      cp?: number;
      realTemp?: TimeSeries[];
      ambientTemp?: TimeSeries[];
      heaterState?: TimeSeries[];
    },
  ): Promise<CalibrationResult> {
    const trial = await this.trialsService.findOne(id);
    const from = trial.startedAt;
    const to = trial.endedAt ?? new Date();

    const realTemp = body.realTemp
      ?? (trial.bathTempChannelId && from ? await this.trialsService.getChannelSeries(trial.bathTempChannelId, from, to) : []);
    const ambientTemp = body.ambientTemp
      ?? (trial.ambientTempChannelId && from ? await this.trialsService.getChannelSeries(trial.ambientTempChannelId, from, to) : []);
    const heaterState = body.heaterState
      ?? (trial.heaterChannelId && from ? await this.trialsService.getChannelSeries(trial.heaterChannelId, from, to) : []);

    const mass = this.twinService.pilotMass(trial.pilotDiameter, trial.pilotLength);
    const result = this.twinService.calibrate(
      mass,
      body.cp ?? 1.0,
      trial.heaterPower,
      realTemp,
      ambientTemp,
      heaterState,
    );
    await this.trialsService.saveCalibration(id, result.eta, result.ua, result.rmse);
    return result;
  }

  @Get(':id/twin/calibration')
  @ApiOperation({ summary: 'Estado de calibración del ensayo' })
  async calibrationStatus(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ eta?: number; ua?: number; rmse?: number; calibratedTrials: number }> {
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
