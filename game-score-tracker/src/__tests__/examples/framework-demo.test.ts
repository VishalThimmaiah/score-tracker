import { describe, it, expect, beforeEach } from 'vitest'
import { gameFlow } from '../utils/game-flow'
import { useGameStore } from '@/store/gameStore'

describe('Testing Framework Demo', () => {
	beforeEach(() => {
		// Reset store before each test
		useGameStore.getState().resetGame()
	})

	describe('Fluent API Examples', () => {
		it('should demonstrate 5-cards game flow', () => {
			// Before: 20+ lines of boilerplate setup
			// After: One fluent chain
			gameFlow()
				.setup5CardsGame(3)
				.expectGameStatus('playing')
				.expectRound(1)
				.playRound([10, 20, 30])
				.expectPlayerScore('Alice', 10)
				.expectPlayerScore('Bob', 20)
				.expectPlayerScore('Charlie', 30)
		})

		it('should demonstrate elimination scenario', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[90, 50, 60],  // Round 1
					[15, 30, 25],  // Round 2 - Alice eliminated (105 total)
				])
				.expectPlayerEliminated('Alice')
				.expectPlayerActive('Bob')
				.expectPlayerActive('Charlie')
		})

		it('should demonstrate secret-7 complete game', () => {
			gameFlow()
				.setupSecret7Game(3)
				.playCompleteGame()
				.expectGameStatus('finished')
				.expectWinner() // Any winner is fine
		})

		it('should demonstrate tie scenario', () => {
			gameFlow()
				.setupCustomRoundsGame(3, 1) // Use rounds-based game with 1 round
				.createTie(50)
				.expectGameStatus('finished')
				.expectWinners(['Alice', 'Bob', 'Charlie'])
		})

		it('should demonstrate custom game setup', () => {
			gameFlow()
				.addPlayers(['Player1', 'Player2', 'Player3'])
				.setGameType('custom')
				.setGameMode('rounds-based')
				.setMaxRounds(5)
				.startGame()
				.expectGameStatus('playing')
				.playRounds([
					[10, 15, 20],
					[12, 18, 22],
					[8, 14, 25],
					[15, 20, 18],
					[11, 16, 19],
				])
				.expectGameStatus('finished')
				.expectWinner('Player1') // Lowest total score
		})
	})

	describe('Game Type Switching Tests', () => {
		it('should preserve custom settings when switching game types', () => {
			const flow = gameFlow()
				.addPlayers(3)
				.setGameType('custom')
				.setGameMode('points-based')
				.setEliminationScore(150)

			// Switch to 5-cards
			flow.setGameType('5-cards')
			expect(flow.getState().gameSettings.eliminationScore).toBe(100)
			expect(flow.getState().gameSettings.gameMode).toBe('points-based')

			// Switch back to custom - should restore settings
			flow.setGameType('custom')
			expect(flow.getState().gameSettings.eliminationScore).toBe(150)
			expect(flow.getState().gameSettings.gameMode).toBe('points-based')
		})

		it('should handle secret-7 to custom transition', () => {
			gameFlow()
				.addPlayers(3)
				.setGameType('secret-7')
				.expectGameStatus('setup')
				.setGameType('custom')
				.expectGameStatus('setup')
				// Custom should default to saved preferences
				.startGame()
				.expectGameStatus('playing')
		})
	})

	describe('Winner Calculation Tests', () => {
		it('should calculate points-based winners correctly', () => {
			gameFlow()
				.setup5CardsGame(4)
				.playRounds([
					[95, 50, 60, 70],  // Round 1: Alice=95, Bob=50, Charlie=60, David=70
					[10, 30, 25, 20],  // Round 2: Alice=105 (eliminated), Bob=80, Charlie=85, David=90
				])
				.expectPlayerEliminated('Alice')  // 105 >= 100
				.expectPlayerActive('Bob')        // 80 < 100
				.expectPlayerActive('Charlie')    // 85 < 100
				.expectPlayerActive('David')      // 90 < 100
		})

		it('should calculate rounds-based winners correctly', () => {
			gameFlow()
				.setupSecret7Game(3)
				.playRounds([
					[10, 20, 30],
					[15, 25, 35],
					[12, 22, 32],
					[18, 28, 38],
					[14, 24, 34],
					[16, 26, 36],
					[13, 23, 33],
				])
				.expectGameStatus('finished')
				.expectWinner('Alice') // Lowest total: 98 vs 148 vs 198
		})

		it('should handle tie scenarios', () => {
			gameFlow()
				.setupCustomRoundsGame(3, 2)
				.playRounds([
					[25, 25, 30],  // Round 1: Alice=25, Bob=25, Charlie=30
					[25, 25, 20],  // Round 2: Alice=50, Bob=50, Charlie=50
				])
				.expectGameStatus('finished')
				.expectWinners(['Alice', 'Bob', 'Charlie']) // All have 50 points
		})
	})

	describe('Edge Cases', () => {
		it('should handle single player remaining', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[95, 95, 50],  // Round 1
					[10, 10, 30],  // Round 2 - Alice & Bob eliminated
				])
				.expectGameStatus('finished')
				.expectWinner('Charlie')
		})

		it('should handle all players eliminated', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[100, 100, 100],  // All eliminated
				])
				.expectGameStatus('finished')
				.expectWinners(['Alice', 'Bob', 'Charlie']) // All tied at 100
		})

		it('should handle zero scores', () => {
			gameFlow()
				.setupCustomPointsGame(2, 50)
				.playRound([0, 0])
				.expectPlayerScore('Alice', 0)
				.expectPlayerScore('Bob', 0)
				.expectGameStatus('playing') // Game continues
		})
	})

	describe('State Persistence Tests', () => {
		it('should maintain game state through operations', () => {
			const flow = gameFlow()
				.setup5CardsGame(3)
				.playRound([10, 20, 30])

			// Verify state is maintained
			const state = flow.getState()
			expect(state.currentRound).toBe(2)
			expect(state.players[0].totalScore).toBe(10)
			expect(state.gameStatus).toBe('playing')

			// Continue game
			flow
				.playRound([15, 25, 35])
				.expectPlayerScore('Alice', 25)
				.expectRound(3)
		})
	})
})
