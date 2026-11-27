import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from './audit-log.entity';
import { AuditPageDto, QueryAuditDto } from './audit.dto';

const SECRET_KEY = /pass|token|secret|authorization|cookie|embedding|otp/i;
const MAX_DETAILS = 4000;

/** Copia saneada: enmascara secretos y resume arrays/strings grandes. */
export function sanitize(value: unknown, depth = 0): unknown {
  if (value == null || typeof value !== 'object') {
    return typeof value === 'string' && value.length > 500
      ? `${value.slice(0, 500)}…`
      : value;
  }
  if (depth > 4) return '[…]';
  if (Array.isArray(value)) {
    return value.length > 20
      ? `[array(${value.length})]`
      : value.map((v) => sanitize(v, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([k, v]) => [
      k,
      SECRET_KEY.test(k) ? '[REDACTED]' : sanitize(v, depth + 1),
    ]),
  );
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog) private readonly repo: Repository<AuditLog>,
  ) {}

  /** Nunca lanza: la auditoría no debe romper la operación auditada. */
  async record(entry: Partial<AuditLog>): Promise<void> {
    try {
      let details = entry.details == null ? null : sanitize(entry.details);
      if (details != null && JSON.stringify(details).length > MAX_DETAILS) {
        details = {
          truncated: true,
          preview: JSON.stringify(details).slice(0, MAX_DETAILS),
        };
      }
      await this.repo.insert({ ...entry, details });
    } catch (err) {
      this.logger.error(`No se pudo registrar auditoría: ${err}`);
    }
  }

  async find(q: QueryAuditDto): Promise<AuditPageDto> {
    const page = q.page ?? 1;
    const limit = q.limit ?? 50;
    const qb = this.repo.createQueryBuilder('a').orderBy('a.at', 'DESC');
    if (q.userId) qb.andWhere('a.userId = :userId', { userId: q.userId });
    if (q.action) qb.andWhere('a.action = :action', { action: q.action });
    if (q.resource)
      qb.andWhere('a.resource = :resource', { resource: q.resource });
    if (q.method) qb.andWhere('a.method = :method', { method: q.method });
    if (q.success != null)
      qb.andWhere('a.success = :success', { success: q.success });
    if (q.from) qb.andWhere('a.at >= :from', { from: new Date(q.from) });
    if (q.to) qb.andWhere('a.at <= :to', { to: new Date(q.to) });
    if (q.search) {
      qb.andWhere('(a.path ILIKE :s OR a.userEmail ILIKE :s)', {
        s: `%${q.search.replace(/[%_\\]/g, '\\$&')}%`,
      });
    }
    const [data, total] = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { data, total, page, limit };
  }

  findOne(id: string): Promise<AuditLog | null> {
    return this.repo.findOne({ where: { id } });
  }
}
