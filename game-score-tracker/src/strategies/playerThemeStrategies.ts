import { Player, GameMode, ScoreDifference } from '@/store/gameStore'

export interface PlayerTheme {
	background: string
	progress: string
	dealerBadge: string
	pickerBadge: string
}

export interface PlayerThemeStrategy {
	getTheme(player: Player, eliminationScore: number, scoreDifference?: ScoreDifference): PlayerTheme
}

export class PointsBasedThemeStrategy implements PlayerThemeStrategy {
	getTheme(player: Player, eliminationScore: number): PlayerTheme {
		if (player.isEliminated) {
			return {
				background: 'bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600',
				progress: 'bg-gray-600 dark:bg-gray-500',
				dealerBadge: 'bg-gray-600 dark:bg-gray-500 text-white',
				pickerBadge: 'bg-gray-700 dark:bg-gray-600 text-white'
			}
		}

		const scorePercentage = eliminationScore > 0 ? (player.totalScore / eliminationScore) * 100 : 0

		if (scorePercentage < 25) {
			return {
				background: 'bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600',
				progress: 'bg-green-500 dark:bg-green-400',
				dealerBadge: 'bg-rose-600 dark:bg-rose-500 text-white',
				pickerBadge: 'bg-indigo-600 dark:bg-indigo-500 text-white'
			}
		} else if (scorePercentage < 50) {
			return {
				background: 'bg-yellow-100 dark:bg-yellow-800/60 text-yellow-900 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600',
				progress: 'bg-yellow-500 dark:bg-yellow-400',
				dealerBadge: 'bg-rose-600 dark:bg-rose-500 text-white',
				pickerBadge: 'bg-indigo-600 dark:bg-indigo-500 text-white'
			}
		} else if (scorePercentage < 75) {
			return {
				background: 'bg-orange-100 dark:bg-orange-800/60 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-600',
				progress: 'bg-orange-500 dark:bg-orange-400',
				dealerBadge: 'bg-rose-600 dark:bg-rose-500 text-white',
				pickerBadge: 'bg-indigo-600 dark:bg-indigo-500 text-white'
			}
		} else {
			return {
				background: 'bg-red-100 dark:bg-red-800/60 text-red-900 dark:text-red-200 border-red-300 dark:border-red-600',
				progress: 'bg-red-500 dark:bg-red-400',
				dealerBadge: 'bg-rose-600 dark:bg-rose-500 text-white',
				pickerBadge: 'bg-indigo-600 dark:bg-indigo-500 text-white'
			}
		}
	}
}

export class RoundsBasedThemeStrategy implements PlayerThemeStrategy {
	getTheme(player: Player, eliminationScore: number, scoreDifference?: ScoreDifference): PlayerTheme {
		if (player.isEliminated) {
			return {
				background: 'bg-gray-800 dark:bg-gray-700 text-white border-gray-700 dark:border-gray-600',
				progress: 'bg-gray-600 dark:bg-gray-500',
				dealerBadge: 'bg-gray-600 dark:bg-gray-500 text-white',
				pickerBadge: 'bg-gray-700 dark:bg-gray-600 text-white'
			}
		}

		// Rounds-based: Green for leaders, default for others
		if (scoreDifference?.isLeader) {
			return {
				background: 'bg-green-100 dark:bg-green-800/60 text-green-900 dark:text-green-200 border-green-300 dark:border-green-600',
				progress: 'bg-green-500 dark:bg-green-400',
				dealerBadge: 'bg-rose-600 dark:bg-rose-500 text-white',
				pickerBadge: 'bg-indigo-600 dark:bg-indigo-500 text-white'
			}
		} else {
			return {
				background: 'bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-200 border-gray-300 dark:border-gray-600',
				progress: 'bg-gray-500 dark:bg-gray-400',
				dealerBadge: 'bg-rose-600 dark:bg-rose-500 text-white',
				pickerBadge: 'bg-indigo-600 dark:bg-indigo-500 text-white'
			}
		}
	}
}

export const PLAYER_THEME_STRATEGIES: Record<GameMode, PlayerThemeStrategy> = {
	'points-based': new PointsBasedThemeStrategy(),
	'rounds-based': new RoundsBasedThemeStrategy()
}
