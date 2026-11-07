import { Body, Controller, Get, Post } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
