import { Player, GameType, GameMode, GameSettings } from '@/store/gameStore'

export const createMockPlayer = (
	name: string,
	scores: number[] = [],
	isEliminated: boolean = false
): Player => ({
	id: `player-${name.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
	name,
	scores,
	totalScore: scores.reduce((sum, score) => sum + score, 0),
	isEliminated,
})

export const mockPlayers = (count: number, names?: string[]): Player[] => {
	const defaultNames = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Henry']
	const playerNames = names || defaultNames.slice(0, count)

	return playerNames.map(name => createMockPlayer(name))
}

export const createMockGameSettings = (
	gameType: GameType = '5-cards',
	gameMode: GameMode = 'points-based',
	eliminationScore: number = 100,
	maxRounds?: number
): GameSettings => ({
	gameType,
	gameMode,
	eliminationScore,
	maxRounds,
	customEliminationScore: 100,
	customMaxRounds: 7,
	customGameMode: 'points-based',
})

export const mockGameScenarios = {
	fiveCards: () => createMockGameSettings('5-cards', 'points-based', 100),
	secret7: () => createMockGameSettings('secret-7', 'rounds-based', 100, 7),
	customPoints: (eliminationScore: number = 150) =>
		createMockGameSettings('custom', 'points-based', eliminationScore),
	customRounds: (maxRounds: number = 10) =>
		createMockGameSettings('custom', 'rounds-based', 100, maxRounds),
}

export const mockScoreRounds = {
	// Standard scoring patterns for testing
	elimination: (playerCount: number) => {
		// Create scores that will eliminate players gradually
		const rounds = []
		for (let round = 0; round < 5; round++) {
			const scores = []
			for (let i = 0; i < playerCount; i++) {
				// Higher indexed players get higher scores (more likely to be eliminated)
				scores.push(Math.floor(Math.random() * 20) + (i * 10) + (round * 5))
			}
			rounds.push(scores)
		}
		return rounds
	},

	tie: (playerCount: number, tieScore: number = 50) => {
		// Create a tie scenario
		return [Array(playerCount).fill(tieScore)]
	},

	progressive: (playerCount: number, rounds: number = 3) => {
		// Progressive scoring where scores increase each round
		const scoreRounds = []
		for (let round = 0; round < rounds; round++) {
			const scores = []
			for (let i = 0; i < playerCount; i++) {
				scores.push((round + 1) * 10 + i * 5)
			}
			scoreRounds.push(scores)
		}
		return scoreRounds
	},
}
