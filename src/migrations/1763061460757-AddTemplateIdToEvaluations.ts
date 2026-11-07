import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTemplateIdToEvaluations1763061460757
  implements MigrationInterface
{
  name = 'AddTemplateIdToEvaluations1763061460757';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar si la columna ya existe antes de agregarla
    const columnExists = await queryRunner.hasColumn(
      'evaluations',
      'templateId',
    );

    if (!columnExists) {
      await queryRunner.query(
        `ALTER TABLE "evaluations" ADD "templateId" integer`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columnExists = await queryRunner.hasColumn(
      'evaluations',
      'templateId',
    );

    if (columnExists) {
      await queryRunner.query(
        `ALTER TABLE "evaluations" DROP COLUMN "templateId"`,
      );
    }
  }
}

