import { type Server } from 'socket.io';
import GameService from './game_service.ts';

export default class GameManagerService {
	io: Server;
	games: Map<string, GameService> = new Map();

	constructor(io: Server) {
		this.io = io;
	}

	/** Retourne la game en cours ou en crée une nouvelle */
	quickmatch(playerId: string, name?: string, avatar?: string) {
		let game: GameService | undefined;

		// On prend la première game non terminée
		for (const g of this.games.values()) {
			if (!g.ended) {
				game = g;
				break;
			}
		}

		if (!game) {
			game = new GameService(this.io, `game-${Date.now()}`);
			this.games.set(game.id, game);
		}

		game.addPlayer(playerId, name, avatar);
		return game;
	}
}
