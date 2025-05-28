/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router';
import { middleware } from '#start/kernel';

const LoginController = () => import('#auth/controllers/login_controller');
const GetAccountController = () => import('#users/controllers/get_account_controller');

const GetPostController = () => import('#controllers/get_post_controller');
const ListPostsController = () => import('#controllers/list_posts_controller');

router.get('/posts', [ListPostsController]);
router.get('/posts/:id', [GetPostController]);

router.get('/users/me', [GetAccountController]).use(middleware.auth());
router.post('/users/login', [LoginController]).use(middleware.guest());
