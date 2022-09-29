"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const room_module_1 = require("./room/room.module");
const prisma_module_1 = require("./prisma/prisma.module");
const chat_room_gateway_1 = require("./room/chat_rooms/chat_room.gateway");
const room_service_1 = require("./room/room.service");
const dm_gateway_1 = require("./room/dm/dm.gateway");
const chat_room_service_1 = require("./room/chat_rooms/chat_room.service");
const dm_service_1 = require("./room/dm/dm.service");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [room_module_1.RoomModule, prisma_module_1.PrismaModule, auth_module_1.AuthModule],
        providers: [chat_room_gateway_1.AppGateway, room_service_1.RoomService, dm_gateway_1.DmGateway, chat_room_service_1.ChatRoomService, dm_service_1.DmService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map