import {Ball, Player} from '../entities/game.entity';

export class CreateGameDto {
    ball    : Ball;
    P1?     : Player;
    P2?     : Player;
}
