import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  logError(errorLog: any): { success: boolean } {
    this.logger.error('Frontend Error:', errorLog);
    return { success: true };
  }

  logInfo(infoLog: any): { success: boolean } {
    this.logger.log('Frontend Info:', infoLog);
    return { success: true };
  }

  logWarning(warningLog: any): { success: boolean } {
    this.logger.warn('Frontend Warning:', warningLog);
    return { success: true };
  }
}
