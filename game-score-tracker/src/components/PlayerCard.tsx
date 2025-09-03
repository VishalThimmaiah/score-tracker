'use client'

import { Player, GameMode, GameType, ScoreDifference } from '@/store/gameStore'
import { PLAYER_THEME_STRATEGIES } from '@/strategies/playerThemeStrategies'
import { Card, CardContent } from '@/components/ui/card'
import { Crown, Skull, CircleDot, Play } from 'lucide-react'
import { motion } from 'framer-motion'

interface GameContext {
	gameMode: GameMode
	gameType: GameType
	gameStatus: 'setup' | 'playing' | 'finished'
	eliminationScore: number
	currentRound: number
}

interface PlayerStatus {
	isWinner?: boolean
	isDealer?: boolean
	isPicker?: boolean
	rank: number
	scoreDifference?: ScoreDifference
}

interface PlayerCardProps {
	player: Player
	gameContext: GameContext
	playerStatus: PlayerStatus
}

export default function PlayerCard({ player, gameContext, playerStatus }: PlayerCardProps) {
	const { gameMode, gameStatus, eliminationScore, currentRound } = gameContext
	const { rank, isWinner = false, isDealer = false, isPicker = false, scoreDifference } = playerStatus

	// Use theme strategy to get all colors - eliminates all if-else chains
	const themeStrategy = PLAYER_THEME_STRATEGIES[gameMode]
	const theme = themeStrategy.getTheme(player, eliminationScore, scoreDifference)

	// Calculate score percentage for progress bar display
	const scorePercentage = eliminationScore > 0 ? (player.totalScore / eliminationScore) * 100 : 0

	return (
		<motion.div
			whileTap={{ scale: 0.98 }}
			initial={{ opacity: 0, y: 20 }}
			animate={{ 
				opacity: 1, 
				y: 0,
				scale: [1, 1.01, 1] // Subtle breathing effect
			}}
			transition={{ 
				type: "spring", 
				stiffness: 300, 
				damping: 20,
				scale: {
					duration: 3,
					repeat: Infinity,
					repeatType: "reverse",
					ease: "easeInOut"
				}
			}}
		>
			<Card className={`py-0 ${theme.background} transition-all duration-300 ${isWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''} 
				relative overflow-hidden
				before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent 
				before:translate-x-[-100%] before:animate-pulse`}>
				<CardContent className="p-4 relative z-10">
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
										<div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${theme.pickerBadge}`}>
											<Play className="h-3 w-3" />
											<span>Picker</span>
										</div>
									)}
									{gameStatus !== 'finished' && isDealer && (
										<div className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${theme.dealerBadge}`}>
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
								className={`h-2 rounded-full transition-all duration-500 ${theme.progress}`}
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
		</motion.div>
	)
}
