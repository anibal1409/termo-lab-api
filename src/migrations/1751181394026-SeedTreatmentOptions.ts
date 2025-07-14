import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class SeedTreatmentOptions1751181394026 implements MigrationInterface {
  // Datos para tratadores verticales (Tabla 1 de API-12L)
  private readonly VERTICAL_TREATERS = [
    { diameter: 3, length: 10, pressure: 50, heat: 100000, notes: 'LSS 10' },
    { diameter: 3, length: 12, pressure: 50, heat: 100000, notes: 'LSS 12' },
    { diameter: 3, length: 15, pressure: 50, heat: 100000, notes: 'LSS 15' },
    { diameter: 4, length: 10, pressure: 50, heat: 250000, notes: 'LSS 10' },
    { diameter: 4, length: 12, pressure: 50, heat: 250000, notes: 'LSS 12' },
    { diameter: 4, length: 20, pressure: 50, heat: 250000, notes: 'LSS 20' },
    { diameter: 6, length: 12, pressure: 50, heat: 500000, notes: 'LSS 12' },
    { diameter: 6, length: 20, pressure: 50, heat: 500000, notes: 'LSS 20' },
    { diameter: 8, length: 20, pressure: 40, heat: 1000000, notes: 'LSS 20' },
    { diameter: 10, length: 20, pressure: 40, heat: 1250000, notes: 'LSS 20' },
  ];

  // Datos para tratadores horizontales (Tabla 2 de API-12L)
  private readonly HORIZONTAL_TREATERS = [
    { diameter: 3, length: 10, pressure: 50, heat: 150000, notes: 'LSS 10' },
    { diameter: 3, length: 12, pressure: 50, heat: 150000, notes: 'LSS 12' },
    { diameter: 3, length: 15, pressure: 50, heat: 150000, notes: 'LSS 15' },
    { diameter: 4, length: 10, pressure: 50, heat: 250000, notes: 'LSS 10' },
    { diameter: 4, length: 12, pressure: 50, heat: 250000, notes: 'LSS 12' },
    { diameter: 6, length: 10, pressure: 50, heat: 500000, notes: 'LSS 10' },
    { diameter: 6, length: 15, pressure: 50, heat: 500000, notes: 'LSS 15' },
    { diameter: 6, length: 20, pressure: 50, heat: 500000, notes: 'LSS 20' },
    { diameter: 8, length: 15, pressure: 50, heat: 750000, notes: 'LSS 15' },
    { diameter: 8, length: 20, pressure: 50, heat: 750000, notes: 'LSS 20' },
    { diameter: 10, length: 20, pressure: 50, heat: 2000000, notes: 'LSS 20' },
    { diameter: 12, length: 30, pressure: 50, heat: 3200000, notes: 'LSS 30' },
  ];

  public async up(queryRunner: QueryRunner): Promise<void> {
    await this.seedInitialData(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar todos los datos de la tabla
    await queryRunner.query(`DELETE FROM treatment_options;`);

    // Alternativamente, si se quiere eliminar la tabla completamente:
    // await queryRunner.query(`DROP TABLE treatment_options;`);
  }

  private async seedInitialData(queryRunner: QueryRunner): Promise<void> {
    // Insertar tratadores verticales
    await this.insertTreaters(queryRunner, 'vertical', this.VERTICAL_TREATERS);

    // Insertar tratadores horizontales
    await this.insertTreaters(
      queryRunner,
      'horizontal',
      this.HORIZONTAL_TREATERS,
    );
  }

  private async insertTreaters(
    queryRunner: QueryRunner,
    type: 'vertical' | 'horizontal',
    treaters: Array<{
      diameter: number;
      length: number;
      pressure: number;
      heat: number;
      notes: string;
    }>,
  ): Promise<void> {
    for (const treater of treaters) {
      await queryRunner.query(
        `INSERT INTO treatment_options 
         (type, diameter, length, design_pressure, min_heat_capacity, notes)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [
          type,
          treater.diameter,
          treater.length,
          treater.pressure,
          treater.heat,
          `Tratador ${type} ${treater.diameter}ft - ${treater.notes}`,
        ],
      );
    }
  }
}
