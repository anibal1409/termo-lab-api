import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TrialsService } from './trials.service';

describe('TrialsService.reportData', () => {
  const make = (trial: any) => {
    const svc = new TrialsService({} as any, {} as any);
    jest.spyOn(svc, 'findOne').mockResolvedValue(trial);
    return svc;
  };
  const base = {
    id: 1,
    name: 'E1',
    pilotDiameter: 1.5,
    pilotLength: 3,
    heaterPower: 5000,
    startedAt: new Date('2026-01-01T00:00:00Z'),
    endedAt: new Date('2026-01-01T01:00:00Z'),
    samples: [],
  };

  it('409 si el ensayo está en draft', async () => {
    await expect(
      make({ ...base, state: 'draft' }).reportData(1),
    ).rejects.toThrow(ConflictException);
  });

  it('422 sin datos mínimos', async () => {
    await expect(
      make({ ...base, state: 'completed', startedAt: null }).reportData(1),
    ).rejects.toThrow(UnprocessableEntityException);
  });

  it('informe con identidad, duración y muestras ordenadas', async () => {
    const data = await make({
      ...base,
      state: 'completed',
      samples: [
        {
          id: 2,
          label: 'BSW',
          value: 0.4,
          unit: '%',
          at: new Date('2026-01-01T00:40:00Z'),
        },
        {
          id: 1,
          label: 'BSW',
          value: 0.9,
          unit: '%',
          at: new Date('2026-01-01T00:10:00Z'),
        },
      ],
    }).reportData(1);
    expect(data.trial.durationMin).toBe(60);
    expect(data.samples.map((s) => s.value)).toEqual([0.9, 0.4]);
    expect(data).not.toHaveProperty('flightRecorder');
    expect(data).not.toHaveProperty('channels');
  });
});
