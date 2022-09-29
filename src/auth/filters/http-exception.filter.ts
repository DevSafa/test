import {ExceptionFilter, Catch, ArgumentsHost, HttpException, UnauthorizedException} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        console.log("Status ",  status);

        if (status == 401)
            response.redirect('http://localhost:3000');
    }
}