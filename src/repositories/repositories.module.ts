import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { TreatmentOptionsModule } from './treatment-options/treatment-options.module';
import { EvaluationsModule } from './evaluations/evaluations.module';
import { TrialsModule } from './trials/trials.module';
import { SimulationModule } from './simulation/simulation.module';
import { SettingsModule } from './settings/settings.module';
import { AuditModule } from './audit/audit.module';
import { BackupsModule } from './backups/backups.module';

@Module({
  imports: [
    UsersModule,
    TreatmentsModule,
    TreatmentOptionsModule,
    EvaluationsModule,
    TrialsModule,
    SimulationModule,
    SettingsModule,
    AuditModule,
    BackupsModule,
  ],
})
export class RepositoriesModule {}
