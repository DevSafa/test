import { PrismaService } from 'src/prisma/prisma.service';
import { dto_admin, dto_changePass, dto_global, dto_msg } from '../dto/create-room.dto';
export declare class ChatRoomService {
    private prisma;
    constructor(prisma: PrismaService);
    add_user_to_room(infos: dto_global): Promise<import(".prisma/client").Users_room>;
    add_msg_room(from: string, to: string, infos: dto_msg): Promise<any>;
    ban_mute_user_in_room(room: string, who: string, action: string, current_role: string): Promise<any>;
    update_ban_mute_user_in_room(room: string, who: string): Promise<import(".prisma/client").Users_room>;
    setAdmin(infos: dto_admin, room: string): Promise<import(".prisma/client").Users_room>;
    getOwner(user: string, room: string): Promise<import(".prisma/client").Users_room>;
    leaveRoom(role: string, room: string, user: string): Promise<import(".prisma/client").Users_room | import(".prisma/client").Room>;
    getNewOwner(room: string): Promise<{
        owner: string;
    }>;
    leaveOwner(room: string, user: string): Promise<import(".prisma/client").Room | (import(".prisma/client").Users_room & {
        room: import(".prisma/client").Room;
    })>;
    leave(room: string, user: string): Promise<import(".prisma/client").Users_room>;
    disablePassword(user: string, room: string): Promise<import(".prisma/client").Room>;
    changePassword(room: string, infos: dto_changePass): Promise<import(".prisma/client").Room>;
}
