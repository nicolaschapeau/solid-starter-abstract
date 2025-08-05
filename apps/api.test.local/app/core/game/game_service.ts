import { randomUUID } from 'node:crypto';

interface Player {
	id: string;
	x: number;
	y: number;
}

export default class GameService {
	id: string;
	players: Map<string, Player> = new Map();
	private interval: NodeJS.Timeout | null = null;

	constructor(id?: string) {
		this.id = id || randomUUID();
	}

	/** Ajoute un joueur à la game */
	addPlayer(id: string) {
		this.players.set(id, { id, x: 0, y: 0 });
	}

	/** Supprime un joueur */
	removePlayer(id: string) {
		this.players.delete(id);
	}

	/** Update position */
	movePlayer(id: string, dx: number, dy: number) {
		const p = this.players.get(id);
		if (!p) return;
		p.x += dx;
		p.y += dy;
	}

	/** Boucle de jeu */
	startLoop(onTick: (state: Player[]) => void) {
		this.interval = setInterval(() => {
			onTick(Array.from(this.players.values()));
		}, 1000 / 30);
	}

	stopLoop() {
		if (this.interval) clearInterval(this.interval);
	}
}
