import { MigrationInterface, QueryRunner } from "typeorm";

export class AddThermalCalculationFields1759797734044 implements MigrationInterface {
    name = 'AddThermalCalculationFields1759797734044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "diameter" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "length" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "freeWaterRemovalPercentage" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "waterDropSize" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "waterSpecificGravity" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "oilSpecificHeat" numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "waterSpecificHeat" numeric(10,4)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "inletTemperature" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "ambientTemperature" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "operatingPressure" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "oilDensity" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "waterDensity" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "oilViscosity" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "factorK" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "lowLowWaterLevel" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "waterOilInterfaceLevel" numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "external_treatments" ADD "highHighOilLevel" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "highHighOilLevel"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "waterOilInterfaceLevel"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "lowLowWaterLevel"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "factorK"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "oilViscosity"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "waterDensity"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "oilDensity"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "operatingPressure"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "ambientTemperature"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "inletTemperature"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "waterSpecificHeat"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "oilSpecificHeat"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "waterSpecificGravity"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "waterDropSize"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "freeWaterRemovalPercentage"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "length"`);
        await queryRunner.query(`ALTER TABLE "external_treatments" DROP COLUMN "diameter"`);
    }

}
