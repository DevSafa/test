"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
class Game {
    constructor() {
        this.P1 = { id: '', x: 0, y: 0, w: 0, h: 0, score: 0, scorpos: 1, room: '' };
        this.P2 = { id: '', x: 0, y: 0, w: 0, h: 0, score: 0, scorpos: 3, room: '' };
        this.ball = { x: 0, y: 0, r: 0, speed: 0, velX: 0, velY: 0 };
        this.started = false;
        this.pause = false;
        this.interupted = false;
    }
}
exports.Game = Game;
//# sourceMappingURL=game.entity.js.map