import { MigrationInterface, QueryRunner } from 'typeorm';

import {
  api12lFirebox,
  API12L_HORIZONTAL_SIZES,
  API12L_VERTICAL_SIZES,
} from '../repositories/evaluations/services/api12l.tables';

/**
 * Completa el catálogo con todos los tamaños de las Tablas 1 y 2 de API-12L
 * (heat duty de Tabla 3 por diámetro y orientación). No toca filas existentes.
 */
export class CompleteApi12lTreatmentOptions1794200000004
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const sets = [
      ['vertical', API12L_VERTICAL_SIZES],
      ['horizontal', API12L_HORIZONTAL_SIZES],
    ] as const;
    for (const [type, sizes] of sets) {
      for (const s of sizes) {
        const duty = api12lFirebox(s.diameter, type)?.duty;
        if (!duty) continue;
        await queryRunner.query(
          `INSERT INTO treatment_options (type, diameter, length, design_pressure, min_heat_capacity, notes)
           SELECT $1::varchar, $2::numeric, $3::numeric, $4::int, $5::int, $6::text
           WHERE NOT EXISTS (
             SELECT 1 FROM treatment_options
             WHERE type = $1::varchar AND diameter = $2::numeric AND length = $3::numeric AND NOT deleted
           )`,
          [
            type,
            s.diameter,
            s.length,
            s.pressure,
            duty,
            `Tratador ${type} ${s.diameter}ft - LSS ${s.length} (API-12L)`,
          ],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM treatment_options WHERE notes LIKE '% (API-12L)'`,
    );
  }
}
