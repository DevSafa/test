"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const common_1 = require("@nestjs/common");
const game_entity_1 = require("./entities/game.entity");
let GameService = class GameService {
    constructor() {
        this.room = {};
    }
    create(id) {
        let r = new game_entity_1.Game();
        this.room[id] = r;
    }
    addP(id, pl, position) {
        if (position === 0)
            this.getRoom(id).P1 = pl;
        else
            this.getRoom(id).P2 = pl;
    }
    getSize() {
        return Object.keys(this.room).length;
    }
    getRoom(id) {
        return this.room[id] || undefined;
    }
    getRooms() {
        return this.room;
    }
    updatePlayerPos(id, player_id, up, down) {
        console.log(this.getRoom(id));
    }
    getRoomP1(id) {
        console.log(this.getRoom(id));
    }
    remove(id) {
        delete this.room[id];
    }
};
GameService = __decorate([
    (0, common_1.Injectable)()
], GameService);
exports.GameService = GameService;
//# sourceMappingURL=game.service.js.map