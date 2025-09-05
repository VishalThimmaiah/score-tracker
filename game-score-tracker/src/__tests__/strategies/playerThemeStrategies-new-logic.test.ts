import { describe, it, expect } from 'vitest'
import {
	PLAYER_THEME_STRATEGIES,
	PointsBasedThemeStrategy,
	RoundsBasedThemeStrategy
} from '@/strategies/playerThemeStrategies'
import { Player, ScoreDifference } from '@/store/gameStore'

describe('PlayerThemeStrategies - New Logic', () => {
	describe('PointsBasedThemeStrategy', () => {
		const strategy = new PointsBasedThemeStrategy()
		const eliminationScore = 100

		const createMockPlayer = (totalScore: number, isEliminated = false, withdrawnManually = false): Player => ({
			id: '1',
			name: 'Test Player',
			scores: [totalScore],
			totalScore,
			isEliminated,
			withdrawnManually
		})

		describe('Badge Color Consistency', () => {
			it('should always use rose color for dealer badge', () => {
				const expectedDealerBadge = 'bg-rose-600 dark:bg-rose-500 text-white'

				// Test across all score ranges
				const testScores = [0, 10, 25, 40, 50, 60, 75, 90, 99]

				testScores.forEach(score => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.dealerBadge).toBe(expectedDealerBadge)
				})
			})

			it('should always use amber color for withdrawal badge', () => {
				const expectedWithdrawalBadge = 'bg-amber-600 dark:bg-amber-500 text-white'

				// Test across all score ranges
				const testScores = [0, 10, 25, 40, 50, 60, 75, 90, 99]

				testScores.forEach(score => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.withdrawalBadge).toBe(expectedWithdrawalBadge)
				})
			})

			it('should use dynamic picker badge colors that match card background', () => {
				const testCases = [
					{ score: 10, expectedPicker: 'bg-green-600 dark:bg-green-500 text-white' }, // < 25%
					{ score: 30, expectedPicker: 'bg-yellow-600 dark:bg-yellow-500 text-white' }, // 25-50%
					{ score: 60, expectedPicker: 'bg-orange-600 dark:bg-orange-500 text-white' }, // 50-75%
					{ score: 90, expectedPicker: 'bg-red-600 dark:bg-red-500 text-white' } // >= 75%
				]

				testCases.forEach(({ score, expectedPicker }) => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.pickerBadge).toBe(expectedPicker)
				})
			})
		})

		describe('Score Percentage Calculation', () => {
			it('should calculate correct score percentages', () => {
				const testCases = [
					{ score: 0, eliminationScore: 100, expectedPercentage: 0 },
					{ score: 25, eliminationScore: 100, expectedPercentage: 25 },
					{ score: 50, eliminationScore: 100, expectedPercentage: 50 },
					{ score: 75, eliminationScore: 100, expectedPercentage: 75 },
					{ score: 100, eliminationScore: 100, expectedPercentage: 100 },
					{ score: 30, eliminationScore: 120, expectedPercentage: 25 }, // 30/120 = 25%
				]

				testCases.forEach(({ score, eliminationScore, expectedPercentage }) => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					// We can infer the percentage from the background color
					if (expectedPercentage < 25) {
						expect(theme.background).toContain('bg-green-100')
					} else if (expectedPercentage < 50) {
						expect(theme.background).toContain('bg-yellow-100')
					} else if (expectedPercentage < 75) {
						expect(theme.background).toContain('bg-orange-100')
					} else {
						expect(theme.background).toContain('bg-red-100')
					}
				})
			})

			it('should handle zero elimination score gracefully', () => {
				const player = createMockPlayer(50)
				const theme = strategy.getTheme(player, 0)

				// Should default to green theme when elimination score is 0
				expect(theme.background).toContain('bg-green-100')
				expect(theme.pickerBadge).toBe('bg-green-600 dark:bg-green-500 text-white')
			})
		})

		describe('Theme Ranges', () => {
			it('should apply green theme for scores < 25%', () => {
				const testScores = [0, 10, 20, 24]

				testScores.forEach(score => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.background).toBe('bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600')
					expect(theme.progress).toBe('bg-green-500 dark:bg-green-400')
					expect(theme.pickerBadge).toBe('bg-green-600 dark:bg-green-500 text-white')
				})
			})

			it('should apply yellow theme for scores 25% <= x < 50%', () => {
				const testScores = [25, 30, 40, 49]

				testScores.forEach(score => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.background).toBe('bg-yellow-100 dark:bg-yellow-800/60 text-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600')
					expect(theme.progress).toBe('bg-yellow-500 dark:bg-yellow-400')
					expect(theme.pickerBadge).toBe('bg-yellow-600 dark:bg-yellow-500 text-white')
				})
			})

			it('should apply orange theme for scores 50% <= x < 75%', () => {
				const testScores = [50, 60, 70, 74]

				testScores.forEach(score => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.background).toBe('bg-orange-100 dark:bg-orange-800/60 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-600')
					expect(theme.progress).toBe('bg-orange-500 dark:bg-orange-400')
					expect(theme.pickerBadge).toBe('bg-orange-600 dark:bg-orange-500 text-white')
				})
			})

			it('should apply red theme for scores >= 75%', () => {
				const testScores = [75, 80, 90, 99, 100]

				testScores.forEach(score => {
					const player = createMockPlayer(score)
					const theme = strategy.getTheme(player, eliminationScore)

					expect(theme.background).toBe('bg-red-100 dark:bg-red-800/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-600')
					expect(theme.progress).toBe('bg-red-500 dark:bg-red-400')
					expect(theme.pickerBadge).toBe('bg-red-600 dark:bg-red-500 text-white')
				})
			})
		})

		describe('Eliminated Players', () => {
			it('should apply gray theme for eliminated players', () => {
				const eliminatedPlayer = createMockPlayer(100, true)
				const theme = strategy.getTheme(eliminatedPlayer, eliminationScore)

				expect(theme.background).toBe('bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600')
				expect(theme.progress).toBe('bg-gray-600 dark:bg-gray-500')
				expect(theme.dealerBadge).toBe('bg-gray-600 dark:bg-gray-500 text-white')
				expect(theme.pickerBadge).toBe('bg-gray-700 dark:bg-gray-600 text-white')
				expect(theme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
			})

			it('should apply gray theme regardless of withdrawal status', () => {
				const eliminatedPlayer = createMockPlayer(50, true, true)
				const theme = strategy.getTheme(eliminatedPlayer, eliminationScore)

				expect(theme.background).toBe('bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600')
				expect(theme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
			})
		})
	})

	describe('RoundsBasedThemeStrategy', () => {
		const strategy = new RoundsBasedThemeStrategy()
		const eliminationScore = 100

		const createMockPlayer = (totalScore: number, isEliminated = false): Player => ({
			id: '1',
			name: 'Test Player',
			scores: [totalScore],
			totalScore,
			isEliminated
		})

		const createScoreDifference = (isLeader: boolean, difference = 0, hasMultipleLeaders = false): ScoreDifference => ({
			playerId: '1',
			difference,
			isLeader,
			hasMultipleLeaders
		})

		describe('Badge Color Consistency', () => {
			it('should always use rose color for dealer badge', () => {
				const expectedDealerBadge = 'bg-rose-600 dark:bg-rose-500 text-white'
				const player = createMockPlayer(50)

				// Test as leader
				const leaderTheme = strategy.getTheme(player, eliminationScore, createScoreDifference(true))
				expect(leaderTheme.dealerBadge).toBe(expectedDealerBadge)

				// Test as non-leader
				const nonLeaderTheme = strategy.getTheme(player, eliminationScore, createScoreDifference(false, 10))
				expect(nonLeaderTheme.dealerBadge).toBe(expectedDealerBadge)
			})

			it('should always use static indigo color for picker badge', () => {
				const expectedPickerBadge = 'bg-indigo-600 dark:bg-indigo-500 text-white'
				const player = createMockPlayer(50)

				// Test as leader
				const leaderTheme = strategy.getTheme(player, eliminationScore, createScoreDifference(true))
				expect(leaderTheme.pickerBadge).toBe(expectedPickerBadge)

				// Test as non-leader
				const nonLeaderTheme = strategy.getTheme(player, eliminationScore, createScoreDifference(false, 10))
				expect(nonLeaderTheme.pickerBadge).toBe(expectedPickerBadge)
			})

			it('should always use amber color for withdrawal badge', () => {
				const expectedWithdrawalBadge = 'bg-amber-600 dark:bg-amber-500 text-white'
				const player = createMockPlayer(50)

				// Test as leader
				const leaderTheme = strategy.getTheme(player, eliminationScore, createScoreDifference(true))
				expect(leaderTheme.withdrawalBadge).toBe(expectedWithdrawalBadge)

				// Test as non-leader
				const nonLeaderTheme = strategy.getTheme(player, eliminationScore, createScoreDifference(false, 10))
				expect(nonLeaderTheme.withdrawalBadge).toBe(expectedWithdrawalBadge)
			})
		})

		describe('Leader vs Non-Leader Themes', () => {
			it('should apply green theme for leaders', () => {
				const player = createMockPlayer(50)
				const scoreDifference = createScoreDifference(true)
				const theme = strategy.getTheme(player, eliminationScore, scoreDifference)

				expect(theme.background).toBe('bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600')
				expect(theme.progress).toBe('bg-green-500 dark:bg-green-400')
			})

			it('should apply gray theme for non-leaders', () => {
				const player = createMockPlayer(60)
				const scoreDifference = createScoreDifference(false, 10)
				const theme = strategy.getTheme(player, eliminationScore, scoreDifference)

				expect(theme.background).toBe('bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600')
				expect(theme.progress).toBe('bg-gray-500 dark:bg-gray-400')
			})

			it('should handle multiple leaders correctly', () => {
				const player = createMockPlayer(30)
				const scoreDifference = createScoreDifference(true, 0, true)
				const theme = strategy.getTheme(player, eliminationScore, scoreDifference)

				expect(theme.background).toBe('bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600')
			})

			it('should handle missing score difference', () => {
				const player = createMockPlayer(50)
				const theme = strategy.getTheme(player, eliminationScore)

				// Should default to non-leader theme
				expect(theme.background).toBe('bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600')
			})
		})

		describe('Eliminated Players', () => {
			it('should apply gray theme for eliminated players regardless of leader status', () => {
				const eliminatedPlayer = createMockPlayer(100, true)
				const leaderScoreDifference = createScoreDifference(true)
				const theme = strategy.getTheme(eliminatedPlayer, eliminationScore, leaderScoreDifference)

				expect(theme.background).toBe('bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600')
				expect(theme.progress).toBe('bg-gray-600 dark:bg-gray-500')
				expect(theme.dealerBadge).toBe('bg-gray-600 dark:bg-gray-500 text-white')
				expect(theme.pickerBadge).toBe('bg-gray-700 dark:bg-gray-600 text-white')
				expect(theme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
			})
		})
	})

	describe('Strategy Factory', () => {
		it('should return correct strategy instances', () => {
			const pointsStrategy = PLAYER_THEME_STRATEGIES['points-based']
			const roundsStrategy = PLAYER_THEME_STRATEGIES['rounds-based']

			expect(pointsStrategy).toBeInstanceOf(PointsBasedThemeStrategy)
			expect(roundsStrategy).toBeInstanceOf(RoundsBasedThemeStrategy)
		})
	})

	describe('Withdrawal Logic Integration', () => {
		it('should handle withdrawal badge consistently across both strategies', () => {
			const player: Player = {
				id: '1',
				name: 'Test Player',
				scores: [50],
				totalScore: 50,
				isEliminated: false,
				withdrawnManually: true
			}

			const pointsTheme = PLAYER_THEME_STRATEGIES['points-based'].getTheme(player, 100)
			const roundsTheme = PLAYER_THEME_STRATEGIES['rounds-based'].getTheme(player, 100)

			expect(pointsTheme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
			expect(roundsTheme.withdrawalBadge).toBe('bg-amber-600 dark:bg-amber-500 text-white')
		})
	})

	describe('Edge Cases', () => {
		it('should handle negative scores', () => {
			const player: Player = {
				id: '1',
				name: 'Test Player',
				scores: [-10],
				totalScore: -10,
				isEliminated: false
			}

			const theme = PLAYER_THEME_STRATEGIES['points-based'].getTheme(player, 100)

			// Negative scores should be treated as 0% (green theme)
			expect(theme.background).toContain('bg-green-100')
			expect(theme.pickerBadge).toBe('bg-green-600 dark:bg-green-500 text-white')
		})

		it('should handle scores above elimination threshold', () => {
			const player: Player = {
				id: '1',
				name: 'Test Player',
				scores: [150],
				totalScore: 150,
				isEliminated: false
			}

			const theme = PLAYER_THEME_STRATEGIES['points-based'].getTheme(player, 100)

			// Scores above 100% should still use red theme
			expect(theme.background).toContain('bg-red-100')
			expect(theme.pickerBadge).toBe('bg-red-600 dark:bg-red-500 text-white')
		})

		it('should handle very large elimination scores', () => {
			const player: Player = {
				id: '1',
				name: 'Test Player',
				scores: [500],
				totalScore: 500,
				isEliminated: false
			}

			const theme = PLAYER_THEME_STRATEGIES['points-based'].getTheme(player, 10000)

			// 500/10000 = 5% should be green theme
			expect(theme.background).toContain('bg-green-100')
			expect(theme.pickerBadge).toBe('bg-green-600 dark:bg-green-500 text-white')
		})
	})
})
