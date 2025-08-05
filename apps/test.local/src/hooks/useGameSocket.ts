// src/hooks/useGameSocket.ts
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

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

export function useGameSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [lobbyState, setLobbyState] = useState<GameState | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)

  useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL || 'http://localhost:3333', {
      transports: ['websocket'],
    })
    setSocket(s)

    s.on('lobby_update', (state: GameState) => setLobbyState(state))
    s.on('game_started', (state: GameState) => setGameState(state))
    s.on('game_state', (state: GameState) => setGameState(state))

    return () => {
      s.disconnect()
    }
  }, [])

  const quickmatch = () => socket?.emit('quickmatch')

  const sendMove = (dx: number, dy: number) => socket?.emit('move', { dx, dy })

  return { socket, lobbyState, gameState, quickmatch, sendMove }
}
