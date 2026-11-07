import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DEVICE_ENTITIES } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature(DEVICE_ENTITIES)],
  controllers: [DevicesController],
  providers: [DevicesService],
  exports: [DevicesService],
})
export class DevicesModule {}
