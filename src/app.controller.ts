import {
  Body,
  Controller,
  Get,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';

import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dataSource: DataSource,
  ) {}

  /** Healthcheck público (Railway): 200 si la API y la base responden. */
  @Public()
  @Get('health')
  async health(): Promise<{ status: 'ok' }> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException('Base de datos no disponible');
    }
    return { status: 'ok' };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  logError(@Body() errorLog: any): { success: boolean } {
    return this.appService.logError(errorLog);
  }

  @Post('info')
  logInfo(@Body() infoLog: any): { success: boolean } {
    return this.appService.logInfo(infoLog);
  }

  @Post('warning')
  logWarning(@Body() warningLog: any): { success: boolean } {
    return this.appService.logWarning(warningLog);
  }
}
