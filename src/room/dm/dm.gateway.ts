import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { dto_msg } from '../dto/create-room.dto';
import { DmService } from './dm.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  }
})
export class DmGateway {
  constructor(private prisma: PrismaService, private dm_service: DmService){}

  @WebSocketServer()
    server: Server;
    private logger: Logger = new Logger('AppGateway_DM');

  @SubscribeMessage('join_dm_room')
    async check_room_name(client: Socket){
      let from = client.handshake.auth.from;
      let to = client.handshake.auth.to;

      from = 'ssghuri';
      to = 'sbarka';
      console.log("hello\n");
      const join_name = await this.dm_service.check_create_room_dm(from, to);
      client.join(join_name);
      client.emit("instant_messaging", {"status": true, "message": "Join Succes"})//send to other user in same room
    }

    @SubscribeMessage('dm_message')
    async send_msg(client: Socket, msg: dto_msg){
      let from = client.handshake.auth.from;
      let to = client.handshake.auth.to;

      from = 'ssghuri';
      to = 'sbarka';
      const get_name = await this.dm_service.find_dm_room_name(from, to);
      await this.dm_service.create_msg(from, to, msg)
      this.server.to(get_name.name).emit('msgToClient_dm', {from: from, msg: msg.msg});
    }

    handleDisconnect(client: Socket) {
    	this.logger.log(`Client disconnected: ${client.id}`);
    }
  
    handleConnection(client: Socket) {
    //	this.logger.log(`Client connected: ${client.id}`);
    }
}
