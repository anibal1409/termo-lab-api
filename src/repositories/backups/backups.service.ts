import { spawn } from 'child_process';
import { createHash, randomBytes } from 'crypto';
import { createReadStream, ReadStream } from 'fs';
import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from 'fs/promises';
import { join, resolve } from 'path';

import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

import { User } from '../users/entities';
import { BackupDto, RestoreResultDto } from './backups.dto';

/** Solo nombres generados por este servicio: impide path traversal. */
const ID_RE = /^termolab-\d{8}T\d{6}Z-[a-f0-9]{6}\.dump$/;

/**
 * La auditoría no entra en los respaldos: restaurar nunca reescribe ni borra
 * el historial (tabla + su secuencia).
 */
const EXCLUDE = ['--exclude-table=public.audit_logs*'];

interface Actor {
  id: number;
  email: string;
}

@Injectable()
export class BackupsService {
  private busy = false;
  readonly dir: string;

  constructor(
    private readonly config: ConfigService,
    private readonly dataSource: DataSource,
  ) {
    this.dir = resolve(
      config.get('BACKUP_DIR') ?? join(process.cwd(), 'backups'),
    );
  }

  async list(): Promise<BackupDto[]> {
    await mkdir(this.dir, { recursive: true });
    const metas = await Promise.all(
      (await readdir(this.dir))
        .filter((f) => f.endsWith('.json') && ID_RE.test(f.slice(0, -5)))
        .map(async (f) =>
          JSON.parse(await readFile(join(this.dir, f), 'utf8')),
        ),
    );
    return metas.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: string): Promise<BackupDto> {
    if (!ID_RE.test(id)) throw new NotFoundException('Respaldo no encontrado');
    try {
      return JSON.parse(await readFile(this.metaPath(id), 'utf8'));
    } catch {
      throw new NotFoundException('Respaldo no encontrado');
    }
  }

  async open(id: string): Promise<{ meta: BackupDto; stream: ReadStream }> {
    const meta = await this.get(id);
    return { meta, stream: createReadStream(this.filePath(id)) };
  }

  create(actor: Actor, note?: string): Promise<BackupDto> {
    return this.exclusive(() => this.dump(actor, 'manual', note));
  }

  async remove(id: string): Promise<void> {
    await this.get(id);
    await this.exclusive(async () => {
      await rm(this.filePath(id), { force: true });
      await rm(this.metaPath(id), { force: true });
    });
  }

  /**
   * Restaura un respaldo. Exige contraseña del admin y repetir el id; verifica el
   * SHA-256, toma un respaldo de seguridad, restaura en una sola transacción,
   * aplica migraciones pendientes y cierra todas las sesiones.
   */
  async restore(
    id: string,
    actor: Actor,
    password: string,
    confirm: string,
  ): Promise<RestoreResultDto> {
    if (confirm !== id) {
      throw new BadRequestException(
        'La confirmación no coincide con el id del respaldo',
      );
    }
    const meta = await this.get(id);
    await this.checkPassword(actor.id, password);

    return this.exclusive(async () => {
      if ((await this.sha256(this.filePath(id))) !== meta.sha256) {
        throw new ConflictException(
          'El archivo del respaldo no coincide con su SHA-256 (alterado o corrupto)',
        );
      }
      const safety = await this.dump(
        actor,
        'pre-restore',
        `Antes de restaurar ${id}`,
      );
      // Índice del dump sin objetos de auditoría (la función del trigger sí entra en el dump)
      const toc = (await this.run('pg_restore', ['--list', this.filePath(id)]))
        .split('\n')
        .filter((line) => !/audit_logs/.test(line))
        .join('\n');
      const listFile = `${this.filePath(id)}.list`;
      await writeFile(listFile, toc);
      await this.run('pg_restore', [
        '--use-list',
        listFile,
        '--clean',
        '--if-exists',
        '--no-owner',
        '--no-privileges',
        '--single-transaction',
        '--exit-on-error',
        '--dbname',
        this.env().PGDATABASE,
        this.filePath(id),
      ]).finally(() => rm(listFile, { force: true }));
      const migrations = await this.dataSource.runMigrations({
        transaction: 'each',
      });
      // Los datos volvieron atrás: todos deben volver a autenticarse
      await this.dataSource.query(
        `UPDATE users SET "tokensValidAfter" = now()`,
      );
      return {
        restored: id,
        safetyBackup: safety.id,
        migrationsApplied: migrations.map((m) => m.name),
      };
    });
  }

