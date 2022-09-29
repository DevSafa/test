import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { GameService } from './game.service';
import { Server, Socket } from 'socket.io';
import { Ball, Player, Cmds } from './entities/game.entity';
import { PrismaService } from 'src/prisma/prisma.service';
export declare class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly gameService;
    private prisma;
    constructor(gameService: GameService, prisma: PrismaService);
    server: Server;
    players: {};
    id: string;
    online_players: number;
    getID(): string;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    update_playerPos(client: Socket, id: Cmds): void;
    update_size(client: Socket, screen_width: number): void;
    collision(ball: Ball, p: Player): boolean;
    resetBall(index: string): void;
    update(id: string): void;
    create_match_h(): Promise<void>;
    gameOver(index: string): void;
    handleInterval(): void;
}
