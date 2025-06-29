import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TreatmentsModule } from './treatments/treatments.module';
import { TreatmentOptionsModule } from './treatment-options/treatment-options.module';

@Module({
  imports: [UsersModule, TreatmentsModule, TreatmentOptionsModule],
})
export class RepositoriesModule {}
