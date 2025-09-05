import { GameSettings } from '@/store/gameStore'

/**
 * Validation result interface
 */
export interface ValidationResult {
	isValid: boolean
	errorMessage?: string
}

/**
 * Validates elimination score for points-based games using guard clauses
 * @param gameSettings - Current game settings
 * @param eliminationScoreInput - Input value from the form (optional)
 * @returns ValidationResult indicating if the elimination score is valid
 */
export function validateEliminationScore(
	gameSettings: GameSettings,
	eliminationScoreInput?: string
): ValidationResult {
	// Early return for rounds-based games - elimination score is not relevant
	if (gameSettings.gameMode === 'rounds-based') {
		return { isValid: true }
	}

	// Get the score value from input or current settings
	const scoreValue = eliminationScoreInput
		? Number(eliminationScoreInput)
		: gameSettings.eliminationScore

	// Guard clause: score must be greater than 0
	if (scoreValue <= 0) {
		return {
			isValid: false,
			errorMessage: 'Elimination score must be greater than 0 to start the game'
		}
	}

	return { isValid: true }
}

/**
 * Validates max rounds for rounds-based games using guard clauses
 * @param gameSettings - Current game settings
 * @returns ValidationResult indicating if the max rounds setting is valid
 */
export function validateMaxRounds(gameSettings: GameSettings): ValidationResult {
	// Early return for points-based games - max rounds is not relevant
	if (gameSettings.gameMode === 'points-based') {
		return { isValid: true }
	}

	const maxRounds = gameSettings.maxRounds || 7

	// Guard clause: rounds must be greater than 0
	if (maxRounds <= 0) {
		return {
			isValid: false,
			errorMessage: 'Number of rounds must be greater than 0'
		}
	}

	return { isValid: true }
}

/**
 * Validates player count using guard clauses
 * @param playerCount - Number of players
 * @returns ValidationResult indicating if the player count is valid
 */
export function validatePlayerCount(playerCount: number): ValidationResult {
	// Guard clause: must have at least 2 players
	if (playerCount < 2) {
		return {
			isValid: false,
			errorMessage: 'Add at least 2 players to start the game'
		}
	}

	return { isValid: true }
}

/**
 * Validates all game settings using guard clauses
 * @param gameSettings - Current game settings
 * @param playerCount - Number of players
 * @param eliminationScoreInput - Optional elimination score input
 * @returns ValidationResult indicating if all settings are valid
 */
export function validateGameSettings(
	gameSettings: GameSettings,
	playerCount: number,
	eliminationScoreInput?: string
): ValidationResult {
	// Guard clause: validate player count first
	const playerValidation = validatePlayerCount(playerCount)
	if (!playerValidation.isValid) {
		return playerValidation
	}

	// Guard clause: validate elimination score for points-based games
	if (gameSettings.gameMode === 'points-based') {
		const eliminationValidation = validateEliminationScore(gameSettings, eliminationScoreInput)
		if (!eliminationValidation.isValid) {
			return eliminationValidation
		}
	}

	// Guard clause: validate max rounds for rounds-based games
	if (gameSettings.gameMode === 'rounds-based') {
		const roundsValidation = validateMaxRounds(gameSettings)
		if (!roundsValidation.isValid) {
			return roundsValidation
		}
	}

	// All validations passed
	return { isValid: true }
}

/**
 * Validates if a game can be started using guard clauses
 * @param gameSettings - Current game settings
 * @param playerCount - Number of players
 * @param eliminationScoreInput - Optional elimination score input
 * @returns boolean indicating if the game can be started
 */
export function canStartGame(
	gameSettings: GameSettings,
	playerCount: number,
	eliminationScoreInput?: string
): boolean {
	const validation = validateGameSettings(gameSettings, playerCount, eliminationScoreInput)
	return validation.isValid
}

/**
 * Gets validation error message using guard clauses
 * @param gameSettings - Current game settings
 * @param playerCount - Number of players
 * @param eliminationScoreInput - Optional elimination score input
 * @returns Error message or undefined if valid
 */
export function getValidationError(
	gameSettings: GameSettings,
	playerCount: number,
	eliminationScoreInput?: string
): string | undefined {
	const validation = validateGameSettings(gameSettings, playerCount, eliminationScoreInput)
	return validation.errorMessage
}
