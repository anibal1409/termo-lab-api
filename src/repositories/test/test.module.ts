import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Test } from './entities';
import { TestController } from './test.controller';
import { TestService } from './test.service';

/**
 * Módulo de NestJS para la funcionalidad de Test.
 * Este módulo encapsula el controlador, el servicio y la entidad
 * relacionados con la gestión de Tests.
 * Configura TypeORM para que la entidad Test esté disponible dentro de este módulo.
 */
@Module({
  imports: [
    // Importa TypeOrmModule.forFeature() para registrar la entidad Test
    // dentro del alcance de este módulo. Esto permite que el TestService
    // inyecte el repositorio de Test.
    TypeOrmModule.forFeature([Test]),
  ],
  controllers: [TestController], // Define los controladores que pertenecen a este módulo
  providers: [TestService], // Define los proveedores (servicios, etc.) que pertenecen a este módulo
  // Opcional: si necesitas exponer TestService o TypeOrmModule a otros módulos, agrégalos a 'exports'
  exports: [TestService, TypeOrmModule],
})
export class TestModule {}
