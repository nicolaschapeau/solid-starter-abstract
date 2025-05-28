import { createSignal } from 'solid-js';

const THEME_KEY = 'theme'; // "light" | "dark" | "system"

type ThemeOption = 'light' | 'dark' | 'system';

const [theme, setTheme] = createSignal<ThemeOption>('system');

function applyTheme(value: ThemeOption) {
	const html = document.documentElement;

	let actualTheme = value;
	if (value === 'system') {
		const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		actualTheme = isDark ? 'dark' : 'light';
	}

	html.setAttribute('data-theme', actualTheme);
}

function initTheme() {
	const saved = localStorage.getItem(THEME_KEY) as ThemeOption | null;
	const initial = saved ?? 'system';
	setTheme(initial);
	applyTheme(initial);
}

function changeTheme(value: ThemeOption) {
	setTheme(value);
	localStorage.setItem(THEME_KEY, value);
	applyTheme(value);
}

export { theme, initTheme, changeTheme };