  // ── internos ───────────────────────────────────────────────

  private async dump(
    actor: Actor,
    kind: BackupDto['kind'],
    note?: string,
  ): Promise<BackupDto> {
    await mkdir(this.dir, { recursive: true });
    const stamp = new Date()
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d+Z$/, 'Z');
    const id = `termolab-${stamp}-${randomBytes(3).toString('hex')}.dump`;
    const tmp = `${this.filePath(id)}.part`;
    try {
      await this.run('pg_dump', [
        '--format=custom',
        '--no-owner',
        '--no-privileges',
        ...EXCLUDE,
        '--file',
        tmp,
      ]);
      await rename(tmp, this.filePath(id));
    } catch (err) {
      await rm(tmp, { force: true });
      throw err;
    }
    const meta: BackupDto = {
      id,
      createdAt: new Date().toISOString(),
      kind,
      size: (await stat(this.filePath(id))).size,
      sha256: await this.sha256(this.filePath(id)),
      createdById: actor.id,
      createdByEmail: actor.email,
      ...(note ? { note } : {}),
    };
    await writeFile(this.metaPath(id), JSON.stringify(meta, null, 2));
    return meta;
  }

  /** Una operación a la vez: un dump durante un restore daría un respaldo inconsistente. */
  private async exclusive<T>(fn: () => Promise<T>): Promise<T> {
    if (this.busy) {
      throw new ConflictException(
        'Hay otra operación de respaldo/restauración en curso',
      );
    }
    this.busy = true;
    try {
      return await fn();
    } finally {
      this.busy = false;
    }
  }

  private async checkPassword(userId: number, password: string): Promise<void> {
    const user = await this.dataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ['id', 'password'],
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }
  }

  /** Credenciales por variables PG* del proceso hijo: nunca en argumentos (visibles en ps). */
  private env(): NodeJS.ProcessEnv {
    const c = this.config;
    return {
      ...process.env,
      PGHOST: c.get('DB_HOST'),
      PGPORT: String(c.get('DB_PORT') ?? 5432),
      PGUSER: c.get('DB_USER'),
      PGPASSWORD: c.get('DB_PASSWORD'),
      PGDATABASE: c.get('DB_NAME'),
      ...(c.get('DB_SSL') === 'true' ? { PGSSLMODE: 'require' } : {}),
    };
  }

  private run(bin: string, args: string[]): Promise<string> {
    return new Promise((ok, fail) => {
      let stderr = '';
      let stdout = '';
      const child = spawn(bin, args, { env: this.env() });
      child.stdout.on('data', (d) => (stdout += d));
      child.stderr.on('data', (d) => (stderr = (stderr + d).slice(-2000)));
      child.on('error', (err: NodeJS.ErrnoException) =>
        fail(
          new ServiceUnavailableException(
            err.code === 'ENOENT'
              ? `${bin} no está instalado en el servidor`
              : `${bin}: ${err.message}`,
          ),
        ),
      );
      child.on('close', (code) =>
        code === 0
          ? ok(stdout)
          : fail(
              new ServiceUnavailableException(
                `${bin} falló (${code}): ${stderr.trim()}`,
              ),
            ),
      );
    });
  }

  private sha256(file: string): Promise<string> {
    return new Promise((ok, fail) => {
      const h = createHash('sha256');
      createReadStream(file)
        .on('data', (d) => h.update(d))
        .on('end', () => ok(h.digest('hex')))
        .on('error', fail);
    });
  }

  private filePath(id: string): string {
    return join(this.dir, id);
  }

  private metaPath(id: string): string {
    return join(this.dir, `${id}.json`);
  }
}
