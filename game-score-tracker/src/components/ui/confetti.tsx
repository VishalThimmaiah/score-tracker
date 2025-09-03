'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'

interface ConfettiProps {
  active: boolean
  particleCount?: number
  duration?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

export default function Confetti({ active, particleCount = 100, duration = 3000 }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])
  const startTimeRef = useRef<number | undefined>(undefined)

  const colors = useMemo(() => [
    '#FFD700', // Gold
    '#FF6B6B', // Red
    '#4ECDC4', // Teal
    '#45B7D1', // Blue
    '#96CEB4', // Green
    '#FFEAA7', // Yellow
    '#DDA0DD', // Plum
    '#98D8C8', // Mint
  ], [])

  const createParticle = useCallback((): Particle => {
    return {
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    }
  }, [colors])

  const updateParticle = useCallback((particle: Particle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.vy += 0.1 // gravity
    particle.rotation += particle.rotationSpeed
  }, [])

  const drawParticle = useCallback((ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save()
    ctx.translate(particle.x, particle.y)
    ctx.rotate((particle.rotation * Math.PI) / 180)
    ctx.fillStyle = particle.color
    ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
    ctx.restore()
  }, [])

  const animate = useCallback((currentTime: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime
    }

    const elapsed = currentTime - startTimeRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')

    if (!canvas || !ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter(particle => {
      updateParticle(particle)
      drawParticle(ctx, particle)
      
      // Remove particles that are off screen
      return particle.y < canvas.height + 50 && particle.x > -50 && particle.x < canvas.width + 50
    })

    // Add new particles if still within duration
    if (elapsed < duration && particlesRef.current.length < particleCount) {
      for (let i = 0; i < 3; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    // Continue animation if particles exist or still within duration
    if (particlesRef.current.length > 0 || elapsed < duration) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }, [duration, particleCount, createParticle, updateParticle, drawParticle])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas)
    }

    if (active && typeof window !== 'undefined') {
      startTimeRef.current = undefined
      particlesRef.current = []
      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [active, animate])

  if (!active) return null

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    />
  )
}
