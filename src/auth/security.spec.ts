import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import { QueryBaseDto } from '../common/pagination/dto/query-base.dto';
import { ThermalTreatmentInputDto } from '../repositories/evaluations/dto/thermal-input.dto';
import { AuthService } from './auth.service';

describe('Seguridad', () => {
  const userWith = (tokensValidAfter: Date | null) => {
    const qb: any = {
      addSelect: () => qb,
      where: () => qb,
      getOne: async () => ({ id: 1, tokensValidAfter }),
    };
    return { createQueryBuilder: () => qb } as any;
  };
  const service = (repo: any) => new AuthService(repo, {} as any, {} as any);
  const now = Math.floor(Date.now() / 1000);

  it('rechaza tokens emitidos antes del logout', async () => {
    const repo = userWith(new Date(Date.now()));
    await expect(
      service(repo).validateUser({ id: 1, iat: now - 60 } as any),
    ).rejects.toThrow('Token invalidado');
  });

  it('acepta tokens emitidos después del logout', async () => {
    const repo = userWith(new Date(Date.now() - 120_000));
    const user = await service(repo).validateUser({ id: 1, iat: now } as any);
    expect(user.id).toBe(1);
    expect(user).not.toHaveProperty('tokensValidAfter');
  });

  it('sort solo acepta identificadores (sin inyección SQL)', () => {
    const bad = plainToInstance(QueryBaseDto, { sort: 'id; DROP TABLE users' });
    const ok = plainToInstance(QueryBaseDto, { sort: 'createdAt' });
    expect(validateSync(bad)).not.toHaveLength(0);
    expect(validateSync(ok)).toHaveLength(0);
  });

  it('entrada térmica rechaza valores absurdos', () => {
    const dto = plainToInstance(ThermalTreatmentInputDto, {
      diameter: -1,
      length: 20,
      totalFlow: 1e12,
      waterFraction: 20,
      apiGravity: 18,
      inletTemperature: 75,
      ambientTemperature: 30,
      operatingPressure: 50,
    });
    const fields = validateSync(dto).map((e) => e.property);
    expect(fields).toEqual(expect.arrayContaining(['diameter', 'totalFlow']));
  });

  it('set-password rechaza enlaces vencidos y consume los válidos', async () => {
    const make = (expires: Date) => {
      const updates: any[] = [];
      const qb: any = {
        addSelect: () => qb,
        where: () => qb,
        getOne: async () => ({ id: 3, passwordTokenExpires: expires }),
      };
      const repo: any = {
        createQueryBuilder: () => qb,
        update: async (_id: number, p: any) => updates.push(p),
      };
      return { svc: service(repo), updates };
    };
    const dto = { token: 'a'.repeat(43), password: 'NuevaClave123' };
    await expect(
      make(new Date(Date.now() - 1000)).svc.setPassword(dto),
    ).rejects.toThrow('Enlace inválido o vencido');
    const ok = make(new Date(Date.now() + 60_000));
    await ok.svc.setPassword(dto);
    expect(ok.updates[0].passwordTokenHash).toBeNull();
    expect(ok.updates[0].password).not.toBe(dto.password);
    expect(ok.updates[0].tokensValidAfter).toBeInstanceOf(Date);
  });
});
