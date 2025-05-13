import {useQuery} from "@tanstack/solid-query";
import {postsFactory} from "./query_key_factory.js";
import {Ref} from "solid-js";

export function usePosts() {
    return useQuery(() => {
        return {
            queryKey: postsFactory.list(),
            queryFn: () =>
                fetch('https://jsonplaceholder.typicode.com/posts').then(
                    (res) => res.json() as Promise<{ userId: number, id: number, title: string, body: string }[]>
                )
        }
    })
}

export function usePost(id: Ref<number>) {
    return useQuery(() => {
        return {
            queryKey: postsFactory.one(id),
            queryFn: () =>
                fetch(`https://jsonplaceholder.typicode.com/posts/${id}`).then(
                    (res) => res.json() as Promise<{ userId: number, id: number, title: string, body: string }>
                )
        }
    })
}