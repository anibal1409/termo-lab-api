import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SimulationController } from './simulation.controller';
import { EquipmentController } from './equipment.controller';
import { SimulationService } from './simulation.service';
import { RunnerService } from './runner/runner.service';
import { Treatment } from '../treatments/entities/treatment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Treatment])],
  controllers: [SimulationController, EquipmentController],
  providers: [SimulationService, RunnerService],
  exports: [SimulationService],
})
export class SimulationModule {}
