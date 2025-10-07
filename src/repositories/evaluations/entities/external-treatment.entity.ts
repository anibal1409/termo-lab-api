import {
  Column,
  Entity,
} from 'typeorm';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

import { IdEntity } from '../../base';

/**
 * @description Entidad para tratadores no registrados en el sistema.
 * Almacena todos los datos técnicos necesarios para evaluar un tratador externo.
 */
@Entity('external_treatments')
export class ExternalTreatment extends IdEntity {
  /**
   * @description Nombre identificador del tratador externo
   */
  @ApiProperty({
    description: 'Nombre o identificador del tratador externo',
    example: 'Tratador Field X-102',
    maxLength: 255,
  })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  /**
   * @description Tipo de tratador (vertical/horizontal)
   */
  @ApiProperty({
    description: 'Configuración física del tratador',
    enum: ['vertical', 'horizontal'],
    example: 'horizontal',
  })
  @Column({ type: 'varchar', length: 20 })
  type: string;

  /**
   * @description Flujo total de emulsión
   */
  @ApiProperty({
    description: 'Flujo total de emulsión en barriles por día (bpd)',
    example: 500,
  })
  @Column('decimal', { precision: 10, scale: 2 })
  totalFlow: number;

  /**
   * @description Porcentaje de agua en la emulsión
   */
  @ApiPropertyOptional({
    description: 'Porcentaje de agua en la emulsión (%)',
    example: 20,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  waterFraction?: number;

  /**
   * @description Gravedad API del crudo
   */
  @ApiPropertyOptional({
    description: 'Gravedad API del crudo procesado',
    example: 18,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  apiGravity?: number;

  /**
   * @description Tiempo de retención de petróleo
   */
  @ApiPropertyOptional({
    description: 'Tiempo de retención de petróleo en minutos',
    example: 60,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  oilRetentionTime?: number;

  // ===== VARIABLES ADICIONALES SEGÚN TABLA 4-1 DEL PDF =====

  /**
   * @description Diámetro del tratador en pies
   */
  @ApiPropertyOptional({
    description: 'Diámetro del tratador térmico en pies',
    example: 6.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  diameter?: number;

  /**
   * @description Longitud del tratador en pies
   */
  @ApiPropertyOptional({
    description: 'Longitud del tratador térmico en pies',
    example: 20.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  length?: number;

  /**
   * @description Porcentaje de agua libre retirada en el separador
   */
  @ApiPropertyOptional({
    description: 'Porcentaje de agua libre retirada en el separador (%)',
    example: 85.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  freeWaterRemovalPercentage?: number;

  /**
   * @description Tamaño de la gota de agua en micrones
   */
  @ApiPropertyOptional({
    description: 'Tamaño de la gota de agua en micrones (µm)',
    example: 150.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  waterDropSize?: number;

  /**
   * @description Gravedad específica del agua
   */
  @ApiPropertyOptional({
    description: 'Gravedad específica del agua (adimensional)',
    example: 1.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  waterSpecificGravity?: number;

  /**
   * @description Calor específico del crudo en BTU/(lb·°F)
   */
  @ApiPropertyOptional({
    description: 'Calor específico del crudo en BTU/(lb·°F)',
    example: 0.45,
  })
  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  oilSpecificHeat?: number;

  /**
   * @description Calor específico del agua en BTU/(lb·°F)
   */
  @ApiPropertyOptional({
    description: 'Calor específico del agua en BTU/(lb·°F)',
    example: 1.0,
  })
  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  waterSpecificHeat?: number;

  /**
   * @description Temperatura del fluido a la entrada del tratador en °F
   */
  @ApiPropertyOptional({
    description: 'Temperatura del fluido a la entrada del tratador en °F',
    example: 75.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  inletTemperature?: number;

  /**
   * @description Temperatura ambiente en °F
   */
  @ApiPropertyOptional({
    description: 'Temperatura ambiente en °F',
    example: 30.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  ambientTemperature?: number;

  /**
   * @description Presión de operación del tratador en psig
   */
  @ApiPropertyOptional({
    description: 'Presión de operación del tratador en psig',
    example: 50.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  operatingPressure?: number;

  /**
   * @description Densidad del crudo en lb/pie³
   */
  @ApiPropertyOptional({
    description: 'Densidad del crudo en lb/pie³',
    example: 54.8,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  oilDensity?: number;

  /**
   * @description Densidad del agua en lb/pie³
   */
  @ApiPropertyOptional({
    description: 'Densidad del agua en lb/pie³',
    example: 62.4,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  waterDensity?: number;

  /**
   * @description Viscosidad del crudo en centipoises
   */
  @ApiPropertyOptional({
    description: 'Viscosidad del crudo en centipoises (cP)',
    example: 15.5,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  oilViscosity?: number;

  /**
   * @description Factor K (constante de diseño)
   */
  @ApiPropertyOptional({
    description: 'Factor K (constante de diseño)',
    example: 0.5,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  factorK?: number;

  /**
   * @description Nivel desde el fondo al nivel bajo bajo de agua en pulgadas
   */
  @ApiPropertyOptional({
    description: 'Nivel desde el fondo al nivel bajo bajo de agua en pulgadas',
    example: 2.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  lowLowWaterLevel?: number;

  /**
   * @description Nivel desde el fondo al nivel de interfase agua-crudo en pulgadas
   */
  @ApiPropertyOptional({
    description: 'Nivel desde el fondo al nivel de interfase agua-crudo en pulgadas',
    example: 12.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  waterOilInterfaceLevel?: number;

  /**
   * @description Nivel desde el fondo al nivel alto alto de crudo en pulgadas
   */
  @ApiPropertyOptional({
    description: 'Nivel desde el fondo al nivel alto alto de crudo en pulgadas',
    example: 24.0,
  })
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  highHighOilLevel?: number;
}
