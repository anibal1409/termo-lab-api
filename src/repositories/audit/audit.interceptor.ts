import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import { AuditService } from './audit.service';

const MUTATING = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
/** Lecturas que exponen datos sensibles o masivos: también se auditan. */
const SENSITIVE_READ =
  /\/(export|report\.(pdf|json)|download)$|\/audit-logs|\/backups/;
/** Ruido sin valor de auditoría. */
const IGNORED = new Set(['/api', '/api/info', '/api/warning', '/api/health']);

const AUTH_ACTIONS: Record<string, [ok: string, fail: string]> = {
  '/api/auth/login': ['LOGIN', 'LOGIN_FAILED'],
  '/api/auth/face-login': ['LOGIN_FACE', 'LOGIN_FACE_FAILED'],
  '/api/auth/logout': ['LOGOUT', 'LOGOUT_FAILED'],
  '/api/auth/register': ['REGISTER', 'REGISTER_FAILED'],
  '/api/auth/set-password': ['SET_PASSWORD', 'SET_PASSWORD_FAILED'],
};

function actionFor(method: string, path: string, ok: boolean): string {
  const auth = AUTH_ACTIONS[path];
  if (auth) return ok ? auth[0] : auth[1];
  if (/\/backups\/[^/]+\/restore$/.test(path)) return 'RESTORE';
  if (method === 'GET') return 'READ';
  if (method === 'DELETE') return 'DELETE';
  if (method === 'POST') return 'CREATE';
  return 'UPDATE';
}

/**
 * Registra toda operación que modifica datos, los eventos de autenticación y las
 * lecturas sensibles. Se escribe al terminar la respuesta ('finish') para tener
 * el código HTTP real, incluso si un filtro de excepciones respondió el error.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly audit: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const method: string = req.method;
    const path: string = (req.originalUrl ?? req.url).split('?')[0];

    const audited =
      !IGNORED.has(path) &&
      (MUTATING.has(method) || (method === 'GET' && SENSITIVE_READ.test(path)));
    if (!audited) return next.handle();

    const started = Date.now();
    res.once('finish', () => {
      const ok = res.statusCode < 400;
      const [, , resource = 'root', resourceId] = path.split('/');
      const user = req.user;
      void this.audit.record({
        userId: user?.id ?? null,
        // En login el usuario aún no existe en req: se registra el email intentado
        userEmail: user?.email ?? req.body?.email ?? null,
        userRole: user?.role ?? null,
        action: actionFor(method, path, ok),
        resource,
        resourceId: resourceId ?? null,
        method,
        path: path.slice(0, 500),
        statusCode: res.statusCode,
        success: ok,
        durationMs: Date.now() - started,
        ip: req.ip ?? null,
        userAgent:
          String(req.headers['user-agent'] ?? '').slice(0, 255) || null,
        details: MUTATING.has(method) ? req.body : null,
      });
    });
    return next.handle();
  }
}
