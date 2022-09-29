import { Game } from './entities/game.entity';
import { GameService } from './game.service';
export declare class GameController {
    private readonly gameService;
    constructor(gameService: GameService);
    getHello(): Game;
}
