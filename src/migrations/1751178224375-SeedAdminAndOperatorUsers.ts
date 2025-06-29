import * as bcrypt from 'bcrypt';
import {
  MigrationInterface,
  QueryRunner,
} from 'typeorm';

import {
  User,
  UserRole,
} from '../repositories/users/entities';

export class SeedAdminAndOperatorUsers1751178224375
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const userRepository = queryRunner.manager.getRepository(User);
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);

    // Crear usuario administrador
    const adminUser = new User();
    adminUser.name = 'Administrador Principal';
    adminUser.email = 'admin@termolab.com';
    adminUser.role = UserRole.ADMIN;
    adminUser.birthDate = new Date('1980-01-01');
    adminUser.password = await bcrypt.hash('12345678', saltRounds);
    adminUser.lastLogin = new Date();

    // Crear usuario operador
    const operatorUser = new User();
    operatorUser.name = 'Operador Primario';
    operatorUser.email = 'operador@termolab.com';
    operatorUser.role = UserRole.OPERATOR;
    operatorUser.birthDate = new Date('1990-01-01');
    operatorUser.password = await bcrypt.hash('12345678', saltRounds);
    operatorUser.lastLogin = new Date();

    await userRepository.save([adminUser, operatorUser]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, [
      { email: 'admin@termolab.com' },
      { email: 'operador@example.com' },
    ]);
  }
}
