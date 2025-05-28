import { TuyauHTTPError } from '@tuyau/client';
import { createEffect, createSignal } from 'solid-js';
import { z } from 'zod';
import DefaultLayout from '../../layouts/default.js';
import { useLogin } from '../queries/users.js';

const LoginSchema = z.object({
	email: z.string().nonempty('Please enter your email.').email('Please enter a valid email.'),
	password: z.string().nonempty('Please enter your password.').min(8, 'You password must have 8 characters or more.'),
});

export function Login() {
	const [email, setEmail] = createSignal('');
	const [password, setPassword] = createSignal('');
	const [errors, setErrors] = createSignal<{ email?: string; password?: string; api?: string }>({});

	const { isPending, status, data, mutate: login } = useLogin();

	createEffect(() => console.log({ isPending, status, data }));

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		const result = LoginSchema.safeParse({ email: email(), password: password() });

		if (!result.success) {
			const formatted: { email?: string; password?: string } = {};
			for (const issue of result.error.issues) {
				formatted[issue.path[0] as 'email' | 'password'] = issue.message;
			}
			setErrors(formatted);
		} else {
			setErrors({});
			login(result.data, {
				onSuccess: (response) => {
					console.log(response);
				},
				onError: (error) => {
					if (error instanceof TuyauHTTPError) {
						if (error.status === 400) {
							setErrors({ api: 'Invalid credentials.' });
						} else {
							setErrors({ api: 'An error occurred.' });
						}
					}
				},
			});
		}
	};
	return (
		<DefaultLayout>
			<form onSubmit={handleSubmit} class={`flex flex-col gap-4 w-full max-w-sm mx-auto`}>
				<h1>Login</h1>
				<div>
					<label class="input validator w-full">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
								<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
								<circle cx="12" cy="7" r="4"></circle>
							</g>
						</svg>
						<input
							name="email"
							type="email"
							required
							placeholder="Email"
							value={email()}
							onInput={(e) => setEmail(e.target.value)}
						/>
					</label>
					<p class="validator-hint hidden">
						Must be 3 to 30 characters
						<br />
						containing only letters, numbers or dash
					</p>
					{errors().email && <p class="text-red-500 text-sm">{errors().email}</p>}
				</div>

				<div>
					<label class="input validator w-full">
						<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
								<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
								<circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
							</g>
						</svg>
						<input
							name="password"
							type="password"
							required
							placeholder="Password"
							value={password()}
							onInput={(e) => setPassword(e.target.value)}
						/>
					</label>
					<p class="validator-hint hidden">
						Must be more than 8 characters, including
						<br />
						At least one number <br />
						At least one lowercase letter <br />
						At least one uppercase letter
					</p>
					{errors().password && <p class="text-red-500 text-sm">{errors().password}</p>}
				</div>

				{errors().api && <p class="text-red-500 text-sm mb-2">{errors().api}</p>}

				<input type="submit" value="Submit" class="btn" disabled={isPending} />
			</form>
		</DefaultLayout>
	);
}
