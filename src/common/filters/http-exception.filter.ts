import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

const SENSITIVE_KEYS = new Set([
  'password',
  'accessToken',
  'token',
  'authorization',
  'cookie',
  'cookieSecret',
  'jwt',
]);

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isDevelopment = process.env.NODE_ENV === 'development';

    let status: number;
    let message: string;
    let error: string;
    let details: any = null;
    let stack: string | undefined;

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
      message = isDevelopment
        ? exception.message || 'Internal server error'
        : 'Internal server error';
      error = exception.name || 'Error';
      stack = exception.stack;

      if (
        exception.name === 'QueryFailedError' ||
        exception.message.includes('database')
      ) {
        message = isDevelopment
          ? `Error de base de datos: ${exception.message}`
          : 'Error de base de datos';
        error = 'Database Error';
      }
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal server error';
      error = 'Unknown Error';
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      error,
      message,
      ...(details && { details }),
      ...(isDevelopment && stack && { stack }),
    };

    this.logger.error(
      `${request.method} ${request.url} - ${status} - ${
        Array.isArray(message) ? message.join(', ') : message
      }`,
      isDevelopment
        ? JSON.stringify({
            body: this.redact(request.body),
            stack: stack || undefined,
          })
        : undefined,
    );

    response.status(status).json(errorResponse);
  }

  private redact(body: unknown): unknown {
    if (!body || typeof body !== 'object') return body;
    const clone: Record<string, unknown> = { ...(body as object) };
    for (const key of Object.keys(clone)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        clone[key] = '[REDACTED]';
      }
    }
    return clone;
  }
}
