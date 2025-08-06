import type { GameState } from "../../hooks/useGameSocket"

export default function GameLobby({
  gameState,
  playerId,
}: {
  gameState: GameState
  playerId: string
}) {
  if (!gameState) return null

  const enoughPlayers = gameState.players.length >= 2

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-6">
      <h2 className="text-2xl mb-6 font-bold">Game Lobby</h2>

      <ul className="w-full space-y-3 mb-6">
        {gameState.players.map((p) => (
          <li
            key={p.id}
            className="flex items-center gap-3 px-4 py-2 bg-gray-800 rounded-lg shadow-md"
          >
            {/* Rond de couleur */}
            <div
              className="w-3 h-3 rounded-full border border-white"
              style={{ backgroundColor: p.color }}
            ></div>

            {/* Avatar */}
            <img
              src={p.avatar || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${p.id}`}
              alt={p.name || p.id}
              className="w-8 h-8 rounded-full border border-gray-600"
            />

            <span>{p.name || p.id.slice(0, 6)}</span>

            {p.id === playerId && (
              <span className="ml-auto text-green-400 font-semibold">(You)</span>
            )}
          </li>
        ))}
      </ul>

      {!enoughPlayers ? (
        <p className="text-yellow-400 animate-pulse font-medium">
          Waiting for players… ({gameState.players.length}/2)
        </p>
      ) : (
        <p className="text-gray-300">
          Game starts in {gameState.timeLeft}s
        </p>
      )}
    </div>
  )
}
