import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TreatmentOption } from './entities';
import { TreatmentOptionController } from './treatment-options.controller';
import { TreatmentOptionService } from './treatment-options.service';

@Module({
  imports: [TypeOrmModule.forFeature([TreatmentOption])],
  controllers: [TreatmentOptionController],
  providers: [TreatmentOptionService],
  exports: [TypeOrmModule, TreatmentOptionService],
})
export class TreatmentOptionsModule {}
