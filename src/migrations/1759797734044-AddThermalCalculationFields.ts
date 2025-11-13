import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThermalCalculationFields1759797734044
  implements MigrationInterface
{
  name = 'AddThermalCalculationFields1759797734044';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si las columnas ya existen antes de agregarlas
    const columns = [
      'diameter',
      'length',
      'freeWaterRemovalPercentage',
      'waterDropSize',
      'waterSpecificGravity',
      'oilSpecificHeat',
      'waterSpecificHeat',
      'inletTemperature',
      'ambientTemperature',
      'operatingPressure',
      'oilDensity',
      'waterDensity',
      'oilViscosity',
      'factorK',
      'lowLowWaterLevel',
      'waterOilInterfaceLevel',
      'highHighOilLevel',
    ];

    for (const column of columns) {
      const columnExists = await queryRunner.hasColumn(
        'external_treatments',
        column,
      );
      if (!columnExists) {
        const precision = column.includes('SpecificHeat') ? '10,4' : '10,2';
        await queryRunner.query(
          `ALTER TABLE "external_treatments" ADD "${column}" numeric(${precision})`,
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "highHighOilLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "waterOilInterfaceLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "lowLowWaterLevel"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "factorK"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "oilViscosity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "waterDensity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "oilDensity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "operatingPressure"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "ambientTemperature"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "inletTemperature"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "waterSpecificHeat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "oilSpecificHeat"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "waterSpecificGravity"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "waterDropSize"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "freeWaterRemovalPercentage"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "length"`,
    );
    await queryRunner.query(
      `ALTER TABLE "external_treatments" DROP COLUMN "diameter"`,
    );
  }
}
