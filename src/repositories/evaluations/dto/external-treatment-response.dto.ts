import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

/**
 * @description DTO para respuesta de tratadores externos
 * @class ExternalTreatmentResponseDto
 */
export class ExternalTreatmentResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID único del tratador externo',
  })
  id: number;

  @ApiProperty({
    example: 'Tratador Field X-102',
    description: 'Nombre identificador',
  })
  name: string;

  @ApiProperty({
    enum: ['vertical', 'horizontal'],
    example: 'horizontal',
    description: 'Configuración física del tratador',
  })
  type: string;

  @ApiProperty({
    example: 500,
    description: 'Flujo total en barriles por día (bpd)',
  })
  totalFlow: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Porcentaje de agua en emulsión',
  })
  waterFraction?: number;

  @ApiPropertyOptional({
    example: 18,
    description: 'Gravedad API del crudo',
  })
  apiGravity?: number;

  @ApiPropertyOptional({
    example: 60,
    description: 'Tiempo de retención en minutos',
  })
  oilRetentionTime?: number;

  constructor(data: Partial<ExternalTreatmentResponseDto>) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.type = data.type || '';
    this.totalFlow = data.totalFlow || 0;
    this.waterFraction = data.waterFraction;
    this.apiGravity = data.apiGravity;
    this.oilRetentionTime = data.oilRetentionTime;
  }
}
