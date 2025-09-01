'use client'

import { useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'

interface ScoreEntryModalProps {
	isOpen: boolean
	onClose: () => void
}

export default function ScoreEntryModal({ isOpen, onClose }: ScoreEntryModalProps) {
	const { players, currentRound, addRoundScores } = useGameStore()
	const scoreRefs = useRef<{ [playerId: string]: HTMLInputElement | null }>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [scores, setScores] = useState<{ [playerId: string]: string }>({})

	const handleClose = () => {
		// Clear scores state when modal is closed
		setScores({})
		onClose()
	}

	const handleScoreChange = (playerId: string, value: string) => {
		// Allow only numbers and empty string
		if (value !== '' && !/^\d+$/.test(value)) {
			// Reset to previous valid value or empty
			const input = scoreRefs.current[playerId]
			if (input) {
				input.value = input.value.replace(/[^\d]/g, '')
				return
			}
		}
		
		// Update state to trigger re-render
		setScores(prev => ({
			...prev,
			[playerId]: value
		}))
	}

	const handleSubmit = async () => {
		setIsSubmitting(true)
		
		try {
			// Validate all scores are entered
			const activePlayers = players.filter(p => !p.isEliminated)
			const scoresArray = activePlayers.map(player => {
				const input = scoreRefs.current[player.id]
				const score = parseInt(input?.value || '0')
				return {
					playerId: player.id,
					score: score
				}
			})

			// Check if all scores are valid
			const hasEmptyScores = scoresArray.some(s => {
				const input = scoreRefs.current[s.playerId]
				return isNaN(s.score) || s.score < 0 || !input?.value.trim()
			})
			
			if (hasEmptyScores) {
				toast.error('Please enter valid scores for all active players.')
				return
			}

			// Add scores to store
			addRoundScores(scoresArray)
			
			// Show success message
			toast.success(`Round ${currentRound} scores saved successfully!`)
			
			// Clear all inputs and state
			activePlayers.forEach(player => {
				const input = scoreRefs.current[player.id]
				if (input) input.value = ''
			})
			setScores({})
			
			// Close modal
			onClose()
		} catch (error) {
			console.error('Error adding scores:', error)
			toast.error('Error adding scores. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent, playerId: string) => {
		if (e.key === 'Enter') {
			// Find next input or submit if this is the last one
			const activePlayerIds = players.filter(p => !p.isEliminated).map(p => p.id)
			const currentIndex = activePlayerIds.indexOf(playerId)
			
			if (currentIndex < activePlayerIds.length - 1) {
				// Focus next input
				const nextPlayerId = activePlayerIds[currentIndex + 1]
				const nextInput = scoreRefs.current[nextPlayerId]
				nextInput?.focus()
			} else {
				// Submit if all scores are filled
				const allFilled = activePlayerIds.every(id => {
					const input = scoreRefs.current[id]
					return input?.value && input.value.trim() !== ''
				})
				if (allFilled) {
					handleSubmit()
				}
			}
		}
	}

	const activePlayers = players.filter(p => !p.isEliminated)
	const allScoresEntered = activePlayers.every(player => {
		const score = scores[player.id]
		return score && score.trim() !== ''
	})

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Save className="h-5 w-5" />
						Round {currentRound} Scores
					</DialogTitle>
					<DialogDescription>
						Enter the points each player scored this round. Lower scores are better.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 max-h-96 overflow-y-auto">
					{activePlayers.map((player, index) => (
						<div key={player.id} className="space-y-2">
							<Label htmlFor={`score-${player.id}`} className="flex items-center justify-between">
								<span className="font-medium">{player.name}</span>
								<span className="text-sm text-gray-500">
									Total: {player.totalScore}
								</span>
							</Label>
							<Input
								id={`score-${player.id}`}
								ref={(el) => { scoreRefs.current[player.id] = el }}
								type="number"
								min="0"
								max="100"
								placeholder="Enter score"
								onChange={(e) => handleScoreChange(player.id, e.target.value)}
								onKeyPress={(e) => handleKeyPress(e, player.id)}
								className="text-lg text-center"
								autoFocus={index === 0}
							/>
						</div>
					))}
				</div>

				<DialogFooter className="flex gap-2">
					<Button 
						variant="outline" 
						onClick={onClose}
						disabled={isSubmitting}
						className="flex-1"
					>
						<X className="h-4 w-4 mr-2" />
						Cancel
					</Button>
					<Button 
						onClick={handleSubmit}
						disabled={!allScoresEntered || isSubmitting}
						className="flex-1"
					>
						<Save className="h-4 w-4 mr-2" />
						{isSubmitting ? 'Saving...' : 'Save Scores'}
					</Button>
				</DialogFooter>

				{/* Quick Tips */}
				<div className="text-xs text-gray-500 text-center border-t pt-3">
					<p>💡 Tip: Press Enter to move to next player or save when done</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
