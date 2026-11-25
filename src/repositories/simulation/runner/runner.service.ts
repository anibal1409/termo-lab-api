import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Treatment } from '../../treatments/entities/treatment.entity';
import { runPipeline, PipelineInput, PipelineResult, PipelineStep } from './simulation-runner';

@Injectable()
export class RunnerService {
  constructor(
    @InjectRepository(Treatment)
    private readonly treatmentRepo: Repository<Treatment>,
  ) {}

  async run(input: PipelineInput & { steps: (PipelineStep & { treatmentId?: number })[] }): Promise<PipelineResult> {
    for (const step of input.steps) {
      if (step.treatmentId) {
        const t = await this.treatmentRepo.findOne({ where: { id: step.treatmentId } });
        if (!t) throw new NotFoundException(`Treatment ${step.treatmentId} no encontrado`);
        step.type = 'thermal-treater';
        step.name = step.name ?? t.name;
        // Treatment stores temps in °F, simulation uses °C.
        // Solo geometría / consignas de diseño del tratador guardado;
        // caudal, API, agua, T entrada y presión vienen de la corriente (mergeStreamIntoConfig).
        const toC = (f: number) => ((f - 32) * 5) / 9;
        step.config = {
          ...step.config,
          treatmentTemperature:
            step.config.treatmentTemperature ?? toC(t.treatmentTemperature),
          ambientTemperature:
            step.config.ambientTemperature ?? toC(t.ambientTemperature),
          diameter: step.config.diameter ?? t.selectedDiameter,
          length: step.config.length ?? t.selectedLength,
          oilRetentionTime:
            step.config.oilRetentionTime ?? t.oilRetentionTime,
          waterRetentionTime:
            step.config.waterRetentionTime ?? t.waterRetentionTime,
          windSpeed: step.config.windSpeed ?? t.windSpeed,
        };
      }
    }
    return runPipeline(input);
  }

  async getAvailableTreatments(): Promise<{ id: number; name: string; type: string; totalFlow: number; apiGravity: number; diameter: number; length: number }[]> {
    const list = await this.treatmentRepo.find({ order: { createdAt: 'DESC' }, take: 50 });
    return list.map(t => ({
      id: t.id,
      name: t.name,
      type: t.type,
      totalFlow: t.totalFlow,
      apiGravity: t.apiGravity,
      diameter: t.selectedDiameter,
      length: t.selectedLength,
    }));
  }
}
