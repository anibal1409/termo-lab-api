import { filter, map, Observable } from 'rxjs';

import {
  Body,
  Controller,
  Delete,
  Get,
  MessageEvent,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators';
import { AdminGuard } from '../../auth/guards';
import {
  CreateChannelDto,
  CreateDeviceDto,
  CreatePidDto,
  CreateRuleDto,
  RawCommandDto,
  ReadingsQueryDto,
  UpdateChannelDto,
  UpdateDeviceDto,
  UpdatePidDto,
  UpdateRuleDto,
  WriteChannelDto,
} from './devices.dto';
import { DevicesService } from './devices.service';
import {
  ChannelReading,
  Device,
  DeviceChannel,
  DeviceCommandLog,
  DeviceRule,
  PidLoop,
} from './entities';

const Id = (name = 'id') => Param(name, ParseIntPipe);

@ApiTags('devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devices: DevicesService) {}

  // ---------- Dispositivos ----------

  @Get()
  @ApiOkResponse({ type: [Device] })
  @ApiOperation({
    summary: 'Dispositivos con sus canales y estado de conexión',
  })
  list() {
    return this.devices.listDevices();
  }

  @Get('ports')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Puertos serie detectados en la máquina de la API' })
  ports() {
    return DevicesService.listPorts();
  }

  @Sse('live')
  @ApiOperation({
    summary: 'Eventos en vivo (SSE): lecturas, escrituras, watchdog, conexión',
  })
  @ApiQuery({ name: 'deviceId', required: false, type: Number })
  live(@Query('deviceId') deviceId?: string): Observable<MessageEvent> {
    return this.devices.live$.pipe(
      filter((e) => !deviceId || e.deviceId === +deviceId),
      map((data) => ({ data })),
    );
  }

  @Post()
  @ApiOkResponse({ type: Device })
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Registra un Arduino' })
  create(@Body() dto: CreateDeviceDto) {
    return this.devices.createDevice(dto);
  }

  @Patch(':id')
  @ApiOkResponse({ type: Device })
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Modifica un Arduino (lo desconecta)' })
  update(@Id() id: number, @Body() dto: UpdateDeviceDto) {
    return this.devices.updateDevice(id, dto);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Elimina un Arduino y su configuración' })
  remove(@Id() id: number) {
    return this.devices.removeDevice(id);
  }

  @Post(':id/connect')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Abre el puerto y configura los pines' })
  connect(@Id() id: number) {
    return this.devices.connect(id);
  }

  @Post(':id/disconnect')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Apaga las salidas y cierra el puerto' })
  disconnect(@Id() id: number) {
    return this.devices.disconnect(id);
  }

  @Post(':id/command')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Envía un comando crudo (diagnóstico)' })
  command(
    @Id() id: number,
    @Body() dto: RawCommandDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.devices.rawCommand(id, dto.command, userId);
  }

  @Get(':id/logs')
  @ApiOkResponse({ type: [DeviceCommandLog] })
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Últimos 200 comandos de escritura' })
  logs(@Id() id: number) {
    return this.devices.logsOf(id);
  }

  // ---------- Canales ----------

  @Post(':id/channels')
  @ApiOkResponse({ type: DeviceChannel })
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Añade un canal (relé, sensor, servo...)' })
  createChannel(@Id() id: number, @Body() dto: CreateChannelDto) {
    return this.devices.createChannel(id, dto);
  }

  @Patch('channels/:channelId')
  @ApiOkResponse({ type: DeviceChannel })
  @UseGuards(AdminGuard)
  updateChannel(@Id('channelId') id: number, @Body() dto: UpdateChannelDto) {
    return this.devices.updateChannel(id, dto);
  }

  @Delete('channels/:channelId')
  @UseGuards(AdminGuard)
  removeChannel(@Id('channelId') id: number) {
    return this.devices.removeChannel(id);
  }

  @Get('channels/:channelId/read')
  @ApiOperation({ summary: 'Lee un canal de entrada ahora' })
  read(@Id('channelId') id: number) {
    return this.devices.readNow(id);
  }

  @Post('channels/:channelId/write')
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Escribe una salida (digital 0/1, pwm 0-255, servo 0-180)',
  })
  write(
    @Id('channelId') id: number,
    @Body() dto: WriteChannelDto,
    @CurrentUser('id') userId: number,
  ) {
    return this.devices.write(id, dto.value, userId);
  }

  @Get('channels/:channelId/readings')
  @ApiOkResponse({ type: [ChannelReading] })
  @ApiOperation({ summary: 'Historial de lecturas (por defecto, última hora)' })
  readings(@Id('channelId') id: number, @Query() q: ReadingsQueryDto) {
    return this.devices.readingsOf(id, q);
  }

  // ---------- Reglas ----------

  @Get('rules')
  @ApiOkResponse({ type: [DeviceRule] })
  listRules() {
    return this.devices.listRules();
  }

  @Post('rules')
  @ApiOkResponse({ type: DeviceRule })
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Crea una regla: si entrada > X entonces salida = Y',
  })
  createRule(@Body() dto: CreateRuleDto) {
    return this.devices.createRule(dto);
  }

  @Patch('rules/:ruleId')
  @ApiOkResponse({ type: DeviceRule })
  @UseGuards(AdminGuard)
  updateRule(@Id('ruleId') id: number, @Body() dto: UpdateRuleDto) {
    return this.devices.updateRule(id, dto);
  }

  @Delete('rules/:ruleId')
  @UseGuards(AdminGuard)
  removeRule(@Id('ruleId') id: number) {
    return this.devices.removeRule(id);
  }

  // ---------- PID ----------

  @Get('pids')
  @ApiOkResponse({ type: [PidLoop] })
  listPids() {
    return this.devices.listPids();
  }

  @Get('pids/status')
  @ApiOperation({
    summary: 'Salida actual de cada PID y si una regla lo anula',
  })
  pidStatus() {
    return this.devices.pidStatus();
  }

  @Post('pids')
  @ApiOkResponse({ type: PidLoop })
  @UseGuards(AdminGuard)
  @ApiOperation({
    summary: 'Crea un lazo PID (se crea desactivado si no se indica)',
  })
  createPid(@Body() dto: CreatePidDto) {
    return this.devices.createPid(dto);
  }

  @Patch('pids/:pidId')
  @ApiOkResponse({ type: PidLoop })
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Cambia consigna, ganancias o activa/desactiva' })
  updatePid(@Id('pidId') id: number, @Body() dto: UpdatePidDto) {
    return this.devices.updatePid(id, dto);
  }

  @Delete('pids/:pidId')
  @UseGuards(AdminGuard)
  removePid(@Id('pidId') id: number) {
    return this.devices.removePid(id);
  }
}
