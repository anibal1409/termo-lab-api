import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDevices1794006813002 implements MigrationInterface {
  name = 'AddDevices1794006813002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "devices" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean DEFAULT true, "deleted" boolean DEFAULT false, "name" character varying(100) NOT NULL, "path" character varying(100) NOT NULL, "baudRate" integer NOT NULL DEFAULT '115200', "autoConnect" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_45adadb1a9b299c7c5af85585f9" UNIQUE ("path"), CONSTRAINT "PK_b1514758245c12daf43486dd1f0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device_channels" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean DEFAULT true, "deleted" boolean DEFAULT false, "deviceId" integer NOT NULL, "name" character varying(100) NOT NULL, "type" character varying(20) NOT NULL, "pins" text NOT NULL, "pullup" boolean NOT NULL DEFAULT false, "unit" character varying(20), "factor" double precision NOT NULL DEFAULT '1', "offset" double precision NOT NULL DEFAULT '0', "pollMs" integer NOT NULL DEFAULT '1000', CONSTRAINT "PK_8426b8fcc28f72e2473234636c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "channel_readings" ("id" SERIAL NOT NULL, "channelId" integer NOT NULL, "value" double precision NOT NULL, "at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2750216685d062bfd93f0b79739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b1ec2b5cf5264f6bf69bfb9725" ON "channel_readings" ("channelId", "at") `,
    );
    await queryRunner.query(
      `CREATE TABLE "device_rules" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean DEFAULT true, "deleted" boolean DEFAULT false, "name" character varying(100) NOT NULL, "sourceChannelId" integer NOT NULL, "operator" character varying(1) NOT NULL, "threshold" double precision NOT NULL, "hysteresis" double precision NOT NULL DEFAULT '0', "targetChannelId" integer NOT NULL, "onValue" double precision NOT NULL, "offValue" double precision, "enabled" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8896327023bd673b0a9acedb138" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "pid_loops" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "status" boolean DEFAULT true, "deleted" boolean DEFAULT false, "name" character varying(100) NOT NULL, "inputChannelId" integer NOT NULL, "outputChannelId" integer NOT NULL, "setpoint" double precision NOT NULL, "kp" double precision NOT NULL DEFAULT '1', "ki" double precision NOT NULL DEFAULT '0', "kd" double precision NOT NULL DEFAULT '0', "outMin" double precision NOT NULL DEFAULT '0', "outMax" double precision NOT NULL DEFAULT '255', "windowMs" integer NOT NULL DEFAULT '10000', "enabled" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_77b0e73f30a538f66b62c96ed25" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "device_command_logs" ("id" SERIAL NOT NULL, "deviceId" integer NOT NULL, "channelId" integer, "userId" integer, "source" character varying(10) NOT NULL, "command" character varying(60) NOT NULL, "response" character varying(100) NOT NULL, "at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_29f3575fe8e47c1f9777cf97b9c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_channels" ADD CONSTRAINT "FK_77cfe67de0d2367b01c8aa5a653" FOREIGN KEY ("deviceId") REFERENCES "devices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_readings" ADD CONSTRAINT "FK_ef036376f57f514e8e9e666facb" FOREIGN KEY ("channelId") REFERENCES "device_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_rules" ADD CONSTRAINT "FK_9e72831a7c434c8c0cee3c9a32a" FOREIGN KEY ("sourceChannelId") REFERENCES "device_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_rules" ADD CONSTRAINT "FK_add10ce210063c69f21a20a80fd" FOREIGN KEY ("targetChannelId") REFERENCES "device_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pid_loops" ADD CONSTRAINT "FK_85809a85136acc9e0d77dabbce3" FOREIGN KEY ("inputChannelId") REFERENCES "device_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "pid_loops" ADD CONSTRAINT "FK_631ab6f2e8c7b2a298a26eecb96" FOREIGN KEY ("outputChannelId") REFERENCES "device_channels"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pid_loops" DROP CONSTRAINT "FK_631ab6f2e8c7b2a298a26eecb96"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pid_loops" DROP CONSTRAINT "FK_85809a85136acc9e0d77dabbce3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_rules" DROP CONSTRAINT "FK_add10ce210063c69f21a20a80fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_rules" DROP CONSTRAINT "FK_9e72831a7c434c8c0cee3c9a32a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "channel_readings" DROP CONSTRAINT "FK_ef036376f57f514e8e9e666facb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "device_channels" DROP CONSTRAINT "FK_77cfe67de0d2367b01c8aa5a653"`,
    );
    await queryRunner.query(`DROP TABLE "device_command_logs"`);
    await queryRunner.query(`DROP TABLE "pid_loops"`);
    await queryRunner.query(`DROP TABLE "device_rules"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b1ec2b5cf5264f6bf69bfb9725"`,
    );
    await queryRunner.query(`DROP TABLE "channel_readings"`);
    await queryRunner.query(`DROP TABLE "device_channels"`);
    await queryRunner.query(`DROP TABLE "devices"`);
  }
}
