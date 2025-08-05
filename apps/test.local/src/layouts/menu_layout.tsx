import { usePrivy } from '@privy-io/react-auth';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { HomeIcon, TrophyIcon } from '@heroicons/react/24/outline';
import type { ReactNode, MouseEventHandler } from 'react';

export default function MenuLayout() {
	const { login, authenticated, ready, user } = usePrivy();
	const navigate = useNavigate();
	const location = useLocation();

	// Skeleton loading
	if (!ready) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background text-text-primary">
				<div className="animate-pulse flex flex-col items-center gap-4">
					<div className="w-32 h-32 bg-surface rounded-full"></div>
					<div className="w-48 h-6 bg-surface rounded-md"></div>
				</div>
			</div>
		);
	}

	// Not logged in
	if (!authenticated) {
		return (
			<div className="min-h-screen flex flex-col items-center justify-center bg-background text-text-primary">
				<div className="w-32 h-32 bg-surface rounded-full shadow-neon animate-pulse flex items-center justify-center mb-8">
					<span className="text-primary font-bold text-lg">Glow</span>
				</div>
				<h1 className="text-3xl font-bold text-primary drop-shadow-neon mb-6">GlowRider</h1>
				<button
					className="px-8 py-3 bg-primary text-black rounded-lg text-lg font-semibold shadow-neon hover:shadow-neon-hover transition-all cursor-pointer"
					onClick={() => login()}
				>
					Login / Register
				</button>
			</div>
		);
	}

	// Routes
	const navItems = [
		{ label: 'Home', path: '/', icon: <HomeIcon className="w-6 h-6" /> },
		{ label: 'Leaderboard', path: '/leaderboard', icon: <TrophyIcon className="w-6 h-6" /> },
	];

	return (
		<div className="min-h-screen flex bg-background text-text-primary">
			{/* Sidebar Desktop */}
			<aside
				className="hidden md:flex flex-col fixed left-0 top-0 h-screen
          bg-surface/80 backdrop-blur-md shadow-lg
          w-[250px] px-3 py-4"
			>
				{/* Logo */}
				<div className="flex flex-col items-center mb-8 mt-4">
					<div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center shadow-neon">
						<span className="text-primary font-bold">G</span>
					</div>
				</div>

				{/* Nav items */}
				<nav className="flex flex-col gap-2 mt-6">
					{navItems.map((item) => (
						<SidebarButton
							key={item.path}
							label={item.label}
							active={location.pathname === item.path}
							onClick={() => navigate(item.path)}
						>
							{item.icon}
						</SidebarButton>
					))}
				</nav>

				{/* Profile at bottom */}
				<div className="mt-auto pt-3 border-t border-white/10 flex flex-col items-center gap-3">
					<button
						onClick={() => navigate('/profile')}
						className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-all cursor-pointer ${
							location.pathname === '/profile'
								? 'bg-primary text-black shadow-neon'
								: 'hover:bg-primary/10 text-text-primary'
						}`}
					>
						<img
							src={user?.twitter?.profilePictureUrl?.split('_normal').join('') || '/avatar-dummy.png'}
							alt="Avatar"
							className="w-8 h-8 rounded-full"
						/>
						<span className="font-medium truncate">Profile</span>
					</button>
				</div>
			</aside>

			{/* Mobile Bottom Navbar */}
			<nav
				className="md:hidden fixed bottom-0 left-0 right-0
        bg-surface/80 backdrop-blur-md shadow-lg flex justify-around w-full py-2"
			>
				{navItems.map((item) => (
					<NavButtonMobile
						key={item.path}
						label={item.label}
						active={location.pathname === item.path}
						onClick={() => navigate(item.path)}
					>
						{item.icon}
					</NavButtonMobile>
				))}
				<NavButtonMobile label="Profile" active={location.pathname === '/profile'} onClick={() => navigate('/profile')}>
					<img
						src={user?.twitter?.profilePictureUrl?.split('_normal').join('') || '/avatar-dummy.png'}
						alt="Avatar"
						className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
					/>
				</NavButtonMobile>
			</nav>

			{/* Main Content */}
			<main className="flex-1 ml-0 mb-[66px] sm:mb-[80px] md:mb-0 md:ml-[250px] flex items-start justify-center">
				<div className="bg-surface/40 p-8 backdrop-blur-sm shadow-inner w-full h-full">
					<Outlet />
				</div>
			</main>
		</div>
	);
}

/* Sidebar Button Props */
interface SidebarButtonProps {
	label: string;
	active: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
}

function SidebarButton({ label, active, onClick, children }: SidebarButtonProps) {
	return (
		<button
			onClick={onClick}
			className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all cursor-pointer w-full
        ${active ? 'bg-primary text-black shadow-neon' : 'hover:bg-primary/10 text-text-primary'}
      `}
		>
			{children}
			<span className="text-base font-semibold">{label}</span>
		</button>
	);
}

/* Mobile Nav Button Props */
interface NavButtonMobileProps {
	label: string;
	active: boolean;
	onClick: MouseEventHandler<HTMLButtonElement>;
	children: ReactNode;
}

function NavButtonMobile({ label, active, onClick, children }: NavButtonMobileProps) {
	return (
		<button
			onClick={onClick}
			className={`flex flex-col items-center gap-0.5 sm:gap-1 px-3 py-1 rounded-lg transition-all cursor-pointer ${
				active ? 'text-primary' : 'text-text-primary hover:text-primary/80'
			}`}
		>
			{children}
			<span className="text-xs sm:text-sm">{label}</span>
		</button>
	);
}

export { SidebarButton, NavButtonMobile };
