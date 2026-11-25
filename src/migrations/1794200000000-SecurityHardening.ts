import { MigrationInterface, QueryRunner } from 'typeorm';

export class SecurityHardening1794200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Tokens emitidos antes de esta fecha se rechazan (logout / cambio de contraseña)
    await queryRunner.query(
      `ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "tokensValidAfter" TIMESTAMP WITH TIME ZONE`,
    );
    // Trazabilidad: quién registró cada muestra
    await queryRunner.query(
      `ALTER TABLE "trial_samples" ADD COLUMN IF NOT EXISTS "createdById" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "trial_samples" DROP COLUMN IF EXISTS "createdById"`,
    );
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN IF EXISTS "tokensValidAfter"`,
    );
  }
}
