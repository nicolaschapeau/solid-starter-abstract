import { Route, Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { onMount } from 'solid-js';
import { initTheme } from './libs/theme.js';
import { OnePost } from './posts/views/one.js';
import { Posts } from './posts/views/posts.js';
import { Login } from './users/views/login.js';
import { Me } from './users/views/me.js';

const queryClient = new QueryClient();

export default function App() {
	onMount(() => initTheme());

	return (
		<QueryClientProvider client={queryClient}>
			<Router>
				<Route path="/" component={Posts} />
				<Route path="/:id" component={OnePost} />
				<Route path="/login" component={Login} />
				<Route path="/me" component={Me} />
			</Router>
		</QueryClientProvider>
	);
}
