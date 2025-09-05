import { useGameStore } from '@/store/gameStore'
import { beforeEach, describe, expect, it } from 'vitest'

// Helper to get a fresh store instance
const getStore = () => {
	const store = useGameStore.getState()
	// Clear all state completely
	store.resetGame()
	// Clear players array manually to ensure clean state
	useGameStore.setState({ players: [] })
	return store
}

describe('Integration: Single Player Dealer-Picker Scenario', () => {
	let store: ReturnType<typeof getStore>

	beforeEach(() => {
		// Get fresh store instance
		store = useGameStore.getState()

		// Reset game completely
		store.resetGame()

		// Set up a standard test scenario with 4 players
		store.addPlayer('Alice')
		store.addPlayer('Bob')
		store.addPlayer('Charlie')
		store.addPlayer('Diana')
		store.setGameType('5-cards')
		store.setGameMode('points-based')
		store.setEliminationScore(100)
		store.startGame()
	})

	describe('When only one player remains after eliminations', () => {
		it('should assign both dealer and picker roles to the same player', () => {
			const initialState = useGameStore.getState()
			const players = initialState.players

			// Record the initial picker for reference
			const initialPicker = initialState.getCurrentPicker()
			const initialDealer = initialState.getCurrentDealer()

			// Verify initial state has different picker and dealer (with 4 players)
			expect(initialPicker?.id).not.toBe(initialDealer?.id)
			expect(initialState.gameStatus).toBe('playing')
			expect(players.length).toBe(4)

			// Eliminate 3 players, leaving only Alice
			store.eliminatePlayerManually(players[1].id) // Bob
			store.eliminatePlayerManually(players[2].id) // Charlie
			store.eliminatePlayerManually(players[3].id) // Diana

			// Get fresh state after eliminations
			const finalState = useGameStore.getState()
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			const remainingPlayer = activePlayers[0]

			// Verify only one player remains
			expect(activePlayers.length).toBe(1)
			expect(remainingPlayer.name).toBe('Alice')
			expect(finalState.gameStatus).toBe('finished')

			// Verify both picker and dealer are the same player
			const currentPicker = finalState.getCurrentPicker()
			const currentDealer = finalState.getCurrentDealer()

			expect(currentPicker?.id).toBe(remainingPlayer.id)
			expect(currentDealer?.id).toBe(remainingPlayer.id)
			expect(currentPicker?.id).toBe(currentDealer?.id)

			// Verify the mathematical calculation
			const pickerIndex = finalState.currentPickerIndex
			const dealerIndex = finalState.calculateDealerIndex(pickerIndex)
			expect(pickerIndex).toBe(dealerIndex)
		})

		it('should maintain consistent picker/dealer assignment across different elimination orders', () => {
			// Test Case 1: Eliminate in reverse order (Diana, Charlie, Bob)
			const initialState = useGameStore.getState()
			const players = [...initialState.players]

			store.eliminatePlayerManually(players[3].id) // Diana
			store.eliminatePlayerManually(players[2].id) // Charlie
			store.eliminatePlayerManually(players[1].id) // Bob

			const finalState1 = useGameStore.getState()
			const activePlayers1 = finalState1.players.filter(p => !p.isEliminated)

			expect(activePlayers1.length).toBe(1)
			expect(activePlayers1[0].name).toBe('Alice')
			expect(finalState1.getCurrentPicker()?.id).toBe(finalState1.getCurrentDealer()?.id)

			// Reset and test Case 2: Eliminate in different order (Bob, Diana, Charlie)
			store.resetGame()
			store.addPlayer('Alice')
			store.addPlayer('Bob')
			store.addPlayer('Charlie')
			store.addPlayer('Diana')
			store.setGameType('5-cards')
			store.setGameMode('points-based')
			store.setEliminationScore(100)
			store.startGame()

			const midState = useGameStore.getState()
			const players2 = [...midState.players]

			store.eliminatePlayerManually(players2[1].id) // Bob
			store.eliminatePlayerManually(players2[3].id) // Diana
			store.eliminatePlayerManually(players2[2].id) // Charlie

			const finalState2 = useGameStore.getState()
			const activePlayers2 = finalState2.players.filter(p => !p.isEliminated)

			expect(activePlayers2.length).toBe(1)
			expect(activePlayers2[0].name).toBe('Alice')
			expect(finalState2.getCurrentPicker()?.id).toBe(finalState2.getCurrentDealer()?.id)
		})

		it('should handle edge case when current picker is eliminated last', () => {
			const initialState = useGameStore.getState()
			const players = [...initialState.players]

			// Set Bob as the current picker
			const bobIndex = players.findIndex(p => p.name === 'Bob')
			store.setCurrentPickerIndex(bobIndex)

			const stateWithBobAsPicker = useGameStore.getState()
			expect(stateWithBobAsPicker.getCurrentPicker()?.name).toBe('Bob')

			// Eliminate everyone except Bob (the current picker)
			store.eliminatePlayerManually(players[0].id) // Alice
			store.eliminatePlayerManually(players[2].id) // Charlie
			store.eliminatePlayerManually(players[3].id) // Diana

			const finalState = useGameStore.getState()
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			const remainingPlayer = activePlayers[0]

			// Verify Bob is the only remaining player and is both picker and dealer
			expect(activePlayers.length).toBe(1)
			expect(remainingPlayer.name).toBe('Bob')
			expect(finalState.getCurrentPicker()?.id).toBe(remainingPlayer.id)
			expect(finalState.getCurrentDealer()?.id).toBe(remainingPlayer.id)
			expect(finalState.getCurrentPicker()?.id).toBe(finalState.getCurrentDealer()?.id)
		})

		it('should handle edge case when current dealer is eliminated last', () => {
			const initialState = useGameStore.getState()
			const players = [...initialState.players]

			// Set Alice as picker, which makes Diana the dealer (Alice - 1 = Diana in rotation)
			store.setCurrentPickerIndex(0) // Alice is picker

			const stateWithAliceAsPicker = useGameStore.getState()
			const currentDealer = stateWithAliceAsPicker.getCurrentDealer()
			expect(currentDealer?.name).toBe('Diana') // Diana should be dealer

			// Eliminate everyone except Diana (the current dealer)
			store.eliminatePlayerManually(players[0].id) // Alice (picker)
			store.eliminatePlayerManually(players[1].id) // Bob
			store.eliminatePlayerManually(players[2].id) // Charlie

			const finalState = useGameStore.getState()
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			const remainingPlayer = activePlayers[0]

			// Verify Diana is the only remaining player and is both picker and dealer
			expect(activePlayers.length).toBe(1)
			expect(remainingPlayer.name).toBe('Diana')
			expect(finalState.getCurrentPicker()?.id).toBe(remainingPlayer.id)
			expect(finalState.getCurrentDealer()?.id).toBe(remainingPlayer.id)
			expect(finalState.getCurrentPicker()?.id).toBe(finalState.getCurrentDealer()?.id)
		})

		it('should handle picker rotation correctly during elimination process', () => {
			const initialState = useGameStore.getState()
			const players = [...initialState.players]

			// Track picker changes during elimination
			const pickerHistory: string[] = []

			// Initial picker
			pickerHistory.push(initialState.getCurrentPicker()?.name || 'unknown')

			// Eliminate Bob (index 1)
			store.eliminatePlayerManually(players[1].id)
			const state1 = useGameStore.getState()
			pickerHistory.push(state1.getCurrentPicker()?.name || 'unknown')

			// Eliminate Charlie (index 2)
			store.eliminatePlayerManually(players[2].id)
			const state2 = useGameStore.getState()
			pickerHistory.push(state2.getCurrentPicker()?.name || 'unknown')

			// Eliminate Diana (index 3) - leaving only Alice
			store.eliminatePlayerManually(players[3].id)
			const finalState = useGameStore.getState()
			pickerHistory.push(finalState.getCurrentPicker()?.name || 'unknown')

			// Verify final state
			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			expect(activePlayers.length).toBe(1)
			expect(activePlayers[0].name).toBe('Alice')

			// Verify picker and dealer are the same
			expect(finalState.getCurrentPicker()?.name).toBe('Alice')
			expect(finalState.getCurrentDealer()?.name).toBe('Alice')
			expect(finalState.getCurrentPicker()?.id).toBe(finalState.getCurrentDealer()?.id)

			// Verify picker history shows valid transitions
			expect(pickerHistory.length).toBe(4)
			expect(pickerHistory[pickerHistory.length - 1]).toBe('Alice')
		})

		it('should maintain game state consistency when only one player remains', () => {
			const initialState = useGameStore.getState()
			const players = [...initialState.players]

			// Eliminate all but Charlie
			store.eliminatePlayerManually(players[0].id) // Alice
			store.eliminatePlayerManually(players[1].id) // Bob
			store.eliminatePlayerManually(players[3].id) // Diana

			const finalState = useGameStore.getState()

			// Verify game state consistency
			expect(finalState.gameStatus).toBe('finished')
			expect(finalState.players.length).toBe(4) // All players still in array

			const activePlayers = finalState.players.filter(p => !p.isEliminated)
			const eliminatedPlayers = finalState.players.filter(p => p.isEliminated)

			expect(activePlayers.length).toBe(1)
			expect(eliminatedPlayers.length).toBe(3)
			expect(activePlayers[0].name).toBe('Charlie')

			// Verify picker/dealer consistency
			const picker = finalState.getCurrentPicker()
			const dealer = finalState.getCurrentDealer()

			expect(picker).toBeDefined()
			expect(dealer).toBeDefined()
			expect(picker?.id).toBe(dealer?.id)
			expect(picker?.name).toBe('Charlie')
			expect(dealer?.name).toBe('Charlie')

			// Verify index calculations
			const pickerIndex = finalState.currentPickerIndex
			const dealerIndex = finalState.calculateDealerIndex(pickerIndex)
			expect(pickerIndex).toBe(dealerIndex)

			// Verify the remaining player is not eliminated
			expect(picker?.isEliminated).toBe(false)
			expect(dealer?.isEliminated).toBe(false)
		})
	})

	describe('Mathematical edge case verification', () => {
		it('should correctly calculate dealer index when only one player exists', () => {
			const initialState = useGameStore.getState()
			const players = [...initialState.players]

			// Eliminate all but one player
			store.eliminatePlayerManually(players[1].id)
			store.eliminatePlayerManually(players[2].id)
			store.eliminatePlayerManually(players[3].id)

			const finalState = useGameStore.getState()
			const activePlayers = finalState.players.filter(p => !p.isEliminated)

			// Find the index of the remaining active player in the full players array
			const remainingPlayer = activePlayers[0]
			const remainingPlayerIndex = finalState.players.findIndex(p => p.id === remainingPlayer.id)

			// Verify mathematical calculation: (pickerIndex - 1 + playersLength) % playersLength
			// With only 1 active player, this should resolve to the same index
			const pickerIndex = finalState.currentPickerIndex
			const calculatedDealerIndex = finalState.calculateDealerIndex(pickerIndex)

			expect(pickerIndex).toBe(calculatedDealerIndex)
			expect(finalState.players[pickerIndex].id).toBe(remainingPlayer.id)
			expect(finalState.players[calculatedDealerIndex].id).toBe(remainingPlayer.id)
		})
	})
})
