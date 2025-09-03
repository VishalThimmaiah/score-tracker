'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
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
import ScoreEntrySheet from './ScoreEntrySheet'
import ActionSheet from './ActionSheet'
import WinnerCelebration from './WinnerCelebration'
import AnimatedGrid from './ui/animated-grid'
import AmbientParticles from './ui/ambient-particles'
import RippleEffect from './ui/ripple-effect'
import { ThemeToggle } from './ThemeToggle'
import { Plus, RotateCcw, Trophy, History, Menu, CircleDot, Play } from 'lucide-react'

interface GameDashboardProps {
	onShowHistory: () => void
}

export default function GameDashboard({ onShowHistory }: GameDashboardProps) {
	const [showScoreEntry, setShowScoreEntry] = useState(false)
	const [showActionSheet, setShowActionSheet] = useState(false)
	const [showWinnerCelebration, setShowWinnerCelebration] = useState(false)
	
	const { 
		players, 
		gameSettings, 
		gameStatus, 
		currentRound,
		getSortedPlayers, 
		getWinners,
		getCurrentPicker,
		getCurrentDealer,
		getScoreDifferences,
		resetGame 
	} = useGameStore()

	const sortedPlayers = getSortedPlayers()
	const winners = getWinners()
	const activePlayers = players.filter(p => !p.isEliminated)
	const currentPicker = getCurrentPicker()
	const currentDealer = getCurrentDealer()
	const scoreDifferences = getScoreDifferences()

	// Trigger winner celebration when game finishes
	useEffect(() => {
		if (gameStatus === 'finished' && winners.length > 0) {
			// Small delay to let the UI update first
			setTimeout(() => {
				setShowWinnerCelebration(true)
			}, 500)
		} else {
			setShowWinnerCelebration(false)
		}
	}, [gameStatus, winners.length])


	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black p-4 relative">
			{/* Atmospheric Background */}
			<AnimatedGrid 
				opacity={0.15}
				color="#6366f1"
				spacing={50}
				dotSize={1.5}
			/>
			<AmbientParticles 
				particleCount={15}
				speed={0.3}
				opacity={0.2}
				color="#8b5cf6"
			/>
			
			<div className="max-w-md mx-auto space-y-4 relative z-10">
				{/* Header */}
				<div className="flex items-center justify-between py-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setShowActionSheet(true)}
						className="h-8 w-8"
					>
						<Menu className="h-5 w-5" />
					</Button>
					<div className="flex-1 text-center">
						<div className="flex items-center justify-center gap-2 mb-1">
							<Image src="/logo.png" alt="Deck Master" width={32} height={32} className="w-8 h-8" />
							<h1 className="text-2xl font-bold text-foreground">Deck Master</h1>

						</div>
						{gameStatus !== 'finished' && (
							<div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
								<span className="flex items-center gap-1">
									<CircleDot className="h-4 w-4" />
									Dealer: {currentDealer?.name || 'None'}
								</span>
								<span>|</span>
								<span className="flex items-center gap-1">
									<Play className="h-4 w-4" />
									Picker: {currentPicker?.name || 'None'}
								</span>
								<span>|</span>
								<span>Round: {currentRound}</span>
							</div>
						)}
					</div>
					<div className="w-8">
						<ThemeToggle />
					</div>
				</div>

				{/* Game Status */}
				{gameStatus === 'finished' && winners.length > 0 && (
					<Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
						<CardContent className="p-4 text-center">
							<div className="flex items-center justify-center gap-2 text-yellow-800 mb-2">
								<Trophy className="h-6 w-6" />
								<span className="text-lg font-bold">Game Over!</span>
							</div>
							{winners.length === 1 ? (
								<p className="text-yellow-700">
									🎉 <strong>{winners[0].name}</strong> wins with {winners[0].totalScore} points!
								</p>
							) : (
								<div className="text-yellow-700">
									<p className="mb-2">🎉 <strong>It&apos;s a tie!</strong></p>
									<p>
										Winners: <strong>{winners.map(w => w.name).join(', ')}</strong> with {winners[0].totalScore} points each!
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* Action Buttons */}
				<div className="flex gap-2">
					{gameStatus === 'playing' && (
						<motion.div 
							className="flex-1"
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<RippleEffect
								onClick={() => setShowScoreEntry(true)}
								className="w-full rounded-md"
								color="rgba(255, 255, 255, 0.3)"
								duration={500}
							>
								<Button 
									className="w-full h-12 text-lg font-semibold pointer-events-none"
									size="lg"
								>
									<motion.div
										animate={{ rotate: [0, 15, -15, 0] }}
										transition={{ 
											duration: 2,
											repeat: Infinity,
											repeatType: "reverse",
											ease: "easeInOut"
										}}
									>
										<Plus className="h-5 w-5 mr-2" />
									</motion.div>
									Add Round Scores
								</Button>
							</RippleEffect>
						</motion.div>
					)}
					
					<motion.div
						whileTap={{ scale: 0.95 }}
					>
						<Button 
							variant="outline"
							onClick={onShowHistory}
							className="h-12 px-4"
						>
							<History className="h-5 w-5" />
						</Button>
					</motion.div>
					
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<motion.div
								whileTap={{ scale: 0.95 }}
							>
								<Button 
									variant="outline"
									className="h-12 px-4"
								>
									<RotateCcw className="h-5 w-5" />
								</Button>
							</motion.div>
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
				<motion.div 
					className="space-y-3"
					initial="hidden"
					animate="visible"
					variants={{
						hidden: { opacity: 0 },
						visible: {
							opacity: 1,
							transition: {
								staggerChildren: 0.1
							}
						}
					}}
				>
					{sortedPlayers.map((player, index) => {
						const scoreDiff = scoreDifferences.find(sd => sd.playerId === player.id)
						return (
							<motion.div
								key={player.id}
								variants={{
									hidden: { opacity: 0, y: 20 },
									visible: { 
										opacity: 1, 
										y: 0,
										transition: {
											type: "spring",
											stiffness: 300,
											damping: 24
										}
									}
								}}
							>
								<PlayerCard
									player={player}
									rank={index + 1}
									eliminationScore={gameSettings.eliminationScore}
									gameMode={gameSettings.gameMode}
									gameStatus={gameStatus}
									gameType={gameSettings.gameType}
									currentRound={currentRound}
									isWinner={gameStatus === 'finished' && winners.some(w => w.id === player.id)}
									isPicker={player.id === currentPicker?.id}
									isDealer={player.id === currentDealer?.id}
									scoreDifference={scoreDiff}
								/>
							</motion.div>
						)
					})}
				</motion.div>

				{/* Game Stats */}
				<Card className="bg-card/50 backdrop-blur-sm">
					<CardHeader className="pb-3">
						<CardTitle className="text-lg text-foreground">Game Statistics</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="text-muted-foreground">Rounds Played:</span>
								<div className="font-semibold text-foreground">{Math.max(0, currentRound - 1)}</div>
							</div>
							{gameSettings.gameMode === 'rounds-based' && (
								<div>
									<span className="text-muted-foreground">Total Rounds:</span>
									<div className="font-semibold text-foreground">
										{gameSettings.gameType === 'secret-7' ? 7 : (gameSettings.maxRounds || 7)}
									</div>
								</div>
							)}
							{gameSettings.gameMode === 'points-based' && (
								<>
									<div>
										<span className="text-muted-foreground">Active Players:</span>
										<div className="font-semibold text-foreground">{activePlayers.length}</div>
									</div>
									<div>
										<span className="text-muted-foreground">Eliminated:</span>
										<div className="font-semibold text-foreground">{players.length - activePlayers.length}</div>
									</div>
								</>
							)}
							<div>
								<span className="text-muted-foreground">Leader:</span>
								<div className="font-semibold text-foreground">
									{gameSettings.gameMode === 'points-based' 
										? (sortedPlayers.find(p => !p.isEliminated)?.name || 'None')
										: (sortedPlayers[0]?.name || 'None')
									}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Instructions */}
				{gameStatus === 'playing' && currentRound === 1 && (
					<div className="text-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
						<p>Tap &quot;Add Round Scores&quot; to enter points for each player.</p>
						{gameSettings.gameMode === 'points-based' && (
							<p>Lower scores are better • Players eliminated at {gameSettings.eliminationScore} points</p>
						)}
						{gameSettings.gameMode === 'rounds-based' && (
							<p>Lower scores are better • Game lasts {gameSettings.gameType === 'secret-7' ? 7 : (gameSettings.maxRounds || 7)} rounds</p>
						)}
					</div>
				)}
			</div>

			{/* Score Entry Sheet */}
			<ScoreEntrySheet 
				isOpen={showScoreEntry}
				onClose={() => setShowScoreEntry(false)}
			/>

			{/* Action Sheet */}
			<ActionSheet
				isOpen={showActionSheet}
				onClose={() => setShowActionSheet(false)}
				onShowHistory={onShowHistory}
			/>

			{/* Winner Celebration */}
			<WinnerCelebration
				winners={winners}
				isVisible={showWinnerCelebration}
				onComplete={() => setShowWinnerCelebration(false)}
			/>
		</div>
	)
}
