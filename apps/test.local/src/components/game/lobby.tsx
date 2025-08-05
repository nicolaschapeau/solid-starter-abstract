import type { FC } from 'react'
import type { LobbyState } from '../../hooks/useGameSocket'

const GameLobby: FC<{ lobbyState: LobbyState }> = ({ lobbyState }) => {
  const playerCount = Object.keys(lobbyState.players).length

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <h1 className="text-3xl font-bold text-primary">Lobby</h1>
      <p className="text-lg text-text-primary">
        Players in lobby: {playerCount} / 8
      </p>
      {lobbyState.countdown && (
        <p className="text-xl font-semibold text-primary">
          Starting in {lobbyState.countdown}s
        </p>
      )}
    </div>
  )
}

export default GameLobby
