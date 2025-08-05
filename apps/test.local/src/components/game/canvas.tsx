// src/views/game/GameCanvas.tsx
import React, { useEffect, useRef } from 'react'

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
}

export default function GameCanvas({ gameState }: { gameState: GameState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    Object.values(gameState.players).forEach((player) => {
      ctx.fillStyle = 'lime'
      ctx.fillRect(player.x, player.y, 20, 20)
    })
  }, [gameState])

  return <canvas ref={canvasRef} width={800} height={800} className="border border-primary" />
}
