import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para enviar los resultados de los cálculos térmicos.
 * Puede usarse para respuestas parciales o endpoints específicos de cálculo.
 */
export class TreatmentCalculationsDto {
  @ApiProperty({
    description: 'Flujo de petróleo calculado (bpd)',
    example: 400,
  })
  calculatedOilFlow: number;

  @ApiProperty({ description: 'Flujo de agua calculado (bpd)', example: 100 })
  calculatedWaterFlow: number;

  @ApiProperty({
    description: 'Volumen retención petróleo (bbl)',
    example: 16.67,
  })
  oilRetentionVolume: number;

  @ApiProperty({ description: 'Volumen retención agua (bbl)', example: 2.08 })
  waterRetentionVolume: number;

  @ApiProperty({ description: 'Calor requerido (BTU/hr)', example: 262210 })
  requiredHeat: number;

  @ApiProperty({ description: 'Pérdidas de calor (BTU/hr)', example: 87120 })
  heatLoss: number;

  @ApiProperty({ description: 'Calor total (BTU/hr)', example: 349330 })
  totalHeat: number;

  @ApiProperty({ description: 'Diámetro recomendado (ft)', example: 4 })
  recommendedDiameter: number;

  @ApiProperty({ description: 'Longitud recomendada (ft)', example: 15 })
  recommendedLength: number;

  @ApiProperty({ description: 'Presión recomendada (psig)', example: 50 })
  recommendedPressure: number;
}
