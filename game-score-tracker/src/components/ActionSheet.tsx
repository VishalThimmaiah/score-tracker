'use client'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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
import { Home, RotateCcw, History, X, Eraser } from 'lucide-react'
import { useGameStore } from '@/store/gameStore'
import { useState } from 'react'

interface ActionSheetProps {
	isOpen: boolean
	onClose: () => void
	onShowHistory: () => void
}

export default function ActionSheet({ isOpen, onClose, onShowHistory }: ActionSheetProps) {
	const { pauseGame, resetGame, clearScores } = useGameStore()
	const [showResetDialog, setShowResetDialog] = useState(false)

	const handleReturnHome = () => {
		pauseGame()
		onClose()
	}

	const handleShowHistory = () => {
		onShowHistory()
		onClose()
	}

	const handleResetGame = () => {
		resetGame()
		onClose()
	}

	const handleClearScores = () => {
		clearScores()
		onClose()
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={onClose}>
				<DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 rounded-t-lg rounded-b-none border-t">
					<DialogHeader className="text-left">
						<div className="flex items-center justify-between">
							<DialogTitle>Game Menu</DialogTitle>
							<Button
								variant="ghost"
								size="icon"
								onClick={onClose}
								className="h-6 w-6"
							>
								{/* <X className="h-4 w-4" /> */}
							</Button>
						</div>
						<DialogDescription>
							Choose an action for your current game
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-2 pb-4">
						{/* Return to Home */}
						<Button
							variant="outline"
							className="w-full justify-start h-12 text-left"
							onClick={handleReturnHome}
						>
							<Home className="h-5 w-5 mr-3" />
							<div>
								<div className="font-medium">Return to Home</div>
								<div className="text-sm text-gray-500">Keep current game and go back</div>
							</div>
						</Button>

						{/* Show History */}
						<Button
							variant="outline"
							className="w-full justify-start h-12 text-left"
							onClick={handleShowHistory}
						>
							<History className="h-5 w-5 mr-3" />
							<div>
								<div className="font-medium">View Game History</div>
								<div className="text-sm text-gray-500">See all rounds and scores</div>
							</div>
						</Button>

						{/* Clear Scores */}
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start h-12 text-left text-orange-600 hover:text-orange-700 hover:bg-orange-50"
								>
									<Eraser className="h-5 w-5 mr-3" />
									<div>
										<div className="font-medium">Clear Scores</div>
										<div className="text-sm text-gray-500">Reset scores but keep players</div>
									</div>
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>Clear All Scores?</AlertDialogTitle>
									<AlertDialogDescription>
										Are you sure you want to clear all scores? This will reset all player scores to 0 but keep the players in the game. This action cannot be undone.
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>Cancel</AlertDialogCancel>
									<AlertDialogAction 
										onClick={handleClearScores} 
										className="bg-orange-600 hover:bg-orange-700"
									>
										Clear Scores
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>

						{/* Reset Game */}
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button
									variant="outline"
									className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
								>
									<RotateCcw className="h-5 w-5 mr-3" />
									<div>
										<div className="font-medium">Start New Game</div>
										<div className="text-sm text-gray-500">Reset all scores and players</div>
									</div>
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
									<AlertDialogAction 
										onClick={handleResetGame} 
										className="bg-red-600 hover:bg-red-700"
									>
										Reset Game
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</DialogContent>
			</Dialog>
		</>
	)
}
