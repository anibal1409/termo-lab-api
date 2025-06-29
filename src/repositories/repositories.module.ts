import { Module } from '@nestjs/common';

import { UsersModule } from './users/users.module';
import { TreatmentsModule } from './treatments/treatments.module';

@Module({
  imports: [UsersModule, TreatmentsModule],
})
export class RepositoriesModule {}
