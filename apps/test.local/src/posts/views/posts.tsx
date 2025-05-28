import { A } from '@solidjs/router';
import { For, Match, Switch } from 'solid-js';
import DefaultLayout from '../../layouts/default.js';
import { usePosts } from '../queries/posts.js';

export function Posts() {
	const posts = usePosts();

	return (
		<DefaultLayout>
			<Switch>
				<Match when={posts.isLoading}>
					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
						<For each={Array(6).fill(0)}>
							{() => (
								<div class="card card-border bg-base-100 card-xs shadow-xl">
									<div class="card-body p-6">
										<h2 class="card-title skeleton h-4 w-3/4 mb-2"></h2>
										<p class="skeleton h-20 w-full my-4"></p>
										<div class="justify-end card-actions mt-2">
											<div class="skeleton h-10 w-16"></div>
										</div>
									</div>
								</div>
							)}
						</For>
					</div>
				</Match>
				<Match when={posts.isError}>Error: {posts.error?.message}</Match>
				<Match when={posts.isSuccess}>
					<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
						<For each={posts.data}>
							{(item) => (
								<div class="card card-border bg-base-100 card-xs shadow-xl hover:shadow-2xl transition-shadow duration-300">
									<div class="card-body p-6">
										<h2 class="card-title">{item.title}</h2>
										<p class="my-4">{item.body}</p>
										<div class="justify-end card-actions mt-2">
											<A class="btn btn-primary" href={`/${item.id}`}>
												See
											</A>
										</div>
									</div>
								</div>
							)}
						</For>
					</div>
				</Match>
			</Switch>
		</DefaultLayout>
	);
}
