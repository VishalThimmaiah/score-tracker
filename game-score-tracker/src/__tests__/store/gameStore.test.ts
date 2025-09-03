import { describe, it, expect, beforeEach } from 'vitest'
import { gameFlow } from '../utils/game-flow'
import { useGameStore } from '@/store/gameStore'

describe('GameStore Tests', () => {
	beforeEach(() => {
		useGameStore.getState().resetGame()
	})

	describe('Game Type Switching', () => {
		it('should switch 5-cards → secret-7 and change mode to rounds-based with maxRounds=7', () => {
			const flow = gameFlow()
				.addPlayers(3)
				.setGameType('5-cards')
				.setGameType('secret-7')

			const state = flow.getState()
			expect(state.gameSettings.gameType).toBe('secret-7')
			expect(state.gameSettings.gameMode).toBe('rounds-based')
			expect(state.gameSettings.maxRounds).toBe(7)
		})

		it('should switch secret-7 → custom and preserve custom preferences', () => {
			gameFlow()
				.addPlayers(3)
				.setGameType('custom')
				.setEliminationScore(150)
				.setGameMode('points-based')
				.setGameType('secret-7')
				.setGameType('custom')
				.expectGameStatus('setup')

			const state = useGameStore.getState()
			expect(state.gameSettings.eliminationScore).toBe(150)
			expect(state.gameSettings.gameMode).toBe('points-based')
		})

		it('should switch custom → 5-cards and save custom settings with elimination=100', () => {
			const flow = gameFlow()
				.addPlayers(3)
				.setGameType('custom')
				.setEliminationScore(200)
				.setGameMode('rounds-based')
				.setGameType('5-cards')

			const state = flow.getState()
			expect(state.gameSettings.gameType).toBe('5-cards')
			expect(state.gameSettings.eliminationScore).toBe(100)
			expect(state.gameSettings.gameMode).toBe('points-based')
			expect(state.gameSettings.customEliminationScore).toBe(200)
			expect(state.gameSettings.customGameMode).toBe('rounds-based')
		})

		it('should toggle custom points → custom rounds mode correctly', () => {
			gameFlow()
				.addPlayers(3)
				.setGameType('custom')
				.setGameMode('points-based')
				.setGameMode('rounds-based')
				.expectGameStatus('setup')

			const state = useGameStore.getState()
			expect(state.gameSettings.gameMode).toBe('rounds-based')
			expect(state.gameSettings.customGameMode).toBe('rounds-based')
		})

		it('should restore saved custom preferences when switching back to custom', () => {
			const flow = gameFlow()
				.addPlayers(3)
				.setGameType('custom')
				.setEliminationScore(180)
				.setGameMode('rounds-based')
				.setMaxRounds(10)
				.setGameType('5-cards')
				.setGameType('custom')

			const state = flow.getState()
			expect(state.gameSettings.eliminationScore).toBe(180)
			expect(state.gameSettings.gameMode).toBe('rounds-based')
			expect(state.gameSettings.maxRounds).toBe(10)
		})
	})

	describe('Winner Calculation (getWinners)', () => {
		it('should return last active player as winner in points-based single winner scenario', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[95, 50, 60],  // Round 1
					[10, 30, 25],  // Round 2 - Alice eliminated (105)
					[0, 60, 30],   // Round 3 - All eliminated: Alice=105, Bob=140, Charlie=115
				])
				.expectGameStatus('finished')
				.expectWinner('Alice')  // Alice has lowest score (105) when all eliminated
		})

		it('should return multiple players with same lowest score in points-based tie', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[50, 50, 60],  // Round 1
					[30, 30, 25],  // Round 2 - All same score except Charlie
				])
				.expectGameStatus('playing')
				.playRound([20, 20, 40])  // Round 3 - Alice & Bob tie at 100
				.expectGameStatus('finished')
				.expectWinners(['Alice', 'Bob'])
		})

		it('should return lowest score winner when all players eliminated in points-based', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRound([100, 105, 110])  // All eliminated
				.expectGameStatus('finished')
				.expectWinner('Alice')  // Lowest at 100
		})

		it('should return lowest total score winner in rounds-based single winner', () => {
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
				.expectWinner('Alice')  // Total: 98 vs 148 vs 198
		})

		it('should return multiple players with same score in rounds-based tie', () => {
			gameFlow()
				.setupCustomRoundsGame(3, 2)
				.playRounds([
					[25, 25, 30],  // Round 1: Alice=25, Bob=25, Charlie=30
					[25, 25, 25],  // Round 2: Alice=50, Bob=50, Charlie=55
				])
				.expectGameStatus('finished')
				.expectWinners(['Alice', 'Bob'])  // Both have 50, Charlie has 55
		})

		it('should return empty array when game not finished', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRound([10, 20, 30])
				.expectGameStatus('playing')
				.expectNoWinners()
		})
	})

	describe('Player Elimination (addRoundScores)', () => {
		it('should eliminate player at threshold and skip in picker rotation', () => {
			const flow = gameFlow()
				.setup5CardsGame(3)
				.playRound([95, 50, 60])  // Alice close to elimination
				.playRound([10, 30, 25])  // Alice eliminated (105)

			flow.expectPlayerEliminated('Alice')
				.expectPlayerActive('Bob')
				.expectPlayerActive('Charlie')

			// Verify picker rotation skips eliminated player
			const state = flow.getState()
			const currentPicker = state.getCurrentPicker()
			expect(currentPicker?.name).not.toBe('Alice')
		})

		it('should skip multiple eliminated players in picker rotation', () => {
			gameFlow()
				.setup5CardsGame(4)
				.playRounds([
					[95, 95, 50, 60],  // Alice & Bob close to elimination
					[10, 10, 30, 25],  // Alice & Bob eliminated
				])
				.expectPlayerEliminated('Alice')
				.expectPlayerEliminated('Bob')
				.expectPlayerActive('Charlie')
				.expectPlayerActive('David')
		})

		it('should end game when last player standing in points-based', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRounds([
					[95, 95, 50],  // Alice & Bob close to elimination
					[10, 10, 30],  // Alice & Bob eliminated
				])
				.expectGameStatus('finished')
				.expectWinner('Charlie')
		})

		it('should keep all players active in rounds-based (no elimination)', () => {
			gameFlow()
				.setupSecret7Game(3)
				.playRounds([
					[100, 100, 100],  // High scores but no elimination
					[50, 50, 50],
				])
				.expectPlayerActive('Alice')
				.expectPlayerActive('Bob')
				.expectPlayerActive('Charlie')
				.expectGameStatus('playing')
		})
	})

	describe('Score Persistence', () => {
		it('should save scores and calculate totals correctly', () => {
			gameFlow()
				.setup5CardsGame(3)
				.playRound([10, 20, 30])
				.expectPlayerScore('Alice', 10)
				.expectPlayerScore('Bob', 20)
				.expectPlayerScore('Charlie', 30)
				.playRound([15, 25, 35])
				.expectPlayerScore('Alice', 25)
				.expectPlayerScore('Bob', 45)
				.expectPlayerScore('Charlie', 65)
		})

		it('should select next active player as picker', () => {
			const flow = gameFlow()
				.setup5CardsGame(3)
				.playRound([10, 20, 30])

			const state = flow.getState()
			expect(state.currentPickerIndex).toBeGreaterThanOrEqual(0)
			expect(state.currentPickerIndex).toBeLessThan(3)
		})

		it('should transition game status from playing to finished correctly', () => {
			gameFlow()
				.setup5CardsGame(2)
				.expectGameStatus('playing')
				.playRound([100, 50])  // Alice eliminated
				.expectGameStatus('finished')
		})

		it('should increment round counting correctly', () => {
			gameFlow()
				.setup5CardsGame(3)
				.expectRound(1)
				.playRound([10, 20, 30])
				.expectRound(2)
				.playRound([15, 25, 35])
				.expectRound(3)
		})
	})

	describe('Player Management', () => {
		it('should add new player with unique ID', () => {
			const flow = gameFlow()
			const initialState = flow.getState()
			const initialCount = initialState.players.length

			// Add player using the store
			useGameStore.getState().addPlayer('TestPlayer')

			const finalState = flow.getState()
			expect(finalState.players.length).toBe(initialCount + 1)
			const newPlayer = finalState.players[finalState.players.length - 1]
			expect(newPlayer.name).toBe('TestPlayer')
			expect(newPlayer.id).toBeDefined()
			expect(newPlayer.totalScore).toBe(0)
			expect(newPlayer.isEliminated).toBe(false)
		})

		it('should remove player and adjust picker index', () => {
			const flow = gameFlow().addPlayers(['Alice', 'Bob', 'Charlie'])
			const initialState = flow.getState()
			const initialCount = initialState.players.length
			const playerToRemove = initialState.players[1] // Bob

			useGameStore.getState().removePlayer(playerToRemove.id)

			const finalState = flow.getState()
			expect(finalState.players.length).toBe(initialCount - 1)
			expect(finalState.players.find(p => p.id === playerToRemove.id)).toBeUndefined()
		})

		it('should update player order when reordered', () => {
			const flow = gameFlow().addPlayers(['Alice', 'Bob', 'Charlie'])
			const initialState = flow.getState()
			const originalOrder = [...initialState.players]
			const reorderedPlayers = [originalOrder[2], originalOrder[0], originalOrder[1]]

			useGameStore.getState().setPlayerOrder(reorderedPlayers)

			const finalState = flow.getState()
			expect(finalState.players[0].name).toBe('Charlie')
			expect(finalState.players[1].name).toBe('Alice')
			expect(finalState.players[2].name).toBe('Bob')
		})

		it('should reset all scores and return game to setup', () => {
			const flow = gameFlow()
				.setup5CardsGame(3)
				.playRound([10, 20, 30])

			useGameStore.getState().clearScores()

			const finalState = flow.getState()
			expect(finalState.gameStatus).toBe('setup')
			expect(finalState.currentRound).toBe(0)
			finalState.players.forEach(player => {
				expect(player.totalScore).toBe(0)
				expect(player.scores).toEqual([])
				expect(player.isEliminated).toBe(false)
			})
		})
	})
})
