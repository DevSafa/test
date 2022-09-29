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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomController = void 0;
const common_1 = require("@nestjs/common");
const create_room_dto_1 = require("./dto/create-room.dto");
const get_rooms_interceptor_1 = require("./interceptors/get_rooms.interceptor");
const data_room_interceptor_1 = require("./interceptors/data_room.interceptor");
const room_service_1 = require("./room.service");
const get_users_room_interceptor_1 = require("./interceptors/get_users_room.interceptor");
const intra_jwt_guard_1 = require("../auth/guards/intra_jwt.guard");
const http_exception_filter_1 = require("../auth/filters/http-exception.filter");
const friends_user_interceptor_1 = require("./interceptors/friends_user.interceptor");
const instant_msg_interceptor_1 = require("./interceptors/instant_msg.interceptor");
const msg_interceptor_1 = require("./interceptors/msg.interceptor");
let RoomController = class RoomController {
    constructor(roomService) {
        this.roomService = roomService;
    }
    async post_room(req, createroomdto) {
        return await this.roomService.create_post_room(createroomdto, req.user);
    }
    async get_rooms(req) {
        return await this.roomService.get_rooms(req.user);
    }
    async get_public_room(req) {
        console.log("req.user : ", req.user);
        return await this.roomService.get_public_room(req.user);
    }
    async get_protected_room(req) {
        return await this.roomService.get_protected_room(req.user);
    }
    async post_name_room(req, room_id) {
        return await this.roomService.get_room_msgs(room_id, req.user);
    }
    async post_name_room_dm(req, name) {
        return await this.roomService.post_name_dm(name, req.user);
    }
    async getAllUsersOfRoom(req, infos) {
        return await this.roomService.getAllUsersOfRoom(infos, req.user);
    }
    get_friends(req) {
        return this.roomService.get_friends(req.user);
    }
    block_user(req, infos) {
        return this.roomService.block_user(infos, req.user);
    }
    instant_messaging(req, to) {
        return this.roomService.instant_messaging(req.user, to);
    }
};
__decorate([
    (0, common_1.Post)('/postroom'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.createRoomDto]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "post_room", null);
__decorate([
    (0, common_1.UseInterceptors)(get_rooms_interceptor_1.GetRoomsInterceptor),
    (0, common_1.Get)('/All_rooms_of_user'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "get_rooms", null);
__decorate([
    (0, common_1.UseInterceptors)(data_room_interceptor_1.DataRoomInterceptor),
    (0, common_1.Get)('/public_room'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "get_public_room", null);
__decorate([
    (0, common_1.UseInterceptors)(data_room_interceptor_1.DataRoomInterceptor),
    (0, common_1.Get)('/protected_room'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "get_protected_room", null);
__decorate([
    (0, common_1.Post)('/get_room_msgs'),
    (0, common_1.UseInterceptors)(msg_interceptor_1.msgInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.room_name]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "post_name_room", null);
__decorate([
    (0, common_1.Post)('/post_name_room_dm'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.dm_room]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "post_name_room_dm", null);
__decorate([
    (0, common_1.Post)('/usersRoom'),
    (0, common_1.UseInterceptors)(get_users_room_interceptor_1.TransformInterceptor),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.room_name]),
    __metadata("design:returntype", Promise)
], RoomController.prototype, "getAllUsersOfRoom", null);
__decorate([
    (0, common_1.UseInterceptors)(friends_user_interceptor_1.FriendsUser),
    (0, common_1.Get)('/get_friends'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "get_friends", null);
__decorate([
    (0, common_1.Post)('/block_user'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.dto_block]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "block_user", null);
__decorate([
    (0, common_1.UseInterceptors)(instant_msg_interceptor_1.InstantMsg),
    (0, common_1.Get)('/instant_messaging'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_room_dto_1.dm_room]),
    __metadata("design:returntype", void 0)
], RoomController.prototype, "instant_messaging", null);
RoomController = __decorate([
    (0, common_1.UseGuards)(intra_jwt_guard_1.IntraJwtGuard),
    (0, common_1.UseFilters)(http_exception_filter_1.HttpExceptionFilter),
    (0, common_1.Controller)('room'),
    __metadata("design:paramtypes", [room_service_1.RoomService])
], RoomController);
exports.RoomController = RoomController;
//# sourceMappingURL=room.controller.js.map