'use client'

import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Trophy, Users, Target } from 'lucide-react'

interface GameHistoryProps {
	onBack: () => void
}

export default function GameHistory({ onBack }: GameHistoryProps) {
	const { players, gameSettings, gameStatus } = useGameStore()

	// Calculate the maximum number of rounds played
	const maxRounds = Math.max(...players.map(p => p.scores.length), 0)
	
	// Create rounds data for the table
	const rounds = Array.from({ length: maxRounds }, (_, index) => {
		const roundNumber = index + 1
		const roundData = players.map(player => ({
			playerId: player.id,
			playerName: player.name,
			score: player.scores[index] || 0,
			runningTotal: player.scores.slice(0, index + 1).reduce((sum, score) => sum + score, 0),
			isEliminated: player.scores.slice(0, index + 1).reduce((sum, score) => sum + score, 0) >= gameSettings.eliminationScore
		}))
		
		return {
			round: roundNumber,
			players: roundData
		}
	})

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-4xl mx-auto space-y-4">
				{/* Header */}
				<div className="flex items-center gap-4 py-4">
					<Button 
						variant="outline" 
						size="icon"
						onClick={onBack}
						className="shrink-0"
					>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-2xl font-bold text-gray-900">Game History</h1>
						<p className="text-gray-600">Round-by-round score breakdown</p>
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
								<span className="text-gray-600 flex items-center gap-1">
									<Users className="h-4 w-4" />
									Players:
								</span>
								<div className="font-semibold">{players.length}</div>
							</div>
							<div>
								<span className="text-gray-600 flex items-center gap-1">
									<Target className="h-4 w-4" />
									Target Score:
								</span>
								<div className="font-semibold">{gameSettings.eliminationScore}</div>
							</div>
							<div>
								<span className="text-gray-600">Rounds Played:</span>
								<div className="font-semibold">{maxRounds}</div>
							</div>
							<div>
								<span className="text-gray-600">Status:</span>
								<div className="font-semibold capitalize">
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
										<tr className="border-b bg-gray-50">
											<th className="text-left p-3 font-semibold">Round</th>
											{players.map(player => (
												<th key={player.id} className="text-center p-3 font-semibold min-w-24">
													{player.name}
												</th>
											))}
										</tr>
									</thead>
									<tbody>
										{rounds.map(round => (
											<tr key={round.round} className="border-b hover:bg-gray-50">
												<td className="p-3 font-medium">
													Round {round.round}
												</td>
												{round.players.map(playerData => {
													const isEliminated = playerData.isEliminated
													const wasEliminatedThisRound = !rounds[round.round - 2]?.players.find(p => p.playerId === playerData.playerId)?.isEliminated && isEliminated
													
													return (
														<td key={playerData.playerId} className="p-3 text-center">
															<div className="space-y-1">
																{/* Round Score */}
																<div className={`text-lg font-semibold ${
																	isEliminated ? 'text-gray-500' : 'text-gray-900'
																}`}>
																	+{playerData.score}
																</div>
																{/* Running Total */}
																<div className={`text-xs ${
																	isEliminated ? 'text-gray-400' : 'text-gray-600'
																}`}>
																	Total: {playerData.runningTotal}
																</div>
																{/* Elimination Indicator */}
																{wasEliminatedThisRound && (
																	<div className="text-xs text-red-600 font-medium">
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
						<CardContent className="p-8 text-center text-gray-500">
							<div className="space-y-2">
								<div className="text-4xl">📊</div>
								<p className="text-lg font-medium">No rounds played yet</p>
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
								{players
									.slice()
									.sort((a, b) => {
										// Eliminated players go to bottom
										if (a.isEliminated && !b.isEliminated) return 1
										if (!a.isEliminated && b.isEliminated) return -1
										// Sort by total score (lowest first)
										return a.totalScore - b.totalScore
									})
									.map((player, index) => (
										<div 
											key={player.id}
											className={`flex items-center justify-between p-3 rounded-lg ${
												player.isEliminated 
													? 'bg-gray-100 text-gray-600' 
													: index === 0 && gameStatus === 'finished'
														? 'bg-yellow-100 text-yellow-900 border border-yellow-300'
														: 'bg-white border'
											}`}
										>
											<div className="flex items-center gap-3">
												<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
													index === 0 && gameStatus === 'finished' && !player.isEliminated
														? 'bg-yellow-500 text-white'
														: player.isEliminated
															? 'bg-gray-400 text-white'
															: 'bg-blue-500 text-white'
												}`}>
													{index === 0 && gameStatus === 'finished' && !player.isEliminated ? (
														<Trophy className="h-4 w-4" />
													) : (
														index + 1
													)}
												</div>
												<div>
													<div className="font-semibold">{player.name}</div>
													{player.isEliminated && (
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
