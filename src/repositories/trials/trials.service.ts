import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';

import { Trial, TrialSample } from './entities';
import {
  ChannelReading,
  DeviceCommandLog,
} from '../devices/entities/device.entity';

import {
  AddSampleDto,
  CreateTrialDto,
  FlightRecorderRow,
  UpdateTrialDto,
} from './trials.dto';

export * from './trials.dto';

// ── Service ─────────────────────────────────────────────────

@Injectable()
export class TrialsService {
  constructor(
    @InjectRepository(Trial) private readonly trialRepo: Repository<Trial>,
    @InjectRepository(TrialSample)
    private readonly sampleRepo: Repository<TrialSample>,
    @InjectRepository(ChannelReading)
    private readonly readingRepo: Repository<ChannelReading>,
    @InjectRepository(DeviceCommandLog)
    private readonly logRepo: Repository<DeviceCommandLog>,
  ) {}

  findAll(): Promise<Trial[]> {
    return this.trialRepo.find({
      order: { createdAt: 'DESC' },
      relations: ['samples'],
    });
  }

  async findOne(id: number): Promise<Trial> {
    const trial = await this.trialRepo.findOne({
      where: { id },
      relations: ['samples'],
    });
    if (!trial) throw new NotFoundException(`Ensayo ${id} no encontrado`);
    return trial;
  }

  create(dto: CreateTrialDto): Promise<Trial> {
    return this.trialRepo.save(this.trialRepo.create(dto));
  }

  async update(id: number, dto: UpdateTrialDto): Promise<Trial> {
    const trial = await this.findOne(id);
    if (trial.state === 'running')
      throw new BadRequestException('No se puede editar un ensayo en curso');
    Object.assign(trial, dto);
    return this.trialRepo.save(trial);
  }

  async remove(id: number): Promise<void> {
    const trial = await this.findOne(id);
    if (trial.state === 'running')
      throw new BadRequestException('Detener el ensayo antes de eliminarlo');
    await this.trialRepo.remove(trial);
  }

  // ── Lifecycle ───────────────────────────────────────────

  async start(id: number): Promise<Trial> {
    const trial = await this.findOne(id);
    if (trial.state !== 'draft')
      throw new BadRequestException(
        `Estado actual: ${trial.state}, solo se puede iniciar desde draft`,
      );
    trial.state = 'running';
    trial.startedAt = new Date();
    trial.endedAt = null;
    return this.trialRepo.save(trial);
  }

  async stop(
    id: number,
    state: 'completed' | 'aborted' = 'completed',
  ): Promise<Trial> {
    const trial = await this.findOne(id);
    if (trial.state !== 'running')
      throw new BadRequestException(
        `El ensayo no está en curso (estado: ${trial.state})`,
      );
    trial.state = state;
    trial.endedAt = new Date();
    return this.trialRepo.save(trial);
  }

  // ── Samples ─────────────────────────────────────────────

  async addSample(
    trialId: number,
    dto: AddSampleDto,
    userId: number,
  ): Promise<TrialSample> {
    const trial = await this.findOne(trialId);
    // Muestras solo durante el ensayo: no se alteran ensayos cerrados
    if (trial.state !== 'running') {
      throw new BadRequestException(
        'Solo se registran muestras en ensayos en curso',
      );
    }
    const at = dto.at ? new Date(dto.at) : new Date();
    if ((trial.startedAt && at < trial.startedAt) || at > new Date()) {
      throw new BadRequestException(
        'La fecha de la muestra debe estar dentro del ensayo en curso',
      );
    }
    return this.sampleRepo.save(
      this.sampleRepo.create({
        trialId,
        createdById: userId,
        label: dto.label,
        value: dto.value,
        unit: dto.unit,
        at,
      }),
    );
  }

  // ── Flight recorder ─────────────────────────────────────

  async flightRecorder(id: number): Promise<FlightRecorderRow[]> {
    const trial = await this.findOne(id);
    if (!trial.startedAt) return [];
    const from = trial.startedAt;
    const to = trial.endedAt ?? new Date();

    const channelIds = [
      trial.bathTempChannelId,
      trial.ambientTempChannelId,
      trial.heaterChannelId,
      ...(trial.levelChannelIds?.map(Number) ?? []),
    ].filter((x): x is number => x != null && !isNaN(x));

    const [readings, logs] = await Promise.all([
      channelIds.length > 0
        ? this.readingRepo
            .createQueryBuilder('r')
            .where('r.channelId IN (:...ids)', { ids: channelIds })
            .andWhere('r.at BETWEEN :from AND :to', { from, to })
            .orderBy('r.at', 'ASC')
            .getMany()
        : Promise.resolve([]),
      this.logRepo.find({
        where: { at: Between(from, to) },
        order: { at: 'ASC' },
      }),
    ]);

    const rows: FlightRecorderRow[] = [
      ...readings.map((r) => ({
        at: r.at,
        kind: 'reading' as const,
        channelId: r.channelId,
        value: r.value,
      })),
      ...logs.map((l) => ({
        at: l.at,
        kind: 'command' as const,
        channelId: l.channelId,
        command: l.command,
        response: l.response,
        source: l.source,
      })),
    ];

    rows.sort((a, b) => a.at.getTime() - b.at.getTime());
    return rows;
  }

  // ── CSV export ──────────────────────────────────────────

