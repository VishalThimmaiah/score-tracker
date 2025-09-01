'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, X, Save } from 'lucide-react'
import { toast } from 'sonner'

interface ScoreEntrySheetProps {
	isOpen: boolean
	onClose: () => void
}

interface PlayerScoreCardProps {
	player: {
		id: string
		name: string
		totalScore: number
		isEliminated: boolean
	}
	score: string
	onScoreChange: (playerId: string, value: string) => void
	onKeyPress: (e: React.KeyboardEvent, playerId: string) => void
	inputRef: (el: HTMLInputElement | null) => void
	autoFocus?: boolean
}

function PlayerScoreCard({ 
	player, 
	score, 
	onScoreChange, 
	onKeyPress, 
	inputRef, 
	autoFocus = false 
}: PlayerScoreCardProps) {
	const hasScore = score && score.trim() !== ''
	
	return (
		<Card className={`transition-all duration-200 ${
			hasScore 
				? 'border-green-300 bg-green-50' 
				: 'border-gray-200 hover:border-gray-300'
		}`}>
			<CardContent className="p-4">
				<div className="text-center space-y-3">
					{/* Player Name */}
					<div>
						<h3 className="font-semibold text-lg text-gray-900">
							{player.name}
						</h3>
						<p className="text-sm text-gray-500">
							Total: {player.totalScore}
						</p>
					</div>
					
					{/* Score Input */}
					<div className="relative">
						<Input
							ref={inputRef}
							type="number"
							min="0"
							max="100"
							placeholder="Enter score"
							value={score}
							onChange={(e) => onScoreChange(player.id, e.target.value)}
							onKeyPress={(e) => onKeyPress(e, player.id)}
							className={`text-2xl text-center h-14 ${
								hasScore 
									? 'border-green-400 focus:border-green-500' 
									: 'focus:border-blue-500'
							}`}
							autoFocus={autoFocus}
						/>
						{hasScore && (
							<div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default function ScoreEntrySheet({ isOpen, onClose }: ScoreEntrySheetProps) {
	const { players, currentRound, addRoundScores } = useGameStore()
	const scoreRefs = useRef<{ [playerId: string]: HTMLInputElement | null }>({})
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

	const handleClose = useCallback(() => {
		setScores({})
		onClose()
	}, [onClose])

	// Reset scores when sheet opens/closes
	useEffect(() => {
		if (isOpen) {
			setScores({})
		}
	}, [isOpen])

	// Handle escape key to close
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				handleClose()
			}
		}
		
		if (isOpen) {
			document.addEventListener('keydown', handleEscape)
			return () => document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen, handleClose])

	const handleScoreChange = (playerId: string, value: string) => {
		// Allow only numbers and empty string
		if (value !== '' && !/^\d+$/.test(value)) {
			return
		}
		
		setScores(prev => ({
			...prev,
			[playerId]: value
		}))
	}

	const handleKeyPress = (e: React.KeyboardEvent, playerId: string) => {
		if (e.key === 'Enter' || e.key === 'Tab') {
			e.preventDefault()
			
			// Find next input or submit if this is the last one
			const activePlayerIds = activePlayers.map(p => p.id)
			const currentIndex = activePlayerIds.indexOf(playerId)
			
			if (e.shiftKey && e.key === 'Tab') {
				// Move to previous input
				if (currentIndex > 0) {
					const prevPlayerId = activePlayerIds[currentIndex - 1]
					const prevInput = scoreRefs.current[prevPlayerId]
					prevInput?.focus()
				}
			} else {
				// Move to next input or submit
				if (currentIndex < activePlayerIds.length - 1) {
					const nextPlayerId = activePlayerIds[currentIndex + 1]
					const nextInput = scoreRefs.current[nextPlayerId]
					nextInput?.focus()
				} else if (allScoresEntered) {
					handleSubmit()
				}
			}
		}
	}

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

	return (
		<div className="fixed inset-0 z-50 bg-white flex flex-col">
			{/* Header */}
			<div className="border-b border-gray-200 bg-white flex-shrink-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16">
						<div className="flex items-center gap-4">
							<Button
								variant="ghost"
								size="sm"
								onClick={handleClose}
								className="flex items-center gap-2"
							>
								<ArrowLeft className="h-4 w-4" />
								Back to Game
							</Button>
						</div>
						
						<div className="text-center">
							<h1 className="text-xl font-semibold text-gray-900">
								Round {currentRound} Score Entry
							</h1>
						</div>
						
						<Button
							variant="ghost"
							size="sm"
							onClick={handleClose}
						>
							<X className="h-4 w-4" />
						</Button>
					</div>
					
					<div className="pb-4">
						<p className="text-center text-sm text-gray-600">
							Enter scores for all active players. Lower scores are better.
						</p>
					</div>
				</div>
			</div>

			{/* Main Content - Scrollable */}
			<div className="flex-1 overflow-y-auto min-h-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Player Grid */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-4">
						{activePlayers.map((player, index) => (
							<PlayerScoreCard
								key={player.id}
								player={player}
								score={scores[player.id] || ''}
								onScoreChange={handleScoreChange}
								onKeyPress={handleKeyPress}
								inputRef={(el) => { scoreRefs.current[player.id] = el }}
								autoFocus={index === 0}
							/>
						))}
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="border-t border-gray-200 bg-white flex-shrink-0">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					{/* Progress */}
					<div className="text-center mb-4">
						<p className="text-sm text-gray-600">
							Progress: {completedCount} of {activePlayers.length} players completed
						</p>
						<div className="w-full bg-gray-200 rounded-full h-2 mt-2">
							<div 
								className="bg-blue-600 h-2 rounded-full transition-all duration-300"
								style={{ width: `${activePlayers.length > 0 ? (completedCount / activePlayers.length) * 100 : 0}%` }}
							/>
						</div>
					</div>
					
					{/* Buttons */}
					<div className="flex gap-4 justify-center">
						<Button 
							variant="outline" 
							onClick={handleClose}
							disabled={isSubmitting}
							className="min-w-[120px]"
						>
							Cancel
						</Button>
						<Button 
							onClick={handleSubmit}
							disabled={!allScoresEntered || isSubmitting}
							className="min-w-[120px]"
						>
							<Save className="h-4 w-4 mr-2" />
							{isSubmitting ? 'Saving...' : 'Save Scores'}
						</Button>
					</div>
					
					{/* Tips */}
					<div className="text-center mt-4">
						<p className="text-xs text-gray-500">
							💡 Tip: Press Tab or Enter to move between players
						</p>
					</div>
				</div>
			</div>
		</div>
	)
}
