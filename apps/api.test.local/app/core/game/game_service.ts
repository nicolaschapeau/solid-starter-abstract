import { type Server } from 'socket.io';

export interface Player {
	id: string;
	x: number;
	y: number;
	angle: number;
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
	timestamp: number;
}

export default class GameService {
	id: string;
	started = false;
	ended = false;
	players: Record<string, Player> = {};
	countdown = 30;
	private tickInterval?: NodeJS.Timeout;
	private interval?: NodeJS.Timeout;

	// 🎨 Palette des couleurs dispo (8 joueurs max)
	private readonly colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#00FF80'];

	constructor(
		public io: Server,
		id: string
	) {
		this.id = id;
	}

	/** Ajoute ou réactive un joueur */
	addPlayer(playerId: string, name?: string, avatar?: string) {
		if (this.players[playerId]) {
			// Réactivation si le joueur existe déjà
			this.players[playerId].active = true;
			this.broadcastState();
			return;
		}

		// 🔹 Choix d'une couleur unique libre
		const usedColors = new Set(Object.values(this.players).map((p) => p.color));
		const color =
			this.colors.find((c) => !usedColors.has(c)) ?? this.colors[Math.floor(Math.random() * this.colors.length)];

		// Spawn provisoire dans le lobby (hors écran ou null)
		this.players[playerId] = {
			id: playerId,
			x: -100,
			y: -100,
			color,
			active: true,
			angle: 0,
			name,
			avatar,
		};

		this.broadcastState();
	}

	/** Déconnexion d'un joueur */
	disconnectPlayer(playerId: string) {
		if (!this.players[playerId]) return;

		if (!this.started) {
			// Supprimer le joueur du lobby si la partie n'a pas commencé
			this.players = Object.fromEntries(Object.entries(this.players).filter(([id]) => id !== playerId));
		} else {
			// Sinon, juste le marquer inactif
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
			timestamp: Date.now(),
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

	/** Démarrage de la partie */
	private startGame() {
		this.started = true;
		this.countdown = 15;

		// 🔹 Placement des joueurs uniquement à ce moment
		const playersArr = Object.values(this.players);
		const total = playersArr.length;
		const centerX = 400;
		const centerY = 400;
		const radius = 250;

		playersArr.forEach((player, idx) => {
			const angle = (2 * Math.PI * idx) / total;
			player.x = centerX + radius * Math.cos(angle);
			player.y = centerY + radius * Math.sin(angle);
			player.angle = angle;
		});

		this.tickInterval = setInterval(() => this.tickGame(), 33);
		this.broadcastState();
	}

	private tickGame() {
		if (this.ended) return;

		const speed = 2.5;
		for (const player of Object.values(this.players)) {
			if (!player.active) continue;
			const dx = Math.cos(player.angle) * speed;
			const dy = Math.sin(player.angle) * speed;
			player.x += dx;
			player.y += dy;
		}

		if (this.activePlayersCount() <= 1) {
			this.endGame();
			return;
		}

		this.broadcastState();
	}

	private endGame() {
		this.ended = true;
		clearInterval(this.interval!);
		clearInterval(this.tickInterval!);
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

	/** Reconnexion */
	reconnectPlayer(playerId: string) {
		if (!this.players[playerId]) return;

		// ✅ Si la partie est déjà terminée, on ne touche à rien
		if (this.ended) return;

		this.players[playerId].active = true;
		this.broadcastState();
	}
}
