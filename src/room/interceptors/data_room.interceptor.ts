import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class DataRoomInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
          .handle()
          .pipe(
            map(items => items.map(item => {
            
              return ({
                room_id : item.name,
                  owner : item.owner,
                  count : item._count.users_room
              });
          }))
          )
  }
}
