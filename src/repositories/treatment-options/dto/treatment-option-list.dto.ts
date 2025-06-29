import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base';

/**
 * DTO para representar una opción de tratamiento en listados.
 * Contiene solo información básica para optimizar rendimiento.
 */
export class TreatmentOptionListDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
  })
  type: string;

  @ApiProperty({
    description: 'Diámetro exterior (ft)',
    example: 4,
  })
  diameter: number;

  @ApiProperty({
    description: 'Longitud estándar (ft)',
    example: 15,
  })
  length: number;

  @ApiProperty({
    description: 'Presión de diseño (psig)',
    example: 50,
  })
  designPressure: number;

  @ApiProperty({
    description: 'Capacidad mínima de calor (BTU/hr)',
    example: 250000,
  })
  minHeatCapacity: number;

  /**
   * Constructor para mapear una entidad TreatmentOption a un TreatmentOptionListDto
   * @param treatmentOption La entidad TreatmentOption de origen
   */
  constructor(treatmentOption: any) {
    super(treatmentOption);
    this.type = treatmentOption.type;
    this.diameter = treatmentOption.diameter;
    this.length = treatmentOption.length;
    this.designPressure = treatmentOption.designPressure;
    this.minHeatCapacity = treatmentOption.minHeatCapacity;
  }
}
