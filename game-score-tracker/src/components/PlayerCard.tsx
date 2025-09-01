'use client'

import { Player } from '@/store/gameStore'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Skull } from 'lucide-react'

interface PlayerCardProps {
	player: Player
	rank: number
	eliminationScore: number
	isWinner?: boolean
}

export default function PlayerCard({ player, rank, eliminationScore, isWinner = false }: PlayerCardProps) {
	// Calculate score percentage for color coding
	const scorePercentage = eliminationScore > 0 ? (player.totalScore / eliminationScore) * 100 : 0
	
	// Determine background color based on score percentage
	const getBackgroundColor = () => {
		if (player.isEliminated) {
			return 'bg-gray-800 text-white border-gray-700'
		}
		
		if (scorePercentage < 25) {
			return 'bg-green-100 text-green-900 border-green-300'
		} else if (scorePercentage < 50) {
			return 'bg-yellow-100 text-yellow-900 border-yellow-300'
		} else if (scorePercentage < 75) {
			return 'bg-orange-100 text-orange-900 border-orange-300'
		} else {
			return 'bg-red-100 text-red-900 border-red-300'
		}
	}

	// Get progress bar color
	const getProgressColor = () => {
		if (player.isEliminated) return 'bg-gray-600'
		if (scorePercentage < 25) return 'bg-green-500'
		if (scorePercentage < 50) return 'bg-yellow-500'
		if (scorePercentage < 75) return 'bg-orange-500'
		return 'bg-red-500'
	}

	return (
		<Card className={`${getBackgroundColor()} transition-all duration-300 py-3 ${isWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
			<CardContent className="p-4">
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-3">
						{/* Rank Badge */}
						<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
							isWinner 
								? 'bg-yellow-500 text-white' 
								: player.isEliminated 
									? 'bg-gray-600 text-white'
									: 'bg-white/20 backdrop-blur-sm'
						}`}>
							{isWinner ? <Crown className="h-4 w-4" /> : rank}
						</div>
						
						{/* Player Name */}
						<div>
							<h3 className="font-semibold text-lg">{player.name}</h3>
							{player.isEliminated && (
								<div className="flex items-center gap-1 text-sm opacity-75">
									<Skull className="h-3 w-3" />
									<span>Eliminated</span>
								</div>
							)}
						</div>
					</div>

					{/* Score Display */}
					<div className="text-right">
						<div className="text-2xl font-bold">{player.totalScore}</div>
						<div className="text-sm opacity-75">
							{player.scores.length} round{player.scores.length !== 1 ? 's' : ''}
						</div>
					</div>
				</div>

				{/* Progress Bar */}
				<div className="space-y-1">
					<div className="flex justify-between text-sm opacity-75">
						<span>Progress to elimination</span>
						<span>{Math.min(scorePercentage, 100).toFixed(1)}%</span>
					</div>
					<div className="w-full bg-white/30 rounded-full h-2">
						<div 
							className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
							style={{ width: `${Math.min(scorePercentage, 100)}%` }}
						/>
					</div>
				</div>

				{/* Last Round Score */}
				{player.scores.length > 0 && (
					<div className="mt-2 pt-2 border-t border-current/20">
						<div className="flex justify-between text-sm">
							<span className="opacity-75">Last round:</span>
							<span className="font-medium">
								+{player.scores[player.scores.length - 1]}
							</span>
						</div>
					</div>
				)}

				{/* Winner Badge */}
				{isWinner && (
					<div className="mt-2 pt-2 border-t border-yellow-400/30">
						<div className="flex items-center justify-center gap-2 text-yellow-700 font-semibold">
							<Crown className="h-4 w-4" />
							<span>Winner!</span>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
