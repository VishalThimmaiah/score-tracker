import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'
import { useGameStore } from '@/store/gameStore'

// Mock Next.js Image component
vi.mock('next/image', () => ({
	default: (props: { alt?: string }) => props.alt || 'mocked-image',
}))

// Mock localStorage for Zustand persist
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock,
})

// Reset store and localStorage before each test
beforeEach(() => {
	// Clear localStorage mocks
	localStorageMock.clear.mockClear()
	localStorageMock.getItem.mockClear()
	localStorageMock.setItem.mockClear()
	localStorageMock.removeItem.mockClear()

	// Reset the store to initial state
	useGameStore.setState({
		players: [],
		gameSettings: {
			gameType: '5-cards',
			gameMode: 'points-based',
			eliminationScore: 100,
			customEliminationScore: 100,
			customMaxRounds: 7,
			customGameMode: 'points-based'
		},
		gameStatus: 'setup',
		currentRound: 0,
		currentPickerIndex: 0
	})
})
