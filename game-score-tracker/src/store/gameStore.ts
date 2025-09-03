import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { GAME_TYPE_STRATEGIES } from '@/strategies/gameTypeStrategies'
import { WINNER_CALCULATORS } from '@/strategies/winnerCalculators'
import { gameStateMachine } from '@/strategies/gameStateMachine'

export interface Player {
	id: string
	name: string
	scores: number[]
	totalScore: number
	isEliminated: boolean
}

export interface ScoreDifference {
	playerId: string
	difference: number
	isLeader: boolean
	hasMultipleLeaders: boolean
}

export type GameType = '5-cards' | 'secret-7' | 'custom'
export type GameMode = 'points-based' | 'rounds-based'

export interface GameSettings {
	gameType: GameType
	gameMode: GameMode
	eliminationScore: number
	maxRounds?: number
	// Custom mode preferences - preserved independently
	customEliminationScore: number
	customMaxRounds: number
	customGameMode: GameMode
}

export interface GameState {
	players: Player[]
	gameSettings: GameSettings
	gameStatus: 'setup' | 'playing' | 'finished'
	currentRound: number
	currentPickerIndex: number
}

interface GameActions {
	// Setup actions
	addPlayer: (name: string) => void
	removePlayer: (id: string) => void
	setPlayerOrder: (players: Player[]) => void
	setEliminationScore: (score: number) => void
	setGameType: (gameType: GameType) => void
	setGameMode: (gameMode: GameMode) => void
	setMaxRounds: (rounds: number) => void
	startGame: () => void

	// Game actions
	addRoundScores: (scores: { playerId: string; score: number }[]) => void
	setCurrentPickerIndex: (index: number) => void
	resetGame: () => void
	pauseGame: () => void
	clearScores: () => void

	// Utility actions
	getPlayerById: (id: string) => Player | undefined
	getSortedPlayers: () => Player[]
	getWinners: () => Player[]
	calculateDealerIndex: (pickerIndex: number) => number
	getCurrentPicker: () => Player | undefined
	getCurrentDealer: () => Player | undefined
	getScoreDifferences: () => ScoreDifference[]
}

type GameStore = GameState & GameActions

const initialState: GameState = {
	players: [],
	gameSettings: {
		gameType: '5-cards',
		gameMode: 'points-based',
		eliminationScore: 100,
		// Custom mode defaults
		customEliminationScore: 100,
		customMaxRounds: 7,
		customGameMode: 'points-based'
	},
	gameStatus: 'setup',
	currentRound: 0,
	currentPickerIndex: 0
}

