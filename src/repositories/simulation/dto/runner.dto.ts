import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  Max,
  ValidateNested,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';
import { MoleFractionDto } from './simulation.dto';

export class PipelineFeedDto {
  @ApiProperty({
    description: 'Caudal diario bruto de líquido BPD',
    example: 5000,
  })
  @IsNumber()
  @Min(1)
  totalFlow_BPD: number;

  @ApiProperty({ description: '°API del crudo', example: 22 })
  @IsNumber()
  @Min(5)
  @Max(60)
  apiGravity: number;

  @ApiPropertyOptional({
    description:
      'Fracción de agua 0–1 (legacy). Preferir bsw o freeWaterPct+emulsifiedWaterPct',
    example: 0.3,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  waterFraction?: number;

  @ApiPropertyOptional({
    description: 'BSW en % (0–100). Preferido frente a waterFraction',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bsw?: number;

  @ApiPropertyOptional({
    description: '% agua libre sobre el líquido (0–100)',
    example: 20,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  freeWaterPct?: number;

  @ApiPropertyOptional({
    description: '% agua emulsionada sobre el líquido (0–100)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  emulsifiedWaterPct?: number;

  @ApiProperty({ description: 'Temperatura °C', example: 80 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ description: 'Presión kPa', example: 500 })
  @IsNumber()
  @Min(1)
  pressure: number;

  @ApiPropertyOptional({
    description:
      'Caudal de gas MMSCFD. Si se omite, se calcula automáticamente con GOR × aceite / 1e6',
  })
  @IsOptional()
  @IsNumber()
  gasFlow_MMSCFD?: number;

  @ApiPropertyOptional({
    description:
      'GOR scf/bbl. Si se omite y hay gas, se calcula; si no hay gas, se estima por °API / cromatografía',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gor?: number;

  @ApiPropertyOptional({
    description:
      'Usar cromatografía para densidades/MW de gas (default true). Genera desde °API+GOR o usa `chromatography` cargada.',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  useChromatography?: boolean;

  @ApiPropertyOptional({
    description:
      'Cromatografía cargada (composición molar). Si se omite, se genera automáticamente desde °API y GOR.',
    type: [MoleFractionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoleFractionDto)
  chromatography?: MoleFractionDto[];

  @ApiPropertyOptional({
    description: 'Fracción molar de agua al generar cromatografía',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(0.99)
  waterMolFrac?: number;
}

export class PipelineStepDto {
  @ApiPropertyOptional({
    description: 'Nombre del paso',
    example: 'Separador de entrada',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    enum: ['separator', 'heat-exchanger', 'storage-tank', 'thermal-treater'],
  })
  @IsString()
  type: 'separator' | 'heat-exchanger' | 'storage-tank' | 'thermal-treater';

  @ApiProperty({
    description:
      'Config del equipo. Dimensiones opcionales: si faltan o autoDimension≠false, el BE autodimensiona. ' +
      'Separador: orientation (horizontal|vertical), diameter_m, length_m, retentionTime, dropDiameter_um (Stewart avg si omitido), autoDimension. ' +
      'Tratador: treatmentTemperature, oil/waterRetentionTime (min), diameter/length (ft), dropDiameter_um, autoDimension.',
    example: { orientation: 'horizontal', autoDimension: true },
  })
  @IsObject()
  config: Record<string, any>;

  @ApiPropertyOptional({
    description:
      'ID de un tratamiento guardado en BD (tipo se fuerza a thermal-treater, dimensiones se cargan de la BD)',
  })
  @IsOptional()
  @IsNumber()
  treatmentId?: number;
}

export class RunPipelineDto {
  @ApiProperty({
    description: 'Alimentación de entrada',
    type: PipelineFeedDto,
  })
  @ValidateNested()
  @Type(() => PipelineFeedDto)
  feed: PipelineFeedDto;

  @ApiProperty({
    description: 'Pasos del proceso en serie',
    type: [PipelineStepDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20) // endpoint público: acota el cómputo por petición
  @ValidateNested({ each: true })
  @Type(() => PipelineStepDto)
  steps: PipelineStepDto[];

  @ApiPropertyOptional({
    description:
      'Si true, redimensiona equipos no conformes hasta cumplir especificaciones (modo bidireccional)',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  designForCompliance?: boolean;
}
