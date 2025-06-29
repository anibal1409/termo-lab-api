import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base';

/**
 * DTO para representar un tratamiento en listados.
 * Contiene solo información básica para optimizar rendimiento.
 */
export class TreatmentListDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Nombre del tratamiento',
    example: 'Tratamiento para crudo 18°API',
  })
  name: string;

  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
  })
  type: string;

  @ApiProperty({
    description: 'Flujo total de emulsión (bpd)',
    example: 500,
  })
  totalFlow: number;

  @ApiProperty({
    description: 'Gravedad API del crudo',
    example: 18,
  })
  apiGravity: number;

  @ApiProperty({
    description: 'Diámetro seleccionado (ft)',
    example: 4,
  })
  selectedDiameter: number;

  @ApiProperty({
    description: 'Longitud seleccionada (ft)',
    example: 15,
  })
  selectedLength: number;

  constructor(treatment: any) {
    super(treatment);
    this.name = treatment.name;
    this.type = treatment.type;
    this.totalFlow = treatment.totalFlow;
    this.apiGravity = treatment.apiGravity;
    this.selectedDiameter = treatment.selectedDiameter;
    this.selectedLength = treatment.selectedLength;
  }
}
