'use client'

import { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Delete, X, Check } from 'lucide-react'

interface FloatingKeypadProps {
	isVisible: boolean
	position: { x: number; y: number }
	currentValue: string
	playerName?: string
	onNumberPress: (digit: string) => void
	onBackspace: () => void
	onClear: () => void
	onConfirm: () => void
	onCancel: () => void
	onMultiply: () => void
}

export const FloatingKeypad = memo(function FloatingKeypad({
	isVisible,
	position,
	currentValue,
	playerName,
	onNumberPress,
	onBackspace,
	onClear,
	onConfirm,
	onCancel,
	onMultiply
}: FloatingKeypadProps) {
	const keypadButtons = [
		['7', '8', '9'],
		['4', '5', '6'],
		['1', '2', '3']
	]

	// Optimize number press handler to prevent recreation on every render
	const handleNumberPress = useCallback((digit: string) => {
		onNumberPress(digit)
	}, [onNumberPress])

	if (!isVisible) return null

	return (
		<div
			className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200"
			style={{
				left: position.x,
				top: position.y
			}}
		>
			<Card className="w-56 shadow-lg border-2 bg-card">
				<CardContent className="p-4">
					{/* Header */}
					<div className="flex items-center justify-between mb-3">
						<div className="text-sm font-medium text-muted-foreground truncate">
							{playerName ? `${playerName}` : 'Enter Score'}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={onCancel}
							className="h-6 w-6 p-0 hover:bg-muted"
						>
							<X className="h-3 w-3" />
						</Button>
					</div>

					{/* Display */}
					<div className="mb-4 p-3 bg-muted rounded border text-center">
						<div className="text-xl font-mono font-semibold text-foreground min-h-[32px]">
							{currentValue || '--'}
						</div>
					</div>

					{/* Number Grid - 4x3 Grid Layout */}
					<div className="grid grid-cols-3 gap-2 mb-4">
						{/* First 3 rows of numbers */}
						{keypadButtons.map((row) => 
							row.map((digit) => (
								<Button
									key={digit}
									variant="outline"
									size="sm"
									onClick={() => handleNumberPress(digit)}
									className="h-11 w-11 p-0 text-base font-semibold hover:bg-muted/50 hover:border-border/80 active:bg-muted transition-colors duration-75"
								>
									{digit}
								</Button>
							))
						)}
						
						{/* Bottom row: Backspace, 0, x2 */}
						<Button
							variant="outline"
							size="sm"
							onClick={onBackspace}
							className="h-11 w-11 p-0 hover:bg-red-50 hover:border-red-300 active:bg-red-100 dark:hover:bg-red-900/20 dark:hover:border-red-600 dark:active:bg-red-900/40 transition-colors duration-75"
							disabled={!currentValue}
						>
							<Delete className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleNumberPress('0')}
							className="h-11 w-11 p-0 text-base font-semibold hover:bg-muted/50 hover:border-border/80 active:bg-muted transition-colors duration-75"
						>
							0
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onMultiply}
							className="h-11 w-11 p-0 text-sm font-semibold hover:bg-green-50 hover:border-green-300 active:bg-green-100 dark:hover:bg-green-900/20 dark:hover:border-green-600 dark:active:bg-green-900/40 transition-colors duration-75"
							disabled={!currentValue || currentValue === '0'}
						>
							×2
						</Button>
					</div>

					{/* Action Buttons */}
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onClear}
							className="flex-1 h-9 text-xs hover:bg-muted/50 active:bg-muted transition-colors duration-75"
							disabled={!currentValue}
						>
							Clear
						</Button>
						<Button
							size="sm"
							onClick={onConfirm}
							className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/80 transition-colors duration-75"
							disabled={currentValue === ''}
						>
							<Check className="h-3 w-3" />
						</Button>
					</div>

				</CardContent>
			</Card>
		</div>
	)
})
