import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  mixin,
  Type,
} from '@nestjs/common';

import { SettingsService } from '../../repositories/settings/settings.service';

type Permission = 'allowFiretube' | 'allowFlightRecorder';

const MESSAGES: Record<Permission, string> = {
  allowFiretube: 'Sin permiso para operar firetube / duty del quemador',
  allowFlightRecorder:
    'Sin permiso para descargar flight recorder / telemetría',
};

/**
 * Exige un permiso del usuario (se lee de BD en cada petición vía JwtStrategy).
 * Para firetube aplica además la política biométrica de /settings.
 */
export function PermissionGuard(permission: Permission): Type<CanActivate> {
  @Injectable()
  class Guard implements CanActivate {
    constructor(private readonly settings: SettingsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
      const user = context.switchToHttp().getRequest().user;
      if (!user?.[permission]) {
        throw new ForbiddenException(MESSAGES[permission]);
      }
      if (permission === 'allowFiretube') {
        const s = await this.settings.get();
        if (
          s.requireBiometricsForFiretube &&
          s.requireBiometricsRoles?.includes(user.role) &&
          !user.faceEnrolled
        ) {
          throw new ForbiddenException(
            'La política exige rostro enrolado para operar firetube',
          );
        }
      }
      return true;
    }
  }
  return mixin(Guard);
}
