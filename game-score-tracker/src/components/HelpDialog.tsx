'use client'

import React from 'react'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { 
	Target, 
	Clock, 
	Settings, 
	Users, 
	Play, 
	Calculator,
	History,
	Trophy,
	Gamepad2,
	Plus,
	GripVertical,
	Menu
} from 'lucide-react'

interface HelpDialogProps {
	isOpen: boolean
	onClose: () => void
}

export default function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 rounded-t-lg rounded-b-none border-t max-h-[85vh] overflow-y-auto">
				<DialogHeader className="text-left">
					<DialogTitle>How to Play</DialogTitle>
					<DialogDescription>
						Complete guide to using Deck Master for card game scoring
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pb-4">
					{/* Game Types */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base flex items-center gap-2">
							<Gamepad2 className="h-4 w-4" />
							Game Types
						</h3>
						
						<div className="space-y-3">
							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Target className="h-4 w-4 text-red-500" />
									<h4 className="font-medium">5 Cards</h4>
								</div>
								<p className="text-sm text-muted-foreground mb-2">
									Points-based elimination game where players are eliminated when they reach 100 points.
								</p>
								<ul className="text-xs text-muted-foreground space-y-1">
									<li>• Players eliminated at 100 points</li>
									<li>• Last player standing wins</li>
									<li>• Dealer and picker rotate each round</li>
								</ul>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Clock className="h-4 w-4 text-blue-500" />
									<h4 className="font-medium">Secret 7</h4>
								</div>
								<p className="text-sm text-muted-foreground mb-2">
									Fixed 7 rounds game where all players stay active throughout.
								</p>
								<ul className="text-xs text-muted-foreground space-y-1">
									<li>• Exactly 7 rounds</li>
									<li>• No player elimination</li>
									<li>• Lowest total score wins</li>
								</ul>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Settings className="h-4 w-4 text-green-500" />
									<h4 className="font-medium">Custom</h4>
								</div>
								<p className="text-sm text-muted-foreground mb-2">
									Configure your own rules - choose between points-based or rounds-based gameplay.
								</p>
								<ul className="text-xs text-muted-foreground space-y-1">
									<li>• Set custom elimination score</li>
									<li>• Choose fixed rounds or elimination</li>
									<li>• Flexible rule configuration</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Getting Started */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base flex items-center gap-2">
							<Play className="h-4 w-4" />
							Getting Started
						</h3>
						
						<div className="space-y-3">
							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Users className="h-4 w-4" />
									<h4 className="font-medium">Adding Players</h4>
								</div>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• Type player name and tap <Plus className="h-3 w-3 inline mx-1" /> or press Enter</li>
									<li>• Need at least 2 players to start</li>
									<li>• Drag <GripVertical className="h-3 w-3 inline mx-1" /> to reorder players</li>
									<li>• First player in list deals first</li>
								</ul>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Target className="h-4 w-4" />
									<h4 className="font-medium">Selecting First Picker</h4>
								</div>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• Choose who picks first in the game</li>
									<li>• Picker rotates automatically each round</li>
									<li>• Dealer is always the player before picker</li>
								</ul>
							</div>
						</div>
					</div>

					{/* During Gameplay */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base flex items-center gap-2">
							<Calculator className="h-4 w-4" />
							During Gameplay
						</h3>
						
						<div className="space-y-3">
							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Calculator className="h-4 w-4" />
									<h4 className="font-medium">Entering Scores</h4>
								</div>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• Tap &quot;Add Round Scores&quot; to enter scores</li>
									<li>• Use floating keypad for quick entry</li>
									<li>• Navigate between players with arrow keys</li>
									<li>• Scores auto-save when submitted</li>
								</ul>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Trophy className="h-4 w-4" />
									<h4 className="font-medium">Player Status</h4>
								</div>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• <span className="bg-rose-600 text-white px-1 rounded text-xs">DEALER</span> - Current dealer (always rose color)</li>
									<li>• <span className="bg-indigo-600 text-white px-1 rounded text-xs">PICKER</span> - Current picker</li>
									<li>• <span className="bg-amber-600 text-white px-1 rounded text-xs">QUIT</span> - Player who withdrew from game</li>
									<li>• Eliminated - Player eliminated by reaching score limit</li>
									<li>• Points-based: Picker badge matches player&apos;s card color</li>
									<li>• Rounds-based: Picker badge is always indigo</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Features */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base flex items-center gap-2">
							<History className="h-4 w-4" />
							Features
						</h3>
						
						<div className="space-y-3">
							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Menu className="h-4 w-4" />
									<h4 className="font-medium">Hamburger Menu</h4>
								</div>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• Access game history and statistics</li>
									<li>• View completed games (last 5 saved)</li>
									<li>• Clear history when needed</li>
									<li>• Get help and app information</li>
								</ul>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<History className="h-4 w-4" />
									<h4 className="font-medium">Auto-Save</h4>
								</div>
								<ul className="text-sm text-muted-foreground space-y-1">
									<li>• Games automatically saved when finished</li>
									<li>• View detailed round-by-round history</li>
									<li>• Statistics track your gaming patterns</li>
									<li>• Works offline - no internet required</li>
								</ul>
							</div>
						</div>
					</div>

					{/* Tips */}
					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
						<h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">💡 Pro Tips</h4>
						<ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
							<li>• Use the floating keypad for faster score entry</li>
							<li>• Install as PWA for app-like experience</li>
						</ul>
					</div>
				</div>

				<div className="flex justify-end pt-4 border-t">
					<Button onClick={onClose} variant="default">
						Got it!
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
