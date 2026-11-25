import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { calculateSeparator } from './equipment/separator';
import { calculateHeatExchanger } from './equipment/heat-exchanger';
import { calculateStorageTank } from './equipment/storage-tank';
import { calculateThermalTreater } from './equipment/thermal-treater';
import {
  SeparatorInputDto,
  HeatExchangerInputDto,
  StorageTankInputDto,
  ThermalTreaterInputDto,
} from './dto/equipment.dto';

@ApiTags('Simulation - Equipment')
@Controller('simulation/equipment')
export class EquipmentController {
  @Post('separator')
  @ApiOperation({
    summary: 'Calcular separador (horizontal o vertical)',
    description:
      'Dimensiona y/o evalúa un separador bifásico usando Souders-Brown. Autodimensiona si no se dan diámetro/longitud.',
  })
  @ApiBody({ type: SeparatorInputDto })
  @ApiOkResponse({
    description: 'Resultado del separador con capacidades y cumplimiento',
  })
  separator(@Body() dto: SeparatorInputDto) {
    return calculateSeparator(dto);
  }

  @Post('heat-exchanger')
  @ApiOperation({
    summary: 'Calcular intercambiador de calor',
    description:
      'Diseña/evalúa un intercambiador shell & tube por método LMTD. Calcula área, duty, NTU y sizing de tubos.',
  })
  @ApiBody({ type: HeatExchangerInputDto })
  @ApiOkResponse({
    description: 'Resultado del intercambiador con área, duty y temperaturas',
  })
  heatExchanger(@Body() dto: HeatExchangerInputDto) {
    return calculateHeatExchanger(dto);
  }

  @Post('storage-tank')
  @ApiOperation({
    summary: 'Calcular tanque de almacenamiento',
    description:
      'Dimensiona un tanque API 650 según caudal y tiempo de almacenamiento. Estima pérdidas evaporativas.',
  })
  @ApiBody({ type: StorageTankInputDto })
  @ApiOkResponse({
    description: 'Resultado del tanque con capacidad y pérdidas',
  })
  storageTank(@Body() dto: StorageTankInputDto) {
    return calculateStorageTank(dto);
  }

  @Post('thermal-treater')
  @ApiOperation({
    summary: 'Calcular tratador térmico',
    description:
      'Dimensiona/evalúa un tratador térmico según API 12L. Calcula calor, retención y BSW estimado.',
  })
  @ApiBody({ type: ThermalTreaterInputDto })
  @ApiOkResponse({
    description: 'Resultado del tratador con dimensiones, térmico y separación',
  })
  thermalTreater(@Body() dto: ThermalTreaterInputDto) {
    return calculateThermalTreater(dto);
  }
}
