import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base';
import { UserResponseDto } from '../../users/dto/user-response.dto';

/**
 * DTO para la respuesta detallada de un tratamiento térmico.
 * Incluye todos los campos de cálculo y diseño según API-12L.
 */
export class TreatmentResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Nombre del tratamiento',
    example: 'Tratamiento para crudo 18°API',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del tratamiento',
    example: 'Diseño para 500 bbl/día con 20% agua',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Tipo de tratador (vertical/horizontal)',
    example: 'horizontal',
    enum: ['vertical', 'horizontal'],
  })
  type: string;

  @ApiProperty({ description: 'Flujo total de emulsión (bpd)', example: 500 })
  totalFlow: number;

  @ApiProperty({ description: 'Fracción de agua (%)', example: 20 })
  waterFraction: number;

  @ApiProperty({ description: 'Temperatura de entrada (°F)', example: 75 })
  inputTemperature: number;

  @ApiProperty({ description: 'Temperatura de tratamiento (°F)', example: 140 })
  treatmentTemperature: number;

  @ApiProperty({ description: 'Temperatura ambiente (°F)', example: 30 })
  ambientTemperature: number;

  @ApiProperty({ description: 'Tiempo retención petróleo (min)', example: 60 })
  oilRetentionTime: number;

  @ApiProperty({ description: 'Tiempo retención agua (min)', example: 30 })
  waterRetentionTime: number;

  @ApiProperty({ description: 'Velocidad del viento (mph)', example: 15 })
  windSpeed: number;

  @ApiProperty({ description: 'Gravedad API del crudo', example: 18 })
  apiGravity: number;

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

  @ApiProperty({ description: 'Diámetro seleccionado (ft)', example: 4 })
  selectedDiameter: number;

  @ApiProperty({ description: 'Longitud seleccionada (ft)', example: 15 })
  selectedLength: number;

  @ApiProperty({ description: 'Presión de diseño (psig)', example: 50 })
  designPressure: number;

  @ApiProperty({
    description: 'Usuario creador del tratamiento',
    type: UserResponseDto,
  })
  createdBy: UserResponseDto;

  constructor(treatment: any) {
    super(treatment);
    this.name = treatment.name;
    this.description = treatment.description;
    this.type = treatment.type;
    this.totalFlow = treatment.totalFlow;
    this.waterFraction = treatment.waterFraction;
    this.inputTemperature = treatment.inputTemperature;
    this.treatmentTemperature = treatment.treatmentTemperature;
    this.ambientTemperature = treatment.ambientTemperature;
    this.oilRetentionTime = treatment.oilRetentionTime;
    this.waterRetentionTime = treatment.waterRetentionTime;
    this.windSpeed = treatment.windSpeed;
    this.apiGravity = treatment.apiGravity;
    this.calculatedOilFlow = treatment.calculatedOilFlow;
    this.calculatedWaterFlow = treatment.calculatedWaterFlow;
    this.oilRetentionVolume = treatment.oilRetentionVolume;
    this.waterRetentionVolume = treatment.waterRetentionVolume;
    this.requiredHeat = treatment.requiredHeat;
    this.heatLoss = treatment.heatLoss;
    this.totalHeat = treatment.totalHeat;
    this.selectedDiameter = treatment.selectedDiameter;
    this.selectedLength = treatment.selectedLength;
    this.designPressure = treatment.designPressure;
    this.createdBy = new UserResponseDto(treatment.createdBy);
  }
}
