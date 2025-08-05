import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"

/** Types du lobby et du jeu */
export interface PlayerState {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  color: string
}

export interface LobbyState {
  id: string
  players: Record<string, PlayerState>
  started: boolean
  countdown: number
}

export interface GameState {
  id: string
  started: boolean
  players: Record<string, PlayerState>
}

export function useGameSocket() {
  const [lobbyState, setLobbyState] = useState<LobbyState | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [joined, setJoined] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    const socket: Socket = io("http://localhost:3333", { withCredentials: true })
    socketRef.current = socket

    return () => {
      socket.disconnect()
    }
  }, [])

  const quickmatch = () => {
    const socket = socketRef.current
    if (!socket) return

    setJoined(true)
    socket.emit("quickmatch")

    // Event: lobby en attente
    socket.on("lobby_state", (state: LobbyState) => {
      setLobbyState(state)
    })

    // Event: état de la game pendant la partie
    socket.on("game_state", (state: GameState) => {
      setGameState(state)
    })

    // Event: transition du lobby vers la game
    socket.on("game_started", () => {
      setLobbyState(null)
    })
  }

  return { lobbyState: joined ? lobbyState : null, gameState, quickmatch }
}

export type { LobbyState as TLobbyState, GameState as TGameState }
