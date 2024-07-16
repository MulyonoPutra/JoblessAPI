import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { HttpResponseEntity } from '../domain/http-response.entity';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<HttpResponseEntity> {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        return next.handle().pipe(
            map((value) => {
                value = value ?? value;
                let message = '';
                switch (method) {
                    case 'GET':
                        message =
                            value.length === 0 ? 'No Data Available' : 'Successfully Retrieved';
                        break;
                    case 'POST':
                        message = 'Successfully';
                        return value ? { message, data: value } : { message };
                    case 'PATCH':
                        message = 'Successfully Updated';
                        return { message };
                    case 'DELETE':
                        message = 'Successfully Deleted';
                        return { message };
                    default:
                        message = 'Operation Successful';
                        break;
                }
                return { message, data: value };
            }),
        );
    }
}
