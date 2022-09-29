import { Module } from '@nestjs/common';
import { RoomModule } from './room/room.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppGateway } from './room/chat_rooms/chat_room.gateway';
import { RoomService } from './room/room.service';
import { DmGateway } from './room/dm/dm.gateway';
import { ChatRoomService } from './room/chat_rooms/chat_room.service';
import { DmService } from './room/dm/dm.service';
import {AuthModule} from "./auth/auth.module";
// import { GameModule } from './game/game.module';

@Module({
  imports: [RoomModule, PrismaModule, AuthModule],
  // controllers: [AppController],
  // providers: [AppService],
  providers: [AppGateway, RoomService, DmGateway, ChatRoomService, DmService],
})
export class AppModule {}