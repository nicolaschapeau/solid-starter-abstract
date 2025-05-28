import { A, useParams } from '@solidjs/router';
import { Match, Switch } from 'solid-js';
import DefaultLayout from '../../layouts/default.js';
import { usePost } from '../queries/posts.js';

export function OnePost() {
	const params = useParams();
	const id = Number(params.id);

	const post = usePost(id);

	return (
		<DefaultLayout>
			<Switch>
				<Match when={post.isLoading}>
					<div class="card bg-base-100 shadow-xl p-8 max-w-4xl mx-auto my-8">
						<div class="card-body">
							<div class="skeleton h-10 w-3/4 mb-6"></div>
							<div class="skeleton h-40 w-full mb-8"></div>
							<div class="card-actions">
 							<div class="skeleton h-10 w-96"></div>
							</div>
						</div>
					</div>
				</Match>
				<Match when={post.isError}>Error: {post.error?.message}</Match>
				<Match when={post.isSuccess}>
					<div class="card bg-base-100 shadow-xl p-8 max-w-4xl mx-auto my-8">
						<div class="card-body">
							<h1 class="card-title text-3xl font-bold mb-6">{post.data?.title}</h1>
							<p class="text-lg mb-8 leading-relaxed">{post.data?.body}</p>
							<div class="card-actions">
								<A href={`/`} class="btn btn-primary">
									Back to posts
								</A>
							</div>
						</div>
					</div>
				</Match>
			</Switch>
		</DefaultLayout>
	);
}
