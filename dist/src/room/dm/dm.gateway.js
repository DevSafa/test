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
exports.DmGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const prisma_service_1 = require("../../prisma/prisma.service");
const create_room_dto_1 = require("../dto/create-room.dto");
const dm_service_1 = require("./dm.service");
let DmGateway = class DmGateway {
    constructor(prisma, dm_service) {
        this.prisma = prisma;
        this.dm_service = dm_service;
        this.logger = new common_1.Logger('AppGateway_DM');
    }
    async check_room_name(client) {
        let from = client.handshake.auth.from;
        let to = client.handshake.auth.to;
        from = 'ssghuri';
        to = 'sbarka';
        console.log("hello\n");
        const join_name = await this.dm_service.check_create_room_dm(from, to);
        client.join(join_name);
        client.emit("instant_messaging", { "status": true, "message": "Join Succes" });
    }
    async send_msg(client, msg) {
        let from = client.handshake.auth.from;
        let to = client.handshake.auth.to;
        from = 'ssghuri';
        to = 'sbarka';
        const get_name = await this.dm_service.find_dm_room_name(from, to);
        await this.dm_service.create_msg(from, to, msg);
        this.server.to(get_name.name).emit('msgToClient_dm', { from: from, msg: msg.msg });
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    handleConnection(client) {
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DmGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_dm_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], DmGateway.prototype, "check_room_name", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('dm_message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, create_room_dto_1.dto_msg]),
    __metadata("design:returntype", Promise)
], DmGateway.prototype, "send_msg", null);
DmGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: ['http://localhost:3000'],
            credentials: true,
        }
    }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, dm_service_1.DmService])
], DmGateway);
exports.DmGateway = DmGateway;
//# sourceMappingURL=dm.gateway.js.map