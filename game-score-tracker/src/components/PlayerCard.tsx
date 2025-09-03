'use client'

import { Player, GameMode, GameType, ScoreDifference } from '@/store/gameStore'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Skull, CircleDot, Play } from 'lucide-react'

interface PlayerCardProps {
	player: Player
	rank: number
	eliminationScore: number
	gameMode: GameMode
	gameStatus: 'setup' | 'playing' | 'finished'
	gameType: GameType
	currentRound: number
	isWinner?: boolean
	isDealer?: boolean
	isPicker?: boolean
	scoreDifference?: ScoreDifference
}

export default function PlayerCard({ player, rank, eliminationScore, gameMode, gameStatus, currentRound, isWinner = false, isDealer = false, isPicker = false, scoreDifference }: PlayerCardProps) {

	// Calculate score percentage for color coding
	const scorePercentage = eliminationScore > 0 ? (player.totalScore / eliminationScore) * 100 : 0
	
	// Determine background color based on game mode
	const getBackgroundColor = () => {
		if (player.isEliminated) {
			return 'bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600'
		}
		
		if (gameMode === 'points-based') {
			// Points-based: Use score percentage logic
			if (scorePercentage < 25) {
				return 'bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600'
			} else if (scorePercentage < 50) {
				return 'bg-yellow-100 dark:bg-yellow-800/60 text-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600'
			} else if (scorePercentage < 75) {
				return 'bg-orange-100 dark:bg-orange-800/60 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-600'
			} else {
				return 'bg-red-100 dark:bg-red-800/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-600'
			}
		} else {
			// Rounds-based: Green only for potential winners (lowest score), default for others
			if (scoreDifference?.isLeader) {
				return 'bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600'
			} else {
				return 'bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600'
			}
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
		
		if (gameMode === 'points-based') {
			// Points-based: Use score percentage logic
			if (scorePercentage < 25) {
				return 'bg-green-600 dark:bg-green-500 text-white'
			} else if (scorePercentage < 50) {
				return 'bg-yellow-600 dark:bg-yellow-500 text-white'
			} else if (scorePercentage < 75) {
				return 'bg-orange-600 dark:bg-orange-500 text-white'
			} else {
				return 'bg-red-600 dark:bg-red-500 text-white'
			}
		} else {
			// Rounds-based: Option 3 - Indigo for Dealer
			return 'bg-indigo-600 dark:bg-indigo-500 text-white'
		}
	}

	// Get picker badge color (different from dealer)
	const getPickerBadgeColor = () => {
		if (player.isEliminated) {
			return 'bg-gray-700 dark:bg-gray-600 text-white'
		}
		
		if (gameMode === 'points-based') {
			// Points-based: Use score percentage logic
			if (scorePercentage < 25) {
				return 'bg-purple-600 dark:bg-purple-500 text-white'
			} else if (scorePercentage < 50) {
				return 'bg-indigo-600 dark:bg-indigo-500 text-white'
			} else if (scorePercentage < 75) {
				return 'bg-blue-600 dark:bg-blue-500 text-white'
			} else {
				return 'bg-violet-600 dark:bg-violet-500 text-white'
			}
		} else {
			// Rounds-based: Option 3 - Rose for Picker (avoiding green conflict)
			return 'bg-rose-600 dark:bg-rose-500 text-white'
		}
	}

	return (
		<Card className={`py-0 ${getBackgroundColor()} transition-all duration-300 ${isWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
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
								<div className="flex items-center gap-1">
									{gameStatus !== 'finished' && isPicker && (
										<div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getPickerBadgeColor()}`}>
											<Play className="h-3 w-3" />
											<span>Picker</span>
										</div>
									)}
									{gameStatus !== 'finished' && isDealer && (
										<div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getDealerBadgeColor()}`}>
											<CircleDot className="h-3 w-3" />
											<span>Dealer</span>
										</div>
									)}
								</div>
							</div>
							{player.isEliminated && (
								<div className="flex items-center gap-1 text-sm opacity-75">
									<Skull className="h-3 w-3" />
									<span>Eliminated</span>
								</div>
							)}
							
							{/* Score Difference Display */}
							{currentRound > 1 && scoreDifference && !player.isEliminated && (
								<div className="text-sm opacity-75 mt-1">
									{scoreDifference.isLeader ? (
										scoreDifference.hasMultipleLeaders ? 'Tied for lead' : 'Leading'
									) : (
										`+${scoreDifference.difference} behind leader`
									)}
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

				{/* Progress Bar - Only show for points-based games */}
				{gameMode === 'points-based' && (
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
