import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

export class SerializeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler
    console.log("I'm running before the handler", context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out.
        // Here 'data' is the data that we are going to send back in response.
        console.log("I'm running before response is sent out", data);
      }),
    );
  }
}
