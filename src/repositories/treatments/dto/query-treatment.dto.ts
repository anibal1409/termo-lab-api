import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { QueryBaseDto } from '../../../common/pagination/dto';

/**
 * DTO para parámetros de consulta específicos de tratamientos
 * Extiende QueryBaseDto para incluir paginación, ordenamiento y búsqueda general
 */
export class QueryTreatmentDto extends QueryBaseDto {
  /**
   * Filtrar por tipo de tratamiento
   */
  @ApiPropertyOptional({
    description: 'Filtrar por tipo de tratamiento',
    example: 'Deshidratación',
  })
  @IsOptional()
  @IsString()
  type?: string;

  /**
   * Filtrar por rango mínimo de flujo total (bpd)
   */
  @ApiPropertyOptional({
    description: 'Filtrar por flujo total mínimo (bpd)',
    example: 1000,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minTotalFlow?: number;

  /**
   * Filtrar por rango máximo de flujo total (bpd)
   */
  @ApiPropertyOptional({
    description: 'Filtrar por flujo total máximo (bpd)',
    example: 5000,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxTotalFlow?: number;

  /**
   * Filtrar por rango mínimo de fracción de agua
   */
  @ApiPropertyOptional({
    description: 'Filtrar por fracción de agua mínima',
    example: 0.1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minWaterFraction?: number;

  /**
   * Filtrar por rango máximo de fracción de agua
   */
  @ApiPropertyOptional({
    description: 'Filtrar por fracción de agua máxima',
    example: 0.5,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxWaterFraction?: number;

  /**
   * Filtrar por rango mínimo de gravedad API
   */
  @ApiPropertyOptional({
    description: 'Filtrar por gravedad API mínima',
    example: 20,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  minApiGravity?: number;

  /**
   * Filtrar por rango máximo de gravedad API
   */
  @ApiPropertyOptional({
    description: 'Filtrar por gravedad API máxima',
    example: 40,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  maxApiGravity?: number;

  /**
   * Filtrar por estado de eliminación lógica
   */
  @ApiPropertyOptional({
    description: 'Filtrar por estado de eliminación lógica',
    example: false,
    type: Boolean,
  })
  @Type(() => Boolean)
  @IsOptional()
  deleted?: boolean;

  /**
   * Filtrar por ID de usuario creador
   */
  @ApiPropertyOptional({
    description: 'Filtrar por ID de usuario creador',
    example: 1,
    type: Number,
  })
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  createdById?: number;

  /**
   * Filtrar por fecha mínima de creación
   */
  @ApiPropertyOptional({
    description: 'Filtrar por fecha mínima de creación (formato YYYY-MM-DD)',
    example: '2023-01-01',
  })
  @IsOptional()
  @IsString()
  minCreatedAt?: string;

  /**
   * Filtrar por fecha máxima de creación
   */
  @ApiPropertyOptional({
    description: 'Filtrar por fecha máxima de creación (formato YYYY-MM-DD)',
    example: '2023-12-31',
  })
  @IsOptional()
  @IsString()
  maxCreatedAt?: string;
}
