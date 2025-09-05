'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useGameStore } from '@/store/gameStore'
import { motion } from 'framer-motion'
import {
	ArrowDown,
	ArrowUp,
	Calculator,
	GripVertical,
	Plus,
	User
} from 'lucide-react'
import { useState } from 'react'

interface AddPlayerSheetProps {
	isOpen: boolean
	onClose: () => void
}

export default function AddPlayerSheet({ isOpen, onClose }: AddPlayerSheetProps) {
	const [playerName, setPlayerName] = useState('')
	const [useManualPoints, setUseManualPoints] = useState(false)
	const [manualPoints, setManualPoints] = useState('')
	const [insertIndex, setInsertIndex] = useState(0)
	
	const { players, currentRound, addPlayerMidGame } = useGameStore()
	
	// Calculate default points (current round * 25)
	const defaultPoints = Math.max(0, currentRound - 1) * 25

	const handleAddPlayer = () => {
		if (!playerName.trim()) return

		const startingPoints = useManualPoints 
			? parseInt(manualPoints) || 0 
			: defaultPoints

		addPlayerMidGame(playerName.trim(), startingPoints, insertIndex)
		
		// Reset form
		setPlayerName('')
		setManualPoints('')
		setUseManualPoints(false)
		setInsertIndex(0)
		onClose()
	}

	const handleClose = () => {
		// Reset form on close
		setPlayerName('')
		setManualPoints('')
		setUseManualPoints(false)
		setInsertIndex(0)
		onClose()
	}

	const movePlayerUp = () => {
		setInsertIndex(Math.max(0, insertIndex - 1))
	}

	const movePlayerDown = () => {
		setInsertIndex(Math.min(players.length, insertIndex + 1))
	}

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Plus className="h-5 w-5" />
						Add Player Mid-Game
					</DialogTitle>
					<DialogDescription>
						Add a new player to the current game with appropriate starting points
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6">
					{/* Player Name Input */}
					<div className="space-y-2">
						<Label htmlFor="player-name" className="flex items-center gap-2">
							<User className="h-4 w-4" />
							Player Name
						</Label>
						<Input
							id="player-name"
							value={playerName}
							onChange={(e) => setPlayerName(e.target.value)}
							placeholder="Enter player name"
							className="w-full"
						/>
					</div>

					{/* Points Configuration */}
					<div className="space-y-4">
						<Label className="flex items-center gap-2">
							<Calculator className="h-4 w-4" />
							Starting Points
						</Label>
						
						{/* Default Points Option */}
						<label className="flex items-start gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
							<input
								type="radio"
								name="points-method"
								checked={!useManualPoints}
								onChange={() => setUseManualPoints(false)}
								className="w-4 h-4 text-primary mt-1"
							/>
							<div className="flex-1">
								<div className="font-medium text-foreground">Auto-Calculate</div>
								<div className="text-sm text-muted-foreground">
									{defaultPoints} points ({Math.max(0, currentRound - 1)} rounds × 25 points)
								</div>
							</div>
						</label>

						{/* Manual Points Option */}
						<label className="flex items-start gap-3 p-3 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
							<input
								type="radio"
								name="points-method"
								checked={useManualPoints}
								onChange={() => setUseManualPoints(true)}
								className="w-4 h-4 text-primary mt-1"
							/>
							<div className="flex-1 space-y-2">
								<div className="font-medium text-foreground">Manual Entry</div>
								{useManualPoints && (
									<Input
										type="number"
										value={manualPoints}
										onChange={(e) => setManualPoints(e.target.value)}
										placeholder="Enter starting points"
										min="0"
										className="w-full"
									/>
								)}
							</div>
						</label>
					</div>

					{/* Player Position */}
					<div className="space-y-4">
						<Label className="flex items-center gap-2">
							<GripVertical className="h-4 w-4" />
							Player Position
						</Label>
						
						<div className="bg-muted/50 rounded-lg p-4">
							<div className="text-sm text-muted-foreground mb-3">
								Choose where to insert the new player in the rotation:
							</div>
							
							{/* Player List with Insert Position */}
							<div className="space-y-2">
								{players.map((player, index) => (
									<div key={player.id}>
										{/* Insert Position Indicator */}
										{insertIndex === index && (
											<motion.div
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												className="flex items-center gap-2 py-2 px-3 bg-primary/10 border-2 border-dashed border-primary rounded-lg"
											>
												<Plus className="h-4 w-4 text-primary" />
												<span className="text-sm font-medium text-primary">
													{playerName || 'New Player'} will be inserted here
												</span>
											</motion.div>
										)}
										
										{/* Existing Player */}
										<div className="flex items-center gap-2 py-2 px-3 bg-background rounded-lg border">
											<div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs font-medium">
												{index + 1}
											</div>
											<span className="text-sm">{player.name}</span>
											{player.isEliminated && (
												<span className="text-xs text-muted-foreground">(Eliminated)</span>
											)}
										</div>
									</div>
								))}
								
								{/* Insert at End */}
								{insertIndex === players.length && (
									<motion.div
										initial={{ opacity: 0, scale: 0.8 }}
										animate={{ opacity: 1, scale: 1 }}
										className="flex items-center gap-2 py-2 px-3 bg-primary/10 border-2 border-dashed border-primary rounded-lg"
									>
										<Plus className="h-4 w-4 text-primary" />
										<span className="text-sm font-medium text-primary">
											{playerName || 'New Player'} will be inserted here
										</span>
									</motion.div>
								)}
							</div>

							{/* Position Controls */}
							<div className="flex items-center justify-center gap-2 mt-4">
								<Button
									variant="outline"
									size="sm"
									onClick={movePlayerUp}
									disabled={insertIndex === 0}
									className="flex items-center gap-1"
								>
									<ArrowUp className="h-3 w-3" />
									Move Up
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={movePlayerDown}
									disabled={insertIndex === players.length}
									className="flex items-center gap-1"
								>
									<ArrowDown className="h-3 w-3" />
									Move Down
								</Button>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2 pt-4">
						<Button
							variant="outline"
							onClick={handleClose}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							onClick={handleAddPlayer}
							disabled={!playerName.trim()}
							className="flex-1"
						>
							<Plus className="h-4 w-4 mr-2" />
							Add Player
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
