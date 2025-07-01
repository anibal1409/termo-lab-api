import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

import { Treatment } from '../repositories/treatments/entities';
import { User } from '../repositories/users/entities';

export class CreateSampleTreatments1751337651500 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const treatmentRepository = queryRunner.manager.getRepository(Treatment);
    const userRepository = queryRunner.manager.getRepository(User);

    // Obtener usuario admin para asignar como creador
    const adminUser = await userRepository.findOneBy({
      email: 'admin@termolab.com',
    });

    if (!adminUser) {
      throw new Error('Usuario admin no encontrado');
    }

    // Tratadores verticales
    const verticalTreatments = [
      {
        name: 'Tratador Vertical 3ft - 500 bpd',
        description: 'Diseño estándar para crudo 18°API',
        type: 'vertical',
        totalFlow: 500,
        waterFraction: 20,
        inputTemperature: 75,
        treatmentTemperature: 140,
        ambientTemperature: 30,
        oilRetentionTime: 60,
        waterRetentionTime: 30,
        windSpeed: 15,
        apiGravity: 18,
        calculatedOilFlow: 400,
        calculatedWaterFlow: 100,
        oilRetentionVolume: 16.67,
        waterRetentionVolume: 2.08,
        requiredHeat: 262210,
        heatLoss: 87120,
        totalHeat: 349330,
        selectedDiameter: 3,
        selectedLength: 10,
        designPressure: 50,
        createdBy: adminUser,
      },
      // Más tratadores verticales...
    ];

    // Tratadores horizontales
    const horizontalTreatments = [
      {
        name: 'Tratador Horizontal 4ft - 1000 bpd',
        description: 'Diseño para crudo pesado 15°API',
        type: 'horizontal',
        totalFlow: 1000,
        waterFraction: 30,
        inputTemperature: 80,
        treatmentTemperature: 150,
        ambientTemperature: 25,
        oilRetentionTime: 90,
        waterRetentionTime: 45,
        windSpeed: 10,
        apiGravity: 15,
        calculatedOilFlow: 700,
        calculatedWaterFlow: 300,
        oilRetentionVolume: 43.75,
        waterRetentionVolume: 9.38,
        requiredHeat: 524420,
        heatLoss: 174240,
        totalHeat: 698660,
        selectedDiameter: 4,
        selectedLength: 12,
        designPressure: 50,
        createdBy: adminUser,
      },
      // Más tratadores horizontales...
    ];

    await treatmentRepository.save([
      ...verticalTreatments,
      ...horizontalTreatments,
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM treatments WHERE name LIKE 'Tratador %'`,
    );
  }
}
