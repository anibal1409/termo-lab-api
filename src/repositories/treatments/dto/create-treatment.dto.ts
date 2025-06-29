import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para la creación de un tratamiento térmico según API-12L.
 * Incluye validaciones con mensajes de error personalizados.
 */
export class CreateTreatmentDto {
  @ApiProperty({
    description: 'Nombre del tratamiento',
    example: 'Tratamiento para crudo 18°API',
  })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  name: string;

  @ApiProperty({
    description: 'Descripción del tratamiento',
    example: 'Diseño para 500 bbl/día con 20% agua',
    required: false,
  })
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
  })
  @IsString({ message: 'El tipo debe ser una cadena de texto' })
  @IsIn(['vertical', 'horizontal'], {
    message: 'El tipo debe ser "vertical" u "horizontal"',
  })
  @IsNotEmpty({ message: 'El tipo no puede estar vacío' })
  type: string;

  @ApiProperty({
    description: 'Flujo total de emulsión (bpd)',
    example: 500,
  })
  @IsNumber({}, { message: 'El flujo total debe ser un número' })
  @Min(0.1, { message: 'El flujo total debe ser mayor a 0' })
  @Max(100000, { message: 'El flujo total no puede exceder 100,000 bpd' })
  @IsNotEmpty({ message: 'El flujo total no puede estar vacío' })
  totalFlow: number;

  @ApiProperty({
    description: 'Fracción de agua (%)',
    example: 20,
  })
  @IsNumber({}, { message: 'La fracción de agua debe ser un número' })
  @Min(0, { message: 'La fracción de agua no puede ser negativa' })
  @Max(100, { message: 'La fracción de agua no puede exceder 100%' })
  @IsNotEmpty({ message: 'La fracción de agua no puede estar vacía' })
  waterFraction: number;

  @ApiProperty({
    description: 'Temperatura de entrada (°F)',
    example: 75,
  })
  @IsNumber({}, { message: 'La temperatura de entrada debe ser un número' })
  @Min(-20, { message: 'La temperatura de entrada no puede ser menor a -20°F' })
  @Max(300, { message: 'La temperatura de entrada no puede exceder 300°F' })
  @IsNotEmpty({ message: 'La temperatura de entrada no puede estar vacía' })
  inputTemperature: number;

  @ApiProperty({
    description: 'Temperatura de tratamiento (°F)',
    example: 140,
  })
  @IsNumber({}, { message: 'La temperatura de tratamiento debe ser un número' })
  @Min(50, {
    message: 'La temperatura de tratamiento no puede ser menor a 50°F',
  })
  @Max(400, { message: 'La temperatura de tratamiento no puede exceder 400°F' })
  @IsNotEmpty({ message: 'La temperatura de tratamiento no puede estar vacía' })
  treatmentTemperature: number;

  @ApiProperty({
    description: 'Temperatura ambiente (°F)',
    example: 30,
  })
  @IsNumber({}, { message: 'La temperatura ambiente debe ser un número' })
  @Min(-50, { message: 'La temperatura ambiente no puede ser menor a -50°F' })
  @Max(150, { message: 'La temperatura ambiente no puede exceder 150°F' })
  @IsNotEmpty({ message: 'La temperatura ambiente no puede estar vacía' })
  ambientTemperature: number;

  @ApiProperty({
    description: 'Tiempo retención petróleo (min)',
    example: 60,
  })
  @IsNumber(
    {},
    { message: 'El tiempo de retención de petróleo debe ser un número' },
  )
  @Min(1, {
    message: 'El tiempo de retención de petróleo debe ser al menos 1 minuto',
  })
  @Max(240, {
    message: 'El tiempo de retención de petróleo no puede exceder 240 minutos',
  })
  @IsNotEmpty({
    message: 'El tiempo de retención de petróleo no puede estar vacío',
  })
  oilRetentionTime: number;

  @ApiProperty({
    description: 'Tiempo retención agua (min)',
    example: 30,
  })
  @IsNumber(
    {},
    { message: 'El tiempo de retención de agua debe ser un número' },
  )
  @Min(1, {
    message: 'El tiempo de retención de agua debe ser al menos 1 minuto',
  })
  @Max(120, {
    message: 'El tiempo de retención de agua no puede exceder 120 minutos',
  })
  @IsNotEmpty({
    message: 'El tiempo de retención de agua no puede estar vacío',
  })
  waterRetentionTime: number;

  @ApiProperty({
    description: 'Velocidad del viento (mph)',
    example: 15,
  })
  @IsNumber({}, { message: 'La velocidad del viento debe ser un número' })
  @Min(0, { message: 'La velocidad del viento no puede ser negativa' })
  @Max(100, { message: 'La velocidad del viento no puede exceder 100 mph' })
  @IsNotEmpty({ message: 'La velocidad del viento no puede estar vacía' })
  windSpeed: number;

  @ApiProperty({
    description: 'Gravedad API del crudo',
    example: 18,
  })
  @IsNumber({}, { message: 'La gravedad API debe ser un número' })
  @Min(5, { message: 'La gravedad API no puede ser menor a 5°' })
  @Max(50, { message: 'La gravedad API no puede exceder 50°' })
  @IsNotEmpty({ message: 'La gravedad API no puede estar vacía' })
  apiGravity: number;
}
