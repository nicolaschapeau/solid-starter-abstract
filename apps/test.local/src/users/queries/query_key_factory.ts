export const usersFactory = {
	root: ['users'] as const,
	me: () => [...usersFactory.root, 'me'] as const,
};
