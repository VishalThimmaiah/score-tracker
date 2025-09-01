'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import PlayerCard from './PlayerCard'
import ScoreEntryModal from './ScoreEntryModal'
import { Plus, RotateCcw, Trophy, History, Users } from 'lucide-react'

interface GameDashboardProps {
	onShowHistory: () => void
}

export default function GameDashboard({ onShowHistory }: GameDashboardProps) {
	const [showScoreEntry, setShowScoreEntry] = useState(false)
	
	const { 
		players, 
		gameSettings, 
		gameStatus, 
		currentRound,
		getSortedPlayers, 
		getWinner,
		resetGame 
	} = useGameStore()

	const sortedPlayers = getSortedPlayers()
	const winner = getWinner()
	const activePlayers = players.filter(p => !p.isEliminated)


	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-md mx-auto space-y-4">
				{/* Header */}
				<div className="text-center py-4">
					<div className="flex items-center justify-center gap-2 mb-1">
						<Image src="/logo.png" alt="Game Score Tracker" width={32} height={32} className="w-8 h-8" />
						<h1 className="text-2xl font-bold text-gray-900">Game Score Tracker</h1>
					</div>
					<div className="flex items-center justify-center gap-4 text-sm text-gray-600">
						<span className="flex items-center gap-1">
							<Users className="h-4 w-4" />
							{activePlayers.length} active
						</span>
						<span>Round {currentRound}</span>
						<span>Target: {gameSettings.eliminationScore}</span>
					</div>
				</div>

				{/* Game Status */}
				{gameStatus === 'finished' && winner && (
					<Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
						<CardContent className="p-4 text-center">
							<div className="flex items-center justify-center gap-2 text-yellow-800 mb-2">
								<Trophy className="h-6 w-6" />
								<span className="text-lg font-bold">Game Over!</span>
							</div>
							<p className="text-yellow-700">
								🎉 <strong>{winner.name}</strong> wins with {winner.totalScore} points!
							</p>
						</CardContent>
					</Card>
				)}

				{/* Action Buttons */}
				<div className="flex gap-2">
					{gameStatus === 'playing' && (
						<Button 
							onClick={() => setShowScoreEntry(true)}
							className="flex-1 h-12 text-lg font-semibold"
							size="lg"
						>
							<Plus className="h-5 w-5 mr-2" />
							Add Round Scores
						</Button>
					)}
					
					<Button 
						variant="outline"
						onClick={onShowHistory}
						className="h-12 px-4"
					>
						<History className="h-5 w-5" />
					</Button>
					
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button 
								variant="outline"
								className="h-12 px-4"
							>
								<RotateCcw className="h-5 w-5" />
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Start New Game?</AlertDialogTitle>
								<AlertDialogDescription>
									Are you sure you want to start a new game? This will reset all scores and cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancel</AlertDialogCancel>
								<AlertDialogAction onClick={resetGame} className="bg-red-600 hover:bg-red-700">
									Reset Game
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>

				{/* Players List */}
				<div className="space-y-3">
					{sortedPlayers.map((player, index) => (
						<PlayerCard
							key={player.id}
							player={player}
							rank={index + 1}
							eliminationScore={gameSettings.eliminationScore}
							isWinner={gameStatus === 'finished' && winner?.id === player.id}
						/>
					))}
				</div>

				{/* Game Stats */}
				<Card className="bg-white/50 backdrop-blur-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg">Game Statistics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-gray-600">Total Rounds:</span>
								<div className="font-semibold">{Math.max(0, currentRound - 1)}</div>
							</div>
							<div>
								<span className="text-gray-600">Active Players:</span>
								<div className="font-semibold">{activePlayers.length}</div>
							</div>
							<div>
								<span className="text-gray-600">Eliminated:</span>
								<div className="font-semibold">{players.length - activePlayers.length}</div>
							</div>
							<div>
								<span className="text-gray-600">Leader:</span>
								<div className="font-semibold">
									{sortedPlayers.find(p => !p.isEliminated)?.name || 'None'}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Instructions */}
				{gameStatus === 'playing' && currentRound === 1 && (
					<div className="text-center text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
						<p>Tap &quot;Add Round Scores&quot; to enter points for each player.</p>
						<p>Lower scores are better • Players eliminated at {gameSettings.eliminationScore} points</p>
					</div>
				)}
			</div>

			{/* Score Entry Modal */}
			{showScoreEntry && (
				<ScoreEntryModal 
					isOpen={showScoreEntry}
					onClose={() => setShowScoreEntry(false)}
				/>
			)}
		</div>
	)
}
