import { useEffect, useRef } from 'react'
import type { GameState } from '../../hooks/useGameSocket'

export default function GameCanvas({ gameState }: { gameState: GameState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const gameStateRef = useRef<GameState>(gameState)
  const animationRef = useRef<number | null>(null)

  const playerIdRef = useRef<string>('') // à passer via prop si besoin
  const angleLocalRef = useRef<number>(0) // injecté depuis le hook plus tard

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx

    const speed = 2.2

    function drawFrame() {
      const ctx = ctxRef.current
      const state = gameStateRef.current
      if (!ctx || !state) return

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

      for (const player of state.players) {
        // 📍 Prendre l'angle local si c'est nous
        const isSelf = player.id === playerIdRef.current
        const angle = isSelf ? angleLocalRef.current : player.angle
        const dx = Math.cos(angle) * speed * 0.3
        const dy = Math.sin(angle) * speed * 0.3
        const x = player.x + dx
        const y = player.y + dy

        ctx.fillStyle = player.color
        ctx.globalAlpha = player.active ? 1 : 0.75
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()

        // 🔻 Indicateur direction
        const dirX = x + Math.cos(angle) * 10
        const dirY = y + Math.sin(angle) * 10
        ctx.beginPath()
        ctx.arc(dirX, dirY, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = 'white'
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationRef.current = requestAnimationFrame(drawFrame)
    }

    animationRef.current = requestAnimationFrame(drawFrame)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  return (
    <div className="flex justify-center items-center h-full w-full">
      <canvas ref={canvasRef} width={800} height={800} className="bg-black" />
    </div>
  )
}
