import { createRoomDto, dm_room, dto_block, room_name } from './dto/create-room.dto';
import { RoomService } from './room.service';
export declare class RoomController {
    private roomService;
    constructor(roomService: RoomService);
    post_room(req: any, createroomdto: createRoomDto): Promise<import(".prisma/client").Room | import("@nestjs/common").HttpException>;
    get_rooms(req: any): Promise<{
        room_id: string;
        room: {
            type: string;
        };
        id: number;
        user_role: string;
    }[]>;
    get_public_room(req: any): Promise<{
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
    get_protected_room(req: any): Promise<{
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
    post_name_room(req: any, room_id: room_name): Promise<{
        from: string;
        content_msg: string;
    }[]>;
    post_name_room_dm(req: any, name: dm_room): Promise<{
        to: string;
        from: string;
        content_msg: string;
    }[]>;
    getAllUsersOfRoom(req: any, infos: room_name): Promise<{
        user: {
            id: number;
            login: string;
            username: string;
            avatar: string;
        };
        user_role: string;
    }[]>;
    get_friends(req: any): Promise<{
        id: number;
        user2: {
            login: string;
            username: string;
            avatar: string;
        };
    }[]>;
    block_user(req: any, infos: dto_block): Promise<void>;
    instant_messaging(req: any, to: dm_room): Promise<{
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
