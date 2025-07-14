import {
  IsNotEmpty,
  IsNumber,
  Max,
  Min,
} from 'class-validator';

// treatment-calculations.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CalculateTreatmentDto {
  @ApiProperty({
    description: 'Flujo total de fluidos (bbl/día)',
    example: 5000,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  totalFlow: number;

  @ApiProperty({
    description: 'Fracción de agua (0-1)',
    example: 0.3,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(1)
  waterFraction: number;

  @ApiProperty({
    description: 'Gravedad API del crudo',
    example: 25,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(50)
  apiGravity: number;

  @ApiProperty({
    description: 'Temperatura de entrada (°F)',
    example: 120,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(60)
  @Max(300)
  inletTemperature: number;

  @ApiProperty({
    description: 'Temperatura objetivo (°F)',
    example: 180,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(250)
  targetTemperature: number;
}

export class TreatmentCalculationsDto {
  @ApiProperty({
    description: 'Capacidad de calor requerida (BTU/hr)',
    example: 2500000,
  })
  requiredHeatCapacity: number;

  @ApiProperty({
    description: 'Volumen de retención requerido (bbl)',
    example: 500,
  })
  requiredRetentionVolume: number;

  @ApiProperty({
    description: 'Tiempo de residencia estimado (minutos)',
    example: 30,
  })
  estimatedResidenceTime: number;

  @ApiProperty({
    description: 'Recomendaciones de tratadores adecuados',
    type: [String],
    example: [
      'Tratador horizontal 10ft - LSS 20',
      'Tratador vertical 8ft - LSS 20',
    ],
  })
  recommendedTreaters: string[];
}
