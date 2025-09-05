'use client'

import React from 'react'
import { useGameStore } from '@/store/gameStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Trophy, Users, Target, Clock } from 'lucide-react'

interface CompletedGameDetailProps {
	gameId: string
	onBack: () => void
}

export default function CompletedGameDetail({ gameId }: CompletedGameDetailProps) {
	const { getCompletedGameById } = useGameStore()
	const game = getCompletedGameById(gameId)

	if (!game) {
		return (
			<Card>
				<CardContent className="p-8 text-center text-muted-foreground">
					<p>The requested game could not be found.</p>
				</CardContent>
			</Card>
		)
	}

	const getGameModeLabel = (gameMode: string) => {
		switch (gameMode) {
			case 'points-based': return 'Points-based'
			case 'rounds-based': return 'Rounds-based'
			default: return gameMode
		}
	}

	// Helper functions similar to GameHistory component
	const isPointsBasedGame = game.gameSettings.gameMode === 'points-based'
	const maxRounds = game.totalRounds
	
	const calculateRunningTotal = (scores: number[], upToIndex: number) => 
		scores.slice(0, upToIndex + 1).reduce((sum, score) => sum + score, 0)
	
	const isPlayerEliminated = (runningTotal: number) => 
		isPointsBasedGame && runningTotal >= game.gameSettings.eliminationScore
	
	const getScoreTextClass = (isEliminated: boolean) => 
		`text-lg font-semibold ${isEliminated && isPointsBasedGame ? 'text-muted-foreground' : 'text-foreground'}`
	
	const getTotalTextClass = (isEliminated: boolean) => 
		`text-xs ${isEliminated && isPointsBasedGame ? 'text-muted-foreground/80' : 'text-muted-foreground'}`
	
	const getPlayerRowClass = (player: typeof game.players[0], index: number) => {
		if (isPointsBasedGame && player.isEliminated) {
			return 'bg-muted text-muted-foreground'
		}
		if (index === 0 && game.winners.length > 0) {
			return 'bg-yellow-100 text-yellow-900 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-600'
		}
		return 'bg-card border'
	}
	
	const getPlayerBadgeClass = (player: typeof game.players[0]) => {
		const isWinner = game.winners.some(w => w.id === player.id)
		const isEliminated = isPointsBasedGame && player.isEliminated
		
		if (isWinner) return 'bg-yellow-500 text-white dark:bg-yellow-600'
		if (isEliminated) return 'bg-muted-foreground/50 text-background'
		return 'bg-primary text-primary-foreground'
	}
	
	const shouldShowWinnerIcon = (player: typeof game.players[0]) => 
		game.winners.some(w => w.id === player.id) && !(isPointsBasedGame && player.isEliminated)

	// Create rounds data for the table
	const rounds = Array.from({ length: maxRounds }, (_, index) => {
		const roundNumber = index + 1
		const roundData = game.players.map(player => {
			const runningTotal = calculateRunningTotal(player.scores, index)
			return {
				playerId: player.id,
				playerName: player.name,
				score: player.scores[index] || 0,
				runningTotal,
				isEliminated: isPlayerEliminated(runningTotal)
			}
		})
		
		return {
			round: roundNumber,
			players: roundData
		}
	})
	
	// Sort players for final standings
	const sortedPlayers = game.players.slice().sort((a, b) => {
		// For points-based games, eliminated players go to bottom
		if (isPointsBasedGame) {
			if (a.isEliminated && !b.isEliminated) return 1
			if (!a.isEliminated && b.isEliminated) return -1
		}
		// Sort by total score (lowest first)
		return a.totalScore - b.totalScore
	})

	return (
		<div className="space-y-4">
			{/* Game Summary */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Trophy className="h-5 w-5" />
						Game Summary
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
						<div>
							<span className="text-muted-foreground flex items-center gap-1">
								<Users className="h-4 w-4" />
								Players:
							</span>
							<div className="font-semibold text-foreground">{game.players.length}</div>
						</div>
						<div>
							<span className="text-muted-foreground flex items-center gap-1">
								<Target className="h-4 w-4" />
								Target Score:
							</span>
							<div className="font-semibold text-foreground">{game.gameSettings.eliminationScore}</div>
						</div>
						<div>
							<span className="text-muted-foreground flex items-center gap-1">
								<Clock className="h-4 w-4" />
								Rounds:
							</span>
							<div className="font-semibold text-foreground">{game.totalRounds}</div>
						</div>
						<div>
							<span className="text-muted-foreground">Mode:</span>
							<div className="font-semibold text-foreground">
								{getGameModeLabel(game.gameSettings.gameMode)}
							</div>
						</div>
					</div>

					{/* Winners */}
					{game.winners.length > 0 && (
						<div className="mt-4 pt-4 border-t">
							<div className="flex items-center gap-2 mb-2">
								<Trophy className="h-4 w-4 text-yellow-600" />
								<span className="font-medium text-foreground">
									{game.winners.length === 1 ? 'Winner' : 'Winners'}:
								</span>
							</div>
							<div className="flex flex-wrap gap-2">
								{game.winners.map(winner => (
									<span 
										key={winner.id}
										className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full text-sm font-medium"
									>
										{winner.name} ({winner.totalScore} points)
									</span>
								))}
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* History Table */}
			<Card>
				<CardHeader>
					<CardTitle>Round History</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b bg-muted">
									<th className="text-left p-3 font-semibold text-foreground">Round</th>
									{game.players.map(player => (
										<th key={player.id} className="text-center p-3 font-semibold min-w-24 text-foreground">
											{player.name}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{rounds.map(round => (
									<tr key={round.round} className="border-b hover:bg-muted">
										<td className="p-3 font-medium text-foreground">
											Round {round.round}
										</td>
										{round.players.map(playerData => {
											const isEliminated = playerData.isEliminated
											const wasEliminatedThisRound = isPointsBasedGame && 
												!rounds[round.round - 2]?.players.find(p => p.playerId === playerData.playerId)?.isEliminated && 
												isEliminated
											
											return (
												<td key={playerData.playerId} className="p-3 text-center">
													<div className="space-y-1">
														{/* Round Score */}
														<div className={getScoreTextClass(isEliminated)}>
															+{playerData.score}
														</div>
														{/* Running Total */}
														<div className={getTotalTextClass(isEliminated)}>
															Total: {playerData.runningTotal}
														</div>
														{/* Elimination Indicator - Only for points-based games */}
														{isPointsBasedGame && wasEliminatedThisRound && (
															<div className="text-xs text-red-600 dark:text-red-400 font-medium">
																💀 Eliminated
															</div>
														)}
													</div>
												</td>
											)
										})}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</CardContent>
			</Card>

			{/* Player Final Standings */}
			<Card>
				<CardHeader>
					<CardTitle>Final Standings</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{sortedPlayers.map((player, index) => (
							<div 
								key={player.id}
								className={`flex items-center justify-between p-3 rounded-lg ${getPlayerRowClass(player, index)}`}
							>
								<div className="flex items-center gap-3">
									<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPlayerBadgeClass(player)}`}>
										{shouldShowWinnerIcon(player) ? (
											<Trophy className="h-4 w-4" />
										) : (
											index + 1
										)}
									</div>
									<div>
										<div className="font-semibold">{player.name}</div>
										{isPointsBasedGame && player.isEliminated && (
											<div className="text-sm opacity-75">Eliminated</div>
										)}
									</div>
								</div>
								<div className="text-right">
									<div className="text-xl font-bold">{player.totalScore}</div>
									<div className="text-sm opacity-75">
										{player.scores.length} rounds
									</div>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
