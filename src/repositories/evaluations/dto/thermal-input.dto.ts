import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

import { ThermalTreatmentInput } from '../services/thermal-calculator.service';
import { MonteCarloInput } from '../services/thermal-analysis.service';

// Rangos amplios: solo rechazan valores absurdos o maliciosos (NaN, negativos, gigantes)

class GasCompositionDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  methane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  ethane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  propane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  butane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  pentane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  hexane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  heptane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  octane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  nonane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  decane?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  co2?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  nitrogen?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  h2s?: number;
}

export class ThermalTreatmentInputDto implements ThermalTreatmentInput {
  @ApiProperty() @IsNumber() @Min(0.1) @Max(50) diameter: number;
  @ApiProperty() @IsNumber() @Min(0.1) @Max(200) length: number;
  @ApiProperty() @IsNumber() @Min(0.1) @Max(1_000_000) totalFlow: number;
  @ApiProperty() @IsNumber() @Min(0) @Max(100) waterFraction: number;
  @ApiProperty() @IsNumber() @Min(0.1) @Max(100) apiGravity: number;
  @ApiProperty() @IsNumber() @Min(-100) @Max(1000) inletTemperature: number;
  @ApiProperty() @IsNumber() @Min(-100) @Max(1000) ambientTemperature: number;
  @ApiProperty() @IsNumber() @Min(0) @Max(5000) operatingPressure: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  freeWaterRemovalPercentage?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10_000)
  waterDropSize?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(2)
  waterSpecificGravity?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  oilSpecificHeat?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  waterSpecificHeat?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(-100)
  @Max(1000)
  treatmentTemperature?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  oilDensity?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(200)
  waterDensity?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(1_000_000)
  oilViscosity?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  factorK?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(600)
  lowLowWaterLevel?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(600)
  waterOilInterfaceLevel?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(600)
  highHighOilLevel?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10_000)
  oilRetentionTime?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10_000)
  waterRetentionTime?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(200)
  windSpeed?: number;

  @ApiPropertyOptional({
    description:
      'Recipiente aislado: pérdidas = 10 % de las del desnudo (API-12L Apéndice D: 5–10 %)',
  })
  @IsOptional()
  @IsBoolean()
  insulated?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1_000_000)
  maxTotalFlow?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  maxWaterFraction?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10_000)
  gasFlowRate?: number;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10_000)
  maxGasFlowRate?: number;
  @ApiPropertyOptional({ enum: ['horizontal', 'vertical'] })
  @IsOptional()
  @IsIn(['horizontal', 'vertical'])
  vesselOrientation?: 'horizontal' | 'vertical';

  @ApiPropertyOptional({ type: () => GasCompositionDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => GasCompositionDto)
  gasComposition?: GasCompositionDto;
}

class DistributionDto {
  @ApiProperty() @IsIn(['normal', 'uniform']) type: 'normal' | 'uniform';
  @ApiPropertyOptional() @IsOptional() @IsNumber() mean?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) stddev?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() min?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() max?: number;
}

class DistributionsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DistributionDto)
  apiGravity?: DistributionDto;
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DistributionDto)
  waterFraction?: DistributionDto;
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DistributionDto)
  oilViscosity?: DistributionDto;
  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => DistributionDto)
  waterDropSize?: DistributionDto;
}

/** Acepta forma plana (campos térmicos en la raíz) o anidada en `base`. */
export class MonteCarloInputDto
  extends PartialType(ThermalTreatmentInputDto)
  implements Partial<MonteCarloInput>
{
  @ApiPropertyOptional({ type: () => ThermalTreatmentInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ThermalTreatmentInputDto)
  base?: ThermalTreatmentInputDto;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20_000)
  runs?: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() seed?: number;

  @ApiPropertyOptional({ type: () => DistributionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DistributionsDto)
  distributions?: DistributionsDto;
}

/**
 * Cuerpo de reportes. Orden de resolución de la entrada térmica:
 * evaluación en BD (`evaluationId`) → `thermalInput` del front → diseño en BD
 * (`treatmentId`); los campos térmicos en la raíz sobrescriben al final.
 */
export class ReportRequestDto extends PartialType(ThermalTreatmentInputDto) {
  @ApiPropertyOptional({
    description: 'Evaluación propia a informar',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  evaluationId?: number | null;

  @ApiPropertyOptional({
    description: 'Diseño (tratamiento) propio a informar',
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  treatmentId?: number | null;

  @ApiPropertyOptional({
    description:
      'Entrada térmica del front (respaldo si la evaluación no tiene datos guardados); se valida al resolver',
    type: () => ThermalTreatmentInputDto,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  thermalInput?: Partial<ThermalTreatmentInputDto> | null;

  @ApiPropertyOptional({
    description: 'Código de auditoría (se imprime en el PDF)',
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  code?: string | null;

  // Calculados por el front: se aceptan pero se ignoran (el servidor recalcula)
  @ApiPropertyOptional({
    description: 'Ignorado: el servidor recalcula',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  score?: number | null;
  @ApiPropertyOptional({
    description: 'Ignorado: el servidor recalcula',
    nullable: true,
  })
  @IsOptional()
  @IsBoolean()
  approved?: boolean | null;
  @ApiPropertyOptional({
    description: 'Ignorado: el servidor recalcula',
    type: Object,
    nullable: true,
  })
  @IsOptional()
  @IsObject()
  thermalResults?: object | null;
  @ApiPropertyOptional({ description: 'Ignorado', type: [Object] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  criteria?: object[];
  @ApiPropertyOptional({ description: 'Ignorado', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  evaluationType?: string | null;
  @ApiPropertyOptional({ description: 'Ignorado', nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  comments?: string | null;
}
