import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  Min,
  Max,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MoleFractionDto {
  @ApiProperty({ description: 'Nombre o fórmula del componente', example: 'Methane' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Fracción molar', example: 0.4 })
  @IsNumber()
  @Min(0)
  moleFraction: number;
}

export class ChromatographyInputDto {
  @ApiProperty({ description: 'Grados API del crudo', example: 22 })
  @IsNumber()
  @Min(5)
  @Max(60)
  apiGravity: number;

  @ApiPropertyOptional({
    description:
      'GOR scf/bbl. Si no se da y hay gasFlow_MMSCFD + caudal de aceite, se calcula. Si no hay nada, se estima por °API.',
    example: 150,
  })
  @IsOptional()
  @IsNumber()
  gor?: number;

  @ApiPropertyOptional({ description: 'Fracción molar de agua en el sistema', example: 0.1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(0.99)
  waterMolFrac?: number;

  @ApiPropertyOptional({
    description:
      'Caudal diario bruto de líquido (BPD). Con BSW se obtiene aceite y, con GOR, el gas.',
    example: 5000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalFlow_BPD?: number;

  @ApiPropertyOptional({
    description: 'Caudal de aceite BPD (si no se da, se deriva de totalFlow_BPD y BSW/waterFraction)',
    example: 3500,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  oilFlow_BPD?: number;

  @ApiPropertyOptional({ description: 'BSW % (0–100) para derivar aceite del bruto', example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  bsw?: number;

  @ApiPropertyOptional({ description: 'Fracción de agua 0–1 (legacy)', example: 0.3 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  waterFraction?: number;

  @ApiPropertyOptional({
    description:
      'Caudal de gas MMSCFD. Si se omite, se calcula automáticamente: oilFlow × GOR / 1e6',
    example: 0.525,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  gasFlow_MMSCFD?: number;

  @ApiPropertyOptional({
    description: 'Composición molar cargada (si se da, se usa en lugar de generar desde °API)',
    type: [MoleFractionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoleFractionDto)
  composition?: MoleFractionDto[];
}

export class FlashInputDto {
  @ApiProperty({ description: 'Grados API del crudo', example: 22 })
  @IsNumber()
  @Min(5)
  @Max(60)
  apiGravity: number;

  @ApiProperty({ description: 'Temperatura en °C', example: 80 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ description: 'Presión en kPa', example: 500 })
  @IsNumber()
  @Min(1)
  pressure: number;

  @ApiPropertyOptional({ description: 'GOR en scf/bbl', example: 150 })
  @IsOptional()
  @IsNumber()
  gor?: number;

  @ApiPropertyOptional({ description: 'Fracción molar de agua', example: 0.1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(0.99)
  waterMolFrac?: number;

  @ApiPropertyOptional({
    description: 'Ecuación de estado',
    enum: ['PR', 'SRK'],
    example: 'PR',
  })
  @IsOptional()
  eos?: 'PR' | 'SRK';

  @ApiPropertyOptional({
    description:
      'Composición personalizada: array de {name, moleFraction}. Si se da, ignora apiGravity/gor.',
    type: [MoleFractionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoleFractionDto)
  customComposition?: MoleFractionDto[];
}

export class FluidPropertiesInputDto {
  @ApiProperty({ description: 'Grados API del crudo', example: 22 })
  @IsNumber()
  @Min(5)
  @Max(60)
  apiGravity: number;

  @ApiProperty({ description: 'Temperatura en °C', example: 80 })
  @IsNumber()
  temperature: number;

  @ApiProperty({ description: 'Presión en kPa', example: 500 })
  @IsNumber()
  @Min(1)
  pressure: number;

  @ApiPropertyOptional({ description: 'GOR en scf/bbl', example: 150 })
  @IsOptional()
  @IsNumber()
  gor?: number;

  @ApiPropertyOptional({
    description: 'Ecuación de estado',
    enum: ['PR', 'SRK'],
    example: 'PR',
  })
  @IsOptional()
  eos?: 'PR' | 'SRK';
}
