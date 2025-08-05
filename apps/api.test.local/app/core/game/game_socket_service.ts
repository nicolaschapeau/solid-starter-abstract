import { Server as IOServer, type Socket } from 'socket.io';
import GameManagerService from './game_manager_service.js';
import { type Game } from './game_service.js';
import type { Server as HttpServer } from 'node:http';

interface LobbyState {
	id: string;
	players: number;
	maxPlayers: number;
	countdown: number;
	started: boolean;
}

export default class GameSocketService {
	private static instance: GameSocketService;
	private io!: IOServer;
	private manager = GameManagerService.getInstance();
	private lobbies: Map<string, { game: Game; countdown: number; interval?: NodeJS.Timeout }> = new Map();

	private constructor() {}

	static getInstance(): GameSocketService {
		if (!this.instance) this.instance = new GameSocketService();
		return this.instance;
	}

	init(httpServer: HttpServer) {
		this.io = new IOServer(httpServer, {
			cors: {
				origin: process.env.FRONTEND_URL || 'http://localhost:5173',
				credentials: true,
			},
		});

		this.io.on('connection', (socket: Socket) => {
			console.log('🟢 Client connected:', socket.id);

			socket.on('quickmatch', () => this.handleQuickmatch(socket));
			socket.on('move', ({ dx, dy }: { dx: number; dy: number }) => {
				const game = this.findGameByPlayer(socket.id);
				game?.handleInput(socket.id, { dx, dy });
			});

			socket.on('disconnect', () => this.handleDisconnect(socket));
		});
	}

	/** Quickmatch: join or create lobby */
	private handleQuickmatch(socket: Socket) {
		// Cherche un lobby en attente
		let lobby = [...this.lobbies.values()].find((l) => !l.game.started && Object.keys(l.game.players).length < 8);

		if (!lobby) {
			const game = this.manager.createGame();
			game.startLoop((state) => this.io.emit('game_state', state));
			lobby = { game, countdown: 30 };
			this.lobbies.set(game.id, lobby);
		}

		lobby.game.addPlayer(socket.id);
		socket.join(lobby.game.id);

		this.broadcastLobby(lobby);

		// Lance countdown si assez de joueurs
		if (Object.keys(lobby.game.players).length >= 2 && !lobby.interval) {
			lobby.interval = setInterval(() => this.tickLobby(lobby!), 1000);
		}
	}

	/** Gère la boucle du lobby */
	private tickLobby(lobby: { game: Game; countdown: number; interval?: NodeJS.Timeout }) {
		const playerCount = Object.keys(lobby.game.players).length;

		// Reset countdown si moins de 2 joueurs
		if (playerCount < 2) {
			lobby.countdown = 30;
			this.broadcastLobby(lobby);
			return;
		}

		lobby.countdown--;
		this.broadcastLobby(lobby);

		if (lobby.countdown <= 0) {
			this.startGame(lobby);
		}
	}

	private startGame(lobby: { game: Game; countdown: number; interval?: NodeJS.Timeout }) {
		clearInterval(lobby.interval);
		lobby.interval = undefined;
		lobby.game.started = true;
		this.io.to(lobby.game.id).emit('game_started', { id: lobby.game.id });
		this.broadcastLobby(lobby);
	}

	/** Diffuse l'état du lobby */
	private broadcastLobby(lobby: { game: Game; countdown: number }) {
		const state: LobbyState = {
			id: lobby.game.id,
			players: Object.keys(lobby.game.players).length,
			maxPlayers: 8,
			countdown: lobby.countdown,
			started: lobby.game.started,
		};
		this.io.to(lobby.game.id).emit('lobby_state', state);
	}

	private handleDisconnect(socket: Socket) {
		const lobby = this.findLobbyByPlayer(socket.id);
		if (!lobby) return;

		lobby.game.removePlayer(socket.id);
		this.broadcastLobby(lobby);

		// Si game vide, on la supprime
		if (Object.keys(lobby.game.players).length === 0) {
			clearInterval(lobby.interval);
			this.lobbies.delete(lobby.game.id);
			this.manager.removeGame(lobby.game.id);
		}
	}

	private findLobbyByPlayer(playerId: string) {
		return [...this.lobbies.values()].find((l) => l.game.players[playerId]);
	}

	private findGameByPlayer(playerId: string) {
		return this.findLobbyByPlayer(playerId)?.game;
	}
}
