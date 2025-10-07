import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../../auth/guards';
import {
  ThermalCalculatorService,
  ThermalCalculationResults,
  ThermalTreatmentInput,
} from '../services/thermal-calculator.service';

/**
 * @description Controlador para cálculos térmicos de tratadores
 * @ApiTags Thermal Calculations
 * @ApiBearerAuth
 */
@ApiTags('Thermal Calculations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('thermal-calculations')
export class ThermalCalculationsController {
  constructor(private readonly thermalCalculatorService: ThermalCalculatorService) {}

  /**
   * @description Calcula resultados térmicos completos según metodología del PDF
   * @ApiOperation Calcular resultados térmicos
   * @ApiResponse 200 - Resultados calculados exitosamente
   * @ApiResponse 400 - Datos de entrada inválidos
   * @ApiResponse 401 - No autorizado
   */
  @Post('calculate')
  @ApiOperation({ 
    summary: 'Calcular resultados térmicos completos',
    description: 'Calcula todos los parámetros térmicos según la metodología del PDF y la norma API-12L'
  })
  @ApiResponse({
    status: 200,
    description: 'Resultados térmicos calculados exitosamente',
    type: ThermalCalculationResults,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  calculateThermalResults(@Body() input: ThermalTreatmentInput): ThermalCalculationResults {
    return this.thermalCalculatorService.calculateThermalResults(input);
  }
}
