import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
    catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
        console.error(exception.message);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        switch (exception.code) {
            case 'P2002':
                response.status(HttpStatus.CONFLICT).json({
                    statusCode: HttpStatus.CONFLICT,
                    message: exception.message,
                });
                break;
            case 'P2025':
                response.status(HttpStatus.NOT_FOUND).json({
                    statusCode: HttpStatus.NOT_FOUND,
                    message: 'Record not found',
                });
                break;
            default:
                super.catch(exception, host);
                break;
        }
    }
}
