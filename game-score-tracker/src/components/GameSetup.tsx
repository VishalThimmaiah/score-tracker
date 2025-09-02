'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useGameStore } from '@/store/gameStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2, Users, Target, GripVertical } from 'lucide-react'
import QRCodeWithLogo from './QRCodeWithLogo'
import { ThemeToggle } from './ThemeToggle'
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
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
import {
	useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Player } from '@/store/gameStore'

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
	} = useSortable({ id: player.id })

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`flex items-center justify-between p-3 bg-muted rounded-lg ${
				isDragging ? 'opacity-50' : ''
			}`}
		>
			<div className="flex items-center gap-3">
				<div
					{...attributes}
					{...listeners}
					className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
				>
					<GripVertical className="h-4 w-4" />
				</div>
				<div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
					{index + 1}
				</div>
				<span className="font-medium text-foreground">{player.name}</span>
			</div>
			<Button
				variant="ghost"
				size="icon"
				onClick={onRemove}
				className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
			>
				<Trash2 className="h-4 w-4" />
			</Button>
		</div>
	)
}

export default function GameSetup() {
	const playerNameRef = useRef<HTMLInputElement>(null)
	const eliminationScoreRef = useRef<HTMLInputElement>(null)
	
	const { 
		players, 
		gameSettings,
		addPlayer, 
		removePlayer, 
		setPlayerOrder,
		setEliminationScore, 
		startGame 
	} = useGameStore()

	const sensors = useSensors(
		useSensor(PointerSensor),
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
		if (players.length >= 2) {
			const eliminationScore = eliminationScoreRef.current?.value
			const scoreValue = (eliminationScore ? Number(eliminationScore) : gameSettings.lastEliminationScore) || 100
			
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
		const scoreValue = eliminationScore ? Number(eliminationScore) : gameSettings.lastEliminationScore
		return scoreValue > 0
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

	return (
		<div className="min-h-screen bg-gray-50 dark:bg-black p-4">
			<div className="max-w-md mx-auto space-y-6">
				{/* Header */}
				<div className="flex items-center justify-between py-4">
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

				<div className="text-center">
					<QRCodeWithLogo />
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
								defaultValue={gameSettings.lastEliminationScore}
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
							Players ({players.length})
						</CardTitle>
						<CardDescription>
							Add 2 or more players to start the game. Drag to reorder - first player deals first.
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

						{/* Validation Messages */}
						{players.length < 2 && (
							<p className="text-sm text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-900/20 p-2 rounded">
								Add at least 2 players to start the game
							</p>
						)}
					</CardContent>
				</Card>

				{/* Elimination Score Validation */}
				{!isValidEliminationScore() && (
					<div className="text-sm text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20 p-2 rounded">
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
				<div className="text-center text-sm text-muted-foreground space-y-1">
					<p>Perfect for: 5 Cards, Secret 7, and custom variants</p>
					<p>Lowest score wins • Manual scoring</p>
				</div>
			</div>
		</div>
	)
}
