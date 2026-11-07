import { Subject } from 'rxjs';
import { SerialPort } from 'serialport';
import { Between, Repository } from 'typeorm';

import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  calibrate,
  ChannelType,
  evalRule,
  isOutput,
  parseValue,
  pidStep,
  PidState,
  readCommand,
  setupCommands,
  timeProportional,
  validatePins,
  writeCommand,
} from './control';
import {
  CreateChannelDto,
  CreateDeviceDto,
  CreatePidDto,
  CreateRuleDto,
  ReadingsQueryDto,
  UpdateChannelDto,
  UpdateDeviceDto,
  UpdatePidDto,
  UpdateRuleDto,
} from './devices.dto';
import {
  ChannelReading,
  Device,
  DeviceChannel,
  DeviceCommandLog,
  DeviceRule,
  PidLoop,
} from './entities';
import { SerialConnection } from './serial-connection';

const TICK_MS = 250;
const MIN_POLL_MS = 250; // MAX6675 necesita >=220 ms entre conversiones

export interface LiveEvent {
  kind: 'reading' | 'write' | 'watchdog' | 'connection';
  deviceId: number;
  channelId?: number;
  value?: number;
  at: Date;
}

interface PidRuntime extends PidState {
  at?: number;
  output?: number;
  lastDigital?: 0 | 1;
}

