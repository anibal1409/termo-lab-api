import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

/**
 * @description DTO para creación de tratadores externos
 * @class CreateExternalTreatmentDto
 */
export class CreateExternalTreatmentDto {
  @ApiProperty({
    description: 'Nombre identificador del tratador',
    example: 'Tratador Field X-102',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Configuración física del tratador',
    enum: ['vertical', 'horizontal'],
    example: 'horizontal',
  })
  @IsEnum(['vertical', 'horizontal'])
  type: string;

  @ApiProperty({
    description: 'Flujo total de emulsión en barriles por día (bpd)',
    example: 500,
  })
  @IsNumber()
  @Min(0)
  totalFlow: number;

  @ApiPropertyOptional({
    description: 'Porcentaje de agua en la emulsión (%)',
    example: 20,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  waterFraction?: number;

  @ApiPropertyOptional({
    description: 'Gravedad API del crudo procesado',
    example: 18,
  })
  @IsNumber()
  @IsOptional()
  apiGravity?: number;

  @ApiPropertyOptional({
    description: 'Tiempo de retención de petróleo en minutos',
    example: 60,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  oilRetentionTime?: number;

  // ===== VARIABLES ADICIONALES SEGÚN TABLA 4-1 DEL PDF =====

  /**
   * @description Diámetro del tratador en pies
   */
  @ApiPropertyOptional({
    description: 'Diámetro del tratador térmico en pies',
    example: 6.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  diameter?: number;

  /**
   * @description Longitud del tratador en pies
   */
  @ApiPropertyOptional({
    description: 'Longitud del tratador térmico en pies',
    example: 20.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  length?: number;

  /**
   * @description Porcentaje de agua libre retirada en el separador
   */
  @ApiPropertyOptional({
    description: 'Porcentaje de agua libre retirada en el separador (%)',
    example: 85.0,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  freeWaterRemovalPercentage?: number;

  /**
   * @description Tamaño de la gota de agua en micrones
   */
  @ApiPropertyOptional({
    description: 'Tamaño de la gota de agua en micrones (µm)',
    example: 150.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  waterDropSize?: number;

  /**
   * @description Gravedad específica del agua
   */
  @ApiPropertyOptional({
    description: 'Gravedad específica del agua (adimensional)',
    example: 1.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  waterSpecificGravity?: number;

  /**
   * @description Calor específico del crudo en BTU/(lb·°F)
   */
  @ApiPropertyOptional({
    description: 'Calor específico del crudo en BTU/(lb·°F)',
    example: 0.45,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  oilSpecificHeat?: number;

  /**
   * @description Calor específico del agua en BTU/(lb·°F)
   */
  @ApiPropertyOptional({
    description: 'Calor específico del agua en BTU/(lb·°F)',
    example: 1.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  waterSpecificHeat?: number;

  /**
   * @description Temperatura del fluido a la entrada del tratador en °F
   */
  @ApiPropertyOptional({
    description: 'Temperatura del fluido a la entrada del tratador en °F',
    example: 75.0,
  })
  @IsNumber()
  @IsOptional()
  inletTemperature?: number;

  /**
   * @description Temperatura ambiente en °F
   */
  @ApiPropertyOptional({
    description: 'Temperatura ambiente en °F',
    example: 30.0,
  })
  @IsNumber()
  @IsOptional()
  ambientTemperature?: number;

  /**
   * @description Presión de operación del tratador en psig
   */
  @ApiPropertyOptional({
    description: 'Presión de operación del tratador en psig',
    example: 50.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  operatingPressure?: number;

  /**
   * @description Densidad del crudo en lb/pie³
   */
  @ApiPropertyOptional({
    description: 'Densidad del crudo en lb/pie³',
    example: 54.8,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  oilDensity?: number;

  /**
   * @description Densidad del agua en lb/pie³
   */
  @ApiPropertyOptional({
    description: 'Densidad del agua en lb/pie³',
    example: 62.4,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  waterDensity?: number;

  /**
   * @description Viscosidad del crudo en centipoises
   */
  @ApiPropertyOptional({
    description: 'Viscosidad del crudo en centipoises (cP)',
    example: 15.5,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  oilViscosity?: number;

  /**
   * @description Factor K (constante de diseño)
   */
  @ApiPropertyOptional({
    description: 'Factor K (constante de diseño)',
    example: 0.5,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  factorK?: number;

  /**
   * @description Nivel desde el fondo al nivel bajo bajo de agua en pulgadas
   */
  @ApiPropertyOptional({
    description: 'Nivel desde el fondo al nivel bajo bajo de agua en pulgadas',
    example: 2.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  lowLowWaterLevel?: number;

  /**
   * @description Nivel desde el fondo al nivel de interfase agua-crudo en pulgadas
   */
  @ApiPropertyOptional({
    description: 'Nivel desde el fondo al nivel de interfase agua-crudo en pulgadas',
    example: 12.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  waterOilInterfaceLevel?: number;

  /**
   * @description Nivel desde el fondo al nivel alto alto de crudo en pulgadas
   */
  @ApiPropertyOptional({
    description: 'Nivel desde el fondo al nivel alto alto de crudo en pulgadas',
    example: 24.0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  highHighOilLevel?: number;
}
