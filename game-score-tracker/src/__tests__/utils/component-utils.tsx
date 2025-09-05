import { render, RenderOptions, screen as testingLibraryScreen } from '@testing-library/react'
import { ReactElement } from 'react'
import { vi, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useGameStore } from '@/store/gameStore'
import { mockPlayers, createMockGameSettings } from './mock-data'
import type { GameState } from '@/store/gameStore'

// Type for screen object from Testing Library
type Screen = typeof testingLibraryScreen

// Custom render function with store provider
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
	initialState?: Partial<GameState>
}

export const renderWithStore = (
	ui: ReactElement,
	options: CustomRenderOptions = {}
) => {
	const { initialState, ...renderOptions } = options

	// Set up initial state if provided
	if (initialState) {
		const store = useGameStore.getState()
		
		// Reset store first
		store.resetGame()
		
		// Apply initial state
		if (initialState.players) {
			initialState.players.forEach(player => {
				store.addPlayer(player.name)
			})
		}
		
		if (initialState.gameSettings) {
			const settings = initialState.gameSettings
			if (settings.gameType) store.setGameType(settings.gameType)
			if (settings.gameMode) store.setGameMode(settings.gameMode)
			if (settings.eliminationScore) store.setEliminationScore(settings.eliminationScore)
			if (settings.maxRounds) store.setMaxRounds(settings.maxRounds)
		}
		
		if (initialState.gameStatus === 'playing') {
			store.startGame()
		}
	}

	return render(ui, renderOptions)
}

// Pre-configured render functions for common scenarios
export const renderGameSetup = (options: CustomRenderOptions = {}) => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const GameSetup = require('@/components/GameSetup').default
	return renderWithStore(<GameSetup />, options)
}

export const renderGameDashboard = (options: CustomRenderOptions = {}) => {
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	const GameDashboard = require('@/components/GameDashboard').default
	const mockShowHistory = vi.fn()
	
	return renderWithStore(
		<GameDashboard onShowHistory={mockShowHistory} />, 
		{
			initialState: {
				gameStatus: 'playing',
				players: mockPlayers(3),
				gameSettings: createMockGameSettings(),
				...options.initialState
			},
			...options
		}
	)
}

// Game state builders for testing
export const gameStateBuilder = {
	// Setup state with players
	withPlayers: (count: number = 3, names?: string[]) => ({
		players: mockPlayers(count, names),
		gameStatus: 'setup' as const,
		currentRound: 0,
		currentPickerIndex: 0,
	}),

	// Playing state
	inProgress: (playerCount: number = 3, round: number = 1) => ({
		players: mockPlayers(playerCount),
		gameStatus: 'playing' as const,
		currentRound: round,
		currentPickerIndex: 0,
		gameSettings: createMockGameSettings(),
	}),

	// Finished state with winner
	finished: (playerCount: number = 3, winnerIndex: number = 0) => {
		const players = mockPlayers(playerCount)
		// Set scores so the winner has the lowest score
		players.forEach((player, index) => {
			const score = index === winnerIndex ? 50 : 100
			player.scores = [score]
			player.totalScore = score
		})
		
		return {
			players,
			gameStatus: 'finished' as const,
			currentRound: 2,
			currentPickerIndex: 0,
			gameSettings: createMockGameSettings(),
		}
	},

	// Points-based game with eliminations
	withEliminations: (playerCount: number = 4) => {
		const players = mockPlayers(playerCount)
		// Eliminate last two players
		players.forEach((player, index) => {
			if (index >= playerCount - 2) {
				player.isEliminated = true
				player.totalScore = 100
				player.scores = [100]
			} else {
				player.totalScore = 50
				player.scores = [50]
			}
		})
		
		return {
			players,
			gameStatus: 'playing' as const,
			currentRound: 2,
			currentPickerIndex: 0,
			gameSettings: createMockGameSettings('5-cards', 'points-based', 100),
		}
	},

	// Rounds-based game
	roundsBased: (playerCount: number = 3, currentRound: number = 1, maxRounds: number = 7) => ({
		players: mockPlayers(playerCount),
		gameStatus: 'playing' as const,
		currentRound,
		currentPickerIndex: 0,
		gameSettings: createMockGameSettings('secret-7', 'rounds-based', 100, maxRounds),
	}),
}

// User interaction helpers
export const userInteractions = {
	// Add a player
	addPlayer: async (name: string, screen: Screen) => {
		const user = userEvent.setup()
		
		const input = screen.getByPlaceholderText(/enter player name/i)
		const addButton = screen.getByRole('button', { name: /add/i })
		
		await user.type(input, name)
		await user.click(addButton)
	},

	// Select game type
	selectGameType: async (gameType: '5-cards' | 'secret-7' | 'custom', screen: Screen) => {
		const user = userEvent.setup()
		
		const gameTypeLabels = {
			'5-cards': /5 cards/i,
			'secret-7': /secret 7/i,
			'custom': /custom/i,
		}
		
		const radio = screen.getByLabelText(gameTypeLabels[gameType])
		await user.click(radio)
	},

	// Start game
	startGame: async (screen: Screen) => {
		const user = userEvent.setup()
		
		const startButton = screen.getByRole('button', { name: /start game/i })
		await user.click(startButton)
	},

	// Add scores
	addRoundScores: async (scores: number[], screen: Screen) => {
		const user = userEvent.setup()
		
		// Open score entry
		const addScoresButton = screen.getByRole('button', { name: /add scores/i })
		await user.click(addScoresButton)
		
		// Enter scores for each player
		const scoreInputs = screen.getAllByRole('spinbutton')
		for (let i = 0; i < scores.length && i < scoreInputs.length; i++) {
			await user.clear(scoreInputs[i])
			await user.type(scoreInputs[i], scores[i].toString())
		}
		
		// Submit scores
		const submitButton = screen.getByRole('button', { name: /save scores/i })
		await user.click(submitButton)
	},
}

// Assertion helpers
export const expectGameState = {
	toHaveStatus: (expectedStatus: 'setup' | 'playing' | 'finished') => {
		const currentStatus = useGameStore.getState().gameStatus
		expect(currentStatus).toBe(expectedStatus)
	},

	toHavePlayerCount: (expectedCount: number) => {
		const playerCount = useGameStore.getState().players.length
		expect(playerCount).toBe(expectedCount)
	},

	toHaveWinner: (playerName: string) => {
		const winners = useGameStore.getState().getWinners()
		const winner = winners.find(w => w.name === playerName)
		expect(winner).toBeDefined()
	},

	toHaveWinners: (playerNames: string[]) => {
		const winners = useGameStore.getState().getWinners()
		const winnerNames = winners.map(w => w.name).sort()
		expect(winnerNames).toEqual(playerNames.sort())
	},

	toHaveRound: (expectedRound: number) => {
		const currentRound = useGameStore.getState().currentRound
		expect(currentRound).toBe(expectedRound)
	},

	toHavePlayerEliminated: (playerName: string) => {
		const player = useGameStore.getState().players.find(p => p.name === playerName)
		expect(player?.isEliminated).toBe(true)
	},

	toHavePlayerActive: (playerName: string) => {
		const player = useGameStore.getState().players.find(p => p.name === playerName)
		expect(player?.isEliminated).toBe(false)
	},
}
