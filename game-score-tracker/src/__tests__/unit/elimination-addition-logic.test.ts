import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/store/gameStore'

describe('Unit Tests: Basic Game Store Logic', () => {
	// Helper function to set up a standard game scenario
	const setupStandardGame = () => {
		const store = useGameStore.getState()
		// Ensure we start fresh
		store.resetGame()

		// Add players
		store.addPlayer('Alice')
		store.addPlayer('Bob')
		store.addPlayer('Charlie')
		store.addPlayer('Diana')

		// Configure game settings
		store.setGameType('5-cards')
		store.setGameMode('points-based')
		store.setEliminationScore(100)

		// Start the game
		store.startGame()

		// Return the store for convenience
		return useGameStore.getState() // Get fresh state after all operations
	}

	describe('calculateDealerIndex', () => {
		it('should calculate dealer as player before picker', () => {
			setupStandardGame()
			// Test with picker at index 2
			const dealerIndex = useGameStore.getState().calculateDealerIndex(2)
			expect(dealerIndex).toBe(1) // Player before picker
		})

		it('should wrap around to last player when picker is first', () => {
			setupStandardGame()
			// Test with picker at index 0
			const dealerIndex = useGameStore.getState().calculateDealerIndex(0)
			expect(dealerIndex).toBe(3) // Last player (Diana)
		})

		it('should return 0 when no players exist', () => {
			const store = useGameStore.getState()
			// Should start with empty state from setup.ts
			const dealerIndex = store.calculateDealerIndex(0)
			expect(dealerIndex).toBe(0)
		})
	})

	describe('getCurrentPicker and getCurrentDealer', () => {
		it('should return correct current picker', () => {
			const store = setupStandardGame()
			const picker = store.getCurrentPicker()
			expect(picker).toBeDefined()
			expect(picker?.id).toBe(store.players[store.currentPickerIndex].id)
		})

		it('should return correct current dealer', () => {
			const store = setupStandardGame()
			const dealer = store.getCurrentDealer()
			const expectedDealerIndex = store.calculateDealerIndex(store.currentPickerIndex)

			expect(dealer).toBeDefined()
			expect(dealer?.id).toBe(store.players[expectedDealerIndex].id)
		})

		it('should return active players only', () => {
			const store = setupStandardGame()
			const picker = store.getCurrentPicker()
			const dealer = store.getCurrentDealer()

			expect(picker?.isEliminated).toBe(false)
			expect(dealer?.isEliminated).toBe(false)
		})
	})

	describe('Basic Game State Management', () => {
		it('should start with correct initial state', () => {
			const store = setupStandardGame()
			expect(store.players.length).toBe(4)
			expect(store.gameStatus).toBe('playing')
			expect(store.currentRound).toBe(1)
			expect(store.gameSettings.gameMode).toBe('points-based')
			expect(store.gameSettings.eliminationScore).toBe(100)
		})

		it('should handle player addition during setup', () => {
			const store = useGameStore.getState()
			// Create a fresh store instance for this test
			store.resetGame()

			expect(useGameStore.getState().players.length).toBe(0) // Should be 0 after reset
			store.addPlayer('NewPlayer')

			// Get fresh state after adding player
			const updatedState = useGameStore.getState()
			expect(updatedState.players.length).toBe(1)
			expect(updatedState.players[0].name).toBe('NewPlayer')
		})

		it('should handle player removal during setup', () => {
			const store = useGameStore.getState()
			// Create a fresh store instance for this test
			store.resetGame()
			store.addPlayer('TestPlayer')

			// Get fresh state after adding player
			const stateAfterAdd = useGameStore.getState()
			expect(stateAfterAdd.players.length).toBe(1)
			const playerToRemove = stateAfterAdd.players[0]

			store.removePlayer(playerToRemove.id)

			// Get fresh state after removing player
			const stateAfterRemove = useGameStore.getState()
			expect(stateAfterRemove.players.length).toBe(0)
			expect(stateAfterRemove.getPlayerById(playerToRemove.id)).toBeUndefined()
		})

		it('should handle game settings changes', () => {
			const store = useGameStore.getState()
			// Start fresh for settings test
			store.resetGame()

			// Test elimination score change
			store.setEliminationScore(150)
			const stateAfterScore = useGameStore.getState()
			expect(stateAfterScore.gameSettings.eliminationScore).toBe(150)

			// Test game mode change
			store.setGameMode('rounds-based')
			const stateAfterMode = useGameStore.getState()
			expect(stateAfterMode.gameSettings.gameMode).toBe('rounds-based')

			// Test game type change - this will apply strategy settings
			store.setGameType('secret-7')
			const stateAfterType = useGameStore.getState()
			expect(stateAfterType.gameSettings.gameType).toBe('secret-7')
			// secret-7 strategy preserves elimination score and sets rounds-based mode
			expect(stateAfterType.gameSettings.gameMode).toBe('rounds-based')
			expect(stateAfterType.gameSettings.maxRounds).toBe(7)
		})

		it('should handle round score addition', () => {
			const store = setupStandardGame()
			const initialRound = store.currentRound

			const scores = [
				{ playerId: store.players[0].id, score: 10 },
				{ playerId: store.players[1].id, score: 15 },
				{ playerId: store.players[2].id, score: 20 },
				{ playerId: store.players[3].id, score: 25 }
			]

			store.addRoundScores(scores)

			// Get fresh state after adding scores
			const stateAfterScores = useGameStore.getState()
			expect(stateAfterScores.currentRound).toBe(initialRound + 1)
			expect(stateAfterScores.players[0].totalScore).toBe(10)
			expect(stateAfterScores.players[1].totalScore).toBe(15)
			expect(stateAfterScores.players[2].totalScore).toBe(20)
			expect(stateAfterScores.players[3].totalScore).toBe(25)
		})

		it('should handle game reset', () => {
			const store = setupStandardGame()

			// Add some scores first
			const scores = [
				{ playerId: store.players[0].id, score: 10 },
				{ playerId: store.players[1].id, score: 15 },
				{ playerId: store.players[2].id, score: 20 },
				{ playerId: store.players[3].id, score: 25 }
			]
			store.addRoundScores(scores)

			// Verify scores were added
			const stateAfterScores = useGameStore.getState()
			expect(stateAfterScores.players[0].totalScore).toBe(10)

			// Reset the game
			store.resetGame()

			// Get fresh state after reset
			const stateAfterReset = useGameStore.getState()
			expect(stateAfterReset.players.length).toBe(0)
			expect(stateAfterReset.gameStatus).toBe('setup')
			expect(stateAfterReset.currentRound).toBe(0)
		})

		it('should handle score clearing', () => {
			const store = setupStandardGame()

			// Add some scores first
			const scores = [
				{ playerId: store.players[0].id, score: 10 },
				{ playerId: store.players[1].id, score: 15 },
				{ playerId: store.players[2].id, score: 20 },
				{ playerId: store.players[3].id, score: 25 }
			]
			store.addRoundScores(scores)

			// Verify scores were added
			const stateAfterScores = useGameStore.getState()
			expect(stateAfterScores.players[0].totalScore).toBe(10)

			// Clear scores
			store.clearScores()

			// Get fresh state after clearing scores
			const stateAfterClear = useGameStore.getState()
			expect(stateAfterClear.players[0].totalScore).toBe(0)
			expect(stateAfterClear.players[1].totalScore).toBe(0)
			expect(stateAfterClear.players[2].totalScore).toBe(0)
			expect(stateAfterClear.players[3].totalScore).toBe(0)
			expect(stateAfterClear.currentRound).toBe(0)
			expect(stateAfterClear.gameStatus).toBe('setup')
		})
	})

	describe('Utility Functions', () => {
		it('should get player by ID', () => {
			const store = setupStandardGame()
			const firstPlayer = store.players[0]

			const foundPlayer = store.getPlayerById(firstPlayer.id)
			expect(foundPlayer).toBeDefined()
			expect(foundPlayer?.id).toBe(firstPlayer.id)
			expect(foundPlayer?.name).toBe(firstPlayer.name)
		})

		it('should return undefined for non-existent player ID', () => {
			const store = useGameStore.getState()
			const foundPlayer = store.getPlayerById('non-existent-id')
			expect(foundPlayer).toBeUndefined()
		})

		it('should get sorted players', () => {
			const store = setupStandardGame()

			// Add some scores to create different totals
			const scores = [
				{ playerId: store.players[0].id, score: 30 },
				{ playerId: store.players[1].id, score: 10 },
				{ playerId: store.players[2].id, score: 20 },
				{ playerId: store.players[3].id, score: 40 }
			]
			store.addRoundScores(scores)

			const sortedPlayers = store.getSortedPlayers()

			// Should be sorted by total score (lowest first)
			expect(sortedPlayers[0].totalScore).toBeLessThanOrEqual(sortedPlayers[1].totalScore)
			expect(sortedPlayers[1].totalScore).toBeLessThanOrEqual(sortedPlayers[2].totalScore)
			expect(sortedPlayers[2].totalScore).toBeLessThanOrEqual(sortedPlayers[3].totalScore)
		})

		it('should get score differences', () => {
			const store = setupStandardGame()

			// Add some scores to create differences
			const scores = [
				{ playerId: store.players[0].id, score: 10 }, // Leader
				{ playerId: store.players[1].id, score: 15 },
				{ playerId: store.players[2].id, score: 20 },
				{ playerId: store.players[3].id, score: 25 }
			]
			store.addRoundScores(scores)

			const scoreDifferences = store.getScoreDifferences()

			expect(scoreDifferences.length).toBe(4)

			// Find the leader (player with lowest score)
			const leader = scoreDifferences.find(diff => diff.isLeader)
			expect(leader).toBeDefined()
			expect(leader?.difference).toBe(0)

			// Check that differences are calculated correctly
			const player1Diff = scoreDifferences.find(diff => diff.playerId === store.players[1].id)
			expect(player1Diff?.difference).toBe(5) // 15 - 10 = 5
		})
	})

	describe('Game Mode Validation', () => {
		it('should validate elimination only works in points-based games during play', () => {
			const store = setupStandardGame()

			// Should work in points-based mode during play
			expect(store.gameSettings.gameMode).toBe('points-based')
			expect(store.gameStatus).toBe('playing')

			const targetPlayer = store.players[0]

			store.eliminatePlayerManually(targetPlayer.id)

			// Should have eliminated the player
			expect(store.getPlayerById(targetPlayer.id)?.isEliminated).toBe(true)
		})

		it('should not allow elimination in rounds-based games', () => {
			const store = setupStandardGame()

			// Switch to rounds-based
			store.setGameMode('rounds-based')

			const targetPlayer = store.players[0]
			const initialState = targetPlayer.isEliminated

			store.eliminatePlayerManually(targetPlayer.id)

			// Should not have eliminated the player
			expect(store.getPlayerById(targetPlayer.id)?.isEliminated).toBe(initialState)
		})

		it('should not allow elimination when game is not playing', () => {
			const store = useGameStore.getState()

			// Reset to setup state
			store.resetGame()
			store.addPlayer('Alice')

			// Get fresh state after adding player
			const stateAfterAdd = useGameStore.getState()
			const targetPlayer = stateAfterAdd.players[0]

			store.eliminatePlayerManually(targetPlayer.id)

			// Get fresh state after elimination attempt
			const stateAfterElimination = useGameStore.getState()
			const playerAfterElimination = stateAfterElimination.getPlayerById(targetPlayer.id)

			// Should not have eliminated the player
			expect(playerAfterElimination?.isEliminated).toBe(false)
		})
	})
})
