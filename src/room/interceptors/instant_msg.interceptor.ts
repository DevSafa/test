import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable ,map} from 'rxjs';

@Injectable()
export class InstantMsg implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
            .handle()
            .pipe(
              map((items :any)=> items.map(item => {
               
                return ({
                    id : item.user.id,
                    login : item.user.login,
                    username : item.user.username,
                    avatar : item.user.avatar
                });
            }))
            )
           
}
}
