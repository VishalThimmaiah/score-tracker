'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Crown, Sparkles } from 'lucide-react'
import { Player } from '@/store/gameStore'
import Confetti from './ui/confetti'

interface WinnerCelebrationProps {
  winners: Player[]
  isVisible: boolean
  onComplete?: () => void
}

export default function WinnerCelebration({ winners, isVisible, onComplete }: WinnerCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showSpotlight, setShowSpotlight] = useState(false)
  const [showText, setShowText] = useState(false)
  const [typewriterText, setTypewriterText] = useState('')

  const isMultipleWinners = winners.length > 1
  const winnerText = isMultipleWinners 
    ? `It's a tie! ${winners.map(w => w.name).join(' & ')} win!`
    : `${winners[0]?.name} wins!`

  // Typewriter effect
  useEffect(() => {
    if (!showText || !winnerText) return

    let currentIndex = 0
    setTypewriterText('')

    const typeInterval = setInterval(() => {
      if (currentIndex <= winnerText.length) {
        setTypewriterText(winnerText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typeInterval)
        // Auto-complete after 3 seconds
        setTimeout(() => {
          onComplete?.()
        }, 3000)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [showText, winnerText, onComplete])

  // Animation sequence
  useEffect(() => {
    if (!isVisible) {
      setShowConfetti(false)
      setShowSpotlight(false)
      setShowText(false)
      setTypewriterText('')
      return
    }

    // Start confetti immediately
    setShowConfetti(true)

    // Show spotlight after 500ms
    setTimeout(() => {
      setShowSpotlight(true)
    }, 500)

    // Show text after 1000ms
    setTimeout(() => {
      setShowText(true)
    }, 1000)
  }, [isVisible])

  if (!isVisible || winners.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Confetti */}
        <Confetti active={showConfetti} particleCount={150} duration={4000} />

        {/* Spotlight Background */}
        <AnimatePresence>
          {showSpotlight && (
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Radial spotlight effect */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.8) 70%)`
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Winner Announcement */}
        <motion.div
          className="relative z-10 text-center px-8 py-12 max-w-md mx-auto"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.3
          }}
        >
          {/* Trophy Icon with Animation */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ y: -50, rotate: -180 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 150,
              damping: 15,
              delay: 0.5
            }}
          >
            <div className="relative">
              <Trophy className="h-20 w-20 text-yellow-400 drop-shadow-lg" />
              
              {/* Sparkles around trophy */}
              <motion.div
                className="absolute -top-2 -right-2"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                <Sparkles className="h-6 w-6 text-yellow-300" />
              </motion.div>
              
              <motion.div
                className="absolute -bottom-2 -left-2"
                animate={{ 
                  rotate: -360,
                  scale: [1, 1.3, 1]
                }}
                transition={{ 
                  rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2.5, repeat: Infinity, delay: 0.5 }
                }}
              >
                <Sparkles className="h-5 w-5 text-yellow-200" />
              </motion.div>
            </div>
          </motion.div>

          {/* Game Over Text */}
          <motion.h1
            className="text-4xl font-bold text-white mb-4 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Game Over!
          </motion.h1>

          {/* Winner Text with Typewriter Effect */}
          <AnimatePresence>
            {showText && (
              <motion.div
                className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-2xl font-bold mb-2 min-h-[2rem] flex items-center justify-center">
                  {typewriterText}
                  <motion.span
                    className="inline-block w-0.5 h-6 bg-yellow-400 ml-1"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                </div>
                
                {/* Winner Score */}
                {winners[0] && (
                  <motion.p
                    className="text-lg text-white/90 drop-shadow"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                  >
                    Final Score: {winners[0].totalScore} points
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Crown Icons for Multiple Winners */}
          {isMultipleWinners && (
            <motion.div
              className="flex justify-center gap-4 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.6 }}
            >
              {winners.map((winner, index) => (
                <motion.div
                  key={winner.id}
                  className="flex flex-col items-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: 1.8 + (index * 0.2),
                    type: "spring",
                    stiffness: 200
                  }}
                >
                  <Crown className="h-8 w-8 text-yellow-400 mb-1" />
                  <span className="text-sm text-white/80">{winner.name}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Floating particles around the announcement */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: `${20 + (i * 12)}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, -30, -10],
                  opacity: [0.7, 1, 0.7],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
