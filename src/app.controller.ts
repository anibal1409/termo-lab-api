import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Post()
  logError(@Body() errorLog: any): { success: boolean } {
    return this.appService.logError(errorLog);
  }

  @Public()
  @Post('info')
  logInfo(@Body() infoLog: any): { success: boolean } {
    return this.appService.logInfo(infoLog);
  }

  @Public()
  @Post('warning')
  logWarning(@Body() warningLog: any): { success: boolean } {
    return this.appService.logWarning(warningLog);
  }
}
