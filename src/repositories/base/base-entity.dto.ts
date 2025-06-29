import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO base abstracto para entidades que heredan de IdEntity.
 * Contiene los campos comunes que pueden ser extendidos por otros DTOs.
 */
export abstract class BaseEntityDto {
  @IsOptional()
  @IsNumber()
  id?: number;
  /**
   * Estado del registro (activo/inactivo).
   * Es opcional y por defecto es true según IdEntity.
   */
  @ApiPropertyOptional({
    description: 'Estado del registro (activo/inactivo).',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
