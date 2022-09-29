import { HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createRoomDto, dm_room, dto_block, room_name } from './dto/create-room.dto';
export declare class RoomService {
    private prisma;
    constructor(prisma: PrismaService);
    create_post_room(createRoomDto: createRoomDto, current_user: any): Promise<import(".prisma/client").Room | HttpException>;
    get_rooms(current_user: any): Promise<{
        room_id: string;
        room: {
            type: string;
        };
        id: number;
        user_role: string;
    }[]>;
    get_public_room(current_user: any): Promise<{
        name: string;
        users_room: {
            user_role: string;
        }[];
        _count: {
            users_room: number;
        };
        id: number;
        owner: string;
    }[]>;
    get_protected_room(current_user: any): Promise<{
        name: string;
        users_room: {
            user_role: string;
        }[];
        _count: {
            users_room: number;
        };
        id: number;
        owner: string;
    }[]>;
    get_room_msgs(name: room_name, current_user: any): Promise<{
        from: string;
        content_msg: string;
    }[]>;
    post_name_dm(name: dm_room, current_user: any): Promise<{
        to: string;
        from: string;
        content_msg: string;
    }[]>;
    getAllUsersOfRoom(infos: room_name, current_user: any): Promise<{
        user: {
            id: number;
            login: string;
            username: string;
            avatar: string;
        };
        user_role: string;
    }[]>;
    block_user(infos: dto_block, current_user: any): Promise<void>;
    get_friends(current_user: any): Promise<{
        id: number;
        user2: {
            login: string;
            username: string;
            avatar: string;
        };
    }[]>;
    instant_messaging(current_user: any, to: dm_room): Promise<{
        user: {
            id: number;
            login: string;
            username: string;
            avatar: string;
            friend: {
                type: string;
            }[];
        };
    }[]>;
}
