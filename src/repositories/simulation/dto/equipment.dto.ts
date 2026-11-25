import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsEnum, Min, Max, IsString, ValidateNested } from 'class-validator';

export class HeatExchangerFluidDto {
  @ApiProperty({ description: 'Caudal másico kg/s', example: 5 })
  @IsNumber()
  massFlow_kgs: number;

  @ApiProperty({ description: 'Temperatura de entrada °C', example: 140 })
  @IsNumber()
  inletTemp: number;

  @ApiPropertyOptional({ description: 'Temperatura de salida °C' })
  @IsOptional() @IsNumber()
  outletTemp?: number;

  @ApiProperty({ description: 'Cp en kJ/(kg·°C)', example: 2.1 })
  @IsNumber()
  cp: number;
}

export class SeparatorInputDto {
  @ApiProperty({ enum: ['horizontal', 'vertical'] })
  @IsString()
  orientation: 'horizontal' | 'vertical';

  @ApiProperty({ description: 'Caudal de líquido en BPD', example: 500 })
  @IsNumber() @Min(1)
  liquidFlowBPD: number;

  @ApiPropertyOptional({ description: 'Caudal de gas MMSCFD' })
  @IsOptional() @IsNumber()
  gasFlowMMSCFD?: number;

  @ApiProperty({ description: 'Fracción de agua (0-1)', example: 0.2 })
  @IsNumber() @Min(0) @Max(1)
  waterFraction: number;

  @ApiPropertyOptional({ description: 'Fracción agua libre (0-1)' })
  @IsOptional() @IsNumber() @Min(0) @Max(1)
  freeWaterFraction?: number;

  @ApiPropertyOptional({ description: 'Fracción agua emulsionada (0-1)' })
  @IsOptional() @IsNumber() @Min(0) @Max(1)
  emulsifiedWaterFraction?: number;

  @ApiProperty({ description: 'Temperatura °C', example: 80 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ description: 'Presión kPa', example: 500 })
  @IsNumber() @Min(1)
  pressure: number;

  @ApiProperty({ description: 'Densidad del líquido kg/m³', example: 920 })
  @IsNumber() @Min(1)
  liquidDensity: number;

  @ApiPropertyOptional({ description: 'Densidad del gas kg/m³ (cromatografía)' })
  @IsOptional() @IsNumber()
  gasDensity?: number;

  @ApiPropertyOptional({ description: 'Diámetro en metros' })
  @IsOptional() @IsNumber() @Min(0.1)
  diameter?: number;

  @ApiPropertyOptional({ description: 'Longitud en metros' })
  @IsOptional() @IsNumber() @Min(0.1)
  length?: number;

  @ApiPropertyOptional({ description: 'Tiempo de retención requerido (min)' })
  @IsOptional() @IsNumber() @Min(0.5)
  retentionTime?: number;

  @ApiPropertyOptional({ description: '°API del crudo' })
  @IsOptional() @IsNumber()
  apiGravity?: number;

  @ApiPropertyOptional({ description: 'Diámetro de gota µm (default Stewart 2008)' })
  @IsOptional() @IsNumber() @Min(1)
  dropDiameter_um?: number;
}

export class HeatExchangerInputDto {
  @ApiProperty({ enum: ['counterflow', 'parallel', 'crossflow'], example: 'counterflow' })
  @IsString()
  arrangement: 'counterflow' | 'parallel' | 'crossflow';

  @ApiProperty({ description: 'Fluido caliente', type: HeatExchangerFluidDto })
  @ValidateNested() @Type(() => HeatExchangerFluidDto)
  hot: HeatExchangerFluidDto;

  @ApiProperty({ description: 'Fluido frío', type: HeatExchangerFluidDto })
  @ValidateNested() @Type(() => HeatExchangerFluidDto)
  cold: HeatExchangerFluidDto;

  @ApiPropertyOptional({ description: 'Coeficiente global U en W/(m²·°C)', example: 500 })
  @IsOptional() @IsNumber()
  U?: number;

  @ApiPropertyOptional({ description: 'Área de transferencia m²' })
  @IsOptional() @IsNumber()
  area?: number;

  @ApiPropertyOptional({ description: 'Factor de ensuciamiento m²·°C/W' })
  @IsOptional() @IsNumber()
  foulingFactor?: number;

