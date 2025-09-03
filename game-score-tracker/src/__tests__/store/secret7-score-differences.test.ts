import { describe, it, expect, beforeEach } from 'vitest'
import { useGameStore } from '@/store/gameStore'

describe('Score Differences', () => {
	beforeEach(() => {
		// Reset store to initial state
		useGameStore.getState().resetGame()
	})

	describe('getScoreDifferences function', () => {
		it('should work for 5-cards (points-based) games', () => {
			const { addPlayer, setGameType, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Add players
			addPlayer('Alice')
			addPlayer('Bob')
			addPlayer('Charlie')

			// Set to 5-cards (points-based)
			setGameType('5-cards')
			startGame()

			// Add first round scores: Alice=5, Bob=10, Charlie=3 (Charlie leads)
			const players = useGameStore.getState().players
			addRoundScores([
				{ playerId: players[0].id, score: 5 },  // Alice
				{ playerId: players[1].id, score: 10 }, // Bob
				{ playerId: players[2].id, score: 3 }   // Charlie (lowest)
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(3)

			// Charlie should be the leader (lowest score = 3)
			const charlieDiff = scoreDifferences.find(sd => sd.playerId === players[2].id)
			expect(charlieDiff).toEqual({
				playerId: players[2].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: false
			})

			// Alice should be +2 behind leader
			const aliceDiff = scoreDifferences.find(sd => sd.playerId === players[0].id)
			expect(aliceDiff).toEqual({
				playerId: players[0].id,
				difference: 2,
				isLeader: false,
				hasMultipleLeaders: false
			})

			// Bob should be +7 behind leader
			const bobDiff = scoreDifferences.find(sd => sd.playerId === players[1].id)
			expect(bobDiff).toEqual({
				playerId: players[1].id,
				difference: 7,
				isLeader: false,
				hasMultipleLeaders: false
			})
		})

		it('should return empty array when no players exist', () => {
			const { setGameType, getScoreDifferences } = useGameStore.getState()

			setGameType('secret-7')

			const scoreDifferences = getScoreDifferences()
			expect(scoreDifferences).toEqual([])
		})

		it('should calculate score differences correctly for Secret 7 game', () => {
			const { addPlayer, setGameType, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup Secret 7 game
			addPlayer('Alice')
			addPlayer('Bob')
			addPlayer('Charlie')
			setGameType('secret-7')
			startGame()

			// Add first round scores: Alice=5, Bob=10, Charlie=3 (Charlie leads)
			const players = useGameStore.getState().players
			addRoundScores([
				{ playerId: players[0].id, score: 5 },  // Alice
				{ playerId: players[1].id, score: 10 }, // Bob
				{ playerId: players[2].id, score: 3 }   // Charlie (lowest)
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(3)

			// Charlie should be the leader (lowest score = 3)
			const charlieDiff = scoreDifferences.find(sd => sd.playerId === players[2].id)
			expect(charlieDiff).toEqual({
				playerId: players[2].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: false
			})

			// Alice should be +2 behind leader
			const aliceDiff = scoreDifferences.find(sd => sd.playerId === players[0].id)
			expect(aliceDiff).toEqual({
				playerId: players[0].id,
				difference: 2,
				isLeader: false,
				hasMultipleLeaders: false
			})

			// Bob should be +7 behind leader
			const bobDiff = scoreDifferences.find(sd => sd.playerId === players[1].id)
			expect(bobDiff).toEqual({
				playerId: players[1].id,
				difference: 7,
				isLeader: false,
				hasMultipleLeaders: false
			})
		})

		it('should handle tie scenarios correctly (multiple leaders)', () => {
			const { addPlayer, setGameType, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup Secret 7 game
			addPlayer('Alice')
			addPlayer('Bob')
			addPlayer('Charlie')
			setGameType('secret-7')
			startGame()

			// Add scores where Alice and Charlie tie for lead: Alice=5, Bob=10, Charlie=5
			const players = useGameStore.getState().players
			addRoundScores([
				{ playerId: players[0].id, score: 5 },  // Alice (tied for lead)
				{ playerId: players[1].id, score: 10 }, // Bob
				{ playerId: players[2].id, score: 5 }   // Charlie (tied for lead)
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(3)

			// Alice should be tied for lead
			const aliceDiff = scoreDifferences.find(sd => sd.playerId === players[0].id)
			expect(aliceDiff).toEqual({
				playerId: players[0].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: true
			})

			// Charlie should be tied for lead
			const charlieDiff = scoreDifferences.find(sd => sd.playerId === players[2].id)
			expect(charlieDiff).toEqual({
				playerId: players[2].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: true
			})

			// Bob should be +5 behind leaders
			const bobDiff = scoreDifferences.find(sd => sd.playerId === players[1].id)
			expect(bobDiff).toEqual({
				playerId: players[1].id,
				difference: 5,
				isLeader: false,
				hasMultipleLeaders: true
			})
		})

		it('should work correctly after multiple rounds', () => {
			const { addPlayer, setGameType, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup Secret 7 game
			addPlayer('Alice')
			addPlayer('Bob')
			setGameType('secret-7')
			startGame()

			const players = useGameStore.getState().players

			// Round 1: Alice=3, Bob=7
			addRoundScores([
				{ playerId: players[0].id, score: 3 },
				{ playerId: players[1].id, score: 7 }
			])

			// Round 2: Alice=2, Bob=1 (totals: Alice=5, Bob=8)
			addRoundScores([
				{ playerId: players[0].id, score: 2 },
				{ playerId: players[1].id, score: 1 }
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(2)

			// Alice should be leading with total 5
			const aliceDiff = scoreDifferences.find(sd => sd.playerId === players[0].id)
			expect(aliceDiff).toEqual({
				playerId: players[0].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: false
			})

			// Bob should be +3 behind with total 8
			const bobDiff = scoreDifferences.find(sd => sd.playerId === players[1].id)
			expect(bobDiff).toEqual({
				playerId: players[1].id,
				difference: 3,
				isLeader: false,
				hasMultipleLeaders: false
			})
		})

		it('should handle all players having same score (complete tie)', () => {
			const { addPlayer, setGameType, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup Secret 7 game
			addPlayer('Alice')
			addPlayer('Bob')
			addPlayer('Charlie')
			setGameType('secret-7')
			startGame()

			// All players get same score
			const players = useGameStore.getState().players
			addRoundScores([
				{ playerId: players[0].id, score: 5 },
				{ playerId: players[1].id, score: 5 },
				{ playerId: players[2].id, score: 5 }
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(3)

			// All players should be tied for lead
			scoreDifferences.forEach(diff => {
				expect(diff).toEqual({
					playerId: expect.any(String),
					difference: 0,
					isLeader: true,
					hasMultipleLeaders: true
				})
			})
		})

		it('should work correctly in finished Secret 7 game', () => {
			const { addPlayer, setGameType, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup Secret 7 game
			addPlayer('Alice')
			addPlayer('Bob')
			setGameType('secret-7')
			startGame()

			const players = useGameStore.getState().players

			// Play all 7 rounds to finish the game
			for (let round = 1; round <= 7; round++) {
				addRoundScores([
					{ playerId: players[0].id, score: round },     // Alice gets increasing scores
					{ playerId: players[1].id, score: 8 - round } // Bob gets decreasing scores
				])
			}

			// Game should be finished now
			expect(useGameStore.getState().gameStatus).toBe('finished')

			// Alice total: 1+2+3+4+5+6+7 = 28
			// Bob total: 7+6+5+4+3+2+1 = 28 (tie!)

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(2)

			// Both should be tied for lead
			scoreDifferences.forEach(diff => {
				expect(diff).toEqual({
					playerId: expect.any(String),
					difference: 0,
					isLeader: true,
					hasMultipleLeaders: true
				})
			})
		})

		it('should handle elimination in points-based games correctly', () => {
			const { addPlayer, setGameType, setEliminationScore, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup 5-cards game with low elimination score for testing
			addPlayer('Alice')
			addPlayer('Bob')
			addPlayer('Charlie')
			setGameType('5-cards')
			setEliminationScore(20) // Low threshold for testing
			startGame()

			const players = useGameStore.getState().players

			// Round 1: Alice=5, Bob=10, Charlie=25 (Charlie gets eliminated)
			addRoundScores([
				{ playerId: players[0].id, score: 5 },  // Alice
				{ playerId: players[1].id, score: 10 }, // Bob
				{ playerId: players[2].id, score: 25 }  // Charlie (eliminated at 25 >= 20)
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(3)

			// Alice should be the leader among active players (score = 5)
			const aliceDiff = scoreDifferences.find(sd => sd.playerId === players[0].id)
			expect(aliceDiff).toEqual({
				playerId: players[0].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: false
			})

			// Bob should be +5 behind leader among active players
			const bobDiff = scoreDifferences.find(sd => sd.playerId === players[1].id)
			expect(bobDiff).toEqual({
				playerId: players[1].id,
				difference: 5,
				isLeader: false,
				hasMultipleLeaders: false
			})

			// Charlie should have no score difference info (eliminated)
			const charlieDiff = scoreDifferences.find(sd => sd.playerId === players[2].id)
			expect(charlieDiff).toEqual({
				playerId: players[2].id,
				difference: 0,
				isLeader: false,
				hasMultipleLeaders: false
			})

			// Verify Charlie is actually eliminated
			const currentState = useGameStore.getState()
			const charliePlayer = currentState.players.find(p => p.id === players[2].id)
			expect(charliePlayer?.isEliminated).toBe(true)
		})

		it('should handle custom rounds-based games', () => {
			const { addPlayer, setGameType, setGameMode, setMaxRounds, startGame, addRoundScores, getScoreDifferences } = useGameStore.getState()

			// Setup custom rounds-based game
			addPlayer('Alice')
			addPlayer('Bob')
			setGameType('custom')
			setGameMode('rounds-based')
			setMaxRounds(3)
			startGame()

			const players = useGameStore.getState().players

			// Round 1: Alice=10, Bob=5 (Bob leads)
			addRoundScores([
				{ playerId: players[0].id, score: 10 }, // Alice
				{ playerId: players[1].id, score: 5 }   // Bob (lowest)
			])

			const scoreDifferences = getScoreDifferences()

			expect(scoreDifferences).toHaveLength(2)

			// Bob should be the leader (lowest score = 5)
			const bobDiff = scoreDifferences.find(sd => sd.playerId === players[1].id)
			expect(bobDiff).toEqual({
				playerId: players[1].id,
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: false
			})

			// Alice should be +5 behind leader
			const aliceDiff = scoreDifferences.find(sd => sd.playerId === players[0].id)
			expect(aliceDiff).toEqual({
				playerId: players[0].id,
				difference: 5,
				isLeader: false,
				hasMultipleLeaders: false
			})
		})
	})
})
