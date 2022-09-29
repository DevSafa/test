import { Socket, Server } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { dto_msg } from '../dto/create-room.dto';
import { DmService } from './dm.service';
export declare class DmGateway {
    private prisma;
    private dm_service;
    constructor(prisma: PrismaService, dm_service: DmService);
    server: Server;
    private logger;
    check_room_name(client: Socket): Promise<void>;
    send_msg(client: Socket, msg: dto_msg): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleConnection(client: Socket): void;
}