export const useGameStore = create<GameStore>()(
	persist(
		(set, get) => ({
			...initialState,

			// Setup actions
			addPlayer: (name: string) => {
				const id = Date.now().toString() + Math.random().toString(36).substr(2, 9)
				const newPlayer: Player = {
					id,
					name: name.trim(),
					scores: [],
					totalScore: 0,
					isEliminated: false
				}

				set((state) => ({
					players: [...state.players, newPlayer]
				}))
			},

			removePlayer: (id: string) => {
				set((state) => {
					const playerIndex = state.players.findIndex(player => player.id === id)
					const newPlayers = state.players.filter(player => player.id !== id)

					// Adjust picker index if necessary
					let newPickerIndex = state.currentPickerIndex
					if (playerIndex <= state.currentPickerIndex && newPlayers.length > 0) {
						newPickerIndex = Math.max(0, state.currentPickerIndex - 1)
					}
					if (newPickerIndex >= newPlayers.length) {
						newPickerIndex = 0
					}

					return {
						players: newPlayers,
						currentPickerIndex: newPickerIndex
					}
				})
			},

			setPlayerOrder: (players: Player[]) => {
				set({ players })
			},

			setEliminationScore: (score: number) => {
				set((state) => ({
					gameSettings: {
						...state.gameSettings,
						eliminationScore: score,
						// Also update custom preference if in custom mode
						customEliminationScore: state.gameSettings.gameType === 'custom' ? score : state.gameSettings.customEliminationScore
					}
				}))
			},

			setGameType: (gameType: GameType) => {
				set((state) => {
					const currentSettings = state.gameSettings
					const newSettings = { ...currentSettings, gameType }

					// Save current custom settings if switching FROM custom
					if (currentSettings.gameType === 'custom') {
						newSettings.customEliminationScore = currentSettings.eliminationScore
						newSettings.customMaxRounds = currentSettings.maxRounds || 7
						newSettings.customGameMode = currentSettings.gameMode
					}

					// Apply game type specific settings using Strategy Pattern
					const strategy = GAME_TYPE_STRATEGIES[gameType]
					const strategySettings = strategy.applySettings(currentSettings)
					Object.assign(newSettings, strategySettings)

					return { gameSettings: newSettings }
				})
			},

			setGameMode: (gameMode: GameMode) => {
				set((state) => ({
					gameSettings: {
						...state.gameSettings,
						gameMode,
						// Also update custom preference if in custom mode
						customGameMode: state.gameSettings.gameType === 'custom' ? gameMode : state.gameSettings.customGameMode
					}
				}))
			},

			setMaxRounds: (rounds: number) => {
				set((state) => ({
					gameSettings: {
						...state.gameSettings,
						maxRounds: rounds,
						// Also update custom preference if in custom mode
						customMaxRounds: state.gameSettings.gameType === 'custom' ? rounds : state.gameSettings.customMaxRounds
					}
				}))
			},

			startGame: () => {
				const state = get()
				const context = {
					players: state.players,
					gameSettings: state.gameSettings,
					currentRound: state.currentRound
				}

				const newStatus = gameStateMachine.startGame(context)
				if (newStatus === 'playing') {
					set({
						gameStatus: newStatus,
						currentRound: 1
						// Don't reset currentPickerIndex - preserve user's selection
					})
				}
			},

			// Game actions
			addRoundScores: (scores: { playerId: string; score: number }[]) => {
				set((state) => {
					const { players, currentPickerIndex, gameSettings } = state
					const { gameMode, eliminationScore } = gameSettings

					const updatedPlayers = players.map(player => {
						const playerScore = scores.find(s => s.playerId === player.id)
						if (playerScore) {
							const newScores = [...player.scores, playerScore.score]
							const newTotalScore = newScores.reduce((sum, score) => sum + score, 0)

							// Only apply elimination logic for points-based games
							const isEliminated = gameMode === 'points-based' && newTotalScore >= eliminationScore

							return {
								...player,
								scores: newScores,
								totalScore: newTotalScore,
								isEliminated
							}
						}
						return player
					})

					// Find next active picker (skip eliminated players only in points-based games)
					const findNextActivePicker = (currentIndex: number, playersList: Player[]) => {
						const totalPlayers = playersList.length
						let nextIndex = (currentIndex + 1) % totalPlayers
						let attempts = 0

						// Only skip eliminated players in points-based games
						while (gameMode === 'points-based' && playersList[nextIndex].isEliminated && attempts < totalPlayers) {
							nextIndex = (nextIndex + 1) % totalPlayers
							attempts++
						}

						return nextIndex
					}

					const nextPickerIndex = findNextActivePicker(currentPickerIndex, updatedPlayers)
					const newRound = state.currentRound + 1

					// Use state machine to determine next game status
					const context = {
						players: updatedPlayers,
						gameSettings: gameSettings,
						currentRound: newRound
					}
					const gameStatus = gameStateMachine.getNextStateAfterRound(context)

					return {
						players: updatedPlayers,
						currentRound: newRound,
						currentPickerIndex: nextPickerIndex,
						gameStatus
					}
				})
			},

			setCurrentPickerIndex: (index: number) => {
				set({ currentPickerIndex: index })
			},

			resetGame: () => {
				const newStatus = gameStateMachine.resetGame()
				set({
					...initialState,
					gameStatus: newStatus
				})
			},

			pauseGame: () => {
				const newStatus = gameStateMachine.pauseGame()
				set(() => ({
					gameStatus: newStatus
				}))
			},

			clearScores: () => {
				set((state) => ({
					players: state.players.map(player => ({
						...player,
						scores: [],
						totalScore: 0,
						isEliminated: false
					})),
					currentRound: 0,
					currentPickerIndex: 0,
					gameStatus: 'setup'
				}))
			},

			// Utility actions
			getPlayerById: (id: string) => {
				return get().players.find(player => player.id === id)
			},

			getSortedPlayers: () => {
				return [...get().players].sort((a, b) => {
					// Eliminated players go to bottom
					if (a.isEliminated && !b.isEliminated) return 1
					if (!a.isEliminated && b.isEliminated) return -1

					// Sort by total score (lowest first)
					return a.totalScore - b.totalScore
				})
			},

			getWinners: () => {
				const { players, gameStatus, gameSettings } = get()
				if (gameStatus !== 'finished') return []

				// Use polymorphic winner calculator based on game mode
				const calculator = WINNER_CALCULATORS[gameSettings.gameMode]
				return calculator.calculateWinners(players)
			},

			calculateDealerIndex: (pickerIndex: number) => {
				const { players } = get()
				if (players.length === 0) return 0

				let dealerIndex = (pickerIndex - 1 + players.length) % players.length
				let attempts = 0

				while (players[dealerIndex].isEliminated && attempts < players.length) {
					dealerIndex = (dealerIndex - 1 + players.length) % players.length
					attempts++
				}

				return dealerIndex
			},

			getCurrentPicker: () => {
				const { players, currentPickerIndex } = get()
				return players[currentPickerIndex]
			},

			getCurrentDealer: () => {
				const { players, currentPickerIndex } = get()
				const dealerIndex = get().calculateDealerIndex(currentPickerIndex)
				return players[dealerIndex]
			},

			getScoreDifferences: () => {
				const { players, gameSettings } = get()

				// Return empty array if no players
				if (players.length === 0) {
					return []
				}

				// For points-based games, only consider active (non-eliminated) players
				const relevantPlayers = gameSettings.gameMode === 'points-based'
					? players.filter(p => !p.isEliminated)
					: players

				// Return empty array if no relevant players
				if (relevantPlayers.length === 0) {
					return []
				}

				// Find the minimum score among relevant players
				const minScore = Math.min(...relevantPlayers.map(p => p.totalScore))

				// Count how many players have the minimum score
				const leadersCount = relevantPlayers.filter(p => p.totalScore === minScore).length

				// Calculate differences for each player
				return players.map(player => {
					// For eliminated players in points-based games, don't show score differences
					if (gameSettings.gameMode === 'points-based' && player.isEliminated) {
						return {
							playerId: player.id,
							difference: 0,
							isLeader: false,
							hasMultipleLeaders: false
						}
					}

					return {
						playerId: player.id,
						difference: player.totalScore - minScore,
						isLeader: player.totalScore === minScore,
						hasMultipleLeaders: leadersCount > 1
					}
				})
			}
		}),
		{
			name: 'game-score-tracker-storage',
			version: 2,
			migrate: (persistedState: unknown, version: number) => {
				// Handle migration from version 1 to version 2
				if (version < 2) {
					// Add any missing fields that were added in version 2
					const state = persistedState as Partial<GameState>

					// Ensure gameSettings has all required fields
					if (state.gameSettings) {
						state.gameSettings = {
							gameType: state.gameSettings.gameType || '5-cards',
							gameMode: state.gameSettings.gameMode || 'points-based',
							eliminationScore: state.gameSettings.eliminationScore || 100,
							maxRounds: state.gameSettings.maxRounds,
							// Add new custom fields with defaults
							customEliminationScore: state.gameSettings.eliminationScore || 100,
							customMaxRounds: 7,
							customGameMode: state.gameSettings.gameMode || 'points-based'
						}
					}

					// Ensure currentPickerIndex exists
					if (typeof state.currentPickerIndex !== 'number') {
						state.currentPickerIndex = 0
					}

					// Ensure all players have required fields
					if (state.players) {
						state.players = state.players.map((player: Partial<Player>) => ({
							id: player.id || Date.now().toString(),
							name: player.name || 'Unknown Player',
							scores: player.scores || [],
							totalScore: player.totalScore || 0,
							isEliminated: player.isEliminated || false
						}))
					}
				}

				return persistedState
			}
		}
	)
)
