import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { useGameStore } from '@/store/gameStore'
import GameHistory from '@/components/GameHistory'

// Mock the game store
const mockGameStore = {
	players: [
		{
			id: '1',
			name: 'Player 1',
			scores: [50, 60],
			totalScore: 110,
			isEliminated: true
		},
		{
			id: '2',
			name: 'Player 2',
			scores: [30, 40],
			totalScore: 70,
			isEliminated: false
		}
	],
	gameSettings: {
		gameType: '5-cards' as const,
		gameMode: 'points-based' as const,
		eliminationScore: 100,
		customEliminationScore: 100,
		customMaxRounds: 7,
		customGameMode: 'points-based' as const
	},
	gameStatus: 'playing' as const
}

// Mock the useGameStore hook
vi.mock('@/store/gameStore', () => ({
	useGameStore: vi.fn()
}))

const mockOnBack = vi.fn()

describe('GameHistory - Elimination Display', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should show elimination indicators for points-based games', () => {
		// Setup points-based game (5-cards)
		const pointsBasedStore = {
			...mockGameStore,
			gameSettings: {
				...mockGameStore.gameSettings,
				gameMode: 'points-based' as const
			}
		}

		vi.mocked(useGameStore).mockReturnValue(pointsBasedStore)

		render(<GameHistory onBack={mockOnBack} />)

		// Should show elimination indicator in round history
		expect(screen.getByText('💀 Eliminated')).toBeInTheDocument()

		// Should show "Eliminated" text in final standings
		expect(screen.getByText('Eliminated')).toBeInTheDocument()

		// Verify that elimination styling is applied somewhere in the document for points-based games
		// This is the core functionality - that eliminated players get different styling
		const eliminatedElements = document.querySelectorAll('.bg-muted.text-muted-foreground')
		expect(eliminatedElements.length).toBeGreaterThan(0)
	})

	it('should NOT show elimination indicators for rounds-based games (Secret 7)', () => {
		// Setup rounds-based game (Secret 7)
		const roundsBasedStore = {
			...mockGameStore,
			gameSettings: {
				...mockGameStore.gameSettings,
				gameType: 'secret-7' as const,
				gameMode: 'rounds-based' as const,
				maxRounds: 7
			},
			players: [
				{
					id: '1',
					name: 'Player 1',
					scores: [50, 60],
					totalScore: 110,
					isEliminated: false // In rounds-based, no elimination
				},
				{
					id: '2',
					name: 'Player 2',
					scores: [30, 40],
					totalScore: 70,
					isEliminated: false
				}
			]
		}

		vi.mocked(useGameStore).mockReturnValue(roundsBasedStore)

		render(<GameHistory onBack={mockOnBack} />)

		// Should NOT show elimination indicator
		expect(screen.queryByText('💀 Eliminated')).not.toBeInTheDocument()

		// Should NOT show "Eliminated" text in final standings
		expect(screen.queryByText('Eliminated')).not.toBeInTheDocument()

		// All players should have normal styling (no muted styling for elimination) in final standings
		// Find player elements in final standings (not table headers)
		const player1Elements = screen.getAllByText('Player 1')
		const player2Elements = screen.getAllByText('Player 2')
		
		const player1InStandings = player1Elements.find(el => 
			el.closest('div')?.classList.contains('font-semibold') && 
			!el.closest('th')
		)
		const player2InStandings = player2Elements.find(el => 
			el.closest('div')?.classList.contains('font-semibold') && 
			!el.closest('th')
		)
		
		const player1Row = player1InStandings?.closest('div')?.closest('div')
		const player2Row = player2InStandings?.closest('div')?.closest('div')
		
		expect(player1Row).not.toHaveClass('bg-muted', 'text-muted-foreground')
		expect(player2Row).not.toHaveClass('bg-muted', 'text-muted-foreground')
	})

	it('should show normal score styling for rounds-based games', () => {
		// Setup rounds-based game
		const roundsBasedStore = {
			...mockGameStore,
			gameSettings: {
				...mockGameStore.gameSettings,
				gameMode: 'rounds-based' as const
			},
			players: [
				{
					id: '1',
					name: 'Player 1',
					scores: [50, 60],
					totalScore: 110,
					isEliminated: false
				}
			]
		}

		vi.mocked(useGameStore).mockReturnValue(roundsBasedStore)

		render(<GameHistory onBack={mockOnBack} />)

		// All scores should have normal foreground styling
		const scoreElements = screen.getAllByText(/^\+\d+$/)
		scoreElements.forEach(element => {
			expect(element).toHaveClass('text-foreground')
			expect(element).not.toHaveClass('text-muted-foreground')
		})
	})

	it('should apply muted styling to eliminated players only in points-based games', () => {
		// Test points-based game with eliminated player
		const pointsBasedStore = {
			...mockGameStore,
			gameSettings: {
				...mockGameStore.gameSettings,
				gameMode: 'points-based' as const
			}
		}

		vi.mocked(useGameStore).mockReturnValue(pointsBasedStore)

		render(<GameHistory onBack={mockOnBack} />)

		// Find score elements for eliminated player (Player 1 with totalScore 110 > eliminationScore 100)
		const eliminatedScores = screen.getAllByText('+50').concat(screen.getAllByText('+60'))
		
		// At least one score should have muted styling (for the eliminated player)
		const hasMutedScore = eliminatedScores.some(element => 
			element.classList.contains('text-muted-foreground')
		)
		expect(hasMutedScore).toBe(true)
	})
})
