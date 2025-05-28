import { A } from '@solidjs/router';
import { children } from 'solid-js';
import logo from '../assets/logo.svg';
import ThemeToggle from '../themes/ThemeToggle.js';
import type { JSXElement } from 'solid-js';

const DefaultLayout = (props: { children: JSXElement }) => {
	const resolved = children(() => props.children);

	return (
		<div class="px-6 py-12 bg-base-200 min-h-screen flex flex-col">
			<div class={`flex justify-between items-center`}>
				<div class="avatar">
					<div class="w-12">
						<A href="/">
							<img src={logo} alt="logo" />
						</A>
					</div>
				</div>
				<div class={`flex items-center gap-4`}>
					<A class={`btn`} href={`/login`}>
						Login
					</A>
					<ThemeToggle />
				</div>
			</div>
			{resolved()}
		</div>
	);
};

export default DefaultLayout;
