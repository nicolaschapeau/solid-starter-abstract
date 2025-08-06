import { useEffect, useRef } from 'react'
import type { GameState } from '../../hooks/useGameSocket'

export default function GameCanvas({ gameState }: { gameState: GameState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    Object.values(gameState.players).forEach((player) => {
      ctx.fillStyle = player.color
      ctx.beginPath()
      ctx.arc(player.x, player.y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
  }, [gameState])

  return (
    <div className="flex justify-center items-center h-full w-full">
      <canvas ref={canvasRef} width={800} height={800} className="bg-black" />
    </div>
  )
}
