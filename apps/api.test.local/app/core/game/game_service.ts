import server from '@adonisjs/core/services/server';
import { Server, type Socket } from 'socket.io';
import GameManagerService from './game_manager_service.js';

class GameService {
	io: Server | null = null;
	private booted = false;
	private manager = GameManagerService.getInstance();

	boot(): void {
		if (this.booted) return;
		this.booted = true;

		const nodeServer = server.getNodeServer();
		if (!nodeServer) throw new Error('Node server not ready');

		this.io = new Server(nodeServer, {
			cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true },
		});

		this.manager.attachIO(this.io);
		this.setupSocketEvents();
	}

	private setupSocketEvents(): void {
		if (!this.io) return;

		this.io.on('connection', (socket: Socket) => {
			console.log('🟢 Client connected', socket.id);

			// Quickmatch join
			socket.on('quickmatch', () => {
				socket.join(this.manager.getLobby().id);
				this.manager.joinQuickmatch(socket.id);
			});

			// Player movement
			socket.on('move', ({ dx, dy }: { dx: number; dy: number }) => {
				const games = this.manager.listGames?.() ?? [];
				for (const game of games) {
					if (game.players[socket.id]) {
						game.handleInput(socket.id, { dx, dy });
					}
				}
			});

			socket.on('disconnect', () => {
				console.log('🔴 Client disconnected', socket.id);
			});
		});
	}
}

export default new GameService();
