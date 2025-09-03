'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RippleProps {
	children: React.ReactNode
	className?: string
	color?: string
	duration?: number
	disabled?: boolean
	onClick?: () => void
}

interface Ripple {
	id: number
	x: number
	y: number
}

export default function RippleEffect({ 
	children, 
	className = '', 
	color = 'rgba(255, 255, 255, 0.6)',
	duration = 600,
	disabled = false,
	onClick
}: RippleProps) {
	const [ripples, setRipples] = useState<Ripple[]>([])

	const createRipple = useCallback((event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
		if (disabled) return

		const element = event.currentTarget
		const rect = element.getBoundingClientRect()
		
		// Handle both mouse and touch events
		let clientX: number, clientY: number
		
		if ('touches' in event && event.touches.length > 0) {
			// Touch event
			clientX = event.touches[0].clientX
			clientY = event.touches[0].clientY
		} else if ('clientX' in event) {
			// Mouse event
			clientX = event.clientX
			clientY = event.clientY
		} else {
			// Fallback to center
			clientX = rect.left + rect.width / 2
			clientY = rect.top + rect.height / 2
		}

		const x = clientX - rect.left
		const y = clientY - rect.top

		const newRipple: Ripple = {
			id: Date.now() + Math.random(),
			x,
			y
		}

		setRipples(prev => [...prev, newRipple])

		// Remove ripple after animation
		setTimeout(() => {
			setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
		}, duration)

		// Call onClick if provided
		if (onClick) {
			onClick()
		}
	}, [disabled, duration, onClick])

	return (
		<div
			className={`relative overflow-hidden ${className}`}
			onMouseDown={createRipple}
			onTouchStart={createRipple}
			style={{ cursor: disabled ? 'default' : 'pointer' }}
		>
			{children}
			
			<AnimatePresence>
				{ripples.map((ripple) => (
					<motion.div
						key={ripple.id}
						className="absolute rounded-full pointer-events-none"
						style={{
							left: ripple.x,
							top: ripple.y,
							backgroundColor: color,
						}}
						initial={{
							width: 0,
							height: 0,
							x: '-50%',
							y: '-50%',
							opacity: 1,
						}}
						animate={{
							width: 300,
							height: 300,
							opacity: 0,
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: duration / 1000,
							ease: 'easeOut',
						}}
					/>
				))}
			</AnimatePresence>
		</div>
	)
}
