import { Game } from './game_instance.js';
import type { Server } from 'socket.io';

export default class GameManagerService {
	private static instance: GameManagerService;
	private games: Map<string, Game> = new Map();
	private lobbyGame: Game | null = null;
	private io: Server | null = null;

	static getInstance(): GameManagerService {
		if (!GameManagerService.instance) {
			GameManagerService.instance = new GameManagerService();
		}
		return GameManagerService.instance;
	}

	attachIO(io: Server) {
		this.io = io;
	}

	/** Crée un lobby */
	private createLobby(): Game {
		const game = new Game();
		this.games.set(game.id, game);
		this.lobbyGame = game;
		console.log(`🟢 New lobby created: ${game.id}`);
		return game;
	}

	getLobby(): Game {
		if (!this.lobbyGame) {
			this.createLobby();
		}
		return this.lobbyGame!;
	}

	/** Rejoint Quickmatch */
	joinQuickmatch(socketId: string) {
		const lobby = this.getLobby();
		lobby.addPlayer(socketId);
		this.broadcastLobby(lobby);

		// Si 2 joueurs → countdown
		if (!lobby.started && Object.keys(lobby.players).length >= 2 && !lobby.startTimeout) {
			lobby.startCountdown(30_000, () => {
				this.startGame(lobby);
			});
		}

		// Si 8 joueurs → start instant
		if (Object.keys(lobby.players).length >= 8 && !lobby.started) {
			this.startGame(lobby);
		}
	}

	/** Lance une partie */
	startGame(game: Game) {
		game.startGame();
		this.io?.to(game.id).emit('game_started', game.getState());

		// Démarrage du loop et broadcast state
		game.startLoop((state) => {
			this.io?.to(game.id).emit('game_state', state);
		});

		// Crée un nouveau lobby pour la suite
		if (this.lobbyGame?.id === game.id) {
			this.lobbyGame = null;
			this.createLobby();
		}
	}

	/** Retourne toutes les games existantes */
	listGames(): Game[] {
		return Array.from(this.games.values());
	}

	/** Supprime une game existante */
	removeGame(id: string): boolean {
		return this.games.delete(id);
	}

	broadcastLobby(game: Game) {
		this.io?.to(game.id).emit('lobby_update', game.getState());
	}
}
