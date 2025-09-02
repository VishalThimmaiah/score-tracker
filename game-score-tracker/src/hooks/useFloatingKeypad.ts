import { useState, useCallback, useEffect } from 'react'

interface KeypadPosition {
	x?: number
	y?: number
	useCSSPositioning?: boolean
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

	const showKeypad = useCallback((playerId: string, targetElement: HTMLElement, currentScore?: string) => {
		// Use CSS-based positioning instead of JavaScript calculations
		setPosition({ useCSSPositioning: true })
		setActivePlayerId(playerId)
		setCurrentValue(currentScore || '')
		setIsVisible(true)
	}, [])

	const hideKeypad = useCallback(() => {
		setIsVisible(false)
		setActivePlayerId(null)
		setCurrentValue('')
	}, [])

	const handleNumberPress = useCallback((digit: string) => {
		setCurrentValue(prev => prev + digit)
	}, [])

	const handleBackspace = useCallback(() => {
		setCurrentValue(prev => prev.slice(0, -1))
	}, [])

	const handleClear = useCallback(() => {
		setCurrentValue('')
	}, [])

	const handleConfirm = useCallback(() => {
		if (currentValue !== '' && activePlayerId) {
			const score = parseInt(currentValue, 10)
			if (!isNaN(score) && score >= 0) {
				onScoreEntered(activePlayerId, score)
				hideKeypad()
			}
		}
	}, [currentValue, activePlayerId, onScoreEntered, hideKeypad])

	const handleMultiply = useCallback(() => {
		if (currentValue !== '' && currentValue !== '0') {
			const currentNumber = parseInt(currentValue, 10)
			if (!isNaN(currentNumber)) {
				setCurrentValue((currentNumber * 2).toString())
			}
		}
	}, [currentValue])

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
		showKeypad,
		hideKeypad,
		handleNumberPress,
		handleBackspace,
		handleClear,
		handleConfirm,
		handleCancel,
		handleMultiply
	}
}
