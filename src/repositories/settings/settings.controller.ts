import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AdminGuard } from '../../auth/guards';
import { User } from '../users/entities';
import { AppSettingsResponseDto, UpdateAppSettingsDto } from './settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@ApiBearerAuth()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settings: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Leer settings globales' })
  @ApiOkResponse({ type: AppSettingsResponseDto })
  get(): Promise<AppSettingsResponseDto> {
    return this.settings.get();
  }

  @Put()
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Actualizar settings (parcial, solo admin)' })
  @ApiOkResponse({ type: AppSettingsResponseDto })
  update(
    @Body() dto: UpdateAppSettingsDto,
    @CurrentUser() user: User,
  ): Promise<AppSettingsResponseDto> {
    return this.settings.update(dto, user.id);
  }

  @Post('reset')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Restaurar defaults de fábrica (solo admin)' })
  @ApiOkResponse({ type: AppSettingsResponseDto })
  reset(@CurrentUser() user: User): Promise<AppSettingsResponseDto> {
    return this.settings.reset(user.id);
  }
}
