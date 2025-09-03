import { GameSettings, GameType, GameMode } from '@/store/gameStore'

/**
 * Strategy interface for handling game type specific settings
 */
export interface GameTypeStrategy {
	/**
	 * Apply game type specific settings to the current settings
	 * @param currentSettings - The current game settings
	 * @returns Partial settings to merge with current settings
	 */
	applySettings(currentSettings: GameSettings): Partial<GameSettings>
}

/**
 * Strategy for 5 Cards game type
 * - Points-based elimination game
 * - Fixed elimination score of 100
 * - No round limit
 */
export class FiveCardsStrategy implements GameTypeStrategy {
	applySettings(): Partial<GameSettings> {
		return {
			gameMode: 'points-based',
			eliminationScore: 100,
			maxRounds: undefined
		}
	}
}

/**
 * Strategy for Secret 7 game type
 * - Rounds-based game
 * - Fixed 7 rounds
 * - Preserves current elimination score
 */
export class Secret7Strategy implements GameTypeStrategy {
	applySettings(currentSettings: GameSettings): Partial<GameSettings> {
		return {
			gameMode: 'rounds-based',
			maxRounds: 7,
			eliminationScore: currentSettings.eliminationScore
		}
	}
}

/**
 * Strategy for Custom game type
 * - Restores previously saved custom preferences
 * - Allows full customization of game mode and settings
 */
export class CustomStrategy implements GameTypeStrategy {
	applySettings(currentSettings: GameSettings): Partial<GameSettings> {
		return {
			gameMode: currentSettings.customGameMode,
			eliminationScore: currentSettings.customEliminationScore,
			maxRounds: currentSettings.customMaxRounds
		}
	}
}

/**
 * Factory function to get the appropriate strategy for a game type
 */
export function getGameTypeStrategy(gameType: GameType): GameTypeStrategy {
	switch (gameType) {
		case '5-cards':
			return new FiveCardsStrategy()
		case 'secret-7':
			return new Secret7Strategy()
		case 'custom':
			return new CustomStrategy()
		default:
			// Fallback to 5-cards strategy for unknown types
			return new FiveCardsStrategy()
	}
}

/**
 * Registry of all available game type strategies
 * This approach avoids the switch statement in getGameTypeStrategy
 */
export const GAME_TYPE_STRATEGIES: Record<GameType, GameTypeStrategy> = {
	'5-cards': new FiveCardsStrategy(),
	'secret-7': new Secret7Strategy(),
	'custom': new CustomStrategy()
} as const