  @ApiPropertyOptional({ description: 'Número de tubos' })
  @IsOptional() @IsNumber()
  numberOfTubes?: number;

  @ApiPropertyOptional({ description: 'Longitud de tubos m' })
  @IsOptional() @IsNumber()
  tubeLength?: number;

  @ApiPropertyOptional({ description: 'Diámetro exterior de tubos m' })
  @IsOptional() @IsNumber()
  tubeOD?: number;
}

export class StorageTankInputDto {
  @ApiProperty({ description: 'Caudal de entrada BPD', example: 500 })
  @IsNumber() @Min(1)
  flowBPD: number;

  @ApiProperty({ description: 'Tiempo de almacenamiento en horas', example: 48 })
  @IsNumber() @Min(1)
  storageTime_hours: number;

  @ApiProperty({ description: 'Temperatura °C', example: 40 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ description: '°API del crudo', example: 22 })
  @IsNumber() @Min(5) @Max(60)
  apiGravity: number;

  @ApiPropertyOptional({ description: 'Fracción de agua remanente' })
  @IsOptional() @IsNumber() @Min(0) @Max(1)
  waterFraction?: number;

  @ApiPropertyOptional({ description: 'Diámetro m' })
  @IsOptional() @IsNumber()
  diameter?: number;

  @ApiPropertyOptional({ description: 'Altura m' })
  @IsOptional() @IsNumber()
  height?: number;

  @ApiPropertyOptional({ enum: ['fixed', 'floating', 'internal-floating'] })
  @IsOptional() @IsString()
  roofType?: 'fixed' | 'floating' | 'internal-floating';
}

export class ThermalTreaterInputDto {
  @ApiProperty({ description: 'Caudal total BPD', example: 500 })
  @IsNumber() @Min(1)
  totalFlow: number;

  @ApiProperty({ description: '°API del crudo', example: 18 })
  @IsNumber() @Min(5) @Max(60)
  apiGravity: number;

  @ApiProperty({ description: 'Fracción de agua (0-1)', example: 0.20 })
  @IsNumber() @Min(0) @Max(1)
  waterFraction: number;

  @ApiProperty({ description: 'Temperatura de entrada °C', example: 75 })
  @IsNumber()
  inletTemperature: number;

  @ApiProperty({ description: 'Temperatura de tratamiento °C', example: 140 })
  @IsNumber()
  treatmentTemperature: number;

  @ApiProperty({ description: 'Temperatura ambiente °C', example: 30 })
  @IsNumber()
  ambientTemperature: number;

  @ApiProperty({ description: 'Presión de operación kPa', example: 350 })
  @IsNumber() @Min(1)
  operatingPressure: number;

  @ApiPropertyOptional({ description: 'Diámetro en pies' })
  @IsOptional() @IsNumber()
  diameter?: number;

  @ApiPropertyOptional({ description: 'Longitud en pies' })
  @IsOptional() @IsNumber()
  length?: number;

  @ApiPropertyOptional({ description: 'Retención de aceite (min)' })
  @IsOptional() @IsNumber()
  oilRetentionTime?: number;

  @ApiPropertyOptional({ description: 'Retención de agua (min)' })
  @IsOptional() @IsNumber()
  waterRetentionTime?: number;

  @ApiPropertyOptional({ description: 'Velocidad del viento mph' })
  @IsOptional() @IsNumber()
  windSpeed?: number;

  @ApiPropertyOptional({ description: 'Eficiencia del quemador (0-1)' })
  @IsOptional() @IsNumber() @Min(0.1) @Max(1)
  burnerEfficiency?: number;

  @ApiPropertyOptional({ description: 'Fracción agua libre (0-1)' })
  @IsOptional() @IsNumber() @Min(0) @Max(1)
  freeWaterFraction?: number;

  @ApiPropertyOptional({ description: 'Fracción agua emulsionada (0-1)' })
  @IsOptional() @IsNumber() @Min(0) @Max(1)
  emulsifiedWaterFraction?: number;

  @ApiPropertyOptional({ description: 'Diámetro de gota µm (default Stewart 2008)' })
  @IsOptional() @IsNumber() @Min(1)
  dropDiameter_um?: number;
}
