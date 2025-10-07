import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreatmentsModule } from '../treatments/treatments.module';
import { UsersModule } from '../users/users.module';
import { EvaluationsController } from './controllers/evaluations.controller';
import { ThermalCalculationsController } from './controllers/thermal-calculations.controller';
import {
  Evaluation,
  EvaluationCriteria,
  EvaluationTemplate,
  EvaluationTemplateCriteria,
  ExternalTreatment,
} from './entities';
import {
  EvaluationCalculatorService,
  EvaluationsService,
  ThermalCalculatorService,
} from './services';

/**
 * @description Módulo que agrupa toda la funcionalidad relacionada con evaluaciones de tratadores
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Evaluation,
      EvaluationCriteria,
      ExternalTreatment,
      EvaluationTemplateCriteria,
      EvaluationTemplate,
    ]),
    UsersModule,
    TreatmentsModule,
  ],
  controllers: [EvaluationsController, ThermalCalculationsController],
  providers: [EvaluationsService, EvaluationCalculatorService, ThermalCalculatorService],
  exports: [EvaluationsService, EvaluationCalculatorService, ThermalCalculatorService, TypeOrmModule],
})
export class EvaluationsModule {}
