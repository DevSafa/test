import { Server, Socket } from "socket.io";
import { PrismaService } from 'src/prisma/prisma.service';
import { dto_admin, dto_ban_mute, dto_changePass, dto_join_room, dto_kick, dto_msg } from "../dto/create-room.dto";
import { ChatRoomService } from './chat_room.service';
export declare class AppGateway {
    private prisma;
    private chatroomservice;
    constructor(prisma: PrismaService, chatroomservice: ChatRoomService);
    myMap: Map<any, any>;
    banned: string[];
    server: Server;
    private logger;
    Join_room(client: Socket, infos: dto_join_room): Promise<void>;
    leaveRoom(client: Socket): Promise<void>;
    setAdmin(client: Socket, infos: dto_admin): Promise<void>;
    disablePassword(client: Socket): Promise<void>;
    changePassword(client: any, infos: dto_changePass): Promise<void>;
    mute_user(client: Socket, infos: dto_ban_mute): Promise<void>;
    ban_user(client: Socket, infos: dto_ban_mute): Promise<void>;
    kick_user(client: Socket, infos: dto_kick): Promise<void>;
    Send_message(client: Socket, msg: dto_msg): Promise<void>;
    close(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
    handleConnection(client: Socket): Promise<void>;
}
