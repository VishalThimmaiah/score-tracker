import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/store/gameStore'

describe('Game End Logic - Single Player Remaining', () => {
	// Helper function to set up a standard game scenario
	const setupStandardGame = (playerNames: string[] = ['Alice', 'Bob', 'Charlie']) => {
		const store = useGameStore.getState()
		// Ensure we start fresh
		store.resetGame()

		// Add players
		playerNames.forEach(name => store.addPlayer(name))

		// Configure game settings for points-based mode
		store.setGameType('5-cards')
		store.setGameMode('points-based')
		store.setEliminationScore(100)

		// Start the game
		store.startGame()

		// Return the fresh state after all operations
		return useGameStore.getState()
	}

	beforeEach(() => {
		// Reset store before each test
		const store = useGameStore.getState()
		store.resetGame()
	})

	it('should end game when only one player remains after manual elimination', () => {
		const store = setupStandardGame()

		// Verify game is playing
		expect(store.gameStatus).toBe('playing')
		expect(store.players.filter(p => !p.isEliminated)).toHaveLength(3)

		// Manually eliminate first player
		const aliceId = store.players[0].id
		store.eliminatePlayerManually(aliceId)

		// Get fresh state after elimination
		const stateAfterFirst = useGameStore.getState()
		expect(stateAfterFirst.gameStatus).toBe('playing')
		expect(stateAfterFirst.players.filter(p => !p.isEliminated)).toHaveLength(2)

		// Manually eliminate second player
		const bobId = stateAfterFirst.players[1].id
		store.eliminatePlayerManually(bobId)

		// Get fresh state after second elimination
		const stateAfterSecond = useGameStore.getState()
		expect(stateAfterSecond.gameStatus).toBe('finished')
		expect(stateAfterSecond.players.filter(p => !p.isEliminated)).toHaveLength(1)

		// The remaining player should be the winner
		const winners = stateAfterSecond.getWinners()
		expect(winners).toHaveLength(1)
		expect(winners[0].name).toBe('Charlie')
	})

	it('should end game when only one player remains after score-based elimination', () => {
		const store = setupStandardGame()

		// Set lower elimination score for this test
		store.setEliminationScore(50)

		// Add scores that eliminate 2 players
		const scores = [
			{ playerId: store.players[0].id, score: 60 }, // Alice eliminated
			{ playerId: store.players[1].id, score: 55 }, // Bob eliminated  
			{ playerId: store.players[2].id, score: 10 }  // Charlie safe
		]
		store.addRoundScores(scores)

		// Get fresh state after adding scores
		const stateAfterScores = useGameStore.getState()
		expect(stateAfterScores.gameStatus).toBe('finished')
		expect(stateAfterScores.players.filter(p => !p.isEliminated)).toHaveLength(1)

		const winners = stateAfterScores.getWinners()
		expect(winners).toHaveLength(1)
		expect(winners[0].name).toBe('Charlie')
	})

	it('should handle mixed elimination scenarios (manual + score-based)', () => {
		const store = setupStandardGame(['Alice', 'Bob', 'Charlie', 'David'])

		// First round - eliminate Alice by score
		const scores = [
			{ playerId: store.players[0].id, score: 120 }, // Alice eliminated by score
			{ playerId: store.players[1].id, score: 30 },
			{ playerId: store.players[2].id, score: 25 },
			{ playerId: store.players[3].id, score: 40 }
		]
		store.addRoundScores(scores)

		// Get fresh state after scores
		const stateAfterScores = useGameStore.getState()
		expect(stateAfterScores.gameStatus).toBe('playing')
		expect(stateAfterScores.players.filter(p => !p.isEliminated)).toHaveLength(3)

		// Manually eliminate Bob
		const bobId = stateAfterScores.players[1].id
		store.eliminatePlayerManually(bobId)

		// Get fresh state after first manual elimination
		const stateAfterFirstManual = useGameStore.getState()
		expect(stateAfterFirstManual.gameStatus).toBe('playing')
		expect(stateAfterFirstManual.players.filter(p => !p.isEliminated)).toHaveLength(2)

		// Manually eliminate Charlie
		const charlieId = stateAfterFirstManual.players[2].id
		store.eliminatePlayerManually(charlieId)

		// Get fresh state after second manual elimination
		const stateAfterSecondManual = useGameStore.getState()
		expect(stateAfterSecondManual.gameStatus).toBe('finished')
		expect(stateAfterSecondManual.players.filter(p => !p.isEliminated)).toHaveLength(1)

		const winners = stateAfterSecondManual.getWinners()
		expect(winners).toHaveLength(1)
		expect(winners[0].name).toBe('David')
	})

	it('should not allow manual elimination in rounds-based games', () => {
		const store = useGameStore.getState()
		store.resetGame()

		// Setup rounds-based game
		store.addPlayer('Alice')
		store.addPlayer('Bob')
		store.setGameType('secret-7') // This sets rounds-based mode
		store.startGame()

		// Get fresh state after setup
		const stateAfterSetup = useGameStore.getState()
		const aliceId = stateAfterSetup.players[0].id

		// Try to manually eliminate - should have no effect
		store.eliminatePlayerManually(aliceId)

		// Get fresh state after elimination attempt
		const stateAfterElimination = useGameStore.getState()
		expect(stateAfterElimination.gameStatus).toBe('playing')
		expect(stateAfterElimination.players.filter(p => !p.isEliminated)).toHaveLength(2)
		expect(stateAfterElimination.players[0].isEliminated).toBe(false)
	})
})
