import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from '../../base';
import { UserResponseDto } from '../../users/dto/user-response.dto';
import { Treatment } from '../entities/treatment.entity';

/**
 * DTO para la respuesta de un tratamiento.
 * Incluye todos los campos del tratamiento más información del usuario creador.
 */
export class TreatmentResponseDto extends BaseResponseDto {
  @ApiProperty({
    description: 'Nombre del tratamiento',
    example: 'Tratamiento de crudo',
  })
  name: string;

  @ApiProperty({
    description: 'Descripción del tratamiento',
    example: 'Tratamiento para crudo pesado',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Tipo de tratamiento',
    example: 'Deshidratación',
  })
  type: string;

  @ApiProperty({ description: 'Flujo total (bpd)', example: 5000 })
  totalFlow: number;

  @ApiProperty({ description: 'Fracción de agua', example: 0.3 })
  waterFraction: number;

  @ApiProperty({ description: 'Temperatura de entrada (°F)', example: 120 })
  inputTemperature: number;

  @ApiProperty({ description: 'Temperatura de tratamiento (°F)', example: 180 })
  treatmentTemperature: number;

  @ApiProperty({
    description: 'Tiempo de retención de aceite (min)',
    example: 30,
  })
  oilRetentionTime: number;

  @ApiProperty({
    description: 'Tiempo de retención de agua (min)',
    example: 20,
  })
  waterRetentionTime: number;

  @ApiProperty({ description: 'Velocidad del viento (mph)', example: 10 })
  windSpeed: number;

  @ApiProperty({ description: 'Gravedad API del crudo', example: 32 })
  apiGravity: number;

  @ApiProperty({
    description: 'Flujo de aceite calculado (bpd)',
    example: 3500,
  })
  calculatedOilFlow: number;

  @ApiProperty({ description: 'Flujo de agua calculado (bpd)', example: 1500 })
  calculatedWaterFlow: number;

  @ApiProperty({
    description: 'Volumen de retención de aceite (bbl)',
    example: 500,
  })
  oilRetentionVolume: number;

  @ApiProperty({
    description: 'Volumen de retención de agua (bbl)',
    example: 300,
  })
  waterRetentionVolume: number;

  @ApiProperty({ description: 'Calor requerido (BTU/hr)', example: 1500000 })
  requiredHeat: number;

  @ApiProperty({ description: 'Pérdida de calor (BTU/hr)', example: 150000 })
  heatLoss: number;

  @ApiProperty({ description: 'Calor total (BTU/hr)', example: 1650000 })
  totalHeat: number;

  @ApiProperty({ description: 'Diámetro seleccionado (pulg)', example: 48 })
  selectedDiameter: number;

  @ApiProperty({ description: 'Longitud seleccionada (pies)', example: 20 })
  selectedLength: number;

  @ApiProperty({
    type: UserResponseDto,
    description: 'Usuario creador del tratamiento',
  })
  createdBy: UserResponseDto;

  constructor(treatment: Treatment) {
    super(treatment);
    this.name = treatment.name;
    this.description = treatment.description;
    this.type = treatment.type;
    this.totalFlow = treatment.totalFlow;
    this.waterFraction = treatment.waterFraction;
    this.inputTemperature = treatment.inputTemperature;
    this.treatmentTemperature = treatment.treatmentTemperature;
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
    this.createdBy = new UserResponseDto(treatment.createdBy);
  }
}
