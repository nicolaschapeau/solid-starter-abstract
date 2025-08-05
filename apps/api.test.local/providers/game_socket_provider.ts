import GameSocketService from '#core/game/game_socket_service';
import type { ApplicationService } from '@adonisjs/core/types';

export default class GameSocketProvider {
	constructor(protected app: ApplicationService) {}

	async ready() {
		const server = await import('@adonisjs/core/services/server');
		const nodeServer = server.default.getNodeServer();

		if (!nodeServer) throw new Error('Node server not ready for sockets');

		GameSocketService.getInstance().init(nodeServer);
		console.log('🎮 GameSocketService booted');
	}
}
