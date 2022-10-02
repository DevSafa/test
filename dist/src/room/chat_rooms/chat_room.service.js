"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRoomService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const argon = require("argon2");
let ChatRoomService = class ChatRoomService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async add_user_to_room(infos) {
        let new_join = await this.prisma.users_room.findFirst({
            where: {
                user_id: infos.from,
                room_id: infos.to,
            }
        });
        if (new_join && (new_join.state_user === "banned" || new_join.state_user === "kicked"))
            return null;
        if (new_join === null) {
            new_join = await this.prisma.users_room.create({
                data: {
                    user_id: infos.from,
                    user_role: "user",
                    room_id: infos.to,
                    state_user: ""
                }
            });
        }
        return (new_join);
    }
    async add_msg_room(from, to, infos) {
        let message;
        const not_ban = await this.prisma.users_room.findFirst({
            where: {
                user_id: from,
                room_id: to,
                NOT: [
                    { state_user: "banned" },
                    { state_user: "muted" },
                    { state_user: "kicked" }
                ]
            }
        });
        if (not_ban) {
            message = await this.prisma.messageRoom.create({
                data: {
                    creationDate: new Date(),
                    from: from,
                    room_name: to,
                    content_msg: infos.msg,
                }
            });
        }
        return message;
    }
    async ban_mute_user_in_room(room, who, action, current_role) {
        console.log("who : ", who);
        console.log("room : ", room);
        console.log("action : ", action);
        console.log("current_role : ", current_role);
        let ret;
        if (current_role === "admin") {
            ret = await this.prisma.users_room.findFirst({
                where: {
                    user_id: who,
                    room_id: room,
                    NOT: [
                        { state_user: action },
                        { user_role: "admin" },
                        { user_role: "owner" }
                    ]
                },
            });
        }
        else if (current_role === "owner") {
            console.log("hereeee\n");
            ret = await this.prisma.users_room.findFirst({
                where: {
                    user_id: who,
                    room_id: room,
                    NOT: [
                        { state_user: action },
                    ]
                },
            });
        }
        if (ret) {
            return await this.prisma.users_room.update({
                where: {
                    user_id_room_id: {
                        user_id: who,
                        room_id: room,
                    }
                },
                data: {
                    state_user: action,
                },
            });
        }
        return ret;
    }
    async update_ban_mute_user_in_room(room, who) {
        return await this.prisma.users_room.update({
            where: {
                user_id_room_id: {
                    user_id: who,
                    room_id: room
                }
            },
            data: {
                state_user: ""
            }
        });
    }
    async setAdmin(infos, room) {
        return await this.prisma.users_room.update({
            where: {
                user_id_room_id: {
                    user_id: infos.new_admin,
                    room_id: room,
                },
            },
            data: {
                user_role: "admin"
            }
        });
    }
    async getOwner(user, room) {
        const find = await this.prisma.users_room.findFirst({
            where: {
                room_id: room,
                user_id: user,
                user_role: "owner",
            }
        });
        return find;
    }
    async leaveRoom(role, room, user) {
        if (role === "owner") {
            return this.leaveOwner(room, user);
        }
        else
            return this.leave(room, user);
    }
    async getNewOwner(room) {
        return await this.prisma.room.findFirst({
            where: {
                name: room
            },
            select: {
                owner: true
            }
        });
    }
    async leaveOwner(room, user) {
        const find = await this.prisma.users_room.findFirst({
            orderBy: { user_role: "asc" },
            where: {
                room_id: room,
                OR: [{ user_role: "admin" }, { user_role: "user" }]
            }
        });
        if (!find) {
            return await this.prisma.room.delete({
                where: {
                    name: room,
                },
            });
        }
        else {
            await this.prisma.users_room.delete({
                where: {
                    user_id_room_id: {
                        user_id: user,
                        room_id: room
                    },
                }
            });
            return await this.prisma.users_room.update({
                where: {
                    user_id_room_id: {
                        user_id: find.user_id,
                        room_id: find.room_id
                    }
                },
                data: {
                    user_role: "owner",
                    room: {
                        update: {
                            owner: find.user_id
                        }
                    }
                },
                include: { room: true },
            });
        }
    }
    async leave(room, user) {
        return await this.prisma.users_room.delete({
            where: {
                user_id_room_id: {
                    user_id: user,
                    room_id: room
                },
            }
        });
    }
    async disablePassword(user, room) {
        const data = await this.prisma.room.findFirst({
            where: {
                name: room,
                type: "protected",
            }
        });
        if (data)
            return await this.prisma.room.update({
                where: {
                    name: room,
                },
                data: {
                    type: "public",
                    password: ""
                }
            });
        return data;
    }
    async changePassword(room, infos) {
        const data = await this.prisma.room.findFirst({
            where: {
                name: room,
                type: "protected",
            }
        });
        if (data) {
            const new_password = await argon.hash(infos.new_password);
            return await this.prisma.room.update({
                where: {
                    name: room,
                },
                data: {
                    password: new_password
                }
            });
        }
        return data;
    }
};
ChatRoomService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChatRoomService);
exports.ChatRoomService = ChatRoomService;
//# sourceMappingURL=chat_room.service.js.map