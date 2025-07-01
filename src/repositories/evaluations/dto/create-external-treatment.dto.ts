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
}
