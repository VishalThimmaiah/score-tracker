'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface AnimatedGridProps {
  className?: string
  dotSize?: number
  spacing?: number
  opacity?: number
  color?: string
}

export default function AnimatedGrid({ 
  className = '',
  dotSize = 1,
  spacing = 40,
  opacity = 0.3,
  color = '#6366f1'
}: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationOffset = 0

    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    const drawGrid = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const cols = Math.ceil(canvas.width / spacing) + 1
      const rows = Math.ceil(canvas.height / spacing) + 1
      
      ctx.fillStyle = color
      
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacing + (animationOffset % spacing)
          const y = j * spacing + (animationOffset % spacing)
          
          // Create subtle wave effect
          const wave = Math.sin((x + y + animationOffset) * 0.01) * 0.5 + 0.5
          const currentOpacity = opacity * wave
          
          ctx.globalAlpha = currentOpacity
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    }

    const animate = () => {
      animationOffset += 0.5
      drawGrid()
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas)
    }
    
    animate()

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dotSize, spacing, opacity, color])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  )
}
