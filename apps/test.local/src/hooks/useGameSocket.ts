import { useEffect, useState, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { usePrivy, type User, type WalletWithMetadata } from "@privy-io/react-auth"

export interface Player {
  id: string
  x: number
  y: number
  color: string
  active: boolean
  name?: string
  avatar?: string
}

export interface GameState {
  id: string
  started: boolean
  ended: boolean
  players: Player[]
  timeLeft: number
}

interface ExtendedWallet extends WalletWithMetadata {
  embeddedWallets?: { address: string }[]
}

function getPersistentGuestId(): string {
  const key = "guest_player_id"
  let id = localStorage.getItem(key)
  if (!id) {
    id = `guest-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(key, id)
  }
  return id
}

function getWalletAddress(user: User | null): string | null {
  if (!user?.linkedAccounts) return null
  const account = (user.linkedAccounts as ExtendedWallet[]).find(
    (acc) => acc.embeddedWallets?.length
  )
  return account?.embeddedWallets?.[0]?.address ?? null
}

export function useGameSocket() {
  const { user } = usePrivy()
  const socketRef = useRef<Socket | null>(null)

  const [gameState, setGameState] = useState<GameState | null>(null)
  const [joined, setJoined] = useState(false)

  const playerId = getWalletAddress(user) ?? getPersistentGuestId()
  const playerName = user?.twitter?.username ?? playerId.slice(0, 6)
  const playerAvatar =
    user?.twitter?.profilePictureUrl ??
    `https://api.dicebear.com/7.x/pixel-art/svg?seed=${playerId}`

  useEffect(() => {
    const socket = io("http://localhost:3333", {
      auth: { playerId }, // 🔹 pour la reconnexion serveur
    })
    socketRef.current = socket

    // --- Reco auto si la game existe encore ---
    const handleState = (state: GameState) => {
      if (state.ended) {
        // Si la game est déjà terminée → on reste sur Quick Match
        setJoined(false)
        setGameState(null)
        return
      }
      setGameState(state)
      setJoined(true)
    }

    socket.on("lobby_state", handleState)
    socket.on("game_state", handleState)

    socket.on("game_ended", () => {
      setJoined(false)
      setGameState(null)
    })

    socket.on("disconnect", () => {
      setJoined(false)
      setGameState(null)
    })

    return () => {
      socket.disconnect()
    }
  }, [playerId])

  // --- QuickMatch ---
  const quickmatch = () => {
    if (!socketRef.current) return
    setJoined(true)
    socketRef.current.emit("quickmatch", {
      playerId,
      name: playerName,
      avatar: playerAvatar,
    })
  }

  return {
    gameState,
    joined,
    quickmatch,
    playerId,
  }
}
