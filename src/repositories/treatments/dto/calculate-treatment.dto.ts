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
    description: 'Flujo total de emulsión (bbl/día)',
    example: 500,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  totalFlow: number;

  @ApiProperty({
    description: 'Fracción de agua (%)',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(100)
  waterFraction: number;

  @ApiProperty({
    description: 'Temperatura de entrada (°F)',
    example: 75,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(60)
  @Max(300)
  inletTemperature: number;

  @ApiProperty({
    description: 'Temperatura de tratamiento (°F)',
    example: 140,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  @Max(250)
  targetTemperature: number;

  @ApiProperty({
    description: 'Temperatura ambiente (°F)',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(-40)
  @Max(120)
  ambientTemperature: number;

  @ApiProperty({
    description: 'Tiempo de retención del petróleo (minutos)',
    example: 60,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(300)
  oilRetentionTime: number;

  @ApiProperty({
    description: 'Tiempo de retención del agua (minutos)',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(5)
  @Max(150)
  waterRetentionTime: number;

  @ApiProperty({
    description: 'Velocidad del viento (mph)',
    example: 15,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  @Max(50)
  windSpeed: number;

  @ApiProperty({
    description: 'Gravedad API del crudo',
    example: 18,
  })
  @IsNumber()
  @IsNotEmpty()
  @Min(10)
  @Max(50)
  apiGravity: number;
}

