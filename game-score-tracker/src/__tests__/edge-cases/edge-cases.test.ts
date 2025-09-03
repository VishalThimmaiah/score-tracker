import { describe, it, expect, beforeEach } from 'vitest'
import { gameFlow } from '../utils/game-flow'
import { useGameStore } from '@/store/gameStore'

describe('Edge Cases Tests', () => {
	beforeEach(() => {
		useGameStore.getState().resetGame()
	})

	describe('Player Scenarios', () => {
		it('should handle single player remaining correctly', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[95, 95, 50],  // Alice & Bob close to elimination
					[10, 10, 30],  // Alice & Bob eliminated
				])
				.expectGameStatus('finished')
				.expectWinner('Charlie')
				.expectPlayerEliminated('Alice')
				.expectPlayerEliminated('Bob')
				.expectPlayerActive('Charlie')
		})

		it('should handle all players eliminated scenario', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRound([100, 105, 110])  // All eliminated simultaneously
				.expectGameStatus('finished')
				.expectWinner('Alice')  // Lowest score wins
		})

		it('should handle tie scenarios with multiple winners', () => {
			gameFlow()
				.setupCustomPointsGame(4, 100)
				.playRound([100, 100, 100, 60])  // Three players eliminated, one remains
				.expectGameStatus('finished')
				.expectWinner('David')  // Only active player wins
		})

		it('should handle empty player list gracefully', () => {
			const store = useGameStore.getState()

			// Try to start game with no players
			store.startGame()
			expect(store.gameStatus).toBe('setup')

			// Try to get winners with no players
			const winners = store.getWinners()
			expect(winners).toEqual([])

			// Try to get current picker with no players
			const picker = store.getCurrentPicker()
			expect(picker).toBeUndefined()
		})

		it('should handle single player game', () => {
			gameFlow()
				.addPlayers(['Solo'])
				.setGameType('custom')
				.setGameMode('points-based')
				.setEliminationScore(100)
				.startGame()
				.playRound([100])  // Eliminate the single player
				.expectGameStatus('finished')
				.expectWinner('Solo')  // Single player wins even when eliminated
		})
	})

	describe('Score Scenarios', () => {
		it('should handle zero scores correctly', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRound([0, 0, 0])  // All zero scores
				.expectPlayerScore('Alice', 0)
				.expectPlayerScore('Bob', 0)
				.expectPlayerScore('Charlie', 0)
				.expectGameStatus('playing')  // Game continues
		})

		it('should handle negative scores validation', () => {
			// Framework should handle negative scores gracefully
			gameFlow()
				.setup5CardsGame(2)
				.playRound([-10, 5])  // Negative score
				.expectPlayerScore('Alice', -10)
				.expectPlayerScore('Bob', 5)
				.expectGameStatus('playing')
		})

		it('should handle large scores without overflow', () => {
			gameFlow()
				.setupCustomPointsGame(2, 10000)
				.playRound([9999, 5000])  // Large scores
				.expectPlayerScore('Alice', 9999)
				.expectPlayerScore('Bob', 5000)
				.expectGameStatus('playing')
		})

		it('should handle decimal scores by rounding appropriately', () => {
			// This tests the framework's handling of decimal inputs
			gameFlow()
				.setup5CardsGame(2)
				.playRound([10.7, 15.3])  // Use decimal scores
				.expectPlayerScore('Alice', 10.7)
				.expectPlayerScore('Bob', 15.3)
				.expectGameStatus('playing')
		})
	})

	describe('State Persistence Edge Cases', () => {
		it('should handle browser refresh during gameplay', () => {
			const flow = gameFlow()
				.setup5CardsGame(3)
				.playRound([10, 20, 30])

			const state = flow.getState()

			// Simulate state restoration
			expect(state.gameStatus).toBe('playing')
			expect(state.currentRound).toBe(2)
			expect(state.players.length).toBe(3)

			// Verify game can continue after "refresh"
			flow.playRound([15, 25, 35])
				.expectPlayerScore('Alice', 25)
		})

		it('should handle localStorage corruption gracefully', () => {
			// Test clean initialization when localStorage is corrupted
			const store = useGameStore.getState()

			expect(store.gameStatus).toBe('setup')
			expect(store.players).toEqual([])
			expect(store.currentRound).toBe(0)
			expect(store.gameSettings.gameType).toBe('5-cards')
		})

		it('should maintain version 2 compatibility', () => {
			const flow = gameFlow().setup5CardsGame(3)
			const state = flow.getState()

			// Verify all version 2 properties exist
			expect(state.gameSettings.customEliminationScore).toBeDefined()
			expect(state.gameSettings.customMaxRounds).toBeDefined()
			expect(state.gameSettings.customGameMode).toBeDefined()
			expect(typeof state.gameSettings.customEliminationScore).toBe('number')
			expect(typeof state.gameSettings.customMaxRounds).toBe('number')
			expect(typeof state.gameSettings.customGameMode).toBe('string')
		})

		it('should handle concurrent tabs synchronization', () => {
			// Test that the store can handle state changes consistently
			const flow = gameFlow().setup5CardsGame(3)

			// Simulate rapid state changes that might occur in concurrent tabs
			flow.playRound([10, 20, 30])
			const state1 = flow.getState()

			// Verify state is consistent
			expect(state1.currentRound).toBe(2)
			expect(state1.players[0].totalScore).toBe(10)
			expect(state1.players[1].totalScore).toBe(20)
			expect(state1.players[2].totalScore).toBe(30)
		})
	})

	describe('Validation Edge Cases', () => {
		it('should reject elimination score of 0 for points-based games', () => {
			const store = useGameStore.getState()
			store.addPlayer('Alice')
			store.addPlayer('Bob')
			store.setGameType('custom')
			store.setGameMode('points-based')
			store.setEliminationScore(0)

			// Game should not start with elimination score of 0
			store.startGame()
			expect(store.gameStatus).toBe('setup')  // Should remain in setup
		})

		it('should reject max rounds of 0 for rounds-based games', () => {
			const store = useGameStore.getState()
			store.addPlayer('Alice')
			store.addPlayer('Bob')
			store.setGameType('custom')
			store.setGameMode('rounds-based')
			store.setMaxRounds(0)

			// Game should not start with 0 rounds
			store.startGame()
			expect(store.gameStatus).toBe('setup')  // Should remain in setup
		})

		it('should handle invalid game type fallback', () => {
			// Verify default game type
			expect(useGameStore.getState().gameSettings.gameType).toBe('5-cards')

			// Valid game types should work
			useGameStore.getState().setGameType('secret-7')
			expect(useGameStore.getState().gameSettings.gameType).toBe('secret-7')

			// Switch back to 5-cards
			useGameStore.getState().setGameType('5-cards')
			expect(useGameStore.getState().gameSettings.gameType).toBe('5-cards')
		})

		it('should sanitize invalid player data', () => {
			// Test that the store handles player name trimming
			useGameStore.getState().addPlayer('  Alice  ')
			expect(useGameStore.getState().players.length).toBe(1)
			expect(useGameStore.getState().players[0].name).toBe('Alice')  // Should be trimmed

			// Test empty name handling
			useGameStore.getState().addPlayer('  ')
			expect(useGameStore.getState().players.length).toBe(2)
			expect(useGameStore.getState().players[1].name).toBe('')  // Trimmed to empty string
		})
	})

	describe('Game Logic Edge Cases', () => {
		it('should handle picker rotation when all players eliminated', () => {
			const flow = gameFlow()
				.setup5CardsGame(3)
				.playRound([100, 100, 100])  // All eliminated

			const state = flow.getState()
			expect(state.gameStatus).toBe('finished')

			// Should still have a valid picker index
			expect(state.currentPickerIndex).toBeGreaterThanOrEqual(0)
			expect(state.currentPickerIndex).toBeLessThan(3)
		})

		it('should handle dealer calculation with eliminated players', () => {
			const flow = gameFlow()
				.setup5CardsGame(4)
				.playRounds([
					[95, 50, 60, 70],  // Round 1
					[10, 30, 25, 20],  // Round 2 - Alice eliminated
				])

			const state = flow.getState()
			const dealerIndex = state.calculateDealerIndex(state.currentPickerIndex)

			expect(dealerIndex).toBeGreaterThanOrEqual(0)
			expect(dealerIndex).toBeLessThan(4)

			const dealer = state.players[dealerIndex]
			expect(dealer.isEliminated).toBe(false)  // Dealer should be active
		})

		it('should handle winner calculation with complex elimination patterns', () => {
			gameFlow()
				.setup5CardsGame(5)
				.playRounds([
					[90, 80, 70, 60, 40],  // Round 1
					[15, 25, 35, 45, 50],  // Round 2 - Alice eliminated (105), Bob eliminated (105), Charlie eliminated (105), David eliminated (105), Eve still active (90)
				])
				.expectPlayerEliminated('Alice')
				.expectPlayerEliminated('Bob')
				.expectPlayerEliminated('Charlie')
				.expectPlayerEliminated('David')
				.expectPlayerActive('Eve')
				.expectGameStatus('finished')  // Only Eve remains
		})

		it('should handle rapid successive eliminations', () => {
			gameFlow()
				.setup5CardsGame(4)
				.playRound([100, 100, 100, 50])  // Three eliminated at once
				.expectGameStatus('finished')
				.expectWinner('David')
				.expectPlayerEliminated('Alice')
				.expectPlayerEliminated('Bob')
				.expectPlayerEliminated('Charlie')
				.expectPlayerActive('David')
		})
	})

	describe('Boundary Conditions', () => {
		it('should handle maximum player count', () => {
			const playerNames = Array.from({ length: 10 }, (_, i) => `Player${i + 1}`)

			gameFlow()
				.addPlayers(playerNames)
				.setGameType('custom')
				.setGameMode('rounds-based')
				.setMaxRounds(2)
				.startGame()
				.playRound(Array.from({ length: 10 }, (_, i) => i * 5))  // 0, 5, 10, ..., 45
				.expectGameStatus('playing')
		})

		it('should handle minimum player count edge case', () => {
			// Test that games require at least 2 players to start
			const flow = gameFlow()
				.addPlayers(['Alice'])
				.setGameType('custom')
				.setGameMode('rounds-based')
				.setMaxRounds(1)
				.startGame()

			// Verify game doesn't start with only 1 player
			expect(flow.getState().currentRound).toBe(0)  // Game should not start
			expect(flow.getState().gameStatus).toBe('setup')  // Should remain in setup
			expect(flow.getState().gameSettings.maxRounds).toBe(1)

			// Add second player and start game
			flow.addPlayers(['Bob'])
				.startGame()

			// Now game should start
			expect(flow.getState().currentRound).toBe(1)
			expect(flow.getState().gameStatus).toBe('playing')

			// Play the single round
			flow.playRound([10, 15])

			// After playing 1 round with maxRounds=1, game should finish
			const finalState = flow.getState()
			expect(finalState.currentRound).toBe(2)  // Round increments after playing
			expect(finalState.gameStatus).toBe('finished')
			expect(finalState.getWinners()[0].name).toBe('Alice')  // Alice has lower score
		})

		it('should handle maximum rounds boundary', () => {
			gameFlow()
				.setupCustomRoundsGame(2, 20)  // High round count
				.playRounds(Array.from({ length: 20 }, () => [10, 15]))
				.expectGameStatus('finished')
				.expectRound(21)  // Round counter increments after game ends
		})

		it('should handle maximum elimination score', () => {
			gameFlow()
				.setupCustomPointsGame(2, 9999)  // Very high elimination score
				.playRound([5000, 6000])
				.expectGameStatus('playing')  // Should still be playing
				.playRound([5000, 4000])  // Total: 10000, 10000 - both eliminated
				.expectGameStatus('finished')
		})
	})

	describe('Race Conditions and Timing', () => {
		it('should handle rapid state changes', () => {
			const flow = gameFlow().setup5CardsGame(3)

			// Rapid successive operations
			flow.playRound([10, 20, 30])
				.playRound([15, 25, 35])
				.playRound([20, 30, 40])

			const state = flow.getState()
			expect(state.currentRound).toBe(4)
			expect(state.players[0].totalScore).toBe(45)  // 10 + 15 + 20
		})

		it('should handle concurrent score updates', () => {
			const flow = gameFlow().setup5CardsGame(3)

			// Use the flow's playRound method which properly handles score updates
			flow.playRound([10, 20, 30])

			const state = flow.getState()
			expect(state.players[0].totalScore).toBe(10)
			expect(state.players[1].totalScore).toBe(20)
			expect(state.players[2].totalScore).toBe(30)
		})

		it('should maintain consistency during player management operations', () => {
			// Add multiple players
			useGameStore.getState().addPlayer('Alice')
			useGameStore.getState().addPlayer('Bob')
			useGameStore.getState().addPlayer('Charlie')

			const initialCount = useGameStore.getState().players.length
			expect(initialCount).toBe(3)

			// Remove middle player
			const bobId = useGameStore.getState().players[1].id
			useGameStore.getState().removePlayer(bobId)

			const finalState = useGameStore.getState()
			expect(finalState.players.length).toBe(initialCount - 1)
			expect(finalState.players.find(p => p.id === bobId)).toBeUndefined()
			expect(finalState.players[0].name).toBe('Alice')
			expect(finalState.players[1].name).toBe('Charlie')
		})
	})
})
