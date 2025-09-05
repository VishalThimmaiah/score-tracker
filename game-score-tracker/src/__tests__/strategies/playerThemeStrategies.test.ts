import { describe, it, expect } from 'vitest'
import { PLAYER_THEME_STRATEGIES } from '@/strategies/playerThemeStrategies'
import { Player } from '@/store/gameStore'

describe('PlayerThemeStrategies', () => {
	describe('PointsBasedThemeStrategy', () => {
		const strategy = PLAYER_THEME_STRATEGIES['points-based']
		const eliminationScore = 100

		const createMockPlayer = (totalScore: number): Player => ({
			id: '1',
			name: 'Test Player',
			scores: [totalScore],
			totalScore,
			isEliminated: false
		})

		it('should have consistent dealer colors and dynamic picker colors across all score ranges', () => {
			// Test different score percentages
			const testCases = [
				{ score: 10, description: 'low score (10%)', expectedPickerBadge: 'bg-green-600 dark:bg-green-500 text-white' },
				{ score: 30, description: 'medium-low score (30%)', expectedPickerBadge: 'bg-yellow-600 dark:bg-yellow-500 text-white' },
				{ score: 60, description: 'medium-high score (60%)', expectedPickerBadge: 'bg-orange-600 dark:bg-orange-500 text-white' },
				{ score: 90, description: 'high score (90%)', expectedPickerBadge: 'bg-red-600 dark:bg-red-500 text-white' }
			]

			const expectedDealerBadge = 'bg-rose-600 dark:bg-rose-500 text-white'

			testCases.forEach(({ score, description, expectedPickerBadge }) => {
				const player = createMockPlayer(score)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.dealerBadge, `Dealer badge should be consistent for ${description}`).toBe(expectedDealerBadge)
				expect(theme.pickerBadge, `Picker badge should be dynamic for ${description}`).toBe(expectedPickerBadge)
			})
		})

		it('should have different background colors based on score percentage', () => {
			const testCases = [
				{ score: 10, expectedBackground: 'bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600' },
				{ score: 30, expectedBackground: 'bg-yellow-100 dark:bg-yellow-800/60 text-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600' },
				{ score: 60, expectedBackground: 'bg-orange-100 dark:bg-orange-800/60 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-600' },
				{ score: 90, expectedBackground: 'bg-red-100 dark:bg-red-800/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-600' }
			]

			testCases.forEach(({ score, expectedBackground }) => {
				const player = createMockPlayer(score)
				const theme = strategy.getTheme(player, eliminationScore)

				expect(theme.background).toBe(expectedBackground)
			})
		})

		it('should handle eliminated players correctly', () => {
			const eliminatedPlayer: Player = {
				id: '1',
				name: 'Eliminated Player',
				scores: [100],
				totalScore: 100,
				isEliminated: true
			}

			const theme = strategy.getTheme(eliminatedPlayer, eliminationScore)

			expect(theme.background).toBe('bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600')
			expect(theme.dealerBadge).toBe('bg-gray-600 dark:bg-gray-500 text-white')
			expect(theme.pickerBadge).toBe('bg-gray-700 dark:bg-gray-600 text-white')
		})
	})

	describe('RoundsBasedThemeStrategy', () => {
		const strategy = PLAYER_THEME_STRATEGIES['rounds-based']
		const eliminationScore = 100

		const createMockPlayer = (totalScore: number): Player => ({
			id: '1',
			name: 'Test Player',
			scores: [totalScore],
			totalScore,
			isEliminated: false
		})

		it('should have consistent dealer and picker colors for both leaders and non-leaders', () => {
			const player = createMockPlayer(50)
			const expectedDealerBadge = 'bg-rose-600 dark:bg-rose-500 text-white'
			const expectedPickerBadge = 'bg-indigo-600 dark:bg-indigo-500 text-white'

			// Test as leader
			const leaderTheme = strategy.getTheme(player, eliminationScore, {
				playerId: '1',
				difference: 0,
				isLeader: true,
				hasMultipleLeaders: false
			})

			expect(leaderTheme.dealerBadge).toBe(expectedDealerBadge)
			expect(leaderTheme.pickerBadge).toBe(expectedPickerBadge)

			// Test as non-leader
			const nonLeaderTheme = strategy.getTheme(player, eliminationScore, {
				playerId: '1',
				difference: 10,
				isLeader: false,
				hasMultipleLeaders: false
			})

			expect(nonLeaderTheme.dealerBadge).toBe(expectedDealerBadge)
			expect(nonLeaderTheme.pickerBadge).toBe(expectedPickerBadge)
		})
	})
})
