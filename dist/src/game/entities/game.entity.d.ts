export declare type Player = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    score: number;
    scorpos: number;
    room: string;
};
export declare type Cmds = {
    room: string;
    key_up: boolean;
    key_down: boolean;
};
export declare type Ball = {
    x: number;
    y: number;
    r: number;
    speed: number;
    velX: number;
    velY: number;
};
export declare class Game {
    P1: Player;
    P2: Player;
    ball: Ball;
    started: boolean;
    pause: boolean;
    interupted: boolean;
}
