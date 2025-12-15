import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    console.error('Error:', {
      status,
      message,
      path: request.url,
      method: request.method,
      error: exception instanceof Error ? exception.stack : exception,
    });

    // Include error details in development
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const errorResponse: any = {
      statusCode: status,
      message: typeof message === 'string' ? message : (message as any).message || 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    // Include stack trace and details in development
    if (isDevelopment && exception instanceof Error) {
      errorResponse.error = exception.message;
      errorResponse.stack = exception.stack;
      if ((exception as any).code) {
        errorResponse.code = (exception as any).code;
      }
      if ((exception as any).detail) {
        errorResponse.detail = (exception as any).detail;
      }
    }

    response.status(status).json(errorResponse);
  }
}

