import { Player, GameMode } from '@/store/gameStore'

/**
 * Abstract base class for winner calculation strategies
 */
export abstract class WinnerCalculator {
	/**
	 * Calculate winners based on game mode specific rules
	 * @param players - Array of all players in the game
	 * @returns Array of winning players
	 */
	abstract calculateWinners(players: Player[]): Player[]

	/**
	 * Helper method to find all players with the lowest score
	 * @param players - Array of players to evaluate
	 * @returns Array of players with the lowest total score
	 */
	protected getPlayersWithLowestScore(players: Player[]): Player[] {
		if (players.length === 0) return []

		const lowestScore = Math.min(...players.map(p => p.totalScore))
		return players.filter(p => p.totalScore === lowestScore)
	}
}

/**
 * Winner calculator for points-based games
 * Rules:
 * - If only one active player remains, they win
 * - If all players are eliminated, lowest score wins
 * - Handles tie scenarios automatically
 */
export class PointsBasedWinnerCalculator extends WinnerCalculator {
	calculateWinners(players: Player[]): Player[] {
		if (players.length === 0) return []

		// Find active (non-eliminated) players
		const activePlayers = players.filter(p => !p.isEliminated)

		// If exactly one active player remains, they are the winner
		if (activePlayers.length === 1) {
			return activePlayers
		}

		// If all players are eliminated, find players with lowest score
		// This also handles ties automatically
		return this.getPlayersWithLowestScore(players)
	}
}

/**
 * Winner calculator for rounds-based games
 * Rules:
 * - All players remain active throughout the game
 * - Winner(s) have the lowest total score
 * - Handles tie scenarios automatically
 */
export class RoundsBasedWinnerCalculator extends WinnerCalculator {
	calculateWinners(players: Player[]): Player[] {
		// In rounds-based games, simply find all players with the lowest score
		return this.getPlayersWithLowestScore(players)
	}
}

/**
 * Factory function to get the appropriate winner calculator for a game mode
 */
export function getWinnerCalculator(gameMode: GameMode): WinnerCalculator {
	switch (gameMode) {
		case 'points-based':
			return new PointsBasedWinnerCalculator()
		case 'rounds-based':
			return new RoundsBasedWinnerCalculator()
		default:
			// Fallback to points-based calculator for unknown modes
			return new PointsBasedWinnerCalculator()
	}
}

/**
 * Registry of all available winner calculators
 * This approach avoids the switch statement in getWinnerCalculator
 */
export const WINNER_CALCULATORS: Record<GameMode, WinnerCalculator> = {
	'points-based': new PointsBasedWinnerCalculator(),
	'rounds-based': new RoundsBasedWinnerCalculator()
} as const
