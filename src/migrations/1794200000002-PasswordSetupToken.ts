import { MigrationInterface, QueryRunner } from 'typeorm';

export class PasswordSetupToken1794200000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Solo se guarda el SHA-256 del token: una fuga de la BD no permite usarlo
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordTokenHash" varchar(64)`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "passwordTokenExpires" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "IDX_users_passwordTokenHash" ON "users" ("passwordTokenHash")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_users_passwordTokenHash"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordTokenExpires"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "passwordTokenHash"`,
    );
  }
}
