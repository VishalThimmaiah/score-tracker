import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Player {
	id: string
	name: string
	scores: number[]
	totalScore: number
	isEliminated: boolean
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

					// Apply game type specific settings
					if (gameType === '5-cards') {
						newSettings.gameMode = 'points-based'
						newSettings.eliminationScore = 100
						newSettings.maxRounds = undefined
					} else if (gameType === 'secret-7') {
						newSettings.gameMode = 'rounds-based'
						newSettings.maxRounds = 7
						newSettings.eliminationScore = currentSettings.eliminationScore
					} else if (gameType === 'custom') {
						// Restore custom preferences
						newSettings.gameMode = currentSettings.customGameMode
						newSettings.eliminationScore = currentSettings.customEliminationScore
						newSettings.maxRounds = currentSettings.customMaxRounds
					}

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
				const { players } = get()
				if (players.length >= 2) {
					set({
						gameStatus: 'playing',
						currentRound: 1
						// Don't reset currentPickerIndex - preserve user's selection
					})
				}
			},

			// Game actions
			addRoundScores: (scores: { playerId: string; score: number }[]) => {
				set((state) => {
					const { players, currentPickerIndex, gameSettings } = state
					const { gameType, gameMode, eliminationScore, maxRounds } = gameSettings

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

					// Determine game status based on game type and mode
					let gameStatus: 'setup' | 'playing' | 'finished' = 'playing'

					if (gameMode === 'points-based') {
						// Points-based: End when only one player left or all eliminated
						const currentActivePlayers = updatedPlayers.filter(p => !p.isEliminated)
						gameStatus = currentActivePlayers.length <= 1 ? 'finished' : 'playing'
					} else if (gameMode === 'rounds-based') {
						// Rounds-based: End when max rounds reached
						const targetRounds = gameType === 'secret-7' ? 7 : (maxRounds || 7)
						gameStatus = newRound > targetRounds ? 'finished' : 'playing'
					}

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
				set(initialState)
			},

			pauseGame: () => {
				set(() => ({
					gameStatus: 'setup'
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

				const { gameMode } = gameSettings

				if (gameMode === 'points-based') {
					// Points-based: Winner is last active player, or lowest score if all eliminated
					const activePlayers = players.filter(p => !p.isEliminated)
					if (activePlayers.length === 1) {
						return activePlayers
					}
					// If all players are eliminated, find all players with lowest score
					const lowestScore = Math.min(...players.map(p => p.totalScore))
					return players.filter(p => p.totalScore === lowestScore)
				} else {
					// Rounds-based: Find all players with lowest total score
					const lowestScore = Math.min(...players.map(p => p.totalScore))
					return players.filter(p => p.totalScore === lowestScore)
				}
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
			}
		}),
		{
			name: 'game-score-tracker-storage',
			version: 2
		}
	)
)
