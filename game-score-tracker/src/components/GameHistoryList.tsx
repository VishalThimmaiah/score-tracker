'use client'

import React from 'react'
import { useGameStore } from '@/store/gameStore'
import { Card, CardContent } from '@/components/ui/card'
import { Trophy, Users, Target, Calendar, Clock } from 'lucide-react'

interface GameHistoryListProps {
	onBack: () => void
	onViewGame: (gameId: string) => void
}

export default function GameHistoryList({ onViewGame }: GameHistoryListProps) {
	const { getGameHistory } = useGameStore()
	const gameHistory = getGameHistory()

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	const getGameTypeLabel = (gameType: string) => {
		switch (gameType) {
			case '5-cards': return '5 Cards'
			case 'secret-7': return 'Secret 7'
			case 'custom': return 'Custom'
			default: return gameType
		}
	}

	const getGameModeLabel = (gameMode: string) => {
		switch (gameMode) {
			case 'points-based': return 'Points-based'
			case 'rounds-based': return 'Rounds-based'
			default: return gameMode
		}
	}

	return (
		<div className="space-y-4">
			{/* Games List */}
			{gameHistory.length > 0 ? (
				<div className="space-y-3">
					{gameHistory.map((game, index) => (
						<Card 
							key={game.id} 
							className="cursor-pointer hover:shadow-md transition-shadow"
							onClick={() => onViewGame(game.id)}
						>
							<CardContent className="p-4">
								<div className="flex items-start justify-between mb-3">
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<h3 className="font-semibold text-foreground">
												{getGameTypeLabel(game.gameSettings.gameType)}
											</h3>
											<span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
												{getGameModeLabel(game.gameSettings.gameMode)}
											</span>
										</div>
										<div className="flex items-center gap-1 text-sm text-muted-foreground">
											<Calendar className="h-3 w-3" />
											<span>{formatDate(game.completedAt)}</span>
										</div>
									</div>
									<div className="text-right">
										<div className="text-xs text-muted-foreground mb-1">
											Game #{gameHistory.length - index}
										</div>
										{game.winners.length > 0 && (
											<div className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
												<Trophy className="h-3 w-3" />
												<span className="text-xs font-medium">
													{game.winners.length === 1 
														? game.winners[0].name 
														: `${game.winners.length} tied`
													}
												</span>
											</div>
										)}
									</div>
								</div>

								<div className="grid grid-cols-3 gap-4 text-sm">
									<div className="flex items-center gap-1">
										<Users className="h-3 w-3 text-muted-foreground" />
										<span className="text-muted-foreground">Players:</span>
										<span className="font-medium">{game.players.length}</span>
									</div>
									<div className="flex items-center gap-1">
										<Clock className="h-3 w-3 text-muted-foreground" />
										<span className="text-muted-foreground">Rounds:</span>
										<span className="font-medium">{game.totalRounds}</span>
									</div>
									<div className="flex items-center gap-1">
										<Target className="h-3 w-3 text-muted-foreground" />
										<span className="text-muted-foreground">Target:</span>
										<span className="font-medium">{game.gameSettings.eliminationScore}</span>
									</div>
								</div>

								{/* Player Summary */}
								<div className="mt-3 pt-3 border-t">
									<div className="flex flex-wrap gap-1">
										{game.players
											.sort((a, b) => a.totalScore - b.totalScore)
											.slice(0, 4)
											.map((player, playerIndex) => (
												<span 
													key={player.id}
													className={`text-xs px-2 py-1 rounded-full ${
														game.winners.some(w => w.id === player.id)
															? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
															: playerIndex === 0
																? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
																: 'bg-muted text-muted-foreground'
													}`}
												>
													{player.name}: {player.totalScore}
												</span>
											))
										}
										{game.players.length > 4 && (
											<span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
												+{game.players.length - 4} more
											</span>
										)}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="p-8 text-center text-muted-foreground">
						<div className="space-y-2">
							<div className="text-4xl">📊</div>
							<p className="text-lg font-medium text-foreground">No games saved yet</p>
							<p className="text-sm">
								Complete some games to see them here. Games are automatically saved when finished.
							</p>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Info */}
			{gameHistory.length > 0 && (
				<div className="text-center text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
					<p>Showing {gameHistory.length} of 5 most recent games</p>
					<p>Older games are automatically removed to save space</p>
				</div>
			)}
		</div>
	)
}
