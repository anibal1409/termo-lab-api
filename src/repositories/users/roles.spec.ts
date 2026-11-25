import { ForbiddenException } from '@nestjs/common';

import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';

describe('Permisos de administración de usuarios', () => {
  const make = (target: any, adminCount: number) => {
    const repo: any = {
      findOne: async () => ({ ...target }),
      count: async () => adminCount,
      save: async (u: any) => u,
    };
    return new UsersService(repo, {} as any);
  };
  const admin = { id: 2, role: UserRole.ADMIN, deleted: false };

  it('no permite eliminarse a sí mismo', async () => {
    await expect(make(admin, 3).remove(2, 2)).rejects.toThrow(
      ForbiddenException,
    );
  });

  it('no permite eliminar ni degradar al último admin', async () => {
    await expect(make(admin, 1).remove(2, 9)).rejects.toThrow(
      ForbiddenException,
    );
    await expect(
      make(admin, 1).update(2, { role: UserRole.OPERATOR } as any, 9),
    ).rejects.toThrow(ForbiddenException);
  });

  it('cambiar el rol cierra las sesiones del usuario', async () => {
    const u: any = await make(admin, 2).update(
      2,
      { role: UserRole.OPERATOR } as any,
      9,
    );
    expect(u).toBeDefined();
  });

  it('alta: no devuelve contraseña, guarda solo el hash del token y envía el enlace', async () => {
    const updates: any[] = [];
    let sentToken = '';
    const repo: any = {
      create: (u: any) => u,
      save: async (u: any) => ({ ...u, id: 7 }),
      update: async (_id: number, patch: any) => updates.push(patch),
    };
    const mail: any = {
      sendSetPassword: async (_to: string, _n: string, t: string) => {
        sentToken = t;
      },
    };
    const res: any = await new UsersService(repo, mail).create({
      name: 'Ana',
      email: 'ana@x.com',
      role: UserRole.OPERATOR,
    } as any);
    expect(res.inviteSent).toBe(true);
    expect(res).not.toHaveProperty('temporaryPassword');
    expect(sentToken).toMatch(/^[A-Za-z0-9_-]{43}$/);
    expect(updates[0].passwordTokenHash).toHaveLength(64);
    expect(updates[0].passwordTokenHash).not.toContain(sentToken);
  });
});
