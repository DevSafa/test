import { PrismaService } from 'src/prisma/prisma.service';
import { dto_msg } from '../dto/create-room.dto';
export declare class DmService {
    private prisma;
    constructor(prisma: PrismaService);
    check_create_room_dm(from: string, to: string): Promise<string>;
    find_dm_room_name(from: string, to: string): Promise<{
        name: string;
    }>;
    create_msg(from: string, to: string, msg: dto_msg): Promise<import(".prisma/client").DirectMessage>;
}
