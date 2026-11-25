import * as bcrypt from 'bcrypt';
import { MigrationInterface, QueryRunner } from 'typeorm';

import { seedPassword } from '../common/utlis/seed-password';

/**
 * Servidores donde ya corrieron las seeds con '12345678': en producción se
 * reemplaza por SEED_*_PASSWORD y se cierran sus sesiones. En local no hace nada.
 */
export class RotateDefaultPasswords1794200000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.NODE_ENV !== 'production') return;

    const users: { id: number; role: string; password: string }[] =
      await queryRunner.query(`SELECT id, role, password FROM users`);
    const hashes = {
      admin: await bcrypt.hash(seedPassword('admin'), 10),
      operator: await bcrypt.hash(seedPassword('operator'), 10),
    };

    let rotated = 0;
    for (const u of users) {
      if (!u.password || !(await bcrypt.compare('12345678', u.password))) {
        continue;
      }
      await queryRunner.query(
        `UPDATE users SET password = $1, "tokensValidAfter" = now() WHERE id = $2`,
        [u.role === 'admin' ? hashes.admin : hashes.operator, u.id],
      );
      rotated++;
    }
    console.log(`🔐 Contraseñas por defecto rotadas: ${rotated} usuario(s)`);
  }

  public async down(): Promise<void> {
    // Irreversible a propósito: no se restaura una contraseña insegura
  }
}
