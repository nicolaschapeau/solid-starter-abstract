import GameLobby from "../components/game/lobby"
import GameCanvas from "../components/game/canvas"
import { useGameSocket } from "../hooks/useGameSocket"

export default function HomePage() {
  const { lobbyState, gameState, quickmatch } = useGameSocket()

  console.log("Lobby State:", lobbyState, gameState)

  if (!lobbyState && !gameState) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6">
        <h1 className="text-3xl font-bold text-primary">GlowRider</h1>
        <button
          onClick={quickmatch}
          className="px-8 py-3 bg-primary text-black rounded-lg text-lg font-semibold shadow-neon hover:shadow-neon-hover transition-all cursor-pointer"
        >
          Quickmatch
        </button>
      </div>
    )
  }

  // Affiche lobby tant que la partie n’est pas lancée
  if (lobbyState && !lobbyState.started) {
    return <GameLobby lobbyState={lobbyState} />
  }

  // Affiche le canvas une fois la game lancée
  if (gameState?.started) {
    return <GameCanvas gameState={gameState} />
  }

  return null
}
