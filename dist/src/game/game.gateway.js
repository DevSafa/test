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
exports.GameGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const game_service_1 = require("./game.service");
const socket_io_1 = require("socket.io");
const schedule_1 = require("@nestjs/schedule");
const prisma_service_1 = require("../prisma/prisma.service");
let GameGateway = class GameGateway {
    constructor(gameService, prisma) {
        this.gameService = gameService;
        this.prisma = prisma;
        this.players = {};
        this.online_players = 0;
    }
    getID() {
        return Date.now().toString();
    }
    handleConnection(client) {
        console.log(`new client with id : ${client.id} connected!`);
        this.players[client.id] = {};
        this.online_players = Object.keys(this.players).length;
        console.log(Object.keys(this.players).length);
        if (this.online_players % 2 === 1) {
            this.id = this.getID();
            client.join(this.id);
            this.gameService.create(this.id);
            this.gameService.addP(this.id, { id: client.id, x: 6, y: 200, w: 13, h: 100, score: 0, scorpos: 1, room: this.id }, 0);
            this.players[client.id] = { id: client.id, x: 6, y: 200, w: 13, h: 100, score: 0, scorpos: 1, room: this.id };
        }
        if (this.online_players % 2 === 0) {
            client.join(this.id);
            this.gameService.addP(this.id, { id: client.id, x: 981, y: 200, w: 13, h: 100, score: 0, scorpos: 3, room: this.id }, 1);
            this.players[client.id] = { id: client.id, x: 981, y: 200, w: 13, h: 100, score: 0, scorpos: 3, room: this.id };
            this.gameService.getRoom(this.id).ball = { x: 500, y: 250, r: 10, speed: 7, velX: 7, velY: 7 };
            this.server.to(this.id).emit('start_game');
            this.gameService.getRoom(this.id).pause = true;
            this.gameService.getRoom(this.id).interupted = false;
            setTimeout(_ => {
                if (!this.gameService.getRoom(this.id).interupted) {
                    this.gameService.getRoom(this.id).pause = false;
                    this.gameService.getRoom(this.id).started = true;
                }
                else
                    this.gameOver(this.id);
            }, 3000);
        }
        this.server.to(this.id).emit('update_connections', this.gameService.getRoom(this.id).P1, this.gameService.getRoom(this.id).P2, this.gameService.getRoom(this.id).ball);
    }
    handleDisconnect(client) {
        console.log(`client with id : ${client.id} has disconnected.`);
    }
    update_playerPos(client, id) {
        if (id.key_up === true && this.gameService.getRoom(id.room).P1.id == client.id && this.gameService.getRoom(id.room).P1.y > 0)
            this.gameService.getRoom(id.room).P1.y -= 5;
        if (id.key_down === true && this.gameService.getRoom(id.room).P1.id === client.id && this.gameService.getRoom(id.room).P1.y < 400)
            this.gameService.getRoom(id.room).P1.y += 5;
        if (id.key_up === true && this.gameService.getRoom(id.room).P2.id === client.id && this.gameService.getRoom(id.room).P2.y > 0)
            this.gameService.getRoom(id.room).P2.y -= 5;
        if (id.key_down === true && this.gameService.getRoom(id.room).P2.id === client.id && this.gameService.getRoom(id.room).P2.y < 400)
            this.gameService.getRoom(id.room).P2.y += 5;
    }
    update_size(client, screen_width) {
        let width, cof;
        cof = screen_width / 1000;
        width = 1000 * cof;
        client.emit('update', width, cof);
    }
    collision(ball, p) {
        let p_top = p.y;
        let p_bottom = p.y + p.h;
        let p_left = p.x;
        let p_right = p.x + p.w;
        let ball_top = ball.y - ball.r;
        let ball_bottom = ball.y + ball.r;
        let ball_left = ball.x - ball.r;
        let ball_right = ball.x + ball.r;
        return (ball_right > p_left && ball_top < p_bottom && ball_left < p_right && ball_bottom > p_top);
    }
    resetBall(index) {
        this.gameService.getRoom(index).ball.speed = 7;
        this.gameService.getRoom(index).ball.velX *= -1;
        this.gameService.getRoom(index).ball.x = 500;
        this.gameService.getRoom(index).ball.y = 250;
    }
    update(id) {
        this.gameService.getRoom(id).ball.x += this.gameService.getRoom(id).ball.velX;
        this.gameService.getRoom(id).ball.y += this.gameService.getRoom(id).ball.velY;
        if (this.gameService.getRoom(id).ball.y + this.gameService.getRoom(id).ball.r > 500 || this.gameService.getRoom(id).ball.y - this.gameService.getRoom(id).ball.r < 0)
            this.gameService.getRoom(id).ball.velY *= -1;
        let player = (this.gameService.getRoom(id).ball.x < 500) ? this.gameService.getRoom(id).P1 : this.gameService.getRoom(id).P2;
        if (this.collision(this.gameService.getRoom(id).ball, player)) {
            let point = (this.gameService.getRoom(id).ball.y - (player.y + (player.h / 2))) / (player.h / 2);
            let angle = point * (Math.PI / 4);
            let direction = (this.gameService.getRoom(id).ball.x < 500) ? 1 : -1;
            this.gameService.getRoom(id).ball.velX = direction * this.gameService.getRoom(id).ball.speed * Math.cos(angle);
            this.gameService.getRoom(id).ball.velY = this.gameService.getRoom(id).ball.speed * Math.sin(angle);
            if (this.gameService.getRoom(id).ball.speed < 13)
                this.gameService.getRoom(id).ball.speed += this.gameService.getRoom(id).ball.speed * 0.05;
        }
        if (this.gameService.getRoom(id).ball.x + this.gameService.getRoom(id).ball.r > 1000) {
            this.gameService.getRoom(id).P1.score++;
            this.resetBall(id);
        }
        if (this.gameService.getRoom(id).ball.x - this.gameService.getRoom(id).ball.r < 0) {
            this.gameService.getRoom(id).P2.score++;
            this.resetBall(id);
        }
        if (this.gameService.getRoom(id).P1.score == 5 || this.gameService.getRoom(id).P2.score == 5)
            this.gameOver(id);
    }
    async create_match_h() {
        await this.prisma.match_history.create({
            data: {
                mod: "classic",
                match_begin: new Date(),
                match_end: new Date(),
                winner_id: "ssghuri",
                loser_id: "ssghuri",
                score_loser: 2,
                score_winner: 5,
            }
        });
    }
    gameOver(index) {
        this.gameService.getRoom(index).started = false;
        this.gameService.getRoom(index).pause = true;
        this.resetBall(index);
        this.server.to(index).emit('update_connections', this.gameService.getRoom(index).P1, this.gameService.getRoom(index).P2, this.gameService.getRoom(index).ball);
        this.server.to(index).emit('game_over');
        this.create_match_h();
        delete this.players[this.gameService.getRoom(index).P1.id];
        delete this.players[this.gameService.getRoom(index).P2.id];
        this.gameService.remove(index);
        console.log('game over');
    }
    handleInterval() {
        for (let id in this.gameService.getRooms()) {
            if (!this.gameService.getRoom(id).pause)
                this.server.to(id).emit('update_connections', this.gameService.getRoom(id).P1, this.gameService.getRoom(id).P2, this.gameService.getRoom(id).ball);
            if (this.gameService.getRoom(id).started)
                this.update(id);
        }
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], GameGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('usr_cmd'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "update_playerPos", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('size_change'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Number]),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "update_size", null);
__decorate([
    (0, schedule_1.Interval)(1000 / 60),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], GameGateway.prototype, "handleInterval", null);
GameGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
        }
    }),
    __metadata("design:paramtypes", [game_service_1.GameService, prisma_service_1.PrismaService])
], GameGateway);
exports.GameGateway = GameGateway;
//# sourceMappingURL=game.gateway.js.map