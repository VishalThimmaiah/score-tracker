import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Player {
	id: string
	name: string
	scores: number[]
	totalScore: number
	isEliminated: boolean
}

export interface GameSettings {
	eliminationScore: number
}

export interface GameState {
	players: Player[]
	gameSettings: GameSettings
	gameStatus: 'setup' | 'playing' | 'finished'
	currentRound: number
}

interface GameActions {
	// Setup actions
	addPlayer: (name: string) => void
	removePlayer: (id: string) => void
	setEliminationScore: (score: number) => void
	startGame: () => void

	// Game actions
	addRoundScores: (scores: { playerId: string; score: number }[]) => void
	resetGame: () => void
	pauseGame: () => void
	clearScores: () => void

	// Utility actions
	getPlayerById: (id: string) => Player | undefined
	getSortedPlayers: () => Player[]
	getWinner: () => Player | undefined
}

type GameStore = GameState & GameActions

const initialState: GameState = {
	players: [],
	gameSettings: {
		eliminationScore: 100
	},
	gameStatus: 'setup',
	currentRound: 0
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
				set((state) => ({
					players: state.players.filter(player => player.id !== id)
				}))
			},

			setEliminationScore: (score: number) => {
				set((state) => ({
					gameSettings: {
						...state.gameSettings,
						eliminationScore: score
					}
				}))
			},

			startGame: () => {
				const { players } = get()
				if (players.length >= 2) {
					set({
						gameStatus: 'playing',
						currentRound: 1
					})
				}
			},

			// Game actions
			addRoundScores: (scores: { playerId: string; score: number }[]) => {
				set((state) => {
					const updatedPlayers = state.players.map(player => {
						const playerScore = scores.find(s => s.playerId === player.id)
						if (playerScore) {
							const newScores = [...player.scores, playerScore.score]
							const newTotalScore = newScores.reduce((sum, score) => sum + score, 0)
							const isEliminated = newTotalScore >= state.gameSettings.eliminationScore

							return {
								...player,
								scores: newScores,
								totalScore: newTotalScore,
								isEliminated
							}
						}
						return player
					})

					// Check if game should end (only one player left or all eliminated)
					const activePlayers = updatedPlayers.filter(p => !p.isEliminated)
					const gameStatus = activePlayers.length <= 1 ? 'finished' : 'playing'

					return {
						players: updatedPlayers,
						currentRound: state.currentRound + 1,
						gameStatus
					}
				})
			},

			resetGame: () => {
				set(initialState)
			},

			pauseGame: () => {
				set((state) => ({
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

			getWinner: () => {
				const { players, gameStatus } = get()
				if (gameStatus !== 'finished') return undefined

				const activePlayers = players.filter(p => !p.isEliminated)
				if (activePlayers.length === 1) {
					return activePlayers[0]
				}

				// If all players are eliminated, winner is the one with lowest score
				return players.reduce((winner, player) =>
					player.totalScore < winner.totalScore ? player : winner
				)
			}
		}),
		{
			name: 'game-score-tracker-storage',
			version: 1
		}
	)
)
