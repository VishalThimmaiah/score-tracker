'use client'

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
}

export function FloatingKeypad({
	isVisible,
	position,
	currentValue,
	playerName,
	onNumberPress,
	onBackspace,
	onClear,
	onConfirm,
	onCancel
}: FloatingKeypadProps) {
	if (!isVisible) return null

	const numberButtons = [
		['7', '8', '9'],
		['4', '5', '6'],
		['1', '2', '3'],
		['0']
	]

	return (
		<div
			className="fixed z-50 animate-in fade-in-0 zoom-in-95 duration-200"
			style={{
				left: position.x,
				top: position.y
			}}
		>
			<Card className="w-48 shadow-lg border-2 border-blue-200 bg-white">
				<CardContent className="p-3">
					{/* Header */}
					<div className="flex items-center justify-between mb-3">
						<div className="text-sm font-medium text-gray-700 truncate">
							{playerName ? `${playerName}` : 'Enter Score'}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={onCancel}
							className="h-6 w-6 p-0 hover:bg-gray-100"
						>
							<X className="h-3 w-3" />
						</Button>
					</div>

					{/* Display */}
					<div className="mb-3 p-2 bg-gray-50 rounded border text-center">
						<div className="text-lg font-mono font-semibold text-gray-900 min-h-[28px]">
							{currentValue || '0'}
						</div>
					</div>

					{/* Number Grid */}
					<div className="grid gap-1 mb-3">
						{numberButtons.map((row, rowIndex) => (
							<div key={rowIndex} className="flex gap-1 justify-center">
								{row.map((digit) => (
									<Button
										key={digit}
										variant="outline"
										size="sm"
										onClick={() => onNumberPress(digit)}
										className="h-8 w-8 p-0 text-sm font-medium hover:bg-blue-50 hover:border-blue-300"
									>
										{digit}
									</Button>
								))}
							</div>
						))}
					</div>

					{/* Action Buttons */}
					<div className="flex gap-1">
						<Button
							variant="outline"
							size="sm"
							onClick={onBackspace}
							className="flex-1 h-8 hover:bg-gray-50"
							disabled={!currentValue}
						>
							<Delete className="h-3 w-3" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onClear}
							className="flex-1 h-8 text-xs hover:bg-gray-50"
							disabled={!currentValue}
						>
							Clear
						</Button>
						<Button
							size="sm"
							onClick={onConfirm}
							className="flex-1 h-8 bg-blue-600 hover:bg-blue-700"
							disabled={!currentValue}
						>
							<Check className="h-3 w-3" />
						</Button>
					</div>

					{/* Quick Tips */}
					<div className="mt-2 text-xs text-gray-500 text-center">
						Press Enter to confirm • Esc to cancel
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
