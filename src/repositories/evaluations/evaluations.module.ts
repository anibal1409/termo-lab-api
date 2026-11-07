import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreatmentsModule } from '../treatments/treatments.module';
import { UsersModule } from '../users/users.module';
import { EvaluationsController } from './controllers/evaluations.controller';
import { ThermalCalculationsController } from './controllers/thermal-calculations.controller';
import { ReportsController } from './controllers/reports.controller';
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
  ReportGeneratorService,
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
  controllers: [
    EvaluationsController,
    ThermalCalculationsController,
    ReportsController,
  ],
  providers: [
    EvaluationsService,
    EvaluationCalculatorService,
    ThermalCalculatorService,
    ReportGeneratorService,
  ],
  exports: [
    EvaluationsService,
    EvaluationCalculatorService,
    ThermalCalculatorService,
    ReportGeneratorService,
    TypeOrmModule,
  ],
})
export class EvaluationsModule {}
