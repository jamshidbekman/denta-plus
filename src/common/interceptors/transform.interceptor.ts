import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class TransformInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;
    const status = statusCode == 200 || 201 || 202 || 204 ? true : false;
    return next.handle().pipe(
      map((response) => {
        return {
          statusCode,
          status,
          ...response,
        };
      }),
    );
  }
}
