import {For, Match, Switch} from "solid-js";
import {usePosts} from "../queries/posts.js";
import {A} from "@solidjs/router";
import DefaultLayout from "../../layouts/default.js";

export function Posts() {
    const posts = usePosts()

    return (
        <DefaultLayout>
            <Switch>
                <Match when={posts.isLoading}>Loading...</Match>
                <Match when={posts.isError}>Error: {posts.error?.message}</Match>
                <Match when={posts.isSuccess}>
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
                        <For each={posts.data}>
                            {(item, index) =>
                                <div
                                    class="card card-border bg-base-100 card-xs shadow-xl hover:shadow-2xl transition-shadow duration-300">
                                    <div class="card-body p-6">
                                        <h2 class="card-title">{item.title}</h2>
                                        <p class="my-4">{item.body}</p>
                                        <div class="justify-end card-actions mt-2">
                                            <A class="btn btn-primary" href={`/${item.id}`}>See</A>
                                        </div>
                                    </div>
                                </div>
                            }
                        </For>
                    </div>
                </Match>
            </Switch>
        </DefaultLayout>
    )
}
