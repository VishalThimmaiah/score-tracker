'use client'

import React from 'react'
import { useGameStore, type Player } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from './ThemeToggle'
import { ArrowLeft, Trophy, Users, Target } from 'lucide-react'

interface GameHistoryProps {
	onBack: () => void
}

export default function GameHistory({ onBack }: GameHistoryProps) {
	const { players, gameSettings, gameStatus } = useGameStore()

	// Helper functions and computed values
	const isPointsBasedGame = gameSettings.gameMode === 'points-based'
	const maxRounds = Math.max(...players.map(p => p.scores.length), 0)
	
	const calculateRunningTotal = (scores: number[], upToIndex: number) => 
		scores.slice(0, upToIndex + 1).reduce((sum, score) => sum + score, 0)
	
	const isPlayerEliminated = (runningTotal: number) => 
		isPointsBasedGame && runningTotal >= gameSettings.eliminationScore
	
	const getScoreTextClass = (isEliminated: boolean) => 
		`text-lg font-semibold ${isEliminated && isPointsBasedGame ? 'text-muted-foreground' : 'text-foreground'}`
	
	const getTotalTextClass = (isEliminated: boolean) => 
		`text-xs ${isEliminated && isPointsBasedGame ? 'text-muted-foreground/80' : 'text-muted-foreground'}`
	
	const getPlayerRowClass = (player: Player, index: number) => {
		if (isPointsBasedGame && player.isEliminated) {
			return 'bg-muted text-muted-foreground'
		}
		if (index === 0 && gameStatus === 'finished') {
			return 'bg-yellow-100 text-yellow-900 border border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100 dark:border-yellow-600'
		}
		return 'bg-card border'
	}
	
	const getPlayerBadgeClass = (player: Player, index: number) => {
		const isWinner = index === 0 && gameStatus === 'finished' && !(isPointsBasedGame && player.isEliminated)
		const isEliminated = isPointsBasedGame && player.isEliminated
		
		if (isWinner) return 'bg-yellow-500 text-white dark:bg-yellow-600'
		if (isEliminated) return 'bg-muted-foreground/50 text-background'
		return 'bg-primary text-primary-foreground'
	}
	
	const shouldShowWinnerIcon = (player: Player, index: number) => 
		index === 0 && gameStatus === 'finished' && !(isPointsBasedGame && player.isEliminated)
	
	// Create rounds data for the table
	const rounds = Array.from({ length: maxRounds }, (_, index) => {
		const roundNumber = index + 1
		const roundData = players.map(player => {
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
	const sortedPlayers = players.slice().sort((a, b) => {
		// For points-based games, eliminated players go to bottom
		if (isPointsBasedGame) {
			if (a.isEliminated && !b.isEliminated) return 1
			if (!a.isEliminated && b.isEliminated) return -1
		}
		// Sort by total score (lowest first)
		return a.totalScore - b.totalScore
	})

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black p-4">
			<div className="max-w-4xl mx-auto space-y-4">
				{/* Header */}
				<div className="flex items-center justify-between py-4">
					<Button 
						variant="outline" 
						size="icon"
						onClick={onBack}
						className="h-8 w-8"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div className="flex-1 text-center">
						<h1 className="text-2xl font-bold text-foreground">Game History</h1>
						<p className="text-sm text-muted-foreground">Round-by-round score breakdown</p>
					</div>
					<div className="w-8">
						<ThemeToggle />
					</div>
				</div>

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
								<div className="font-semibold text-foreground">{players.length}</div>
							</div>
							<div>
								<span className="text-muted-foreground flex items-center gap-1">
									<Target className="h-4 w-4" />
									Target Score:
								</span>
								<div className="font-semibold text-foreground">{gameSettings.eliminationScore}</div>
							</div>
							<div>
								<span className="text-muted-foreground">Rounds Played:</span>
								<div className="font-semibold text-foreground">{maxRounds}</div>
							</div>
							<div>
								<span className="text-muted-foreground">Status:</span>
								<div className="font-semibold text-foreground capitalize">
									{gameStatus === 'finished' ? 'Completed' : 'In Progress'}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* History Table */}
				{maxRounds > 0 ? (
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
											{players.map(player => (
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
				) : (
					<Card>
						<CardContent className="p-8 text-center text-muted-foreground">
							<div className="space-y-2">
								<div className="text-4xl">📊</div>
								<p className="text-lg font-medium text-foreground">No rounds played yet</p>
								<p className="text-sm">Start adding scores to see the history here</p>
							</div>
						</CardContent>
					</Card>
				)}

				{/* Player Final Standings */}
				{maxRounds > 0 && (
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
											<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getPlayerBadgeClass(player, index)}`}>
												{shouldShowWinnerIcon(player, index) ? (
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
				)}
			</div>
		</div>
	)
}
