import { randomUUID } from 'node:crypto';

export interface PlayerState {
	id: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
}

export interface GameState {
	id: string;
	players: Record<string, PlayerState>;
	started: boolean;
	countdown?: number;
}

export class Game {
	readonly id: string;
	players: Record<string, PlayerState> = {};
	started = false;
	startTimeout: NodeJS.Timeout | null = null;
	countdownEnd: number | null = null;

	private interval: NodeJS.Timeout | null = null;
	private readonly tickRate = 60; // 60 FPS

	constructor() {
		this.id = randomUUID();
	}

	addPlayer(id: string): void {
		this.players[id] = { id, x: 0, y: 0, vx: 0, vy: 0 };
	}

	removePlayer(id: string): void {
		this.players = Object.fromEntries(Object.entries(this.players).filter(([key]) => key !== id));
	}

	handleInput(id: string, input: { dx: number; dy: number }): void {
		const player = this.players[id];
		if (!player) return;
		player.vx = input.dx;
		player.vy = input.dy;
	}

	private update(): void {
		for (const player of Object.values(this.players)) {
			player.x += player.vx;
			player.y += player.vy;
		}
	}

	startLoop(callback: (state: GameState) => void): void {
		if (this.interval) return;
		this.interval = setInterval(() => {
			this.update();
			callback(this.getState());
		}, 1000 / this.tickRate);
	}

	stopLoop(): void {
		if (this.interval) clearInterval(this.interval);
		this.interval = null;
	}

	startCountdown(ms: number, onComplete: () => void): void {
		if (this.startTimeout) return;
		this.countdownEnd = Date.now() + ms;
		this.startTimeout = setTimeout(onComplete, ms);
	}

	getCountdown(): number | null {
		return this.countdownEnd ? Math.max(0, this.countdownEnd - Date.now()) : null;
	}

	startGame(): void {
		this.started = true;
		this.countdownEnd = null;
		if (this.startTimeout) {
			clearTimeout(this.startTimeout);
			this.startTimeout = null;
		}
	}

	getState(): GameState {
		return {
			id: this.id,
			players: this.players,
			started: this.started,
			countdown: this.getCountdown() ?? undefined,
		};
	}
}
