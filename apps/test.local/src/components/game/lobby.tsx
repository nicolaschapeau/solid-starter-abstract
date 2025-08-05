// src/views/game/LobbyView.tsx
import React from 'react'

interface PlayerState {
  id: string
  x: number
  y: number
  vx: number
  vy: number
}

interface GameState {
  id: string
  players: Record<string, PlayerState>
  started: boolean
  countdown?: number
}

export default function GameLobby({ lobbyState }: { lobbyState: GameState }) {
  const playersCount = Object.keys(lobbyState.players).length
  const countdown = lobbyState.countdown
    ? Math.ceil(lobbyState.countdown / 1000)
    : null

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h2 className="text-2xl font-bold text-primary">Lobby #{lobbyState.id.slice(0, 4)}</h2>
      <p className="text-lg">Players: {playersCount} / 8</p>
      {countdown !== null && (
        <p className="text-xl text-yellow-400 font-mono">
          Starting in {countdown}s…
        </p>
      )}
    </div>
  )
}
