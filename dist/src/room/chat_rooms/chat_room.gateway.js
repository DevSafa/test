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
exports.AppGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../../prisma/prisma.service");
const create_room_dto_1 = require("../dto/create-room.dto");
const chat_room_service_1 = require("./chat_room.service");
const validationWs_1 = require("../validationWs");
let AppGateway = class AppGateway {
    constructor(prisma, chatroomservice) {
        this.prisma = prisma;
        this.chatroomservice = chatroomservice;
        this.myMap = new Map();
        this.banned = [];
        this.logger = new common_1.Logger('AppGateway');
    }
    async Join_room(client, infos) {
        client.leave(client.data.current_room);
        client.data.current_room = infos.room;
        const user = client.data.from;
        const room = client.data.current_room;
        let error = 0;
        const check = this.myMap.get(client.id);
        try {
            if (typeof check !== "undefined" && (check.user_id != user))
                error = 1;
            else {
                if (await this.chatroomservice.getOwner(user, room))
                    this.myMap.set(client.id, { "user_id": user, "room_id": room, "user_role": "owner" });
                else
                    this.myMap.set(client.id, { "user_id": user, "room_id": room, "user_role": "user" });
                if (!await this.chatroomservice.add_user_to_room({ from: user, to: room }))
                    error = 1;
                if (!error) {
                    client.join(room);
                    console.log("user : ", user, " joined room : ", room, "!!!!");
                    client.emit("roomsOfUser", { "status": true, "action": "", "message": `Join ${room}`, "user": `${user}` });
                }
            }
        }
        catch (exception) {
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `${user} can't join `, "user": `${user}` });
        }
        if (error) {
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `${user} can't join `, "user": `${user}` });
        }
        console.log("---------------------JOIN-----------------------");
        console.log(this.myMap);
        console.log("-------------------------------------------------");
    }
    async leaveRoom(client) {
        const user = client.data.from;
        const room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room) {
                if (await this.chatroomservice.leaveRoom(check.user_role, room, user)) {
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === user) {
                            this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "leave", "message": `you have  left ${room}`, "user": `${user}` });
                            if (value.room_id === room)
                                this.server.sockets.sockets.get(key).leave(room);
                        }
                    }
                    if (check.user_role === "owner") {
                        const ret = await this.chatroomservice.getNewOwner(room);
                        if (ret) {
                            for (let [key, value] of this.myMap) {
                                if (value.user_id === ret.owner) {
                                    if (value.room_id === room)
                                        this.myMap.set(client.id, { "user_id": user, "room_id": room, "user_role": "owner" });
                                    this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "setAdmin", "message": `you are the new owner of ${room}`, "user": `${user}` });
                                }
                            }
                        }
                    }
                }
                else
                    error = 1;
            }
            else
                error = 1;
        }
        catch (exception) {
            client.emit("roomsOfUser", { "status": false, "action": "leave", "message": `failed to leave ${room}`, "user": user });
        }
        if (error)
            client.emit("roomsOfUser", { "status": false, "action": "leave", "message": `failed to leave ${room}`, "user": user });
    }
    async setAdmin(client, infos) {
        const user = client.data.from;
        const room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && check.user_role === "owner") {
                if (await this.chatroomservice.setAdmin(infos, room)) {
                    client.emit("roomsOfUser", { "status": true, "action": "setAdmin", "message": `${infos.new_admin} is a new admin in   ${room}`, "user": user });
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === infos.new_admin)
                            this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "setAdmin", "message": `you are admin of ${room}`, "user": `${user}` });
                    }
                }
                else
                    error = 1;
            }
            else
                error = 1;
        }
        catch (exception) {
            client.emit("roomsOfUser", { "status": false, "action": "setAdmin", "message": `can't set ${infos.new_admin} admin`, "user": user });
        }
        if (error)
            client.emit("roomsOfUser", { "status": false, "action": "setAdmin", "message": `can't set ${infos.new_admin} admin`, "user": user });
    }
    async disablePassword(client) {
        const user = client.data.from;
        const room = client.data.current_room;
        let check = this.myMap.get(client.id);
        let error = 0;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.user_role === "owner") {
                if (!await this.chatroomservice.disablePassword(user, room)) {
                    error = 1;
                }
                else {
                    client.emit("roomsOfUser", { "status": true, "action": "setAdmin", "message": `password is disabled successfully for ${room}`, "user": user });
                    for (let [key, value] of this.myMap) {
                        this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "setAdmin", "message": `password of ${room} is disabled`, "user": `${user}` });
                    }
                }
            }
            else
                error = 1;
        }
        catch (exception) {
            client.emit("roomsOfUser", { status: false, "action": "", "message": "", "user": `${user}` });
        }
        if (error)
            client.emit("roomsOfUser", { status: false, "action": "", "message": "", "user": `${user}` });
    }
    async changePassword(client, infos) {
        const user = client.data.from;
        const room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && check.user_role === "owner") {
                const ret = await this.chatroomservice.changePassword(room, infos);
                if (ret)
                    client.emit("roomsOfUser", { "status": true, "action": "setAdmin", "message": `password of ${room} has been changed successfully`, "user": `${user}` });
                else
                    error = 1;
            }
            else
                error = 1;
        }
        catch (exception) {
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `failed to change password of  ${room}`, "user": `${user}` });
        }
        if (error)
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `failed to change password of  ${room}`, "user": `${user}` });
    }
    async mute_user(client, infos) {
        const user = client.data.from;
        const room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        let time = 0;
        if (infos.type === "hour")
            time = infos.time * 60 * 60 * 1000;
        else if (infos.type === "minute")
            time = infos.time * 60 * 1000;
        else if (infos.type === "jour")
            time = infos.time * 24 * 60 * 60 * 1000;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin")) {
                if (await this.chatroomservice.ban_mute_user_in_room(room, infos.who, "muted", check.user_role)) {
                    client.emit("roomsOfUser", { "status": true, "action": "", "message": `${infos.who}  muted successfully`, "user": `${user}` });
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === infos.who)
                            this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "", "message": `you are muted at   ${room}`, "user": `${user}` });
                    }
                    setTimeout(async () => {
                        if (!await this.chatroomservice.update_ban_mute_user_in_room(room, infos.who))
                            error = 1;
                        else {
                            for (let [key, value] of this.myMap) {
                                if (value.user_id === infos.who)
                                    this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "", "message": `you are unmuted at  ${room}`, "user": `${user}` });
                            }
                        }
                    }, time);
                }
                else
                    error = 1;
            }
            else
                error = 1;
        }
        catch (exception) {
            error = 1;
        }
        if (error)
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `failed to mute ${infos.who}`, "user": user });
    }
    async ban_user(client, infos) {
        const user = client.data.from;
        const room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        let time = 0;
        if (infos.type === "hour")
            time = infos.time * 60 * 60 * 1000;
        else if (infos.type === "minute")
            time = infos.time * 60 * 1000;
        else if (infos.type === "day")
            time = infos.time * 24 * 60 * 60 * 1000;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin")) {
                if (await this.chatroomservice.ban_mute_user_in_room(room, infos.who, "banned", check.user_role)) {
                    client.emit("roomsOfUser", { "status": true, "action": "", "message": `${infos.who}  banned successfully`, "user": `${user}` });
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === infos.who) {
                            this.server.sockets.sockets.get(key).leave(room);
                        }
                    }
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === infos.who)
                            this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "", "message": `you are banned at   ${room}`, "user": `${user}` });
                    }
                    setTimeout(async () => {
                        if (!await this.chatroomservice.update_ban_mute_user_in_room(room, infos.who))
                            error = 1;
                        for (let [key, value] of this.myMap) {
                            if (value.user_id === infos.who) {
                                this.server.sockets.sockets.get(key).join(room);
                            }
                        }
                        for (let [key, value] of this.myMap) {
                            if (value.user_id === infos.who)
                                this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "", "message": `you are unbanned at  ${room}`, "user": `${user}` });
                        }
                    }, time);
                }
                else
                    error = 1;
            }
            else
                error = 1;
        }
        catch (_a) {
            error = 1;
        }
        if (error)
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `failed to ban ${infos.who}`, "user": user });
    }
    async kick_user(client, infos) {
        const user = client.data.from;
        const room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room && (check.user_role === "owner" || check.user_role === "admin")) {
                if (await this.chatroomservice.ban_mute_user_in_room(room, infos.who, "kicked", check.current_role)) {
                    client.emit("roomsOfUser", { "status": true, "action": "leave", "message": `${infos.who}  kicked successfully`, "user": user });
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === infos.who && value.room_id === room) {
                            this.server.sockets.sockets.get(key).leave(room);
                        }
                    }
                    for (let [key, value] of this.myMap) {
                        if (value.user_id === infos.who)
                            this.server.sockets.sockets.get(key).emit("roomsOfUser", { "status": true, "action": "", "message": `you are kickedd from  ${room}`, "user": `${user}` });
                    }
                }
                else
                    error = 1;
            }
            else
                error = 1;
        }
        catch (_a) {
            error = 1;
        }
        if (error)
            client.emit("roomsOfUser", { "status": false, "action": "", "message": `failed to kick ${infos.who}`, "user": user });
    }
    async Send_message(client, msg) {
        const user = client.data.from;
        const room = client.data.current_room;
        const check = this.myMap.get(client.id);
        let error = 0;
        try {
            if (typeof check !== "undefined" && check.user_id === user && check.room_id === room) {
                if (await this.chatroomservice.add_msg_room(user, room, msg)) {
                    this.server.to(room).emit("msgToClient", { "from": user, "msg": msg.msg, "avatar": msg.avatar });
                }
            }
        }
        catch (exception) {
        }
    }
    async close(client) {
        this.handleDisconnect(client);
    }
    async handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
        this.myMap.delete(client.id);
    }
    async handleConnection(client) {
        this.logger.log(`Client connected : ${client.id}`);
        client.data.from = client.handshake.auth.from;
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], AppGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('JoinRoom'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_join_room]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "Join_room", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('leaveRoom'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "leaveRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('setAdmin'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_admin]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "setAdmin", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('disablePassword'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "disablePassword", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('changePassword'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.dto_changePass]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "changePassword", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('mute'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_ban_mute]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "mute_user", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('ban'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_ban_mute]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "ban_user", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('kick'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_kick]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "kick_user", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('SendMessageRoom'),
    (0, common_1.UsePipes)(validationWs_1.WSValidationPipe),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_msg]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "Send_message", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("close"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], AppGateway.prototype, "close", null);
AppGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, chat_room_service_1.ChatRoomService])
], AppGateway);
exports.AppGateway = AppGateway;
//# sourceMappingURL=chat_room.gateway.js.map