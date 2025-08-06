import { Server, type Socket } from 'socket.io';
import GameManagerService from './game_manager_service.ts';

export default class GameSocketService {
	private static instance: GameSocketService;
	private io!: Server;
	private manager!: GameManagerService;

	private constructor() {}

	static getInstance(): GameSocketService {
		if (!this.instance) this.instance = new GameSocketService();
		return this.instance;
	}

	init(server: any) {
		if (this.io) return; // évite double init
		this.io = new Server(server, { cors: { origin: '*' } });
		this.manager = new GameManagerService(this.io);
		this.setupSockets();
	}

	private setupSockets() {
		this.io.on('connection', (socket: Socket) => {
			console.log('Client connected', socket.id);

			// 🔹 Reconnexion automatique
			const pid = socket.handshake.auth?.playerId as string | undefined;
			if (pid) {
				for (const game of this.manager.games.values()) {
					if (game.players[pid]) {
						console.log(`Player ${pid} reconnected`);
						socket.data.playerId = pid;
						socket.join(game.id);
						game.reconnectPlayer(pid); // ✅
						break;
					}
				}
			}

			socket.on('quickmatch', ({ playerId, name, avatar }) => {
				const game = this.manager.quickmatch(playerId, name, avatar);

				socket.data.playerId = playerId;
				socket.join(game.id);

				// 🔹 Envoi direct de l'état du lobby même avec 1 joueur
				this.io.to(game.id).emit('lobby_state', game.getState());

				game.tryStartCountdown();
			});

			socket.on('disconnect', () => {
				const pid = socket.data.playerId;
				if (!pid) return;

				for (const game of this.manager.games.values()) {
					if (game.players[pid]) {
						game.disconnectPlayer(pid);
					}
				}
			});
		});
	}
}
