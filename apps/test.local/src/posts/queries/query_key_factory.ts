export const postsFactory = {
	root: ['posts'] as const,
	list: () => [...postsFactory.root, 'list'] as const,
	one: (id: number) => [...postsFactory.root, id] as const,
	test: () => [...postsFactory.root, 'test'] as const,
};
