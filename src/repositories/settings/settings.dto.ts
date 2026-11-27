import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, Max, Min } from 'class-validator';

/** Settings institucionales. Lo que no venga en PUT conserva su valor. */
export class AppSettingsDto {
  @ApiProperty({
    description: 'Factor de seguridad de diseño (%)',
    default: 15,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  safetyFactorPct: number;

  @ApiProperty({ description: 'Límite BSW de crudo tratado (%)', default: 0.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  bswLimitPct: number;

  @ApiProperty({ enum: ['api12l', 'stewart'], default: 'api12l' })
  @IsIn(['api12l', 'stewart'])
  calcMode: 'api12l' | 'stewart';

  // ── Fluidos ──
  @ApiPropertyOptional({ description: '°API por defecto' })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(100)
  defaultApiGravity?: number;

  @ApiPropertyOptional({ description: '% agua por defecto' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  defaultWaterFractionPct?: number;

  @ApiPropertyOptional({ description: 'cp crudo BTU/(lb·°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  defaultCpOilBtu?: number;

  @ApiPropertyOptional({ description: 'cp agua BTU/(lb·°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  @Max(10)
  defaultCpWaterBtu?: number;

  // ── Tolerancias / gemelo ──
  @ApiPropertyOptional({ description: 'RMSE gemelo "excelente" máx (°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  twinRmseExcellentMax?: number;

  @ApiPropertyOptional({ description: 'RMSE gemelo "aceptable" máx (°F)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  twinRmseAcceptableMax?: number;

  @ApiPropertyOptional({ description: 'BSW conforme máx en muestras (%)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  sampleBswConformMax?: number;

  @ApiPropertyOptional({ description: 'Aceite en agua conforme máx (ppm)' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  sampleOiwConformMaxPpm?: number;
}

/** PUT parcial: mismas validaciones, todo opcional. */
export class UpdateAppSettingsDto extends PartialType(AppSettingsDto) {}

export class AppSettingsResponseDto extends AppSettingsDto {
  @ApiProperty({ description: 'Versión (se incrementa en cada cambio)' })
  version: number;

  @ApiProperty() updatedAt: Date;

  @ApiPropertyOptional({ description: 'Usuario que hizo el último cambio' })
  updatedById?: number;
}

export const DEFAULT_SETTINGS: AppSettingsDto = {
  safetyFactorPct: 15,
  bswLimitPct: 0.5,
  calcMode: 'api12l',
  defaultApiGravity: 18,
  defaultWaterFractionPct: 20,
  defaultCpOilBtu: 0.5,
  defaultCpWaterBtu: 1.0,
  twinRmseExcellentMax: 1.0,
  twinRmseAcceptableMax: 3.0,
  sampleBswConformMax: 0.5,
  sampleOiwConformMaxPpm: 50,
};
