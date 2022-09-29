import { runInThisContext } from "vm";

export type	Player = {
	id		: string,
	x		: number;
	y		: number;
	w		: number;
	h		: number;
	score	: number;
	scorpos	: number;
	// cmds?	: Cmds;
	room	:string;
}

export type Cmds = {
	room 		:string;
	key_up		: boolean;
	key_down	: boolean;
}

export type	Ball = {
	x		: number;
	y		: number;
	r		: number;
	speed	: number;
	velX	: number;
	velY	: number;
}

export class Game {
	// count	: number = 0;
	// id		: string = '';
	P1		: Player = {id: '', x: 0, y: 0, w: 0, h: 0, score: 0, scorpos: 1, room: ''};
	P2		: Player = {id: '', x: 0, y: 0, w: 0, h: 0, score: 0, scorpos: 3, room: ''};
	ball	: Ball   = {x: 0, y: 0, r: 0, speed: 0, velX: 0, velY: 0};
	started	: boolean = false;
	pause	: boolean = false;
	interupted : boolean = false;
}
