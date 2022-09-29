export declare class createRoomDto {
    name: string;
    type: string;
    password: string;
}
export declare class room_name {
    room_id: string;
}
export declare class dm_room {
    to: string;
}
export declare class dto_msg {
    msg: string;
}
export declare class dto_user_room {
    from: string;
    to: string;
    msg: string;
}
export declare class dto_global {
    from: string;
    to: string;
}
export declare class dto_invite {
    user_to_invite: string;
}
export declare class dto_block {
    user_to_block: string;
    room_id: string;
}
export declare class dm_msg {
    msg: string;
}
export declare class dto_admin {
    new_admin: string;
}
export declare class dto_ban_mute {
    who: string;
    time: number;
    type: string;
}
export declare class dto_kick {
    who: string;
}
export declare class dto_join_room {
    room: string;
}
export declare class dto_changePass {
    new_password: string;
}
