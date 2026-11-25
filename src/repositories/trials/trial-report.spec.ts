import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { TrialsService } from './trials.service';

describe('TrialsService.reportData', () => {
  const make = (trial: any, rows: any[] = []) => {
    const svc = new TrialsService({} as any, {} as any, {} as any, {} as any);
    jest.spyOn(svc, 'findOne').mockResolvedValue(trial);
    jest.spyOn(svc, 'flightRecorder').mockResolvedValue(rows);
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

  it('resume el flight recorder por canal', async () => {
    const at = new Date();
    const data = await make({ ...base, state: 'completed' }, [
      { at, kind: 'reading', channelId: 2, value: 10 },
      { at, kind: 'reading', channelId: 2, value: 20 },
      { at, kind: 'command', command: 'H1' },
    ]).reportData(1);
    expect(data.trial.durationMin).toBe(60);
    expect(data.flightRecorder).toMatchObject({ readings: 2, commands: 1 });
    expect(data.flightRecorder.perChannel[0]).toMatchObject({
      channelId: 2,
      min: 10,
      max: 20,
      avg: 15,
    });
  });
});
