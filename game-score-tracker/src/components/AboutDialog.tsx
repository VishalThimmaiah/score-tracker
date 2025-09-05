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
	Info,
	Smartphone,
	Wifi,
	Save,
	BarChart3,
	Shield,
	Heart
} from 'lucide-react'
import Image from 'next/image'

interface AboutDialogProps {
	isOpen: boolean
	onClose: () => void
}

export default function AboutDialog({ isOpen, onClose }: AboutDialogProps) {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-md bottom-0 top-auto translate-y-0 slide-in-from-bottom-2 data-[state=closed]:slide-out-to-bottom-2 rounded-t-lg rounded-b-none border-t max-h-[85vh] overflow-y-auto">
				<DialogHeader className="text-left">
					<DialogTitle className="flex items-center gap-3">
						<Image src="/logo.png" alt="Deck Master" width={32} height={32} className="w-8 h-8" />
						About Deck Master
					</DialogTitle>
					<DialogDescription>
						Your ultimate card game score tracking companion
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 pb-4">
					{/* App Info */}
					<div className="text-center space-y-2">
						<div className="bg-muted/50 rounded-lg p-4">
							<h3 className="font-semibold text-lg mb-2">Deck Master</h3>
							<p className="text-sm text-muted-foreground mb-3">
								Professional card game score tracker designed for 5 Cards, Secret 7, and custom card game variants.
							</p>
							<div className="text-xs text-muted-foreground">
								Version 1.0.0 • Built with Next.js & TypeScript
							</div>
						</div>
					</div>

					{/* Key Features */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base flex items-center gap-2">
							<Info className="h-4 w-4" />
							Key Features
						</h3>
						
						<div className="grid grid-cols-1 gap-3">
							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Save className="h-4 w-4 text-green-500" />
									<h4 className="font-medium">Auto-Save</h4>
								</div>
								<p className="text-sm text-muted-foreground">
									Games automatically saved when finished. Never lose your progress.
								</p>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<BarChart3 className="h-4 w-4 text-blue-500" />
									<h4 className="font-medium">Game History</h4>
								</div>
								<p className="text-sm text-muted-foreground">
									Track your last 5 completed games with detailed round-by-round breakdowns.
								</p>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Smartphone className="h-4 w-4 text-purple-500" />
									<h4 className="font-medium">Mobile-First</h4>
								</div>
								<p className="text-sm text-muted-foreground">
									Optimized for mobile devices with touch-friendly controls and responsive design.
								</p>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Wifi className="h-4 w-4 text-orange-500" />
									<h4 className="font-medium">Offline Ready</h4>
								</div>
								<p className="text-sm text-muted-foreground">
									Works completely offline. Install as PWA for app-like experience.
								</p>
							</div>

							<div className="bg-muted/50 rounded-lg p-3">
								<div className="flex items-center gap-2 mb-2">
									<Shield className="h-4 w-4 text-red-500" />
									<h4 className="font-medium">Privacy First</h4>
								</div>
								<p className="text-sm text-muted-foreground">
									All data stored locally on your device. No tracking, no ads, no data collection.
								</p>
							</div>
						</div>
					</div>

					{/* Supported Games */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base">Supported Games</h3>
						<div className="bg-muted/50 rounded-lg p-3">
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• <strong>5 Cards</strong> - Classic elimination card game</li>
								<li>• <strong>Secret 7</strong> - Fixed 7-round variant</li>
								<li>• <strong>Custom Games</strong> - Configure your own rules</li>
								<li>• <strong>Any Card Game</strong> - Flexible scoring system</li>
							</ul>
						</div>
					</div>

					{/* Technical Info */}
					<div className="space-y-3">
						<h3 className="font-semibold text-base">Technical Details</h3>
						<div className="bg-muted/50 rounded-lg p-3">
							<ul className="text-sm text-muted-foreground space-y-1">
								<li>• Built with Next.js 15 & React 18</li>
								<li>• TypeScript for type safety</li>
								<li>• Tailwind CSS for styling</li>
								<li>• Progressive Web App (PWA)</li>
								<li>• Local storage for data persistence</li>
								<li>• Responsive design for all devices</li>
							</ul>
						</div>
					</div>

					{/* Made with Love */}
					<div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-lg p-4 text-center">
						<div className="flex items-center justify-center gap-2 mb-2">
							<span className="text-sm">Made with</span>
							<Heart className="h-4 w-4 text-red-500 fill-current" />
							<span className="text-sm">for card game enthusiasts</span>
						</div>
						<p className="text-xs text-muted-foreground">
							Designed to make your card game sessions more enjoyable and organized
						</p>
					</div>

					{/* Installation Tip */}
					<div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
						<h4 className="font-medium mb-2 text-blue-900 dark:text-blue-100">💡 Pro Tip</h4>
						<p className="text-sm text-blue-800 dark:text-blue-200">
							Install Deck Master as a PWA for the best experience! Tap your browser&apos;s menu and select &quot;Add to Home Screen&quot; or &quot;Install App&quot;.
						</p>
					</div>
				</div>

				<div className="flex justify-end pt-4 border-t">
					<Button onClick={onClose} variant="default">
						Close
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}
