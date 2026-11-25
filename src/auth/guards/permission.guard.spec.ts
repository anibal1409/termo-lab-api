import { ForbiddenException } from '@nestjs/common';

import { PermissionGuard } from './permission.guard';

const ctx = (user: any) =>
  ({ switchToHttp: () => ({ getRequest: () => ({ user }) }) }) as any;
const settings = (s: any) => ({ get: async () => s }) as any;

describe('PermissionGuard', () => {
  const Firetube = PermissionGuard('allowFiretube');
  const Recorder = PermissionGuard('allowFlightRecorder');

  it('403 sin el permiso', async () => {
    const g = new (Recorder as any)(settings({}));
    await expect(
      g.canActivate(ctx({ allowFlightRecorder: false })),
    ).rejects.toThrow(ForbiddenException);
  });

  it('permite con el permiso', async () => {
    const g = new (Recorder as any)(settings({}));
    await expect(
      g.canActivate(ctx({ allowFlightRecorder: true })),
    ).resolves.toBe(true);
  });

  it('firetube aplica la política biométrica de settings', async () => {
    const policy = {
      requireBiometricsForFiretube: true,
      requireBiometricsRoles: ['admin'],
    };
    const g = new (Firetube as any)(settings(policy));
    const admin = { role: 'admin', allowFiretube: true };
    await expect(
      g.canActivate(ctx({ ...admin, faceEnrolled: false })),
    ).rejects.toThrow('rostro enrolado');
    await expect(
      g.canActivate(ctx({ ...admin, faceEnrolled: true })),
    ).resolves.toBe(true);
    // rol no incluido en la política
    await expect(
      g.canActivate(
        ctx({ role: 'operator', allowFiretube: true, faceEnrolled: false }),
      ),
    ).resolves.toBe(true);
  });
});
