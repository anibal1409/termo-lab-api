import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { seedPassword } from '../common/utlis/seed-password';

export class UpdateUserPasswords1759794383734 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminPassword = await bcrypt.hash(seedPassword('admin'), 10);
    const operatorPassword = await bcrypt.hash(seedPassword('operator'), 10);

    // Actualizar contraseña para admin@termolab.com
    await queryRunner.query(
      `
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'admin@termolab.com'
        `,
      [adminPassword],
    );

    // Actualizar contraseña para operador@termolab.com
    await queryRunner.query(
      `
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'operador@termolab.com'
        `,
      [operatorPassword],
    );

    console.log(
      '✅ Contraseñas actualizadas para admin@termolab.com y operador@termolab.com',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Hash de las contraseñas originales (generadas aleatoriamente)
    // Como no tenemos las contraseñas originales, las revertimos a valores temporales
    const tempPassword = await bcrypt.hash('temp', 10);

    // Revertir contraseña para admin@termolab.com
    await queryRunner.query(
      `
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'admin@termolab.com'
        `,
      [tempPassword],
    );

    // Revertir contraseña para operador@termolab.com
    await queryRunner.query(
      `
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'operador@termolab.com'
        `,
      [tempPassword],
    );

    console.log('⚠️ Contraseñas revertidas a valores temporales');
  }
}
