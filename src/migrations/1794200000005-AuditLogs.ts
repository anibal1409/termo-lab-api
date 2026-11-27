import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Bitácora de auditoría append-only: el trigger rechaza UPDATE y DELETE,
 * incluso desde SQL directo con el usuario de la aplicación.
 */
export class AuditLogs1794200000005 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "audit_logs" (
        "id" BIGSERIAL PRIMARY KEY,
        "at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "userId" integer,
        "userEmail" varchar(255),
        "userRole" varchar(20),
        "action" varchar(40) NOT NULL,
        "resource" varchar(60) NOT NULL,
        "resourceId" varchar(120),
        "method" varchar(10) NOT NULL,
        "path" varchar(500) NOT NULL,
        "statusCode" smallint NOT NULL,
        "success" boolean NOT NULL,
        "durationMs" integer NOT NULL,
        "ip" varchar(64),
        "userAgent" varchar(255),
        "details" jsonb
      )
    `);
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_logs_at" ON "audit_logs" ("at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_logs_user_at" ON "audit_logs" ("userId", "at")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_audit_logs_resource_at" ON "audit_logs" ("resource", "at")`,
    );
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION audit_logs_immutable() RETURNS trigger AS $$
      BEGIN
        RAISE EXCEPTION 'audit_logs es de solo inserción (% bloqueado)', TG_OP;
      END;
      $$ LANGUAGE plpgsql
    `);
    await queryRunner.query(
      `DROP TRIGGER IF EXISTS audit_logs_no_change ON "audit_logs"`,
    );
    await queryRunner.query(`
      CREATE TRIGGER audit_logs_no_change
      BEFORE UPDATE OR DELETE ON "audit_logs"
      FOR EACH ROW EXECUTE FUNCTION audit_logs_immutable()
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "audit_logs"`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS audit_logs_immutable()`);
  }
}
