import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

export class SeedTreatmentOptions1751181394026 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insertar datos iniciales basados en API-12L
    await this.seedInitialData(queryRunner);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE treatment_options;`);
  }

  private async seedInitialData(queryRunner: QueryRunner): Promise<void> {
    // Datos para tratadores verticales (Tabla 1 de API-12L)
    await queryRunner.query(`
      INSERT INTO treatment_options 
        (type, diameter, length, design_pressure, min_heat_capacity, notes)
      VALUES
        ('vertical', 3, 10, 50, 100000, 'Tratador vertical 3ft - LSS 10'),
        ('vertical', 3, 12, 50, 100000, 'Tratador vertical 3ft - LSS 12'),
        ('vertical', 3, 15, 50, 100000, 'Tratador vertical 3ft - LSS 15'),
        ('vertical', 4, 10, 50, 250000, 'Tratador vertical 4ft - LSS 10'),
        ('vertical', 4, 12, 50, 250000, 'Tratador vertical 4ft - LSS 12'),
        ('vertical', 4, 20, 50, 250000, 'Tratador vertical 4ft - LSS 20'),
        ('vertical', 6, 12, 50, 500000, 'Tratador vertical 6ft - LSS 12'),
        ('vertical', 6, 20, 50, 500000, 'Tratador vertical 6ft - LSS 20'),
        ('vertical', 8, 20, 40, 1000000, 'Tratador vertical 8ft - LSS 20'),
        ('vertical', 10, 20, 40, 1250000, 'Tratador vertical 10ft - LSS 20');
    `);

    // Datos para tratadores horizontales (Tabla 2 de API-12L)
    await queryRunner.query(`
      INSERT INTO treatment_options 
        (type, diameter, length, design_pressure, min_heat_capacity, notes)
      VALUES
        ('horizontal', 3, 10, 50, 150000, 'Tratador horizontal 3ft - LSS 10'),
        ('horizontal', 3, 12, 50, 150000, 'Tratador horizontal 3ft - LSS 12'),
        ('horizontal', 3, 15, 50, 150000, 'Tratador horizontal 3ft - LSS 15'),
        ('horizontal', 4, 10, 50, 250000, 'Tratador horizontal 4ft - LSS 10'),
        ('horizontal', 4, 12, 50, 250000, 'Tratador horizontal 4ft - LSS 12'),
        ('horizontal', 6, 10, 50, 500000, 'Tratador horizontal 6ft - LSS 10'),
        ('horizontal', 6, 15, 50, 500000, 'Tratador horizontal 6ft - LSS 15'),
        ('horizontal', 6, 20, 50, 500000, 'Tratador horizontal 6ft - LSS 20'),
        ('horizontal', 8, 15, 50, 750000, 'Tratador horizontal 8ft - LSS 15'),
        ('horizontal', 8, 20, 50, 750000, 'Tratador horizontal 8ft - LSS 20'),
        ('horizontal', 10, 20, 50, 2000000, 'Tratador horizontal 10ft - LSS 20'),
        ('horizontal', 12, 30, 50, 3200000, 'Tratador horizontal 12ft - LSS 30');
    `);
  }
}
