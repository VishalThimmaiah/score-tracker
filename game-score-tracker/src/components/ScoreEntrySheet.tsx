'use client'

import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { X, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useFloatingKeypad } from '@/hooks/useFloatingKeypad'
import { FloatingKeypad } from '@/components/FloatingKeypad'
import { ScalablePlayerList } from '@/components/ScalablePlayerList'

interface ScoreEntrySheetProps {
	isOpen: boolean
	onClose: () => void
}

export default function ScoreEntrySheet({ isOpen, onClose }: ScoreEntrySheetProps) {
	const { players, currentRound, addRoundScores } = useGameStore()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [scores, setScores] = useState<{ [playerId: string]: string }>({})

	// Get active players
	const activePlayers = players.filter(p => !p.isEliminated)
	
	// Calculate progress
	const completedCount = activePlayers.filter(player => {
		const score = scores[player.id]
		return score && score.trim() !== ''
	}).length
	
	const allScoresEntered = completedCount === activePlayers.length && activePlayers.length > 0

	// Floating keypad functionality
	const handleScoreEntered = useCallback((playerId: string, score: number) => {
		setScores(prev => ({
			...prev,
			[playerId]: score.toString()
		}))
	}, [])

	const {
		isVisible: keypadVisible,
		position: keypadPosition,
		activePlayerId,
		currentValue: keypadValue,
		containerRef,
		showKeypad,
		hideKeypad,
		handleNumberPress,
		handleBackspace,
		handleClear,
		handleConfirm,
		handleCancel
	} = useFloatingKeypad({
		onScoreEntered: handleScoreEntered
	})

	const handlePlayerScoreClick = useCallback((playerId: string, targetElement: HTMLElement) => {
		const currentScore = scores[playerId] || ''
		showKeypad(playerId, targetElement, currentScore)
	}, [showKeypad, scores])

	const handleClose = useCallback(() => {
		hideKeypad()
		setScores({})
		onClose()
	}, [hideKeypad, onClose])

	// Reset scores when sheet opens/closes
	useEffect(() => {
		if (isOpen) {
			setScores({})
		} else {
			hideKeypad()
		}
	}, [isOpen, hideKeypad])

	// Handle escape key to close
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen && !keypadVisible) {
				handleClose()
			}
		}
		
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			return () => document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, keypadVisible, handleClose])

	const handleSubmit = async () => {
		setIsSubmitting(true)
		
		try {
			// Validate all scores are entered
			const scoresArray = activePlayers.map(player => {
				const score = parseInt(scores[player.id] || '0')
				return {
					playerId: player.id,
					score: score
				}
			})

			// Check if all scores are valid
			const hasInvalidScores = scoresArray.some(s => {
				const scoreValue = scores[s.playerId]
				return isNaN(s.score) || s.score < 0 || !scoreValue || scoreValue.trim() === ''
			})
			
			if (hasInvalidScores) {
				toast.error('Please enter valid scores for all active players.')
				return
			}

			// Add scores to store
			addRoundScores(scoresArray)
			
			// Show success message
			toast.success(`Round ${currentRound} scores saved successfully!`)
			
			// Close sheet
			handleClose()
		} catch (error) {
			console.error('Error adding scores:', error)
			toast.error('Error adding scores. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	if (!isOpen) return null

	// Get active player name for keypad
	const activePlayer = activePlayers.find(p => p.id === activePlayerId)

	return (
		<div ref={containerRef} className="fixed inset-0 z-50 bg-white flex flex-col">
			{/* Header */}
			<div className="border-b border-gray-200 bg-white flex-shrink-0">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="w-10"></div> {/* Spacer for centering */}
						
						<div className="text-center">
							<h1 className="text-xl font-semibold text-gray-900">
								Round {currentRound} Score Entry
							</h1>
						</div>
						
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClose}
							disabled={keypadVisible}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					
					<div className="pb-4">
						<p className="text-center text-sm text-gray-600">
							{`💡 Tap any player's score button to enter their score quickly`}
						</p>
					</div>
				</div>
			</div>

			{/* Main Content - Scrollable */}
			<div className="flex-1 overflow-y-auto min-h-0">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
					<ScalablePlayerList
						players={activePlayers}
						scores={scores}
						onScoreClick={handlePlayerScoreClick}
					/>
				</div>
			</div>

			{/* Footer */}
			<div className="border-t border-gray-200 bg-white flex-shrink-0">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					{/* Buttons */}
					<div className="flex gap-4 justify-center">
						<Button 
							variant="outline" 
							onClick={handleClose}
							disabled={isSubmitting || keypadVisible}
							className="min-w-[120px]"
						>
							Cancel
						</Button>
						<Button 
							onClick={handleSubmit}
							disabled={!allScoresEntered || isSubmitting || keypadVisible}
							className="min-w-[120px]"
						>
							<Save className="h-4 w-4 mr-2" />
							{isSubmitting ? 'Saving...' : 'Save Scores'}
						</Button>
					</div>
					
					{/* Tips */}
					<div className="text-center mt-4">
						<p className="text-xs text-gray-500">
							{activePlayers.length > 8 
								? `🚀 Large group (${activePlayers.length} players) - Floating keypad optimized for quick entry`
								: '💡 Tap score buttons for quick entry • Keyboard shortcuts available'
							}
						</p>
					</div>
				</div>
			</div>

			{/* Floating Keypad */}
			<FloatingKeypad
				isVisible={keypadVisible}
				position={keypadPosition}
				currentValue={keypadValue}
				playerName={activePlayer?.name}
				onNumberPress={handleNumberPress}
				onBackspace={handleBackspace}
				onClear={handleClear}
				onConfirm={handleConfirm}
				onCancel={handleCancel}
			/>
		</div>
	)
}