  async exportCsv(id: number): Promise<string> {
    const rows = await this.flightRecorder(id);
    const trial = await this.findOne(id);
    const lines = [
      `# Ensayo: ${trial.name}`,
      `# Inicio: ${trial.startedAt?.toISOString() ?? ''}`,
      `# Fin: ${trial.endedAt?.toISOString() ?? ''}`,
      'at,kind,channelId,value,command,response,source',
    ];
    for (const r of rows) {
      lines.push(
        [
          r.at.toISOString(),
          r.kind,
          r.channelId ?? '',
          r.value ?? '',
          r.command ?? '',
          r.response ?? '',
          r.source ?? '',
        ].join(','),
      );
    }
    // Manual samples
    if (trial.samples?.length) {
      lines.push('', '# Muestras manuales', 'at,label,value,unit');
      for (const s of trial.samples) {
        lines.push(
          [s.at.toISOString(), s.label, s.value, s.unit ?? ''].join(','),
        );
      }
    }
    return lines.join('\n');
  }

  // ── Informe técnico ─────────────────────────────────────

  /**
   * Datos del informe de ensayo (base del PDF y de su hash).
   * 409 si el ensayo nunca corrió; 422 si faltan datos mínimos.
   */
  async reportData(id: number) {
    const trial = await this.findOne(id);
    if (trial.state === 'draft') {
      throw new ConflictException('El ensayo no se ha ejecutado (draft)');
    }
    if (!trial.startedAt || !trial.pilotDiameter || !trial.pilotLength) {
      throw new UnprocessableEntityException(
        'Faltan datos mínimos: inicio del ensayo o geometría del piloto',
      );
    }
    const rows = await this.flightRecorder(id);

    // Resumen por canal (lecturas) y conteo de comandos
    const stats = new Map<
      number,
      { n: number; min: number; max: number; sum: number }
    >();
    let commands = 0;
    for (const r of rows) {
      if (r.kind === 'command') {
        commands++;
        continue;
      }
      if (r.channelId == null || r.value == null) continue;
      const s = stats.get(r.channelId) ?? {
        n: 0,
        min: Infinity,
        max: -Infinity,
        sum: 0,
      };
      s.n++;
      s.min = Math.min(s.min, r.value);
      s.max = Math.max(s.max, r.value);
      s.sum += r.value;
      stats.set(r.channelId, s);
    }
    const end = trial.endedAt ?? new Date();

    return {
      trial: {
        id: trial.id,
        name: trial.name,
        state: trial.state,
        startedAt: trial.startedAt,
        endedAt: trial.endedAt ?? null,
        durationMin: +(
          (end.getTime() - trial.startedAt.getTime()) /
          60000
        ).toFixed(2),
        notes: trial.notes ?? null,
      },
      geometry: {
        pilotDiameter: trial.pilotDiameter,
        pilotLength: trial.pilotLength,
        heaterPower: trial.heaterPower,
      },
      channels: {
        bathTempChannelId: trial.bathTempChannelId ?? null,
        ambientTempChannelId: trial.ambientTempChannelId ?? null,
        heaterChannelId: trial.heaterChannelId ?? null,
        levelChannelIds: trial.levelChannelIds ?? [],
        pidLoopId: trial.pidLoopId ?? null,
        ruleIds: trial.ruleIds ?? [],
      },
      flightRecorder: {
        readings: rows.length - commands,
        commands,
        perChannel: [...stats.entries()]
          .sort(([a], [b]) => a - b)
          .map(([channelId, s]) => ({
            channelId,
            readings: s.n,
            min: s.min,
            max: s.max,
            avg: +(s.sum / s.n).toFixed(4),
          })),
      },
      samples: [...(trial.samples ?? [])]
        .sort((a, b) => a.at.getTime() - b.at.getTime() || a.id - b.id)
        .map((s) => ({
          label: s.label,
          value: s.value,
          unit: s.unit ?? null,
          at: s.at,
        })),
      calibration: {
        calibratedEta: trial.calibratedEta ?? null,
        calibratedUA: trial.calibratedUA ?? null,
        calibrationRmse: trial.calibrationRmse ?? null,
      },
    };
  }

  // ── Calibration data (for thermal twin) ─────────────────

  async saveCalibration(
    id: number,
    eta: number,
    ua: number,
    rmse: number,
  ): Promise<Trial> {
    const trial = await this.findOne(id);
    trial.calibratedEta = eta;
    trial.calibratedUA = ua;
    trial.calibrationRmse = rmse;
    return this.trialRepo.save(trial);
  }

  async getChannelSeries(
    channelId: number,
    from: Date,
    to: Date,
  ): Promise<{ t: number; value: number }[]> {
    const readings = await this.readingRepo
      .createQueryBuilder('r')
      .where('r.channelId = :id', { id: channelId })
      .andWhere('r.at BETWEEN :from AND :to', { from, to })
      .orderBy('r.at', 'ASC')
      .getMany();
    if (!readings.length) return [];
    const t0 = readings[0].at.getTime() / 1000;
    return readings.map((r) => ({
      t: r.at.getTime() / 1000 - t0,
      value: r.value,
    }));
  }

  async getCalibrationDefaults(
    pilotDiameter: number,
    pilotLength: number,
  ): Promise<{ eta: number; ua: number; count: number } | null> {
    const calibrated = await this.trialRepo
      .createQueryBuilder('t')
      .where('t.calibratedEta IS NOT NULL')
      .andWhere('t.pilotDiameter = :d', { d: pilotDiameter })
      .andWhere('t.pilotLength = :l', { l: pilotLength })
      .andWhere('t.state = :s', { s: 'completed' })
      .orderBy('t.endedAt', 'DESC')
      .getMany();
    if (calibrated.length === 0) return null;
    const eta =
      calibrated.reduce((s, t) => s + t.calibratedEta!, 0) / calibrated.length;
    const ua =
      calibrated.reduce((s, t) => s + t.calibratedUA!, 0) / calibrated.length;
    return { eta, ua, count: calibrated.length };
  }
}
