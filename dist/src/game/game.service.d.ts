import { Game, Player } from './entities/game.entity';
export declare class GameService {
    private room;
    create(id: string): void;
    addP(id: string, pl: Player, position: number): void;
    getSize(): number;
    getRoom(id: string): Game;
    getRooms(): Game;
    updatePlayerPos(id: string, player_id: string, up: boolean, down: boolean): void;
    getRoomP1(id: string): void;
    remove(id: string): void;
}
