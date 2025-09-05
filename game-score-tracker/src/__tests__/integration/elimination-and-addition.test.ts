import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/store/gameStore'
import type { Player } from '@/store/gameStore'

// Helper to get a fresh store instance
const getStore = () => {
	const store = useGameStore.getState()
	// Clear all state completely
	store.resetGame()
	// Clear players array manually to ensure clean state
	useGameStore.setState({ players: [] })
	return store
}

describe('Integration: Player Elimination and Addition', () => {
	let store: ReturnType<typeof getStore>

	beforeEach(() => {
		// Get fresh store instance
		store = useGameStore.getState()

		// Reset game completely
		store.resetGame()

		// Set up a standard test scenario
		store.addPlayer('Alice')
		store.addPlayer('Bob')
		store.addPlayer('Charlie')
		store.addPlayer('Diana')
		store.setGameType('5-cards')
		store.setGameMode('points-based')
		store.setEliminationScore(100)
		store.startGame()
	})

	describe('Manual Player Elimination', () => {
		it('should eliminate a player manually in points-based game', () => {
			const initialState = useGameStore.getState()
			const targetPlayer = initialState.players[1] // Bob

			// Verify initial state
			expect(targetPlayer.isEliminated).toBe(false)
			expect(initialState.gameStatus).toBe('playing')

			// Eliminate player manually
			store.eliminatePlayerManually(targetPlayer.id)

			// Get fresh state after elimination
			const updatedState = useGameStore.getState()
			const updatedPlayer = updatedState.getPlayerById(targetPlayer.id)
			expect(updatedPlayer?.isEliminated).toBe(true)

			// Game should still be playing (more than 1 active player)
			const activePlayers = updatedState.players.filter(p => !p.isEliminated)
			expect(activePlayers.length).toBe(3)
			expect(updatedState.gameStatus).toBe('playing')
		})

		it('should end game when only one player remains after elimination', () => {
			const initialState = useGameStore.getState()
			const players = initialState.players

			// Eliminate all but one player
			store.eliminatePlayerManually(players[1].id) // Bob
			store.eliminatePlayerManually(players[2].id) // Charlie
			store.eliminatePlayerManually(players[3].id) // Diana

			// Get fresh state after eliminations
			const finalState = useGameStore.getState()

			// Game should end
			expect(finalState.gameStatus).toBe('finished')

			// Only Alice should remain active
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			expect(activePlayers.length).toBe(1)
			expect(activePlayers[0].name).toBe('Alice')
		})

		it('should adjust picker index when current picker is eliminated', () => {
			const initialState = useGameStore.getState()
			const initialPickerIndex = initialState.currentPickerIndex
			const currentPicker = initialState.players[initialPickerIndex]

			// Eliminate the current picker
			store.eliminatePlayerManually(currentPicker.id)

			// Get fresh state after elimination
			const updatedState = useGameStore.getState()

			// Picker index should have moved to next active player
			const newPicker = updatedState.getCurrentPicker()
			expect(newPicker?.id).not.toBe(currentPicker.id)
			expect(newPicker?.isEliminated).toBe(false)
		})

		it('should not allow elimination in rounds-based games', () => {
			// Switch to rounds-based
			store.setGameMode('rounds-based')

			const currentState = useGameStore.getState()
			const targetPlayer = currentState.players[0]
			const initialEliminationState = targetPlayer.isEliminated

			// Attempt elimination
			store.eliminatePlayerManually(targetPlayer.id)

			// Get fresh state after elimination attempt
			const updatedState = useGameStore.getState()
			const updatedPlayer = updatedState.getPlayerById(targetPlayer.id)
			expect(updatedPlayer?.isEliminated).toBe(initialEliminationState)
		})

		it('should not allow elimination when game is not playing', () => {
			// Reset to setup state
			store.resetGame()
			store.addPlayer('Alice')

			const currentState = useGameStore.getState()
			const targetPlayer = currentState.players[0]

			// Attempt elimination in setup state
			store.eliminatePlayerManually(targetPlayer.id)

			// Get fresh state after elimination attempt
			const updatedState = useGameStore.getState()
			const updatedPlayer = updatedState.getPlayerById(targetPlayer.id)
			expect(updatedPlayer?.isEliminated).toBe(false)
		})
	})

	describe('Mid-Game Player Addition', () => {
		it('should add a player mid-game with correct starting points', () => {
			const currentState = useGameStore.getState()
			const initialPlayerCount = currentState.players.length
			const currentRound = currentState.currentRound
			const expectedPoints = Math.max(0, currentRound - 1) * 25

			// Add player mid-game
			store.addPlayerMidGame('Eve', expectedPoints, 2)

			// Get fresh state after addition
			const updatedState = useGameStore.getState()

			// Verify addition
			expect(updatedState.players.length).toBe(initialPlayerCount + 1)

			const newPlayer = updatedState.players[2] // Inserted at index 2
			expect(newPlayer.name).toBe('Eve')
			expect(newPlayer.totalScore).toBe(expectedPoints)
			expect(newPlayer.isEliminated).toBe(false)
		})

		it('should insert player at correct position in rotation', () => {
			const currentState = useGameStore.getState()
			const originalPlayers = [...currentState.players]

			// Add player at index 1
			store.addPlayerMidGame('Eve', 50, 1)

			// Get fresh state after addition
			const updatedState = useGameStore.getState()

			// Verify order
			expect(updatedState.players[0].name).toBe(originalPlayers[0].name) // Alice
			expect(updatedState.players[1].name).toBe('Eve') // New player
			expect(updatedState.players[2].name).toBe(originalPlayers[1].name) // Bob (shifted)
			expect(updatedState.players[3].name).toBe(originalPlayers[2].name) // Charlie (shifted)
			expect(updatedState.players[4].name).toBe(originalPlayers[3].name) // Diana (shifted)
		})

		it('should adjust picker index when insertion affects current picker', () => {
			const currentState = useGameStore.getState()
			const initialPickerIndex = currentState.currentPickerIndex

			// Insert player before current picker
			if (initialPickerIndex > 0) {
				store.addPlayerMidGame('Eve', 50, initialPickerIndex - 1)

				// Get fresh state after addition
				const updatedState = useGameStore.getState()
				// Picker index should be adjusted
				expect(updatedState.currentPickerIndex).toBe(initialPickerIndex + 1)
			} else {
				// Insert at beginning
				store.addPlayerMidGame('Eve', 50, 0)

				// Get fresh state after addition
				const updatedState = useGameStore.getState()
				// Picker index should be adjusted
				expect(updatedState.currentPickerIndex).toBe(initialPickerIndex + 1)
			}
		})

		it('should create appropriate score history for new player', () => {
			// Get fresh state for player IDs
			const currentState = useGameStore.getState()

			// Simulate some rounds have been played
			const scores1 = [
				{ playerId: currentState.players[0].id, score: 10 },
				{ playerId: currentState.players[1].id, score: 15 },
				{ playerId: currentState.players[2].id, score: 20 },
				{ playerId: currentState.players[3].id, score: 25 }
			]
			store.addRoundScores(scores1)

			const scores2 = [
				{ playerId: currentState.players[0].id, score: 5 },
				{ playerId: currentState.players[1].id, score: 10 },
				{ playerId: currentState.players[2].id, score: 15 },
				{ playerId: currentState.players[3].id, score: 20 }
			]
			store.addRoundScores(scores2)

			// Get fresh state for current round
			const stateAfterRounds = useGameStore.getState()
			const currentRound = stateAfterRounds.currentRound
			const completedRounds = currentRound - 1

			store.addPlayerMidGame('Eve', 75, 2)

			// Get fresh state after adding player
			const finalState = useGameStore.getState()
			const newPlayer = finalState.players[2]

			// Should have score entries for completed rounds (filled with 0)
			expect(newPlayer.scores.length).toBe(completedRounds)
			expect(newPlayer.scores.every(score => score === 0)).toBe(true)
			expect(newPlayer.totalScore).toBe(75) // Starting points
		})

		it('should not allow adding players in rounds-based games', () => {
			// Switch to rounds-based
			store.setGameMode('rounds-based')

			const initialPlayerCount = store.players.length

			// Attempt to add player
			store.addPlayerMidGame('Eve', 50, 2)

			// Should not have changed
			expect(store.players.length).toBe(initialPlayerCount)
		})

		it('should not allow adding players when game is not playing', () => {
			// Reset to setup state
			store.resetGame()
			store.addPlayer('Alice')

			const initialPlayerCount = store.players.length

			// Attempt to add player in setup state
			store.addPlayerMidGame('Eve', 50, 0)

			// Should not have changed
			expect(store.players.length).toBe(initialPlayerCount)
		})
	})

	describe('Combined Elimination and Addition Scenarios', () => {
		it('should handle elimination followed by addition', () => {
			const initialState = useGameStore.getState()
			const initialCount = initialState.players.length

			// Eliminate a player
			store.eliminatePlayerManually(initialState.players[1].id)

			// Add a new player
			store.addPlayerMidGame('Eve', 50, 1)

			// Get fresh state after operations
			const finalState = useGameStore.getState()

			// Total count should be one more (eliminated player stays in array, new player added)
			expect(finalState.players.length).toBe(initialCount + 1)

			// But active players should be same as initial (one eliminated, one added)
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			expect(activePlayers.length).toBe(initialCount)

			// New player should be active
			const newPlayer = finalState.players.find(p => p.name === 'Eve')
			expect(newPlayer?.isEliminated).toBe(false)

			// Eliminated player should still be in the array but marked as eliminated
			const eliminatedPlayer = finalState.getPlayerById(initialState.players[1].id)
			expect(eliminatedPlayer?.isEliminated).toBe(true)
		})

		it('should maintain game state consistency through multiple operations', () => {
			// Get initial state for player IDs
			const initialState = useGameStore.getState()

			// Perform multiple operations
			store.eliminatePlayerManually(initialState.players[3].id) // Eliminate Diana
			store.addPlayerMidGame('Eve', 25, 2) // Add Eve

			// Get fresh state after first operations
			const midState = useGameStore.getState()
			store.eliminatePlayerManually(midState.players[1].id) // Eliminate Bob
			store.addPlayerMidGame('Frank', 75, 0) // Add Frank at beginning

			// Get final state
			const finalState = useGameStore.getState()

			// Verify final state
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			expect(activePlayers.length).toBe(4) // Started with 4, eliminated 2, added 2

			// Game should still be playing
			expect(finalState.gameStatus).toBe('playing')

			// Picker should be valid
			const currentPicker = finalState.getCurrentPicker()
			expect(currentPicker?.isEliminated).toBe(false)
		})

		it('should handle picker rotation correctly after eliminations and additions', () => {
			const initialState = useGameStore.getState()
			const originalPickerIndex = initialState.currentPickerIndex

			// Add player before current picker
			store.addPlayerMidGame('Eve', 50, originalPickerIndex)

			// Get fresh state after addition
			const stateAfterAddition = useGameStore.getState()

			// Current picker should have shifted
			expect(stateAfterAddition.currentPickerIndex).toBe(originalPickerIndex + 1)

			// Eliminate the new player
			const newPlayer = stateAfterAddition.players[originalPickerIndex]
			store.eliminatePlayerManually(newPlayer.id)

			// Get final state
			const finalState = useGameStore.getState()

			// Picker should still be valid and not eliminated
			const currentPicker = finalState.getCurrentPicker()
			expect(currentPicker?.isEliminated).toBe(false)
		})
	})

	describe('Edge Cases', () => {
		it('should handle elimination when only two players remain', () => {
			// Get initial state for player IDs
			const initialState = useGameStore.getState()

			// Eliminate two players to leave only two
			store.eliminatePlayerManually(initialState.players[2].id)
			store.eliminatePlayerManually(initialState.players[3].id)

			// Get state after first eliminations
			const midState = useGameStore.getState()
			expect(midState.gameStatus).toBe('playing')

			// Eliminate one more to end the game
			store.eliminatePlayerManually(initialState.players[1].id)

			// Get final state
			const finalState = useGameStore.getState()
			expect(finalState.gameStatus).toBe('finished')
		})

		it('should handle adding player when all positions are at end of list', () => {
			const initialState = useGameStore.getState()
			const playerCount = initialState.players.length

			// Add at the very end
			store.addPlayerMidGame('Eve', 100, playerCount)

			// Get fresh state after addition
			const finalState = useGameStore.getState()

			// Should be at the end
			expect(finalState.players[playerCount].name).toBe('Eve')
			expect(finalState.players.length).toBe(playerCount + 1)
		})

		it('should handle rapid elimination and addition operations', () => {
			// Rapid operations
			for (let i = 0; i < 3; i++) {
				store.addPlayerMidGame(`Player${i}`, i * 25, i)

				// Get fresh state to check current players
				const currentState = useGameStore.getState()
				if (currentState.players.length > 2) {
					store.eliminatePlayerManually(currentState.players[currentState.players.length - 2].id)
				}
			}

			// Get final state
			const finalState = useGameStore.getState()

			// Should maintain valid state
			expect(finalState.gameStatus).toBe('playing')
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			expect(activePlayers.length).toBeGreaterThan(1)

			const currentPicker = finalState.getCurrentPicker()
			expect(currentPicker?.isEliminated).toBe(false)
		})
	})
})
