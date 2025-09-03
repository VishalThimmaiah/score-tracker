import { mockPlayers, mockScoreRounds } from './mock-data'
import { useGameStore } from '@/store/gameStore'
import type { GameType, GameMode, Player } from '@/store/gameStore'

// Fluent API for game testing using the real store
export class GameFlowBuilder {
	private players: Player[] = []

	constructor() {
		// Properly reset the store state including persistence
		this.resetStore()
	}

	private resetStore(): void {
		// Clear the store completely and reset to initial state
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
	}

	// Player management
	addPlayers(count: number): this
	addPlayers(names: string[]): this
	addPlayers(countOrNames: number | string[]): this {
		if (typeof countOrNames === 'number') {
			this.players = mockPlayers(countOrNames)
		} else {
			this.players = mockPlayers(countOrNames.length, countOrNames)
		}

		// Add players to real store
		this.players.forEach((player: Player) => {
			useGameStore.getState().addPlayer(player.name)
		})

		return this
	}

	// Game type setup
	setGameType(gameType: GameType): this {
		useGameStore.getState().setGameType(gameType)
		return this
	}

	setGameMode(gameMode: GameMode): this {
		useGameStore.getState().setGameMode(gameMode)
		return this
	}

	setEliminationScore(score: number): this {
		useGameStore.getState().setEliminationScore(score)
		return this
	}

	setMaxRounds(rounds: number): this {
		useGameStore.getState().setMaxRounds(rounds)
		return this
	}

	// Quick setup methods
	setup5CardsGame(playerCount: number = 3): this {
		return this
			.addPlayers(playerCount)
			.setGameType('5-cards')
			.startGame()
	}

	setupSecret7Game(playerCount: number = 3): this {
		return this
			.addPlayers(playerCount)
			.setGameType('secret-7')
			.startGame()
	}

	setupCustomPointsGame(playerCount: number = 3, eliminationScore: number = 150): this {
		return this
			.addPlayers(playerCount)
			.setGameType('custom')
			.setGameMode('points-based')
			.setEliminationScore(eliminationScore)
			.startGame()
	}

	setupCustomRoundsGame(playerCount: number = 3, maxRounds: number = 5): this {
		return this
			.addPlayers(playerCount)
			.setGameType('custom')
			.setGameMode('rounds-based')
			.setMaxRounds(maxRounds)
			.startGame()
	}

	// Game flow
	startGame(): this {
		useGameStore.getState().startGame()
		return this
	}

	// Score management
	playRound(scores: number[]): this {
		const players = useGameStore.getState().players
		const scoreData = players.map((player: Player, index: number) => ({
			playerId: player.id,
			score: scores[index] || 0
		}))

		useGameStore.getState().addRoundScores(scoreData)
		return this
	}

	playRounds(rounds: number[][]): this {
		rounds.forEach((roundScores: number[]) => {
			this.playRound(roundScores)
		})
		return this
	}

	// Play until elimination (for points-based games)
	playToElimination(): this {
		const state = useGameStore.getState()
		if (state.gameSettings.gameMode !== 'points-based') {
			throw new Error('playToElimination only works with points-based games')
		}

		const playerCount = state.players.length
		const eliminationRounds = mockScoreRounds.elimination(playerCount)

		return this.playRounds(eliminationRounds)
	}

	// Play complete game (for rounds-based games)
	playCompleteGame(): this {
		const state = useGameStore.getState()
		if (state.gameSettings.gameMode !== 'rounds-based') {
			throw new Error('playCompleteGame only works with rounds-based games')
		}

		const playerCount = state.players.length
		const maxRounds = state.gameSettings.maxRounds || 7
		const gameRounds = mockScoreRounds.progressive(playerCount, maxRounds)

		return this.playRounds(gameRounds)
	}

	// Create tie scenario
	createTie(tieScore: number = 50): this {
		const playerCount = useGameStore.getState().players.length
		const tieRounds = mockScoreRounds.tie(playerCount, tieScore)
		return this.playRounds(tieRounds)
	}

	// Assertions
	expectGameStatus(status: 'setup' | 'playing' | 'finished'): this {
		const currentStatus = useGameStore.getState().gameStatus
		if (currentStatus !== status) {
			throw new Error(`Expected game status '${status}', got '${currentStatus}'`)
		}
		return this
	}

	expectWinner(playerName?: string): this {
		const state = useGameStore.getState()
		const winners = state.getWinners()

		if (!playerName) {
			if (winners.length === 0) {
				throw new Error('Expected a winner, but no winners found')
			}
			return this
		}

		const winner = winners.find((w: Player) => w.name === playerName)
		if (!winner) {
			const winnerNames = winners.map((w: Player) => w.name).join(', ')
			throw new Error(`Expected winner '${playerName}', but winners are: ${winnerNames}`)
		}
		return this
	}

	expectWinners(playerNames: string[]): this {
		const winners = useGameStore.getState().getWinners()
		const winnerNames = winners.map((w: Player) => w.name).sort()
		const expectedNames = playerNames.sort()

		if (JSON.stringify(winnerNames) !== JSON.stringify(expectedNames)) {
			throw new Error(`Expected winners [${expectedNames.join(', ')}], got [${winnerNames.join(', ')}]`)
		}
		return this
	}

	expectNoWinners(): this {
		const winners = useGameStore.getState().getWinners()
		if (winners.length > 0) {
			const winnerNames = winners.map((w: Player) => w.name).join(', ')
			throw new Error(`Expected no winners, but found: ${winnerNames}`)
		}
		return this
	}

	expectPlayerEliminated(playerName: string): this {
		const player = useGameStore.getState().players.find((p: Player) => p.name === playerName)
		if (!player) {
			throw new Error(`Player '${playerName}' not found`)
		}
		if (!player.isEliminated) {
			throw new Error(`Expected player '${playerName}' to be eliminated`)
		}
		return this
	}

	expectPlayerActive(playerName: string): this {
		const player = useGameStore.getState().players.find((p: Player) => p.name === playerName)
		if (!player) {
			throw new Error(`Player '${playerName}' not found`)
		}
		if (player.isEliminated) {
			throw new Error(`Expected player '${playerName}' to be active`)
		}
		return this
	}

	expectRound(roundNumber: number): this {
		const currentRound = useGameStore.getState().currentRound
		if (currentRound !== roundNumber) {
			throw new Error(`Expected round ${roundNumber}, got ${currentRound}`)
		}
		return this
	}

	expectPlayerScore(playerName: string, expectedScore: number): this {
		const player = useGameStore.getState().players.find((p: Player) => p.name === playerName)
		if (!player) {
			throw new Error(`Player '${playerName}' not found`)
		}
		if (player.totalScore !== expectedScore) {
			throw new Error(`Expected player '${playerName}' to have score ${expectedScore}, got ${player.totalScore}`)
		}
		return this
	}

	// Get current state for custom assertions
	getState() {
		return useGameStore.getState()
	}

	// Get store instance for advanced testing
	getStore() {
		return useGameStore
	}
}

// Factory function for fluent API
export const gameFlow = () => new GameFlowBuilder()
