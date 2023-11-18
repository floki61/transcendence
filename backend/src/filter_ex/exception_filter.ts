import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    // console.error(exception);

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();

      switch (exception.code) {
        case 'P2000': {
          const status = HttpStatus.BAD_REQUEST;
          response.status(status).json({
            statusCode: status,
            message: 'Bad Request',
          });
          break;
        }
        case 'P2002': {
          const status = HttpStatus.CONFLICT;
          response.status(status).json({
            statusCode: status,
            message: 'Conflict',
          });
          break;
        }
        case 'P2025': {
          const status = HttpStatus.NOT_FOUND;
          response.status(status).json({
            statusCode: status,
            message: 'Not Found',
          });
          break;
        }

        default: {
          const status = HttpStatus.INTERNAL_SERVER_ERROR;
          response.status(status).json({
            statusCode: status,
            message: 'Internal Server Error',
          });
          break;
        }
      }
    }
    else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const status = exception.status;
      response.status(status).json({
        message: exception.message,
        error: exception.response?.error,
        statusCode: status,
      });
    }
  }
}