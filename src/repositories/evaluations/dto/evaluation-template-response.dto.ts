import { ApiProperty } from '@nestjs/swagger';

/**
 * @description DTO para respuesta al crear una plantilla
 * @class EvaluationTemplateResponseDto
 */
export class EvaluationTemplateResponseDto {
  @ApiProperty({ example: 1, description: 'ID de la plantilla creada' })
  id: number;

  @ApiProperty({
    example: 'Evaluación API-12L para tratadores horizontales',
    description: 'Nombre de la plantilla',
  })
  name: string;

  @ApiProperty({
    example: '1.0.0',
    description: 'Versión de la plantilla',
  })
  version: string;

  @ApiProperty({
    enum: ['vertical', 'horizontal', 'ambos'],
    example: 'horizontal',
    description: 'Tipo de tratador aplicable',
  })
  applicableTo: string;

  @ApiProperty({
    example: 5,
    description: 'Cantidad de criterios incluidos',
  })
  criteriaCount: number;

  @ApiProperty({
    example: '2023-10-27T10:30:00Z',
    description: 'Fecha de creación',
  })
  createdAt: string;

  constructor(data: Partial<EvaluationTemplateResponseDto>) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.version = data.version || '';
    this.applicableTo = data.applicableTo || '';
    this.criteriaCount = data.criteriaCount || 0;
    this.createdAt = data.createdAt || '';
  }
}
