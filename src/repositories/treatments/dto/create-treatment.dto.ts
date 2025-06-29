import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de un tratamiento.
 * Define la estructura de los datos esperados al crear un nuevo tratamiento.
 */
export class CreateTreatmentDto {
  @ApiProperty({
    description: 'Nombre del tratamiento',
    example: 'Tratamiento de crudo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descripción del tratamiento',
    example: 'Tratamiento para crudo pesado',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Tipo de tratamiento',
    example: 'Deshidratación',
  })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Flujo total (bpd)', example: 5000 })
  @IsNumber()
  @IsNotEmpty()
  totalFlow: number;

  @ApiProperty({ description: 'Fracción de agua', example: 0.3 })
  @IsNumber()
  @IsNotEmpty()
  waterFraction: number;

  @ApiProperty({ description: 'Temperatura de entrada (°F)', example: 120 })
  @IsNumber()
  @IsNotEmpty()
  inputTemperature: number;

  @ApiProperty({ description: 'Temperatura de tratamiento (°F)', example: 180 })
  @IsNumber()
  @IsNotEmpty()
  treatmentTemperature: number;

  @ApiProperty({
    description: 'Tiempo de retención de aceite (min)',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  oilRetentionTime: number;

  @ApiProperty({
    description: 'Tiempo de retención de agua (min)',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  waterRetentionTime: number;

  @ApiProperty({ description: 'Velocidad del viento (mph)', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  windSpeed: number;

  @ApiProperty({ description: 'Gravedad API del crudo', example: 32 })
  @IsNumber()
  @IsNotEmpty()
  apiGravity: number;
}
