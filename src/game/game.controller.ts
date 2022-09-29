import { Controller, Get } from '@nestjs/common';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
    constructor(private readonly gameService: GameService) {}

    @Get('live_matchs')
    getHello(): Game {
      return this.gameService.getRooms();
    }
}
