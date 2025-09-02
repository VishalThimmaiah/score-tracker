'use client'

import { useRef, useCallback, memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check, User } from 'lucide-react'

interface Player {
	id: string
	name: string
	totalScore: number
	isEliminated: boolean
}

interface PlayerRowProps {
	player: Player
	score: string
	isCompleted: boolean
	onScoreClick: (playerId: string, targetElement: HTMLElement) => void
}

const PlayerRow = memo(({ player, score, isCompleted, onScoreClick }: PlayerRowProps) => {
	const scoreButtonRef = useRef<HTMLButtonElement>(null)

	const handleScoreClick = useCallback(() => {
		if (scoreButtonRef.current) {
			onScoreClick(player.id, scoreButtonRef.current)
		}
	}, [player.id, onScoreClick])

	return (
		<Card className={`transition-all duration-200 ${
			isCompleted 
				? 'border-green-300 bg-green-50 dark:border-green-600 dark:bg-green-900/20' 
				: 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
		}`}>
			<CardContent className="p-3">
				<div className="flex items-center justify-between">
					{/* Player Info */}
					<div className="flex items-center gap-3 flex-1 min-w-0">
						<div className="flex-shrink-0">
							<div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
								<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
							</div>
						</div>
						<div className="min-w-0 flex-1">
							<h3 className="font-medium text-gray-900 dark:text-white truncate">
								{player.name}
							</h3>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Total: {player.totalScore}
							</p>
						</div>
					</div>

					{/* Score Input */}
					<div className="flex items-center gap-2">
						<Button
							ref={scoreButtonRef}
							variant="outline"
							onClick={handleScoreClick}
							className={`min-w-[80px] h-10 text-base font-medium ${
								isCompleted 
									? 'border-green-400 bg-green-50 text-green-700 dark:border-green-600 dark:bg-green-900/20 dark:text-green-400' 
									: 'border-gray-300 hover:border-blue-400 dark:border-gray-600 dark:hover:border-blue-500'
							}`}
						>
							{score || '--'}
						</Button>
						{isCompleted && (
							<div className="flex-shrink-0">
								<Check className="h-4 w-4 text-green-600 dark:text-green-400" />
							</div>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	)
})

PlayerRow.displayName = 'PlayerRow'

interface ScalablePlayerListProps {
	players: Player[]
	scores: { [playerId: string]: string }
	onScoreClick: (playerId: string, targetElement: HTMLElement) => void
	className?: string
}

export function ScalablePlayerList({ 
	players, 
	scores, 
	onScoreClick,
	className = ''
}: ScalablePlayerListProps) {
	const activePlayers = players.filter(p => !p.isEliminated)

	// Calculate completion stats
	const completedCount = activePlayers.filter(player => {
		const score = scores[player.id]
		return score && score.trim() !== ''
	}).length

	const completionPercentage = activePlayers.length > 0 
		? (completedCount / activePlayers.length) * 100 
		: 0

	return (
		<div className={`space-y-3 ${className}`}>
			{/* Progress Header */}
			<div className="sticky top-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 pb-3 mb-3 z-10">
				<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
					<span>Progress: {completedCount} of {activePlayers.length} players</span>
					<span>{Math.round(completionPercentage)}% complete</span>
				</div>
				<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
					<div 
						className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
						style={{ width: `${completionPercentage}%` }}
					/>
				</div>
			</div>

			{/* Player List */}
			<div className="space-y-2">
				{activePlayers.map((player) => {
					const score = scores[player.id] || ''
					const isCompleted = score && score.trim() !== ''
					
					return (
						<PlayerRow
							key={player.id}
							player={player}
							score={score}
							isCompleted={!!isCompleted}
							onScoreClick={onScoreClick}
						/>
					)
				})}
			</div>

			{/* Large Player Count Helper */}
			{activePlayers.length > 8 && (
				<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
					<div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
						<div className="w-4 h-4 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center">
							<span className="text-xs text-white font-bold">!</span>
						</div>
						<span>
							{`Large group detected (${activePlayers.length} players). 
							Tap any player's score button to enter their score quickly.`}
						</span>
					</div>
				</div>
			)}

			{/* Empty State */}
			{activePlayers.length === 0 && (
				<div className="text-center py-8 text-gray-500 dark:text-gray-400">
					<User className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
					<p className="dark:text-gray-300">No active players found</p>
					<p className="text-sm dark:text-gray-400">Add players to start scoring</p>
				</div>
			)}
		</div>
	)
}
