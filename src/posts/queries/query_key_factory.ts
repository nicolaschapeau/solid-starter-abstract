import {Ref} from "solid-js";

export const postsFactory = {
    root: ['posts'] as const,
    list: () => [...postsFactory.root, 'list'] as const,
    one: (id: Ref<number>) => [...postsFactory.root, id] as const,
}