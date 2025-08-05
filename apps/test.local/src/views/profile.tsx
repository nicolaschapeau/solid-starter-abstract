// src/views/profile.tsx
import { usePrivy } from '@privy-io/react-auth';

export default function ProfilePage() {
	const { user, logout, linkTwitter, unlinkTwitter } = usePrivy();

	return (
		<div className="flex flex-col items-center gap-6 w-full">
			<h1 className="text-3xl font-bold text-primary">Profile & Settings</h1>

			{/* Avatar + Twitter */}
			<div className="flex flex-col items-center gap-3">
				<img
					src={user?.twitter?.profilePictureUrl?.replace('_normal', '') || '/avatar-dummy.png'}
					alt="User Avatar"
					className="w-20 h-20 rounded-full shadow-[0_0_10px_#00ff88]"
				/>

				{user?.twitter?.username && <p className="text-lg font-semibold">@{user.twitter.username}</p>}

				{user?.twitter?.subject ? (
					<button
						className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
						onClick={() => unlinkTwitter(user?.twitter?.subject as string)}
					>
						Unlink Twitter
					</button>
				) : (
					<button
						className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer"
						onClick={() => linkTwitter()}
					>
						Link Twitter
					</button>
				)}
			</div>

			{/* Logout button */}
			<div className="mt-6">
				<button
					className="py-3 px-8 bg-red-500 text-white rounded-lg font-bold shadow-[0_0_10px_#ff4444] hover:bg-red-600 transition-all cursor-pointer"
					onClick={() => logout()}
				>
					Logout
				</button>
			</div>
		</div>
	);
}
