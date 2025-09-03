'use client'

import { useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

interface AmbientParticlesProps {
  className?: string
  particleCount?: number
  speed?: number
  opacity?: number
  color?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  baseOpacity: number
}

export default function AmbientParticles({ 
  className = '',
  particleCount = 20,
  speed = 0.5,
  opacity = 0.4,
  color = '#8b5cf6'
}: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])

  const particleColor = useMemo(() => {
    // Convert hex to RGB for alpha blending
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    return { r, g, b }
  }, [color])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (typeof window !== 'undefined') {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    const createParticle = (): Particle => {
      return {
        x: Math.random() * (canvas?.width || 400),
        y: Math.random() * (canvas?.height || 600),
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size: Math.random() * 3 + 1,
        opacity: 0,
        baseOpacity: Math.random() * opacity + 0.1
      }
    }

    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle())
      }
    }

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx
      particle.y += particle.vy

      // Breathing effect
      particle.opacity = particle.baseOpacity * (Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.5 + 0.5)

      // Wrap around screen edges
      if (particle.x < -10) particle.x = canvas.width + 10
      if (particle.x > canvas.width + 10) particle.x = -10
      if (particle.y < -10) particle.y = canvas.height + 10
      if (particle.y > canvas.height + 10) particle.y = -10
    }

    const drawParticle = (particle: Particle) => {
      ctx.save()
      
      // Create radial gradient for glow effect
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size * 3
      )
      gradient.addColorStop(0, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${particle.opacity})`)
      gradient.addColorStop(1, `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, 0)`)
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner bright core
      ctx.fillStyle = `rgba(${particleColor.r}, ${particleColor.g}, ${particleColor.b}, ${particle.opacity * 0.8})`
      ctx.beginPath()
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fill()
      
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particlesRef.current.forEach(particle => {
        updateParticle(particle)
        drawParticle(particle)
      })
      
      animationRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', resizeCanvas)
    }
    
    initParticles()
    animate()

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', resizeCanvas)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [particleCount, speed, opacity, particleColor])

  return (
    <motion.canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3, delay: 1 }}
    />
  )
}
