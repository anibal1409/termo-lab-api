import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

/** Máximo de puntos por serie del gemelo: ~28 h a 1 Hz (acota cómputo por petición). */
const MAX_SERIES_POINTS = 100_000;

// ── Ensayo ──────────────────────────────────────────────────

export class CreateTrialDto {
  @ApiProperty({ example: 'Ensayo Morichal 18°API' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({ description: 'Evaluación asociada' })
  @IsOptional()
  @IsInt()
  @Min(1)
  evaluationId?: number;

  @ApiProperty({ description: 'Diámetro del piloto (ft)', example: 1.5 })
  @IsNumber()
  @Min(0.01)
  @Max(50)
  pilotDiameter: number;

  @ApiProperty({ description: 'Longitud del piloto (ft)', example: 3 })
  @IsNumber()
  @Min(0.01)
  @Max(200)
  pilotLength: number;

  @ApiProperty({
    description: 'Potencia del calentador (BTU/h)',
    example: 5000,
  })
  @IsNumber()
  @Min(0)
  @Max(100_000_000)
  heaterPower: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  bathTempChannelId?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  ambientTempChannelId?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  heaterChannelId?: number;

  @ApiPropertyOptional({ type: [Number], description: 'Canales de nivel' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  levelChannelIds?: number[];

  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) pidLoopId?: number;

  @ApiPropertyOptional({ type: [Number], description: 'Reglas de seguridad' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsInt({ each: true })
  ruleIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  notes?: string;
}

export class UpdateTrialDto extends PartialType(CreateTrialDto) {}

export class StopTrialDto {
  @ApiPropertyOptional({ enum: ['completed', 'aborted'] })
  @IsOptional()
  @IsIn(['completed', 'aborted'])
  state?: 'completed' | 'aborted';
}

export class AddSampleDto {
  @ApiProperty({ example: 'BSW salida' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  label: string;

  @ApiProperty({ example: 0.4 })
  @IsNumber()
  value: number;

  @ApiPropertyOptional({ example: '%' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  unit?: string;

  @ApiPropertyOptional({ description: 'ISO 8601; por defecto, ahora' })
  @IsOptional()
  @IsISO8601()
  at?: string;
}

// ── Flight recorder ─────────────────────────────────────────

export class FlightRecorderRow {
  @ApiProperty() at: Date;
  @ApiProperty({ enum: ['reading', 'command'] }) kind: 'reading' | 'command';
  @ApiPropertyOptional() channelId?: number;
  @ApiPropertyOptional() value?: number;
  @ApiPropertyOptional() command?: string;
  @ApiPropertyOptional() response?: string;
  @ApiPropertyOptional() source?: string;
}

// ── Gemelo térmico ──────────────────────────────────────────

export class TimeSeriesPointDto {
  @ApiProperty({ description: 'Segundos desde startedAt' })
  @IsNumber()
  t: number;
  @ApiProperty() @IsNumber() value: number;
}

const series = (description: string) =>
  ApiPropertyOptional({ type: [TimeSeriesPointDto], description });

function SeriesValidators(): PropertyDecorator {
  return (target, key) => {
    IsOptional()(target, key);
    IsArray()(target, key);
    ArrayMaxSize(MAX_SERIES_POINTS)(target, key);
    ValidateNested({ each: true })(target, key);
    Type(() => TimeSeriesPointDto)(target, key);
  };
}

export class SimulateTwinDto {
  @series('Temperatura real del baño (°F); por defecto, lecturas del canal')
  @SeriesValidators()
  realTempSeries?: TimeSeriesPointDto[];

  @series('Temperatura ambiente (°F)')
  @SeriesValidators()
  ambientSeries?: TimeSeriesPointDto[];

  @series('Estado del calentador (0/1)')
  @SeriesValidators()
  heaterSeries?: TimeSeriesPointDto[];

  @ApiPropertyOptional({ description: 'Eficiencia (0–1)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  eta?: number;

  @ApiPropertyOptional({ description: 'UA (BTU/h·°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  ua?: number;

  @ApiPropertyOptional({ description: 'cp del fluido (BTU/lb·°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  cp?: number;
}

export class CalibrateTwinDto {
  @series('Temperatura real del baño (°F)')
  @SeriesValidators()
  realTemp?: TimeSeriesPointDto[];
  @series('Temperatura ambiente (°F)')
  @SeriesValidators()
  ambientTemp?: TimeSeriesPointDto[];
  @series('Estado del calentador (0/1)')
  @SeriesValidators()
  heaterState?: TimeSeriesPointDto[];

  @ApiPropertyOptional({ description: 'cp del fluido (BTU/lb·°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  cp?: number;
}

export class TwinPointDto {
  @ApiProperty() t: number;
  @ApiProperty() real: number;
  @ApiProperty() simulated: number;
  @ApiProperty() error: number;
}

export class CalibrationResultDto {
  @ApiProperty() eta: number;
  @ApiProperty() ua: number;
  @ApiProperty() rmse: number;
  @ApiProperty({ description: 'Puntos usados en el ajuste' }) points: number;
}

export class CalibrationStatusDto {
  @ApiPropertyOptional() eta?: number;
  @ApiPropertyOptional() ua?: number;
  @ApiPropertyOptional() rmse?: number;
  @ApiProperty() calibratedTrials: number;
}

// ── Informe de ensayo (report.json; mismo contenido que el PDF) ─────

class TrialReportIdentityDto {
  @ApiProperty() id: number;
  @ApiProperty() name: string;
  @ApiProperty({ enum: ['draft', 'running', 'completed', 'aborted'] })
  state: string;
  @ApiProperty() startedAt: Date;
  @ApiPropertyOptional({ nullable: true }) endedAt: Date | null;
  @ApiProperty() durationMin: number;
  @ApiPropertyOptional({ nullable: true }) notes: string | null;
}

class TrialReportGeometryDto {
  @ApiProperty({ description: 'ft' }) pilotDiameter: number;
  @ApiProperty({ description: 'ft' }) pilotLength: number;
  @ApiProperty({ description: 'BTU/h' }) heaterPower: number;
}

class TrialReportChannelsDto {
  @ApiPropertyOptional({ nullable: true }) bathTempChannelId: number | null;
  @ApiPropertyOptional({ nullable: true }) ambientTempChannelId: number | null;
  @ApiPropertyOptional({ nullable: true }) heaterChannelId: number | null;
  @ApiProperty({ type: [Number] }) levelChannelIds: number[];
  @ApiPropertyOptional({ nullable: true }) pidLoopId: number | null;
  @ApiProperty({ type: [Number] }) ruleIds: number[];
}

class TrialReportChannelStatDto {
  @ApiProperty() channelId: number;
  @ApiProperty() readings: number;
  @ApiProperty() min: number;
  @ApiProperty() max: number;
  @ApiProperty() avg: number;
}

class TrialReportFlightRecorderDto {
  @ApiProperty() readings: number;
  @ApiProperty() commands: number;
  @ApiProperty({ type: [TrialReportChannelStatDto] })
  perChannel: TrialReportChannelStatDto[];
}

class TrialReportSampleDto {
  @ApiProperty() label: string;
  @ApiProperty() value: number;
  @ApiPropertyOptional({ nullable: true }) unit: string | null;
  @ApiProperty() at: Date;
}

class TrialReportCalibrationDto {
  @ApiPropertyOptional({ nullable: true }) calibratedEta: number | null;
  @ApiPropertyOptional({ nullable: true }) calibratedUA: number | null;
  @ApiPropertyOptional({ nullable: true }) calibrationRmse: number | null;
}

export class TrialReportDto {
  @ApiProperty({ type: TrialReportIdentityDto }) trial: TrialReportIdentityDto;
  @ApiProperty({ type: TrialReportGeometryDto })
  geometry: TrialReportGeometryDto;
  @ApiProperty({ type: TrialReportChannelsDto })
  channels: TrialReportChannelsDto;
  @ApiProperty({ type: TrialReportFlightRecorderDto })
  flightRecorder: TrialReportFlightRecorderDto;
  @ApiProperty({ type: [TrialReportSampleDto] })
  samples: TrialReportSampleDto[];
  @ApiProperty({ type: TrialReportCalibrationDto })
  calibration: TrialReportCalibrationDto;
  @ApiProperty({
    enum: ['Sin calibrar', 'Excelente', 'Aceptable', 'Fuera de tolerancia'],
    description: 'Según twinRmse*Max de /settings',
  })
  calibrationRating: string;
  @ApiProperty({
    description: 'SHA-256 del contenido (idéntico al X-Report-SHA256 del PDF)',
  })
  sha256: string;
}
