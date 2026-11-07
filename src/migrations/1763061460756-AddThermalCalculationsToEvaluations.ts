import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddThermalCalculationsToEvaluations1763061460756
  implements MigrationInterface
{
  name = 'AddThermalCalculationsToEvaluations1763061460756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna ya existe antes de agregarla
    const columnExists = await queryRunner.hasColumn(
      'evaluations',
      'thermal_calculations',
    );

    if (!columnExists) {
      await queryRunner.query(
        `ALTER TABLE "evaluations" ADD "thermal_calculations" json`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn(
      'evaluations',
      'thermal_calculations',
    );

    if (columnExists) {
      await queryRunner.query(
        `ALTER TABLE "evaluations" DROP COLUMN "thermal_calculations"`,
      );
    }
  }
}

