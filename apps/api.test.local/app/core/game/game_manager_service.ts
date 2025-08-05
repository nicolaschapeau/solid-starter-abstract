import GameService from './game_service.js';

class GameManagerService {
	games: Map<string, GameService> = new Map();
	private static instance: GameManagerService;

	private constructor() {
		const game = new GameService('test-game');
		this.games.set(game.id, game);
	}

	static getInstance() {
		if (!this.instance) this.instance = new GameManagerService();
		return this.instance;
	}

	getGame(id = 'test-game'): GameService | undefined {
		return this.games.get(id);
	}
}

export default GameManagerService;
