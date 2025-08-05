import { Game } from './game_service.js';

export default class GameManagerService {
	private static instance: GameManagerService;
	private games: Map<string, Game> = new Map();

	private constructor() {
		// Crée une partie par défaut
		const defaultGame = new Game();
		this.games.set(defaultGame.id, defaultGame);
	}

	static getInstance(): GameManagerService {
		if (!GameManagerService.instance) {
			GameManagerService.instance = new GameManagerService();
		}
		return GameManagerService.instance;
	}

	/** Retourne une game par ID ou la première */
	getGame(id?: string): Game {
		if (id) {
			const game = this.games.get(id);
			if (!game) throw new Error(`Game ${id} not found`);
			return game;
		}
		const first = this.games.values().next().value as Game | undefined;
		if (!first) return this.createGame();
		return first;
	}

	/** Crée une nouvelle game */
	createGame(): Game {
		const game = new Game();
		this.games.set(game.id, game);
		return game;
	}

	/** Supprime une game */
	removeGame(id: string): boolean {
		return this.games.delete(id);
	}

	/** Liste toutes les games */
	listGames(): Game[] {
		return Array.from(this.games.values());
	}
}
