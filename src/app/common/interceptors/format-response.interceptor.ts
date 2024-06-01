import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { HttpResponseEntity } from '../domain/http-response.entity';

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponseEntity> {
    return next.handle().pipe(
      map((value) => {
        value = value ? value : [];
        const isValueExists =
          value.length === 0 ? 'No Data Available' : 'Successfully';
        return { message: isValueExists, data: value };
      }),
    );
  }
}
