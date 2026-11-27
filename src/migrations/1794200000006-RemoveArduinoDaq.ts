import { MigrationInterface, QueryRunner } from 'typeorm';

import { AddDevices1794006813002 } from './1794006813002-AddDevices';

/**
 * Retira el hardware Arduino / DAQ: tablas de dispositivos, canales, lecturas,
 * reglas, PID y comandos; mapeo de canales en ensayos; permisos de firetube y
 * flight recorder. Respaldar antes: los datos de esas tablas se pierden.
 */
export class RemoveArduinoDaq1794200000006 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS
        "device_command_logs",
        "pid_loops",
        "device_rules",
        "channel_readings",
        "device_channels",
        "devices"
      CASCADE
    `);
    await queryRunner.query(`
      ALTER TABLE "trials"
        DROP COLUMN IF EXISTS "bathTempChannelId",
        DROP COLUMN IF EXISTS "ambientTempChannelId",
        DROP COLUMN IF EXISTS "heaterChannelId",
        DROP COLUMN IF EXISTS "levelChannelIds",
        DROP COLUMN IF EXISTS "pidLoopId",
        DROP COLUMN IF EXISTS "ruleIds"
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "allowFiretube",
        DROP COLUMN IF EXISTS "allowFlightRecorder"
    `);
    // Política biométrica de firetube en settings (JSON): ya no aplica
    await queryRunner.query(`
      UPDATE "app_settings"
        SET "data" = "data" - 'requireBiometricsForFiretube' - 'requireBiometricsRoles'
    `);
  }

  /** Recrea la estructura vacía (los datos se recuperan desde un respaldo). */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await new AddDevices1794006813002().up(queryRunner);
    await queryRunner.query(`
      ALTER TABLE "trials"
        ADD COLUMN IF NOT EXISTS "bathTempChannelId" integer,
        ADD COLUMN IF NOT EXISTS "ambientTempChannelId" integer,
        ADD COLUMN IF NOT EXISTS "heaterChannelId" integer,
        ADD COLUMN IF NOT EXISTS "levelChannelIds" text,
        ADD COLUMN IF NOT EXISTS "pidLoopId" integer,
        ADD COLUMN IF NOT EXISTS "ruleIds" text
    `);
    await queryRunner.query(`
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "allowFiretube" boolean NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS "allowFlightRecorder" boolean NOT NULL DEFAULT false
    `);
  }
}
