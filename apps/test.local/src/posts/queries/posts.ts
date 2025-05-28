import { useQuery } from '@tanstack/solid-query';
import { tuyau } from '../../libs/tuyau.js';
import { postsFactory } from './query_key_factory.js';

export function usePosts() {
	return useQuery(() => {
		return {
			queryKey: postsFactory.list(),
			queryFn: () => tuyau.posts.$get().unwrap(),
			staleTime: Infinity,
		};
	});
}

export function usePost(id: number) {
	return useQuery(() => ({
		queryKey: postsFactory.one(id),
		queryFn: () => tuyau.posts({ id }).$get().unwrap(),
		staleTime: Infinity,
	}));
}
