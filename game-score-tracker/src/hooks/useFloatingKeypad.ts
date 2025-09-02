import { useState, useCallback, useRef, useEffect } from 'react'

interface KeypadPosition {
	x: number
	y: number
}

interface UseFloatingKeypadProps {
	onScoreEntered: (playerId: string, score: number) => void
	onCancel?: () => void
}

export function useFloatingKeypad({ onScoreEntered, onCancel }: UseFloatingKeypadProps) {
	const [isVisible, setIsVisible] = useState(false)
	const [position, setPosition] = useState<KeypadPosition>({ x: 0, y: 0 })
	const [activePlayerId, setActivePlayerId] = useState<string | null>(null)
	const [currentValue, setCurrentValue] = useState('')
	const containerRef = useRef<HTMLDivElement>(null)

	const calculateOptimalPosition = useCallback((targetElement: HTMLElement) => {
		const rect = targetElement.getBoundingClientRect()
		const containerRect = containerRef.current?.getBoundingClientRect()

		if (!containerRect) return { x: 0, y: 0 }

		const keypadWidth = 200
		const keypadHeight = 240
		const padding = 16

		// Try to position keypad to the right of the target
		let x = rect.right + padding
		let y = rect.top

		// If keypad would go off right edge, position to the left
		if (x + keypadWidth > containerRect.right) {
			x = rect.left - keypadWidth - padding
		}

		// If keypad would go off left edge, center it
		if (x < containerRect.left) {
			x = Math.max(padding, (containerRect.width - keypadWidth) / 2)
		}

		// Ensure keypad stays within vertical bounds
		if (y + keypadHeight > containerRect.bottom) {
			y = containerRect.bottom - keypadHeight - padding
		}
		if (y < containerRect.top) {
			y = containerRect.top + padding
		}

		// Convert to relative coordinates
		return {
			x: x - containerRect.left,
			y: y - containerRect.top
		}
	}, [])

	const showKeypad = useCallback((playerId: string, targetElement: HTMLElement) => {
		const optimalPosition = calculateOptimalPosition(targetElement)
		setPosition(optimalPosition)
		setActivePlayerId(playerId)
		setCurrentValue('')
		setIsVisible(true)
	}, [calculateOptimalPosition])

	const hideKeypad = useCallback(() => {
		setIsVisible(false)
		setActivePlayerId(null)
		setCurrentValue('')
	}, [])

	const handleNumberPress = useCallback((digit: string) => {
		setCurrentValue(prev => {
			const newValue = prev + digit
			// Limit to 3 digits for reasonable score ranges
			return newValue.length <= 3 ? newValue : prev
		})
	}, [])

	const handleBackspace = useCallback(() => {
		setCurrentValue(prev => prev.slice(0, -1))
	}, [])

	const handleClear = useCallback(() => {
		setCurrentValue('')
	}, [])

	const handleConfirm = useCallback(() => {
		if (currentValue && activePlayerId) {
			const score = parseInt(currentValue, 10)
			if (!isNaN(score) && score >= 0) {
				onScoreEntered(activePlayerId, score)
				hideKeypad()
			}
		}
	}, [currentValue, activePlayerId, onScoreEntered, hideKeypad])

	const handleCancel = useCallback(() => {
		hideKeypad()
		onCancel?.()
	}, [hideKeypad, onCancel])

	// Handle escape key
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!isVisible) return

			if (e.key === 'Escape') {
				handleCancel()
			} else if (e.key === 'Enter') {
				handleConfirm()
			} else if (e.key === 'Backspace') {
				e.preventDefault()
				handleBackspace()
			} else if (/^[0-9]$/.test(e.key)) {
				e.preventDefault()
				handleNumberPress(e.key)
			}
		}

		if (isVisible) {
			document.addEventListener('keydown', handleKeyDown)
			return () => document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isVisible, handleCancel, handleConfirm, handleBackspace, handleNumberPress])

	return {
		isVisible,
		position,
		activePlayerId,
		currentValue,
		containerRef,
		showKeypad,
		hideKeypad,
		handleNumberPress,
		handleBackspace,
		handleClear,
		handleConfirm,
		handleCancel
	}
}
