import { type Server } from 'socket.io';

export interface Player {
	id: string;
	x: number;
	y: number;
	color: string;
	active: boolean;
	name?: string;
	avatar?: string;
}

export interface GameState {
	id: string;
	started: boolean;
	ended: boolean;
	players: Player[];
	timeLeft: number;
}

export default class GameService {
	id: string;
	started = false;
	ended = false;
	players: Record<string, Player> = {};
	countdown = 30;
	private interval?: NodeJS.Timeout;

	constructor(
		public io: Server,
		id: string
	) {
		this.id = id;
	}

	/** Add or reactivate a player */
	addPlayer(playerId: string, name?: string, avatar?: string) {
		if (this.players[playerId]) {
			// Reactivation if player already exists
			this.players[playerId].active = true;
			this.broadcastState();
			return;
		}

		const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#00FF80'];

		const idx = Object.keys(this.players).length;
		const angle = (2 * Math.PI * idx) / 8;
		const radius = 250;

		this.players[playerId] = {
			id: playerId,
			x: 400 + radius * Math.cos(angle),
			y: 300 + radius * Math.sin(angle),
			color: colors[idx % colors.length],
			active: true,
			name,
			avatar,
		};

		this.broadcastState();
	}

	/** Handle player disconnection */
	disconnectPlayer(playerId: string) {
		if (!this.players[playerId]) return;

		if (!this.started) {
			// Remove from lobby if game not started
			this.players = Object.fromEntries(Object.entries(this.players).filter(([id]) => id !== playerId));
		} else {
			// Mark inactive if game started
			this.players[playerId].active = false;
		}
		this.broadcastState();
	}

	getState(): GameState {
		return {
			id: this.id,
			started: this.started,
			ended: this.ended,
			players: Object.values(this.players),
			timeLeft: this.countdown,
		};
	}

	tryStartCountdown() {
		if (this.started || this.activePlayersCount() < 2) return;
		if (!this.interval) {
			this.interval = setInterval(() => this.tickCountdown(), 1000);
		}
	}

	private tickCountdown() {
		if (this.activePlayersCount() < 2) {
			this.countdown = 30;
			this.broadcastState();
			return;
		}

		this.countdown--;
		this.broadcastState();

		if (this.countdown <= 0) {
			clearInterval(this.interval!);
			this.startGame();
		}
	}

	private startGame() {
		this.started = true;
		this.countdown = 60;
		this.interval = setInterval(() => this.tickGame(), 1000);
		this.broadcastState();
	}

	private tickGame() {
		this.countdown--;
		this.broadcastState();

		if (this.countdown <= 0) {
			this.endGame();
		}
	}

	private endGame() {
		this.ended = true;
		clearInterval(this.interval!);
		this.io.to(this.id).emit('game_ended');
	}

	broadcastState() {
		const state = this.getState();
		if (!this.started) this.io.to(this.id).emit('lobby_state', state);
		else this.io.to(this.id).emit('game_state', state);
	}

	activePlayersCount() {
		return Object.values(this.players).filter((p) => p.active).length;
	}

	/** Handle player reconnection */
	reconnectPlayer(playerId: string) {
		if (!this.players[playerId]) return;

		this.players[playerId].active = true;

		this.broadcastState();
	}
}
