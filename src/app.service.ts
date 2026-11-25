import { Injectable, Logger } from '@nestjs/common';

/** Logs del frontend: tamaño acotado para que no se pueda inundar el disco. */
function clip(payload: unknown): string {
  const text = JSON.stringify(payload ?? null) ?? '';
  return text.length > 4000 ? `${text.slice(0, 4000)}…[truncado]` : text;
}

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    return 'Hello World!';
  }

  logError(errorLog: any): { success: boolean } {
    this.logger.error('Frontend Error:', clip(errorLog));
    return { success: true };
  }

  logInfo(infoLog: any): { success: boolean } {
    this.logger.log('Frontend Info:', clip(infoLog));
    return { success: true };
  }

  logWarning(warningLog: any): { success: boolean } {
    this.logger.warn('Frontend Warning:', clip(warningLog));
    return { success: true };
  }
}
