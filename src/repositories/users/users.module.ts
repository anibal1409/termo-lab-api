import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MailService } from '../../common/mail';
import { User } from './entities';
import { ProfileController } from './profile.controller';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, MailService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
