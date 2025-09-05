'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { 
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core'
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { 
	Plus, 
	Trash2, 
	Users, 
	Target, 
	GripVertical, 
	Play, 
	Gamepad2, 
	Clock, 
	Settings,
	Menu,
	ArrowLeft,
	Home
} from 'lucide-react'

import { useGameStore, Player } from '@/store/gameStore'
import { canStartGame, getValidationError } from '@/utils/gameValidation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ThemeToggle } from './ThemeToggle'
import SetupActionSheet from './SetupActionSheet'
import GameHistoryList from './GameHistoryList'
import CompletedGameDetail from './CompletedGameDetail'

interface SortablePlayerItemProps {
	player: Player
	index: number
	onRemove: () => void
}

function SortablePlayerItem({ player, index, onRemove }: SortablePlayerItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
		isOver,
	} = useSortable({ id: player.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	// Clean class name composition
	const getItemClasses = () => {
		const baseClasses = 'flex items-center justify-between p-3 bg-muted rounded-lg transition-all duration-200'
		const dragClasses = isDragging ? 'opacity-50 scale-105 shadow-lg z-50' : ''
		const overClasses = isOver ? 'ring-2 ring-primary ring-opacity-50' : ''
		
		return [baseClasses, dragClasses, overClasses].filter(Boolean).join(' ')
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={getItemClasses()}
		>
			<div className="flex items-center gap-3 flex-1">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-manipulation p-2 -m-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
					style={{ touchAction: 'none' }}
				>
					<GripVertical className="h-5 w-5" />
				</div>
				<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
					{index + 1}
				</div>
				<span className="font-medium text-foreground flex-1">{player.name}</span>
			</div>
			<Button
				variant="ghost"
				size="icon"
				onClick={onRemove}
				className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 min-w-[44px] min-h-[44px]"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	)
}

export default function GameSetup() {
	const playerNameRef = useRef<HTMLInputElement>(null)
	const eliminationScoreRef = useRef<HTMLInputElement>(null)
	const [selectedPickerId, setSelectedPickerId] = useState<string>('')
	const [showActionSheet, setShowActionSheet] = useState(false)
	const [currentView, setCurrentView] = useState<'setup' | 'history-list' | 'game-detail'>('setup')
	const [selectedGameId, setSelectedGameId] = useState<string>('')
	
	const { 
		players, 
		gameSettings,
		currentPickerIndex,
		addPlayer, 
		removePlayer, 
		setPlayerOrder,
		setCurrentPickerIndex,
		setEliminationScore,
		setGameType,
		setGameMode,
		setMaxRounds,
		startGame 
	} = useGameStore()

	// Initialize selected picker when players change
	useEffect(() => {
		if (players.length > 0) {
			const currentPicker = players[currentPickerIndex]
			if (currentPicker) {
				setSelectedPickerId(currentPicker.id)
			} else if (players.length > 0) {
				// Fallback to first player if currentPickerIndex is invalid
				setSelectedPickerId(players[0].id)
				setCurrentPickerIndex(0)
			}
		}
	}, [players, currentPickerIndex, setCurrentPickerIndex])

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // Require 8px movement before drag starts
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 200, // 200ms delay before drag starts on touch
				tolerance: 5, // Allow 5px of movement during delay
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	const handleAddPlayer = () => {
		const playerName = playerNameRef.current?.value.trim()
		if (playerName) {
			addPlayer(playerName)
			if (playerNameRef.current) {
				playerNameRef.current.value = ''
			}
		}
	}

	const handleStartGame = () => {
		const eliminationScore = eliminationScoreRef.current?.value
		
		// Use guard clause validation - early return if game cannot start
		if (!canStartGame(gameSettings, players.length, eliminationScore)) {
			return
		}
		
		const scoreValue = (eliminationScore ? Number(eliminationScore) : gameSettings.eliminationScore) || 100
		setEliminationScore(scoreValue)
		startGame()
	}

	const handlePickerChange = (playerId: string) => {
		const playerIndex = players.findIndex(p => p.id === playerId)
		if (playerIndex !== -1) {
			setSelectedPickerId(playerId)
			setCurrentPickerIndex(playerIndex)
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter') {
			handleAddPlayer()
		}
	}

	const isValidGameSettings = () => {
		const eliminationScore = eliminationScoreRef.current?.value
		return canStartGame(gameSettings, players.length, eliminationScore)
	}

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event

		if (active.id !== over?.id) {
			const oldIndex = players.findIndex((player) => player.id === active.id)
			const newIndex = players.findIndex((player) => player.id === over?.id)

			const newPlayers = arrayMove(players, oldIndex, newIndex)
			setPlayerOrder(newPlayers)
		}
	}

	// Action sheet handlers
	const handleViewGameHistory = () => {
		setShowActionSheet(false)
		setCurrentView('history-list')
	}

	const handleViewGameDetail = (gameId: string) => {
		setSelectedGameId(gameId)
		setCurrentView('game-detail')
	}

	const handleBackToSetup = () => {
		setCurrentView('setup')
		setSelectedGameId('')
	}

	// Render different views based on currentView state
	if (currentView === 'history-list') {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-black p-4">
				<div className="max-w-md mx-auto space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between py-4">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentView('setup')}
								className="text-muted-foreground hover:text-foreground"
								title="Back to Setup"
							>
								<ArrowLeft className="h-5 w-5" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentView('setup')}
								className="text-muted-foreground hover:text-foreground"
								title="Home"
							>
								<Home className="h-5 w-5" />
							</Button>
						</div>
						<div className="flex-1 text-center">
							<div className="flex items-center justify-center gap-3 mb-1">
								<Image src="/logo.png" alt="Deck Master" width={32} height={32} className="w-8 h-8" />
								<h1 className="text-2xl font-bold text-foreground">Deck Master</h1>
							</div>
							<p className="text-xs text-muted-foreground">Game History</p>
						</div>
						<div className="w-10">
							<ThemeToggle />
						</div>
					</div>

					<GameHistoryList 
						onBack={handleBackToSetup}
						onViewGame={handleViewGameDetail} 
					/>
				</div>
			</div>
		)
	}

	if (currentView === 'game-detail') {
		return (
			<div className="min-h-screen bg-gray-50 dark:bg-black p-4">
				<div className="max-w-md mx-auto space-y-6">
					{/* Header */}
					<div className="flex items-center justify-between py-4">
						<div className="w-10">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => setCurrentView('history-list')}
								className="text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="h-5 w-5" />
							</Button>
						</div>
						<div className="flex-1 text-center">
							<div className="flex items-center justify-center gap-3 mb-1">
								<Image src="/logo.png" alt="Deck Master" width={32} height={32} className="w-8 h-8" />
								<h1 className="text-2xl font-bold text-foreground">Deck Master</h1>
							</div>
							<p className="text-xs text-muted-foreground">Game Details</p>
						</div>
						<div className="w-10">
							<ThemeToggle />
						</div>
					</div>

					<CompletedGameDetail 
						gameId={selectedGameId}
						onBack={() => setCurrentView('history-list')}
					/>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black p-4">
			<div className="max-w-md mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between py-4">
					<div className="w-10">
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setShowActionSheet(true)}
							className="text-muted-foreground hover:text-foreground"
						>
							<Menu className="h-5 w-5" />
						</Button>
					</div>
					<div className="flex-1 text-center">
						<div className="flex items-center justify-center gap-3 mb-1">
							<Image src="/logo.png" alt="Deck Master" width={32} height={32} className="w-8 h-8" />
							<h1 className="text-2xl font-bold text-foreground">Deck Master</h1>
						</div>
						<p className="text-sm text-muted-foreground">Set up your card game session</p>
					</div>
					<div className="w-10">
						<ThemeToggle />
					</div>
				</div>


				{/* Add Players */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Users className="h-5 w-5" />
							Players ({players.length})
						</CardTitle>
						<CardDescription>
							Add 2 or more players to start the game. Drag to reorder - first player deals first.
							<br />
							<span className="text-xs text-muted-foreground/80">
								Press and hold the grip icon to drag
							</span>
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex gap-2">
							<div className="flex-1">
								<Input
									ref={playerNameRef}
									placeholder="Enter player name"
									onKeyPress={handleKeyPress}
								/>
							</div>
							<Button 
								onClick={handleAddPlayer}
								size="icon"
							>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{/* Player List */}
						{players.length > 0 && (
							<DndContext
								sensors={sensors}
								collisionDetection={closestCenter}
								onDragEnd={handleDragEnd}
							>
								<SortableContext items={players.map(p => p.id)} strategy={verticalListSortingStrategy}>
									<div className="space-y-2">
										{players.map((player, index) => (
											<SortablePlayerItem
												key={player.id}
												player={player}
												index={index}
												onRemove={() => removePlayer(player.id)}
											/>
										))}
									</div>
								</SortableContext>
							</DndContext>
						)}

						{/* Game Settings Validation */}
						{!isValidGameSettings() && (
							<div className="text-sm text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 p-2 rounded">
								<p>{getValidationError(gameSettings, players.length, eliminationScoreRef.current?.value)}</p>
							</div>
						)}
					</CardContent>
				</Card>

				{/* Game Type & Settings */}
				{players.length >= 2 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Gamepad2 className="h-5 w-5" />
								Game Type & Settings
							</CardTitle>
							<CardDescription>
								Choose your game variant and configure settings
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Game Type Options */}
							<div className="space-y-3">
								<label className="flex items-start gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
									<input
										type="radio"
										name="gameType"
										value="5-cards"
										checked={gameSettings.gameType === '5-cards'}
										onChange={() => setGameType('5-cards')}
										className="w-4 h-4 text-primary mt-1"
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<Target className="h-4 w-4" />
											<span className="font-medium text-foreground">5 Cards</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Points-based elimination • Fixed at 100 points
										</p>
									</div>
								</label>

								<label className="flex items-start gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
									<input
										type="radio"
										name="gameType"
										value="secret-7"
										checked={gameSettings.gameType === 'secret-7'}
										onChange={() => setGameType('secret-7')}
										className="w-4 h-4 text-primary mt-1"
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<Clock className="h-4 w-4" />
											<span className="font-medium text-foreground">Secret 7</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Fixed 7 rounds • No elimination • Lowest score wins
										</p>
									</div>
								</label>

								<label className="flex items-start gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
									<input
										type="radio"
										name="gameType"
										value="custom"
										checked={gameSettings.gameType === 'custom'}
										onChange={() => setGameType('custom')}
										className="w-4 h-4 text-primary mt-1"
									/>
									<div className="flex-1">
										<div className="flex items-center gap-2 mb-1">
											<Settings className="h-4 w-4" />
											<span className="font-medium text-foreground">Custom</span>
										</div>
										<p className="text-sm text-muted-foreground">
											Choose between points-based or rounds-based rules
										</p>
									</div>
								</label>
							</div>

							{/* Custom Game Mode Selection */}
							{gameSettings.gameType === 'custom' && (
								<div className="space-y-3 pt-2 border-t">
									<Label className="text-sm font-medium">Game Mode</Label>
									<div className="space-y-2">
										<label className="flex items-center gap-3 p-2 bg-background rounded cursor-pointer hover:bg-muted/50 transition-colors">
											<input
												type="radio"
												name="gameMode"
												value="points-based"
												checked={gameSettings.gameMode === 'points-based'}
												onChange={() => setGameMode('points-based')}
												className="w-4 h-4 text-primary"
											/>
											<span className="text-sm">Points-based (with elimination)</span>
										</label>
										<label className="flex items-center gap-3 p-2 bg-background rounded cursor-pointer hover:bg-muted/50 transition-colors">
											<input
												type="radio"
												name="gameMode"
												value="rounds-based"
												checked={gameSettings.gameMode === 'rounds-based'}
												onChange={() => setGameMode('rounds-based')}
												className="w-4 h-4 text-primary"
											/>
											<span className="text-sm">Rounds-based (fixed rounds)</span>
										</label>
									</div>

									{/* Custom Rounds Input */}
									{gameSettings.gameMode === 'rounds-based' && (
										<div>
											<Label htmlFor="max-rounds" className="text-sm">Number of Rounds</Label>
											<Input
												id="max-rounds"
												type="number"
												defaultValue={gameSettings.maxRounds || 7}
												min={1}
												max={20}
												onChange={(e) => setMaxRounds(Number(e.target.value))}
												className="mt-1"
											/>
										</div>
									)}
								</div>
							)}

							{/* Elimination Score - Only show for points-based games and not 5 Cards */}
							{gameSettings.gameMode === 'points-based' && gameSettings.gameType !== '5-cards' && (
								<div className="space-y-3 pt-2 border-t">
									<Label htmlFor="elimination-score" className="text-sm font-medium">Elimination Score</Label>
									<Input
										id="elimination-score"
										ref={eliminationScoreRef}
										type="number"
										defaultValue={gameSettings.eliminationScore}
										min={1}
										step={10}
										className="mt-1"
									/>
									<p className="text-sm text-muted-foreground">
										Players are eliminated when they reach this score (must be greater than 0)
									</p>
								</div>
							)}

							{/* Game Type Info */}
							<div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
								{gameSettings.gameType === '5-cards' && (
									<p>Classic elimination game • Fixed at 100 points elimination</p>
								)}
								{gameSettings.gameType === 'secret-7' && (
									<p>Exactly 7 rounds • All players stay active • Winner has lowest total</p>
								)}
								{gameSettings.gameType === 'custom' && gameSettings.gameMode === 'points-based' && (
									<p>Custom elimination game • Configure elimination score above</p>
								)}
								{gameSettings.gameType === 'custom' && gameSettings.gameMode === 'rounds-based' && (
									<p>Custom fixed rounds • All players stay active • Winner has lowest total</p>
								)}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Picker Selection */}
				{players.length >= 2 && (
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Play className="h-5 w-5" />
								Who Picks First?
							</CardTitle>
							<CardDescription>
								Select the player who will pick first in the game
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-2">
								{players.map((player, index) => (
									<label
										key={player.id}
										className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
									>
										<input
											type="radio"
											name="picker"
											value={player.id}
											checked={selectedPickerId === player.id}
											onChange={() => handlePickerChange(player.id)}
											className="w-4 h-4 text-primary"
										/>
										<div className="flex items-center gap-3">
											<div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
												selectedPickerId === player.id 
													? 'bg-indigo-600 dark:bg-indigo-500 text-white' 
													: 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
											}`}>
												{index + 1}
											</div>
											<span className="font-medium text-foreground">{player.name}</span>
										</div>
									</label>
								))}
							</div>
						</CardContent>
					</Card>
				)}

				{/* Start Game Button */}
				<Button 
					onClick={handleStartGame}
					disabled={players.length < 2 || !isValidGameSettings()}
					className="w-full h-12 text-lg font-semibold"
					size="lg"
				>
					Start Game
				</Button>

				{/* Game Info */}
				<div className="text-center text-sm text-muted-foreground space-y-1">
					<p>Perfect for: 5 Cards, Secret 7, and custom variants</p>
					<p>Lowest score wins • Manual scoring</p>
				</div>
			</div>

			{/* Action Sheet */}
			<SetupActionSheet
				isOpen={showActionSheet}
				onClose={() => setShowActionSheet(false)}
				onViewGameHistory={handleViewGameHistory}
			/>
		</div>
	)
}
