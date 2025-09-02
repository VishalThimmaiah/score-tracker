'use client'

import { Player } from '@/store/gameStore'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Skull, CircleDot } from 'lucide-react'

interface PlayerCardProps {
	player: Player
	rank: number
	eliminationScore: number
	isWinner?: boolean
	isDealer?: boolean
}

export default function PlayerCard({ player, rank, eliminationScore, isWinner = false, isDealer = false }: PlayerCardProps) {
	// Calculate score percentage for color coding
	const scorePercentage = eliminationScore > 0 ? (player.totalScore / eliminationScore) * 100 : 0
	
	// Determine background color based on score percentage
	const getBackgroundColor = () => {
		if (player.isEliminated) {
			return 'bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600'
		}
		
		if (scorePercentage < 25) {
			return 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-100 border-green-300 dark:border-green-700'
		} else if (scorePercentage < 50) {
			return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-700'
		} else if (scorePercentage < 75) {
			return 'bg-orange-100 dark:bg-orange-900/30 text-orange-900 dark:text-orange-100 border-orange-300 dark:border-orange-700'
		} else {
			return 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-100 border-red-300 dark:border-red-700'
		}
	}

	// Get progress bar color
	const getProgressColor = () => {
		if (player.isEliminated) return 'bg-gray-600 dark:bg-gray-500'
		if (scorePercentage < 25) return 'bg-green-500 dark:bg-green-400'
		if (scorePercentage < 50) return 'bg-yellow-500 dark:bg-yellow-400'
		if (scorePercentage < 75) return 'bg-orange-500 dark:bg-orange-400'
		return 'bg-red-500 dark:bg-red-400'
	}

	// Get dealer badge color that matches the theme
	const getDealerBadgeColor = () => {
		if (player.isEliminated) {
			return 'bg-gray-600 dark:bg-gray-500 text-white'
		}
		
		if (scorePercentage < 25) {
			return 'bg-green-600 dark:bg-green-500 text-white'
		} else if (scorePercentage < 50) {
			return 'bg-yellow-600 dark:bg-yellow-500 text-white'
		} else if (scorePercentage < 75) {
			return 'bg-orange-600 dark:bg-orange-500 text-white'
		} else {
			return 'bg-red-600 dark:bg-red-500 text-white'
		}
	}

	return (
		<Card className={`${getBackgroundColor()} transition-all duration-300 py-0${isWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
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
							<div className="flex items-center gap-2">
								<h3 className="font-semibold text-lg">{player.name}</h3>
								{isDealer && (
									<div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getDealerBadgeColor()}`}>
										<CircleDot className="h-3 w-3" />
										<span>Dealer</span>
									</div>
								)}
							</div>
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
