import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTrials1794021872972 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "trials" (
                "id" SERIAL PRIMARY KEY,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "status" boolean DEFAULT true,
                "deleted" boolean DEFAULT false,
                "name" varchar(200) NOT NULL,
                "evaluationId" integer,
                "pilotDiameter" double precision NOT NULL,
                "pilotLength" double precision NOT NULL,
                "heaterPower" double precision NOT NULL,
                "bathTempChannelId" integer,
                "ambientTempChannelId" integer,
                "heaterChannelId" integer,
                "levelChannelIds" text,
                "pidLoopId" integer,
                "ruleIds" text,
                "state" varchar(20) NOT NULL DEFAULT 'draft',
                "startedAt" TIMESTAMP WITH TIME ZONE,
                "endedAt" TIMESTAMP WITH TIME ZONE,
                "notes" text,
                "calibratedEta" double precision,
                "calibratedUA" double precision,
                "calibrationRmse" double precision
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "trial_samples" (
                "id" SERIAL PRIMARY KEY,
                "trialId" integer NOT NULL,
                "label" varchar(100) NOT NULL,
                "value" double precision NOT NULL,
                "unit" varchar(20),
                "at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                CONSTRAINT "FK_trial_samples_trial" FOREIGN KEY ("trialId") REFERENCES "trials"("id") ON DELETE CASCADE
            )
        `);

        await queryRunner.query(`CREATE INDEX "IDX_trial_samples_trialId_at" ON "trial_samples" ("trialId", "at")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "trial_samples"`);
        await queryRunner.query(`DROP TABLE "trials"`);
    }

}
