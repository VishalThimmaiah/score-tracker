import { describe, it, expect } from 'vitest'
import { PLAYER_THEME_STRATEGIES } from '@/strategies/playerThemeStrategies'
import { Player, ScoreDifference } from '@/store/gameStore'

describe('Unit Tests: Dealer Picker Color Logic', () => {
	// Helper function to create a test player
	const createTestPlayer = (
		name: string,
		totalScore: number,
		isEliminated: boolean = false
	): Player => ({
		id: `player-${name.toLowerCase()}`,
		name,
		scores: [totalScore],
		totalScore,
		isEliminated
	})

	// Helper function to create score difference
	const createScoreDifference = (
		playerId: string,
		difference: number,
		isLeader: boolean = false,
		hasMultipleLeaders: boolean = false
	): ScoreDifference => ({
		playerId,
		difference,
		isLeader,
		hasMultipleLeaders
	})

	describe('Points-Based Game Mode', () => {
		const strategy = PLAYER_THEME_STRATEGIES['points-based']
		const eliminationScore = 100

		describe('Dealer Badge Colors', () => {
			it('should always use rose color for dealer badge in active players', () => {
				const player = createTestPlayer('Alice', 25)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.dealerBadge).toBe('bg-rose-600 dark:bg-rose-500 text-white')
			})

			it('should use gray color for dealer badge in eliminated players', () => {
				const player = createTestPlayer('Bob', 100, true)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.dealerBadge).toBe('bg-gray-600 dark:bg-gray-500 text-white')
			})
		})

		describe('Picker Badge Colors - Dynamic Based on Score', () => {
			it('should use green picker badge for low scores (< 25%)', () => {
				const player = createTestPlayer('Alice', 20) // 20% of 100
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.pickerBadge).toBe('bg-green-600 dark:bg-green-500 text-white')
			})

			it('should use yellow picker badge for medium-low scores (25-49%)', () => {
				const player = createTestPlayer('Bob', 40) // 40% of 100
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.pickerBadge).toBe('bg-yellow-600 dark:bg-yellow-500 text-white')
			})

			it('should use orange picker badge for medium-high scores (50-74%)', () => {
				const player = createTestPlayer('Charlie', 60) // 60% of 100
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.pickerBadge).toBe('bg-orange-600 dark:bg-orange-500 text-white')
			})

			it('should use red picker badge for high scores (≥ 75%)', () => {
				const player = createTestPlayer('Diana', 80) // 80% of 100
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.pickerBadge).toBe('bg-red-600 dark:bg-red-500 text-white')
			})

			it('should use gray picker badge for eliminated players', () => {
				const player = createTestPlayer('Eve', 100, true)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.pickerBadge).toBe('bg-gray-700 dark:bg-gray-600 text-white')
			})
		})

		describe('Edge Cases for Points-Based', () => {
			it('should handle zero elimination score', () => {
				const player = createTestPlayer('Alice', 50)
				const theme = strategy.getTheme(player, 0)

				// Should default to green (< 25% category) when elimination score is 0
				expect(theme.pickerBadge).toBe('bg-green-600 dark:bg-green-500 text-white')
			})

			it('should handle exact boundary values', () => {
				// Exactly 25%
				const player25 = createTestPlayer('Player25', 25)
				const theme25 = strategy.getTheme(player25, eliminationScore)
				expect(theme25.pickerBadge).toBe('bg-yellow-600 dark:bg-yellow-500 text-white')

				// Exactly 50%
				const player50 = createTestPlayer('Player50', 50)
				const theme50 = strategy.getTheme(player50, eliminationScore)
				expect(theme50.pickerBadge).toBe('bg-orange-600 dark:bg-orange-500 text-white')

				// Exactly 75%
				const player75 = createTestPlayer('Player75', 75)
				const theme75 = strategy.getTheme(player75, eliminationScore)
				expect(theme75.pickerBadge).toBe('bg-red-600 dark:bg-red-500 text-white')
			})
		})
	})

	describe('Rounds-Based Game Mode', () => {
		const strategy = PLAYER_THEME_STRATEGIES['rounds-based']
		const eliminationScore = 100 // Not used in rounds-based, but required parameter

		describe('Dealer Badge Colors', () => {
			it('should always use rose color for dealer badge in active players', () => {
				const player = createTestPlayer('Alice', 25)
				const scoreDiff = createScoreDifference(player.id, 0, true)
				const theme = strategy.getTheme(player, eliminationScore, scoreDiff)

				expect(theme.dealerBadge).toBe('bg-rose-600 dark:bg-rose-500 text-white')
			})

			it('should use gray color for dealer badge in eliminated players', () => {
				const player = createTestPlayer('Bob', 100, true)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.dealerBadge).toBe('bg-gray-600 dark:bg-gray-500 text-white')
			})
		})

		describe('Picker Badge Colors - Static Indigo', () => {
			it('should use static indigo picker badge for leaders', () => {
				const player = createTestPlayer('Alice', 10)
				const scoreDiff = createScoreDifference(player.id, 0, true)
				const theme = strategy.getTheme(player, eliminationScore, scoreDiff)

				expect(theme.pickerBadge).toBe('bg-indigo-600 dark:bg-indigo-500 text-white')
			})

			it('should use static indigo picker badge for non-leaders', () => {
				const player = createTestPlayer('Bob', 25)
				const scoreDiff = createScoreDifference(player.id, 15, false)
				const theme = strategy.getTheme(player, eliminationScore, scoreDiff)

				expect(theme.pickerBadge).toBe('bg-indigo-600 dark:bg-indigo-500 text-white')
			})

			it('should use gray picker badge for eliminated players', () => {
				const player = createTestPlayer('Charlie', 50, true)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.pickerBadge).toBe('bg-gray-700 dark:bg-gray-600 text-white')
			})
		})

		describe('Leader vs Non-Leader Themes', () => {
			it('should use green background for leaders', () => {
				const player = createTestPlayer('Leader', 10)
				const scoreDiff = createScoreDifference(player.id, 0, true)
				const theme = strategy.getTheme(player, eliminationScore, scoreDiff)

				expect(theme.background).toBe('bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600')
				expect(theme.progress).toBe('bg-green-500 dark:bg-green-400')
			})

			it('should use gray background for non-leaders', () => {
				const player = createTestPlayer('NonLeader', 25)
				const scoreDiff = createScoreDifference(player.id, 15, false)
				const theme = strategy.getTheme(player, eliminationScore, scoreDiff)

				expect(theme.background).toBe('bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600')
				expect(theme.progress).toBe('bg-gray-500 dark:bg-gray-400')
			})
		})
	})

	describe('Withdrawal Badge Colors', () => {
		it('should always use amber color for withdrawal badge in points-based mode', () => {
			const strategy = PLAYER_THEME_STRATEGIES['points-based']
			const player = createTestPlayer('Alice', 50)
			const theme = strategy.getTheme(player, 100)

			expect(theme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
		})

		it('should always use amber color for withdrawal badge in rounds-based mode', () => {
			const strategy = PLAYER_THEME_STRATEGIES['rounds-based']
			const player = createTestPlayer('Bob', 25)
			const scoreDiff = createScoreDifference(player.id, 0, true)
			const theme = strategy.getTheme(player, 100, scoreDiff)

			expect(theme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
		})

		it('should use amber withdrawal badge even for eliminated players', () => {
			const strategy = PLAYER_THEME_STRATEGIES['points-based']
			const player = createTestPlayer('Charlie', 100, true)
			const theme = strategy.getTheme(player, 100)

			expect(theme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
		})
	})

	describe('Strategy Selection', () => {
		it('should have correct strategies for each game mode', () => {
			expect(PLAYER_THEME_STRATEGIES['points-based']).toBeDefined()
			expect(PLAYER_THEME_STRATEGIES['rounds-based']).toBeDefined()
		})

		it('should return different picker badge colors between game modes', () => {
			const player = createTestPlayer('TestPlayer', 50)
			const eliminationScore = 100

			// Points-based: should be orange (50% of elimination score)
			const pointsTheme = PLAYER_THEME_STRATEGIES['points-based'].getTheme(player, eliminationScore)
			expect(pointsTheme.pickerBadge).toBe('bg-orange-600 dark:bg-orange-500 text-white')

			// Rounds-based: should be static indigo
			const roundsTheme = PLAYER_THEME_STRATEGIES['rounds-based'].getTheme(player, eliminationScore)
			expect(roundsTheme.pickerBadge).toBe('bg-indigo-600 dark:bg-indigo-500 text-white')
		})
	})

	describe('Color Consistency', () => {
		it('should maintain consistent dealer badge color across all score ranges in points-based', () => {
			const strategy = PLAYER_THEME_STRATEGIES['points-based']
			const eliminationScore = 100
			const expectedDealerBadge = 'bg-rose-600 dark:bg-rose-500 text-white'

			const scores = [10, 30, 60, 90]
			scores.forEach(score => {
				const player = createTestPlayer(`Player${score}`, score)
				const theme = strategy.getTheme(player, eliminationScore)
				expect(theme.dealerBadge).toBe(expectedDealerBadge)
			})
		})

		it('should maintain consistent picker badge color regardless of score in rounds-based', () => {
			const strategy = PLAYER_THEME_STRATEGIES['rounds-based']
			const eliminationScore = 100
			const expectedPickerBadge = 'bg-indigo-600 dark:bg-indigo-500 text-white'

			const scores = [10, 30, 60, 90]
			scores.forEach(score => {
				const player = createTestPlayer(`Player${score}`, score)
				const scoreDiff = createScoreDifference(player.id, 0, false)
				const theme = strategy.getTheme(player, eliminationScore, scoreDiff)
				expect(theme.pickerBadge).toBe(expectedPickerBadge)
			})
		})
	})
})
