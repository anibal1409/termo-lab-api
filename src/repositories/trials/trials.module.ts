import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TRIAL_ENTITIES } from './entities';
import { TrialsController } from './trials.controller';
import { TrialsService } from './trials.service';
import { ThermalTwinService } from '../evaluations/services/thermal-twin.service';
import {
  ChannelReading,
  DeviceCommandLog,
} from '../devices/entities/device.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([...TRIAL_ENTITIES, ChannelReading, DeviceCommandLog]),
  ],
  controllers: [TrialsController],
  providers: [TrialsService, ThermalTwinService],
  exports: [TrialsService, ThermalTwinService],
})
export class TrialsModule {}
