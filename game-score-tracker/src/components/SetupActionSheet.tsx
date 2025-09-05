'use client'

import React, { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
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
import { 
	History, 
	Trash2, 
	HelpCircle, 
	Info,
	BarChart3,
	QrCode
} from 'lucide-react'
import HelpDialog from './HelpDialog'
import AboutDialog from './AboutDialog'
import QRCodeWithLogo from './QRCodeWithLogo'

interface SetupActionSheetProps {
	isOpen: boolean
	onClose: () => void
	onViewGameHistory: () => void
}

export default function SetupActionSheet({ isOpen, onClose, onViewGameHistory }: SetupActionSheetProps) {
	const { getGameHistory, clearGameHistory } = useGameStore()
	const gameHistory = getGameHistory()
	const [showHelpDialog, setShowHelpDialog] = useState(false)
	const [showAboutDialog, setShowAboutDialog] = useState(false)

	const handleGameHistoryClick = () => {
		onViewGameHistory()
		onClose()
	}

	const handleClearHistory = () => {
		clearGameHistory()
	}

	const handleHelpClick = () => {
		setShowHelpDialog(true)
		onClose()
	}

	const handleAboutClick = () => {
		setShowAboutDialog(true)
		onClose()
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 rounded-t-lg rounded-b-none border-t max-h-[80vh] overflow-y-auto">
				<DialogHeader className="text-left">
					<DialogTitle>Menu</DialogTitle>
					<DialogDescription>
						Game history, statistics, and help
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-3 pb-4">
					{/* Game History */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm text-muted-foreground px-1">
							<span className="flex items-center gap-2">
								<History className="h-4 w-4" />
								Game History
							</span>
							<span className="font-medium">{gameHistory.length}/5</span>
						</div>
						
						<Button
							variant="outline"
							className="w-full justify-start h-12 text-left"
							onClick={handleGameHistoryClick}
							disabled={gameHistory.length === 0}
						>
							<History className="h-5 w-5 mr-3" />
							<div>
								<div className="font-medium">
									{gameHistory.length === 0 ? 'No games saved yet' : `View ${gameHistory.length} saved games`}
								</div>
								<div className="text-sm text-muted-foreground">Browse completed games</div>
							</div>
						</Button>

						{gameHistory.length > 0 && (
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="outline"
										className="w-full justify-start h-12 text-left text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
									>
										<Trash2 className="h-5 w-5 mr-3" />
										<div>
											<div className="font-medium">Clear History</div>
											<div className="text-sm text-muted-foreground">Delete all saved games</div>
										</div>
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Clear Game History?</AlertDialogTitle>
										<AlertDialogDescription>
											This will permanently delete all {gameHistory.length} saved games. This action cannot be undone.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction 
											onClick={handleClearHistory}
											className="bg-red-600 hover:bg-red-700"
										>
											Clear History
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						)}
					</div>

					{/* Statistics */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
							<BarChart3 className="h-4 w-4" />
							Statistics
						</div>
						
						<div className="bg-muted/50 rounded-lg p-3">
							{gameHistory.length > 0 ? (
								<div className="space-y-2 text-sm">
									<div className="flex justify-between">
										<span className="text-muted-foreground">Total Games:</span>
										<span className="font-medium">{gameHistory.length}</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Most Recent:</span>
										<span className="font-medium">
											{new Date(gameHistory[0]?.completedAt).toLocaleDateString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span className="text-muted-foreground">Game Types:</span>
										<span className="font-medium">
											{Array.from(new Set(gameHistory.map(g => g.gameSettings.gameType))).join(', ')}
										</span>
									</div>
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Play games to see stats here
								</p>
							)}
						</div>
					</div>

					{/* QR Code */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
							<QrCode className="h-4 w-4" />
							Share Game
						</div>
						
						<div className="bg-muted/50 rounded-lg p-4 flex flex-col items-center">
							<QRCodeWithLogo />
							<p className="text-xs text-muted-foreground text-center mt-2">
								Scan to join game
							</p>
						</div>
					</div>

					{/* Help */}
					<Button
						variant="outline"
						className="w-full justify-start h-12 text-left"
						onClick={handleHelpClick}
					>
						<HelpCircle className="h-5 w-5 mr-3" />
						<div>
							<div className="font-medium">How to Play</div>
							<div className="text-sm text-muted-foreground">Game rules and instructions</div>
						</div>
					</Button>

					{/* About */}
					<Button
						variant="outline"
						className="w-full justify-start h-12 text-left"
						onClick={handleAboutClick}
					>
						<Info className="h-5 w-5 mr-3" />
						<div>
							<div className="font-medium">About</div>
							<div className="text-sm text-muted-foreground">App info and features</div>
						</div>
					</Button>
				</div>
			</DialogContent>

			{/* Help Dialog */}
			<HelpDialog 
				isOpen={showHelpDialog} 
				onClose={() => setShowHelpDialog(false)} 
			/>

			{/* About Dialog */}
			<AboutDialog 
				isOpen={showAboutDialog} 
				onClose={() => setShowAboutDialog(false)} 
			/>
		</Dialog>
	)
}
