import router from '@adonisjs/core/services/router';
import server from '@adonisjs/core/services/server';

/**
 * Error handler
 */
server.errorHandler(() => import('#core/exceptions/handler'));

/**
 * Global server middleware
 */
server.use([
	() => import('#core/middleware/container_bindings_middleware'),
	() => import('#core/middleware/force_json_response_middleware'),
	() => import('@adonisjs/cors/cors_middleware'),
]);

/**
 * Router middleware
 */
router.use([
	() => import('@adonisjs/core/bodyparser_middleware'),
	() => import('@adonisjs/session/session_middleware'),
	() => import('@adonisjs/auth/initialize_auth_middleware'),
]);

/**
 * Named middleware
 */
export const middleware = router.named({
	guest: () => import('#core/middleware/guest_middleware'),
	auth: () => import('#core/middleware/auth_middleware'),
});
