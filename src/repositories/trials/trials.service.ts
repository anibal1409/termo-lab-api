import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Trial, TrialSample } from './entities';
import { AddSampleDto, CreateTrialDto, UpdateTrialDto } from './trials.dto';

export * from './trials.dto';

// ── Service ─────────────────────────────────────────────────

@Injectable()
export class TrialsService {
  constructor(
    @InjectRepository(Trial) private readonly trialRepo: Repository<Trial>,
    @InjectRepository(TrialSample)
    private readonly sampleRepo: Repository<TrialSample>,
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

  // ── CSV export (muestras manuales) ──────────────────────

  async exportCsv(id: number): Promise<string> {
    const trial = await this.findOne(id);
    const csv = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const lines = [
      `# Ensayo: ${trial.name}`,
      `# Inicio: ${trial.startedAt?.toISOString() ?? ''}`,
      `# Fin: ${trial.endedAt?.toISOString() ?? ''}`,
      'at,label,value,unit',
      ...[...(trial.samples ?? [])]
        .sort((a, b) => a.at.getTime() - b.at.getTime())
        .map((s) =>
          [s.at.toISOString(), csv(s.label), s.value, csv(s.unit)].join(','),
        ),
    ];
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
