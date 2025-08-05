import app from '@adonisjs/core/services/app';
import game_service from '#core/game/game_service';

app.ready(() => {
	game_service.boot();
	console.log('🎮 Game Service ready');
});
