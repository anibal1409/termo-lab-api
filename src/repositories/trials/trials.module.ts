import { PdfService } from '../../common/pdf';
import { SettingsModule } from '../settings/settings.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TRIAL_ENTITIES } from './entities';
import { TrialsController } from './trials.controller';
import { TrialsService } from './trials.service';
import { ThermalTwinService } from '../evaluations/services/thermal-twin.service';

@Module({
  imports: [SettingsModule, TypeOrmModule.forFeature([...TRIAL_ENTITIES])],
  controllers: [TrialsController],
  providers: [PdfService, TrialsService, ThermalTwinService],
  exports: [TrialsService, ThermalTwinService],
})
export class TrialsModule {}
