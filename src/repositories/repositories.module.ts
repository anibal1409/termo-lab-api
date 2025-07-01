import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { TreatmentOptionsModule } from './treatment-options/treatment-options.module';
import { EvaluationsModule } from './evaluations/evaluations.module';

@Module({
  imports: [UsersModule, TreatmentsModule, TreatmentOptionsModule, EvaluationsModule],
})
export class RepositoriesModule {}
