'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Users, Target } from 'lucide-react'
import QRCodeWithLogo from './QRCodeWithLogo'

export default function GameSetup() {
	const playerNameRef = useRef<HTMLInputElement>(null)
	const eliminationScoreRef = useRef<HTMLInputElement>(null)
	
	const { 
		players, 
		addPlayer, 
		removePlayer, 
		setEliminationScore, 
		startGame 
	} = useGameStore()

	const handleAddPlayer = () => {
		const playerName = playerNameRef.current?.value.trim()
		if (playerName && players.length < 8) {
			addPlayer(playerName)
			if (playerNameRef.current) {
				playerNameRef.current.value = ''
			}
		}
	}

	const handleStartGame = () => {
		if (players.length >= 2) {
			const eliminationScore = eliminationScoreRef.current?.value
			const scoreValue = eliminationScore ? Number(eliminationScore) : 100
			
			// Prevent starting game if elimination score is 0
			if (scoreValue <= 0) {
				return
			}
			
			setEliminationScore(scoreValue)
			startGame()
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddPlayer()
		}
	}

	const isValidEliminationScore = () => {
		const eliminationScore = eliminationScoreRef.current?.value
		const scoreValue = eliminationScore ? Number(eliminationScore) : 100
		return scoreValue > 0
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
			<div className="max-w-md mx-auto space-y-6">
				{/* Header */}
				<div className="text-center py-6">
					<div className="flex items-center justify-center gap-3 mb-2">
						<Image src="/logo.png" alt="Game Score Tracker" width={40} height={40} className="w-10 h-10" />
						<h1 className="text-3xl font-bold text-gray-900">Game Score Tracker</h1>
					</div>
					<p className="text-gray-600">Set up your card game session</p>
					<div className="mt-4">
						<QRCodeWithLogo />
					</div>
				</div>

				{/* Game Settings */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Target className="h-5 w-5" />
							Game Settings
						</CardTitle>
						<CardDescription>
							Configure your game parameters
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label htmlFor="elimination-score">Elimination Score</Label>
							<Input
								id="elimination-score"
								ref={eliminationScoreRef}
								type="number"
								defaultValue={100}
								min={1}
								max={500}
								step={10}
								className="mt-1"
							/>
							<p className="text-sm text-gray-500 mt-1">
								Players are eliminated when they reach this score (must be greater than 0)
							</p>
						</div>
					</CardContent>
				</Card>

				{/* Add Players */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Players ({players.length}/8)
						</CardTitle>
						<CardDescription>
							Add 2-8 players to start the game
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<div className="flex-1">
								<Input
									ref={playerNameRef}
									placeholder="Enter player name"
									onKeyPress={handleKeyPress}
									disabled={players.length >= 8}
								/>
							</div>
							<Button 
								onClick={handleAddPlayer}
								disabled={players.length >= 8}
								size="icon"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{/* Player List */}
						{players.length > 0 && (
							<div className="space-y-2">
								{players.map((player, index) => (
									<div 
										key={player.id}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
												{index + 1}
											</div>
											<span className="font-medium">{player.name}</span>
										</div>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => removePlayer(player.id)}
											className="text-red-500 hover:text-red-700 hover:bg-red-50"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								))}
							</div>
						)}

						{/* Validation Messages */}
						{players.length < 2 && (
							<p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
								Add at least 2 players to start the game
							</p>
						)}
						
						{players.length >= 8 && (
							<p className="text-sm text-blue-600 bg-blue-50 p-2 rounded">
								Maximum of 8 players reached
							</p>
						)}
					</CardContent>
				</Card>

				{/* Elimination Score Validation */}
				{!isValidEliminationScore() && (
					<div className="text-sm text-red-600 bg-red-50 p-2 rounded">
						Elimination score must be greater than 0 to start the game
					</div>
				)}

				{/* Start Game Button */}
				<Button 
					onClick={handleStartGame}
					disabled={players.length < 2 || !isValidEliminationScore()}
					className="w-full h-12 text-lg font-semibold"
					size="lg"
				>
					Start Game
				</Button>

				{/* Game Info */}
				<div className="text-center text-sm text-gray-500 space-y-1">
					<p>Perfect for: 5 Cards, Secret 7, and custom variants</p>
					<p>Lowest score wins • Manual scoring</p>
				</div>
			</div>
		</div>
	)
}
