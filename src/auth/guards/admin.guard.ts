import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

import { UserRole } from '../../repositories/users/entities';

/** Solo administradores. Se usa junto al JwtAuthGuard global. */
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const user = context.switchToHttp().getRequest().user;
    if (user?.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Requiere rol administrador');
    }
    return true;
  }
}
