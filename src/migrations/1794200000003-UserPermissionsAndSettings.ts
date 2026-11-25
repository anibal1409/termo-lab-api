import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserPermissionsAndSettings1794200000003
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "allowFiretube" boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "allowFlightRecorder" boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "enrollOnFirstLogin" boolean NOT NULL DEFAULT true,
        ADD COLUMN IF NOT EXISTS "faceEnrolled" boolean NOT NULL DEFAULT false
    `);
    // Usuarios existentes: se conserva el acceso que ya tenían (admins operaban el
    // firetube; todos descargaban telemetría) y no se les fuerza enrolamiento.
    await queryRunner.query(`
      UPDATE "users" SET
        "allowFiretube" = (role = 'admin'),
        "allowFlightRecorder" = true,
        "enrollOnFirstLogin" = false,
        "faceEnrolled" = ("faceEmbedding" IS NOT NULL)
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "app_settings" (
        "id" integer PRIMARY KEY DEFAULT 1 CHECK ("id" = 1),
        "data" jsonb NOT NULL,
        "version" integer NOT NULL,
        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updatedById" integer
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "app_settings"`);
    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "faceEnrolled",
        DROP COLUMN IF EXISTS "enrollOnFirstLogin",
        DROP COLUMN IF EXISTS "allowFlightRecorder",
        DROP COLUMN IF EXISTS "allowFiretube"
    `);
  }
}
