import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro global de excepciones para capturar y formatear todos los errores
 * Asegura que los errores se envíen con información detallada al frontend
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    console.error('[HttpExceptionFilter] === EXCEPCIÓN CAPTURADA ===');
    console.error('[HttpExceptionFilter] URL:', request.url);
    console.error('[HttpExceptionFilter] Método:', request.method);
    console.error('[HttpExceptionFilter] Body:', JSON.stringify(request.body, null, 2));
    console.error('[HttpExceptionFilter] Tipo de excepción:', exception?.constructor?.name);
    console.error('[HttpExceptionFilter] Excepción completa:', exception);

    let status: number;
    let message: string;
    let error: string;
    let details: any = null;
    let stack: string | undefined = undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        error = exception.message || 'Http Exception';
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as any;
        message = responseObj.message || exception.message || 'Http Exception';
        error = responseObj.error || exception.name || 'Http Exception';
        details = responseObj;
      } else {
        message = exception.message || 'Http Exception';
        error = exception.name || 'Http Exception';
      }
    } else if (exception instanceof Error) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = exception.message || 'Internal server error';
      error = exception.name || 'Error';
      stack = exception.stack;
      
      // Log detallado del error
      console.error('[HttpExceptionFilter] Error name:', exception.name);
      console.error('[HttpExceptionFilter] Error message:', exception.message);
      console.error('[HttpExceptionFilter] Stack trace:', exception.stack);
      
      // Si es un error de TypeORM o base de datos
      if (exception.name === 'QueryFailedError' || exception.message.includes('database')) {
        message = `Error de base de datos: ${exception.message}`;
        error = 'Database Error';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Unknown Error';
      console.error('[HttpExceptionFilter] Excepción desconocida:', JSON.stringify(exception));
    }

    // En desarrollo, incluir el stack trace en la respuesta
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error: error,
      message: message,
      ...(details && { details }),
      ...(isDevelopment && stack && { stack }),
    };

    console.error('[HttpExceptionFilter] Respuesta de error a enviar:', JSON.stringify(errorResponse, null, 2));
    console.error('[HttpExceptionFilter] === FIN DE EXCEPCIÓN ===');

    // Log al logger de NestJS
    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${message}`,
      stack || exception?.toString(),
    );

    response.status(status).json(errorResponse);
  }
}

