import type { HttpContext } from '@adonisjs/core/http';

export default class GetAccountController {
	handle({ auth, response }: HttpContext) {
		const user = auth.getUserOrFail();

		return response.json(user);
	}
}
