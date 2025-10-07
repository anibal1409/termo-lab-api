import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';

export class UpdateUserPasswords1759794383734 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Hash de la contraseña "12345678"
        const newPassword = await bcrypt.hash('12345678', 10);
        
        // Actualizar contraseña para admin@termolab.com
        await queryRunner.query(`
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'admin@termolab.com'
        `, [newPassword]);

        // Actualizar contraseña para operador@termolab.com
        await queryRunner.query(`
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'operador@termolab.com'
        `, [newPassword]);

        console.log('✅ Contraseñas actualizadas para admin@termolab.com y operador@termolab.com a "12345678"');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Hash de las contraseñas originales (generadas aleatoriamente)
        // Como no tenemos las contraseñas originales, las revertimos a valores temporales
        const tempPassword = await bcrypt.hash('temp', 10);
        
        // Revertir contraseña para admin@termolab.com
        await queryRunner.query(`
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'admin@termolab.com'
        `, [tempPassword]);

        // Revertir contraseña para operador@termolab.com
        await queryRunner.query(`
            UPDATE "users" 
            SET "password" = $1 
            WHERE "email" = 'operador@termolab.com'
        `, [tempPassword]);

        console.log('⚠️ Contraseñas revertidas a valores temporales');
    }

}
