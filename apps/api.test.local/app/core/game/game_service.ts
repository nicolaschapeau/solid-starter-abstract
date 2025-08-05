import { randomUUID } from 'node:crypto';

export interface PlayerState {
	id: string;
	x: number;
	y: number;
	vx: number;
	vy: number;
	color: string;
}

export interface GameState {
	id: string;
	players: Record<string, PlayerState>;
	started: boolean;
}

export class Game {
	readonly id: string;
	players: Record<string, PlayerState> = {};
	started = false;

	private interval: NodeJS.Timeout | null = null;
	private readonly tickRate = 60; // 60 FPS

	constructor() {
		this.id = randomUUID();
	}

	/** Ajoute un joueur avec une position sur un cercle */
	addPlayer(id: string): void {
		const color = this.getRandomColor();
		this.players[id] = { id, x: 0, y: 0, vx: 0, vy: 0, color };
		this.repositionPlayers();
	}

	/** Supprime un joueur */
	removePlayer(id: string): void {
		this.players = Object.fromEntries(Object.entries(this.players).filter(([key]) => key !== id));
		this.repositionPlayers();
	}

	/** Met à jour la vélocité du joueur */
	handleInput(id: string, input: { dx: number; dy: number }): void {
		const player = this.players[id];
		if (!player) return;
		player.vx = input.dx;
		player.vy = input.dy;
	}

	/** Update positions */
	private update(): void {
		for (const player of Object.values(this.players)) {
			player.x += player.vx;
			player.y += player.vy;
		}
	}

	/** Start loop */
	startLoop(callback: (state: GameState) => void): void {
		if (this.interval) return;
		this.interval = setInterval(() => {
			this.update();
			callback({ id: this.id, players: this.players, started: this.started });
		}, 1000 / this.tickRate);
	}

	stopLoop(): void {
		if (this.interval) clearInterval(this.interval);
		this.interval = null;
	}

	/** Repositionne les joueurs sur un cercle autour du centre */
	private repositionPlayers(): void {
		const count = Object.keys(this.players).length;
		if (count === 0) return;

		const radius = 250;
		const centerX = 0;
		const centerY = 0;

		Object.values(this.players).forEach((player, index) => {
			const angle = (2 * Math.PI * index) / count;
			player.x = centerX + radius * Math.cos(angle);
			player.y = centerY + radius * Math.sin(angle);
		});
	}

	/** Couleurs aléatoires pour les joueurs */
	private getRandomColor(): string {
		const colors = ['#FF4444', '#44FF44', '#4444FF', '#FFFF44', '#FF44FF', '#44FFFF', '#FFA500', '#00CED1'];
		return colors[Math.floor(Math.random() * colors.length)];
	}
}