@Injectable()
export class DevicesService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DevicesService.name);
  private readonly connections = new Map<number, SerialConnection>();
  private readonly lastPoll = new Map<number, number>();
  private readonly lastError = new Map<number, string>();
  private readonly busy = new Set<number>();
  private readonly ruleActive = new Map<number, boolean>();
  private readonly pidRuntime = new Map<number, PidRuntime>();
  private channels: DeviceChannel[] = [];
  private rules: DeviceRule[] = [];
  private pids: PidLoop[] = [];
  private timer?: NodeJS.Timeout;

  /** Flujo en vivo para SSE: lecturas, escrituras, watchdog y conexiones. */
  readonly live$ = new Subject<LiveEvent>();

  constructor(
    @InjectRepository(Device) private readonly devices: Repository<Device>,
    @InjectRepository(DeviceChannel)
    private readonly channelRepo: Repository<DeviceChannel>,
    @InjectRepository(ChannelReading)
    private readonly readings: Repository<ChannelReading>,
    @InjectRepository(DeviceRule)
    private readonly ruleRepo: Repository<DeviceRule>,
    @InjectRepository(PidLoop) private readonly pidRepo: Repository<PidLoop>,
    @InjectRepository(DeviceCommandLog)
    private readonly logs: Repository<DeviceCommandLog>,
  ) {}

  // ---------------- Ciclo de vida ----------------

  async onModuleInit() {
    await this.reloadConfig();
    const auto = await this.devices.find({ where: { autoConnect: true } });
    for (const d of auto) {
      this.connect(d.id).catch((e) =>
        this.logger.warn(
          `No se pudo conectar ${d.name} (${d.path}): ${e.message}`,
        ),
      );
    }
    this.timer = setInterval(() => this.tick(), TICK_MS);
  }

  async onModuleDestroy() {
    clearInterval(this.timer);
    await Promise.all(
      [...this.connections.keys()].map((id) => this.disconnect(id)),
    );
  }

  /** Recarga en memoria canales, reglas y PID tras cualquier cambio de configuración. */
  private async reloadConfig() {
    [this.channels, this.rules, this.pids] = await Promise.all([
      this.channelRepo.find(),
      this.ruleRepo.find(),
      this.pidRepo.find(),
    ]);
  }

  // ---------------- Conexión ----------------

  static listPorts() {
    return SerialPort.list();
  }

  async connect(deviceId: number) {
    const device = await this.findDevice(deviceId);
    // Recoge también cambios hechos fuera de la API (p. ej. directo en la BD).
    await this.reloadConfig();
    await this.disconnect(deviceId);
    const conn = new SerialConnection(device.path, device.baudRate, {
      onEvent: (pin, value) => this.onEvent(deviceId, pin, value),
      onReady: () => this.configurePins(deviceId),
    });
    try {
      await conn.open();
    } catch (e) {
      throw new ServiceUnavailableException(
        `No se pudo abrir ${device.path}: ${(e as Error).message}`,
      );
    }
    this.connections.set(deviceId, conn);
    this.emit({ kind: 'connection', deviceId, value: 1 });
    return this.status(deviceId);
  }

  /** Apaga las salidas y cierra el puerto. */
  async disconnect(deviceId: number) {
    const conn = this.connections.get(deviceId);
    if (!conn) return this.status(deviceId);
    for (const ch of this.channels.filter(
      (c) => c.deviceId === deviceId && isOutput(c.type),
    )) {
      await conn.send(writeCommand(ch, 0)).catch(() => undefined);
    }
    this.connections.delete(deviceId);
    await conn.close();
    this.emit({ kind: 'connection', deviceId, value: 0 });
    return this.status(deviceId);
  }

  status(deviceId: number) {
    const conn = this.connections.get(deviceId);
    return { deviceId, connected: !!conn?.connected };
  }

  private async configurePins(deviceId: number) {
    const conn = this.connections.get(deviceId);
    for (const ch of this.channels.filter((c) => c.deviceId === deviceId)) {
      for (const cmd of setupCommands(ch)) await conn?.send(cmd);
    }
    for (const p of this.pids) this.pidRuntime.delete(p.id);
  }

  private connFor(ch: DeviceChannel) {
    const conn = this.connections.get(ch.deviceId);
    if (!conn?.connected) {
      throw new ServiceUnavailableException('El dispositivo no está conectado');
    }
    return conn;
  }

  // ---------------- Lectura / escritura ----------------

  async readNow(channelId: number) {
    return this.readChannel(this.findChannel(channelId));
  }

  async write(
    channelId: number,
    value: number,
    userId: number | null,
    source: 'manual' | 'rule' = 'manual',
  ) {
    const ch = this.findChannel(channelId);
    if (!isOutput(ch.type)) {
      throw new BadRequestException(`El canal "${ch.name}" no es de salida`);
    }
    const command = writeCommand(ch, value);
    const response = await this.connFor(ch).send(command);
    await this.logs.insert({
      deviceId: ch.deviceId,
      channelId: ch.id,
      userId: userId ?? undefined,
      source,
      command,
      response,
    });
    const written = +command.split(' ').pop()!;
    this.emit({
      kind: 'write',
      deviceId: ch.deviceId,
      channelId: ch.id,
      value: written,
    });
    return { channelId, value: written, response };
  }

  async rawCommand(deviceId: number, command: string, userId: number) {
    const conn = this.connections.get(deviceId);
    if (!conn?.connected) {
      throw new ServiceUnavailableException('El dispositivo no está conectado');
    }
    const response = await conn.send(command);
    await this.logs.insert({
      deviceId,
      userId,
      source: 'manual',
      command,
      response,
    });
    return { response };
  }

  private async readChannel(ch: DeviceChannel) {
    if (isOutput(ch.type)) {
      throw new BadRequestException(`El canal "${ch.name}" es de salida`);
    }
    const conn = this.connFor(ch);
    const value = calibrate(ch, parseValue(await conn.send(readCommand(ch))));
    await this.onReading(ch, value);
    return { channelId: ch.id, value, unit: ch.unit ?? null };
  }

  private async onReading(ch: DeviceChannel, value: number) {
    await this.readings.insert({ channelId: ch.id, value });
    this.emit({
      kind: 'reading',
      deviceId: ch.deviceId,
      channelId: ch.id,
      value,
    });
    await this.applyRules(ch, value);
    this.applyPid(ch, value);
  }

  private onEvent(deviceId: number, pin: string, value: number) {
    if (pin === 'WATCHDOG') {
      this.logger.warn(`Dispositivo ${deviceId}: watchdog apagó las salidas`);
      this.emit({ kind: 'watchdog', deviceId, value });
      return;
    }
    const ch = this.channels.find(
      (c) =>
        c.deviceId === deviceId &&
        c.type === ChannelType.DIGITAL_IN &&
        pinNumber(c.pins[0]) === pinNumber(pin),
    );
    if (ch)
      this.onReading(ch, value).catch((e) => this.logger.error(e.message));
  }

  // ---------------- Bucle: lecturas periódicas y salidas on/off de PID ----------------

  private tick() {
    const now = Date.now();
    for (const ch of this.channels) {
      if (isOutput(ch.type) || !ch.pollMs || this.busy.has(ch.id)) continue;
      if (!this.connections.get(ch.deviceId)?.connected) continue;
      if (
        now - (this.lastPoll.get(ch.id) ?? 0) <
        Math.max(ch.pollMs, MIN_POLL_MS)
      )
        continue;

      this.lastPoll.set(ch.id, now);
      this.busy.add(ch.id);
      this.readChannel(ch)
        .then(() => this.lastError.delete(ch.id))
        .catch((e: Error) => {
          // ponytail: solo se registra el primer error repetido por canal
          if (this.lastError.get(ch.id) !== e.message) {
            this.lastError.set(ch.id, e.message);
            this.logger.warn(`Lectura "${ch.name}": ${e.message}`);
          }
        })
        .finally(() => this.busy.delete(ch.id));
    }

    for (const pid of this.pids) {
      const rt = this.pidRuntime.get(pid.id);
      const out = this.channels.find((c) => c.id === pid.outputChannelId);
      if (
        !pid.enabled ||
        rt?.output === undefined ||
        out?.type !== ChannelType.DIGITAL_OUT
      )
        continue;
      if (this.overridden(out.id)) continue;
      const on = timeProportional(rt.output, pid, now, pid.windowMs);
      if (on === rt.lastDigital) continue;
      rt.lastDigital = on;
      this.connections
        .get(out.deviceId)
        ?.send(writeCommand(out, on))
        .catch(() => (rt.lastDigital = undefined));
    }
  }

  // ---------------- Reglas y PID ----------------

  /** Una salida con una regla activa no la toca el PID: la seguridad manda. */
  private overridden(channelId: number) {
    return this.rules.some(
      (r) =>
        r.enabled &&
        r.targetChannelId === channelId &&
        this.ruleActive.get(r.id),
    );
  }

  private async applyRules(ch: DeviceChannel, value: number) {
    for (const rule of this.rules) {
      if (!rule.enabled || rule.sourceChannelId !== ch.id) continue;
      const prev = this.ruleActive.get(rule.id) ?? false;
      const next = evalRule(rule, value, prev);
      if (next === prev) continue;
      this.ruleActive.set(rule.id, next);
      const target = next ? rule.onValue : rule.offValue;
      if (target === null || target === undefined) continue;
      this.logger.log(
        `Regla "${rule.name}" ${next ? 'activada' : 'desactivada'} (${value})`,
      );
      await this.write(rule.targetChannelId, target, null, 'rule').catch((e) =>
        this.logger.error(`Regla "${rule.name}": ${e.message}`),
      );
    }
  }

  private applyPid(ch: DeviceChannel, value: number) {
    const now = Date.now();
    for (const pid of this.pids) {
      if (!pid.enabled || pid.inputChannelId !== ch.id) continue;
      const rt = this.pidRuntime.get(pid.id) ?? { integral: 0 };
      const dt = rt.at ? (now - rt.at) / 1000 : 0;
      const { output, state } = pidStep(pid, rt, value, dt);
      this.pidRuntime.set(pid.id, { ...rt, ...state, at: now, output });

      const out = this.channels.find((c) => c.id === pid.outputChannelId);
      // digital_out se modula en tick() por ventana de tiempo
      if (
        !out ||
        out.type === ChannelType.DIGITAL_OUT ||
        this.overridden(out.id)
      )
        continue;
      this.connections
        .get(out.deviceId)
        ?.send(writeCommand(out, output))
        .catch((e) => this.logger.warn(`PID "${pid.name}": ${e.message}`));
    }
  }

  pidStatus() {
    return this.pids.map((p) => ({
      id: p.id,
      output: this.pidRuntime.get(p.id)?.output ?? null,
      overridden: this.overridden(p.outputChannelId),
    }));
  }

  // ---------------- Consultas ----------------

  async listDevices() {
    const list = await this.devices.find({
      relations: { channels: true },
      order: { id: 'ASC' },
    });
    return list.map((d) => ({ ...d, connected: this.status(d.id).connected }));
  }

  readingsOf(channelId: number, q: ReadingsQueryDto) {
    this.findChannel(channelId);
    const from = q.from ? new Date(q.from) : new Date(Date.now() - 3600_000);
    const to = q.to ? new Date(q.to) : new Date();
    return this.readings.find({
      where: { channelId, at: Between(from, to) },
      order: { at: 'ASC' },
      take: q.limit ?? 1000,
    });
  }

  logsOf(deviceId: number) {
    return this.logs.find({
      where: { deviceId },
      order: { at: 'DESC' },
      take: 200,
    });
  }

  // ---------------- CRUD ----------------

  async createDevice(dto: CreateDeviceDto) {
    return this.devices.save(this.devices.create(dto));
  }

  async updateDevice(id: number, dto: UpdateDeviceDto) {
    const device = await this.findDevice(id);
    await this.disconnect(id);
    return this.devices.save(Object.assign(device, dto));
  }

  async removeDevice(id: number) {
    await this.findDevice(id);
    await this.disconnect(id);
    await this.devices.delete(id);
    await this.reloadConfig();
  }

  async createChannel(deviceId: number, dto: CreateChannelDto) {
    await this.findDevice(deviceId);
    this.checkPins(dto.type, dto.pins);
    const ch = await this.channelRepo.save(
      this.channelRepo.create({ ...dto, deviceId }),
    );
    await this.afterChannelChange(deviceId);
    return ch;
  }

  async updateChannel(id: number, dto: UpdateChannelDto) {
    const ch = this.findChannel(id);
    const merged = Object.assign(
      await this.channelRepo.findOneByOrFail({ id }),
      dto,
    );
    this.checkPins(merged.type, merged.pins);
    const saved = await this.channelRepo.save(merged);
    await this.afterChannelChange(ch.deviceId);
    return saved;
  }

  async removeChannel(id: number) {
    const ch = this.findChannel(id);
    if (isOutput(ch.type) && this.connections.get(ch.deviceId)?.connected) {
      await this.write(id, 0, null).catch(() => undefined);
    }
    await this.channelRepo.delete(id);
    await this.reloadConfig();
  }

  async createRule(dto: CreateRuleDto) {
    this.checkRule(dto.sourceChannelId, dto.targetChannelId);
    const rule = await this.ruleRepo.save(this.ruleRepo.create(dto));
    await this.reloadConfig();
    return rule;
  }

  async updateRule(id: number, dto: UpdateRuleDto) {
    const rule = Object.assign(await this.findOr404(this.ruleRepo, id), dto);
    this.checkRule(rule.sourceChannelId, rule.targetChannelId);
    const saved = await this.ruleRepo.save(rule);
    this.ruleActive.delete(id);
    await this.reloadConfig();
    return saved;
  }

  async removeRule(id: number) {
    await this.findOr404(this.ruleRepo, id);
    await this.ruleRepo.delete(id);
    this.ruleActive.delete(id);
    await this.reloadConfig();
  }

  listRules() {
    return this.ruleRepo.find({ order: { id: 'ASC' } });
  }

  async createPid(dto: CreatePidDto) {
    const pid = this.pidRepo.create(dto);
    this.checkPid(pid);
    const saved = await this.pidRepo.save(pid);
    await this.reloadConfig();
    return saved;
  }

  async updatePid(id: number, dto: UpdatePidDto) {
    const pid = Object.assign(await this.findOr404(this.pidRepo, id), dto);
    this.checkPid(pid);
    const saved = await this.pidRepo.save(pid);
    // Al desactivar, deja la salida en 0 para no quedar encendida.
    if (dto.enabled === false) {
      this.pidRuntime.delete(id);
      await this.write(pid.outputChannelId, 0, null).catch(() => undefined);
    }
    await this.reloadConfig();
    return saved;
  }

  async removePid(id: number) {
    const pid = await this.findOr404(this.pidRepo, id);
    await this.pidRepo.delete(id);
    this.pidRuntime.delete(id);
    await this.write(pid.outputChannelId, 0, null).catch(() => undefined);
    await this.reloadConfig();
  }

  listPids() {
    return this.pidRepo.find({ order: { id: 'ASC' } });
  }

  // ---------------- Validaciones / helpers ----------------

  private async afterChannelChange(deviceId: number) {
    await this.reloadConfig();
    if (this.connections.get(deviceId)?.connected) {
      await this.configurePins(deviceId).catch((e) =>
        this.logger.warn(`Reconfiguración: ${e.message}`),
      );
    }
  }

  private checkPins(type: ChannelType, pins: string[]) {
    const err = validatePins(type, pins);
    if (err) throw new BadRequestException(err);
  }

  private checkRule(sourceId: number, targetId: number) {
    if (isOutput(this.findChannel(sourceId).type)) {
      throw new BadRequestException('El canal origen debe ser una entrada');
    }
    if (!isOutput(this.findChannel(targetId).type)) {
      throw new BadRequestException('El canal destino debe ser una salida');
    }
  }

  private checkPid(pid: PidLoop) {
    this.checkRule(pid.inputChannelId, pid.outputChannelId);
    if ((pid.outMin ?? 0) >= (pid.outMax ?? 255)) {
      throw new BadRequestException('outMin debe ser menor que outMax');
    }
    const conflict = this.pids.find(
      (p) => p.id !== pid.id && p.outputChannelId === pid.outputChannelId,
    );
    if (conflict) {
      throw new BadRequestException(
        `La salida ya la controla el PID "${conflict.name}"`,
      );
    }
  }

  private async findDevice(id: number) {
    const device = await this.devices.findOneBy({ id });
    if (!device) throw new NotFoundException(`Dispositivo ${id} no encontrado`);
    return device;
  }

  private findChannel(id: number) {
    const ch = this.channels.find((c) => c.id === id);
    if (!ch) throw new NotFoundException(`Canal ${id} no encontrado`);
    return ch;
  }

  private async findOr404<T extends { id: number }>(
    repo: Repository<T>,
    id: number,
  ) {
    const found = await repo.findOne({ where: { id } as never });
    if (!found) throw new NotFoundException(`Registro ${id} no encontrado`);
    return found;
  }

  private emit(e: Omit<LiveEvent, 'at'>) {
    this.live$.next({ ...e, at: new Date() });
  }
}

/** "D7" / "7" -> 7, "A0" -> 14 (misma numeración que el firmware). */
export function pinNumber(pin: string): number {
  const p = pin.toUpperCase();
  if (p.startsWith('A')) return 14 + +p.slice(1);
  return +p.replace(/^D/, '');
}
