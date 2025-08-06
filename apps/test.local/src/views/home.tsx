import GameCanvas from '../components/game/canvas'
import GameLobby from '../components/game/lobby'
import { useGameSocket } from '../hooks/useGameSocket'

export default function HomePage() {
  const { gameState, joined, quickmatch, playerId } = useGameSocket()

  return (
    <div className="flex flex-col items-center justify-center h-full text-white">
      {!joined || !gameState ? (
        <button
          onClick={quickmatch}
          className="px-6 py-3 bg-primary cursor-pointer text-black font-semibold rounded-lg transition shadow-neon hover:shadow-neon-hover"
        >
          Quick Match
        </button>
      ) : !gameState.started ? (
        <GameLobby gameState={gameState} playerId={playerId} />
      ) : (
        <GameCanvas gameState={gameState} />
      )}
    </div>
  )
}
