import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreatmentOptionsModule } from '../treatment-options/treatment-options.module';
import { TreatmentOption } from '../treatment-options/entities';
import { UsersModule } from '../users';
import { Treatment } from './entities';
import { TreatmentsController } from './treatments.controller';
import { TreatmentsService } from './treatments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Treatment, TreatmentOption]),
    UsersModule,
    TreatmentOptionsModule,
  ],
  controllers: [TreatmentsController],
  providers: [TreatmentsService],
  exports: [TypeOrmModule, TreatmentsService],
})
export class TreatmentsModule {}
