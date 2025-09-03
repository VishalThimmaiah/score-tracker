// Main testing framework exports
export { gameFlow, GameFlowBuilder, createTestStore } from './game-flow'

// Mock data utilities
export {
	createMockPlayer,
	mockPlayers,
	createMockGameSettings,
	mockGameScenarios,
	mockScoreRounds,
} from './mock-data'

// Component testing utilities
export {
	renderWithStore,
	renderGameSetup,
	renderGameDashboard,
	gameStateBuilder,
	userInteractions,
	expectGameState,
} from './component-utils'

// Re-export common testing utilities
export { vi, expect, describe, it, beforeEach, afterEach } from 'vitest'
export { screen, waitFor, fireEvent } from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
