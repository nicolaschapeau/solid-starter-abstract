import { useMutation, useQuery } from '@tanstack/solid-query';
import { tuyau } from '../../libs/tuyau.js';
import { usersFactory } from './query_key_factory.js';

export function useLogin() {
	return useMutation(() => ({
		mutationFn: async (data: { email: string; password: string }) => await tuyau.users.login.$post(data).unwrap(),
	}));
}

export function useMe() {
	return useQuery(() => ({
		queryKey: usersFactory.me(),
		queryFn: async () => await tuyau.users.me.$get(),
	}));
}
