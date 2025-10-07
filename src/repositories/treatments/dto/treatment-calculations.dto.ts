import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para enviar los resultados de los cálculos térmicos según API-12L.
 * Incluye todos los cálculos realizados según las fórmulas de la norma.
 */
export class TreatmentCalculationsDto {
  @ApiProperty({
    description: 'Flujo de petróleo calculado según API-12L (bpd)',
    example: 400,
  })
  calculatedOilFlow: number;

  @ApiProperty({ 
    description: 'Flujo de agua calculado según API-12L (bpd)', 
    example: 100 
  })
  calculatedWaterFlow: number;

  @ApiProperty({
    description: 'Volumen de retención de petróleo según API-12L (bbl)',
    example: 16.67,
  })
  oilRetentionVolume: number;

  @ApiProperty({ 
    description: 'Volumen de retención de agua según API-12L (bbl)', 
    example: 2.08 
  })
  waterRetentionVolume: number;

  @ApiProperty({ 
    description: 'Capacidad de calor requerida según API-12L (BTU/hr)', 
    example: 262210 
  })
  requiredHeatCapacity: number;

  @ApiProperty({ 
    description: 'Pérdidas de calor según API-12L (BTU/hr)', 
    example: 87120 
  })
  heatLoss: number;

  @ApiProperty({ 
    description: 'Calor total requerido según API-12L (BTU/hr)', 
    example: 349330 
  })
  totalHeat: number;

  @ApiProperty({ 
    description: 'Diámetro recomendado según API-12L (ft)', 
    example: 4 
  })
  recommendedDiameter: number;

  @ApiProperty({ 
    description: 'Longitud recomendada según API-12L (ft)', 
    example: 15 
  })
  recommendedLength: number;

  @ApiProperty({ 
    description: 'Presión de diseño recomendada según API-12L (psig)', 
    example: 50 
  })
  recommendedPressure: number;

  @ApiProperty({
    description: 'Lista de tratadores recomendados según API-12L',
    type: [String],
    example: [
      'Tratador horizontal 4ft - LSS 15 - 250000 BTU/hr',
      'Tratador horizontal 6ft - LSS 12 - 500000 BTU/hr'
    ]
  })
  recommendedTreaters: string[];

  @ApiProperty({
    description: 'Volumen de retención total requerido (bbl)',
    example: 16.67,
  })
  requiredRetentionVolume: number;

  @ApiProperty({
    description: 'Tiempo de residencia estimado (minutos)',
    example: 30,
  })
  estimatedResidenceTime: number;
}
