import { track } from '@vercel/analytics';

/**
 * Analytics utility functions for tracking game-specific events
 */

export const trackGameEvent = {
	/**
	 * Track when a new game is started
	 */
	gameStarted: (gameType?: string, playerCount?: number) => {
		track('Game Started', {
			gameType: gameType || 'unknown',
			playerCount: playerCount || 0,
		});
	},

	/**
	 * Track when a score is entered
	 */
	scoreEntered: (playerName?: string, score?: number, round?: number) => {
		track('Score Entered', {
			playerName: playerName || 'unknown',
			score: score || 0,
			round: round || 0,
		});
	},

	/**
	 * Track when a game is completed
	 */
	gameCompleted: (gameType?: string, playerCount?: number, totalRounds?: number, winner?: string) => {
		track('Game Completed', {
			gameType: gameType || 'unknown',
			playerCount: playerCount || 0,
			totalRounds: totalRounds || 0,
			winner: winner || 'unknown',
		});
	},

	/**
	 * Track when a player is added to the game
	 */
	playerAdded: (playerName?: string, totalPlayers?: number) => {
		track('Player Added', {
			playerName: playerName || 'unknown',
			totalPlayers: totalPlayers || 0,
		});
	},

	/**
	 * Track when a player is removed from the game
	 */
	playerRemoved: (playerName?: string, totalPlayers?: number) => {
		track('Player Removed', {
			playerName: playerName || 'unknown',
			totalPlayers: totalPlayers || 0,
		});
	},

	/**
	 * Track when theme is changed
	 */
	themeChanged: (newTheme: string) => {
		track('Theme Changed', {
			theme: newTheme,
		});
	},

	/**
	 * Track when game history is viewed
	 */
	historyViewed: () => {
		track('Game History Viewed');
	},

	/**
	 * Track when a game is reset/restarted
	 */
	gameReset: (gameType?: string, playerCount?: number) => {
		track('Game Reset', {
			gameType: gameType || 'unknown',
			playerCount: playerCount || 0,
		});
	},

	/**
	 * Track when PWA is installed
	 */
	pwaInstalled: () => {
		track('PWA Installed');
	},

	/**
	 * Track when help/about dialog is opened
	 */
	helpOpened: (section?: string) => {
		track('Help Opened', {
			section: section || 'general',
		});
	},

	/**
	 * Track when QR code is generated/shared
	 */
	qrCodeShared: () => {
		track('QR Code Shared');
	},
};

/**
 * Track custom events with flexible parameters
 */
export const trackCustomEvent = (eventName: string, properties?: Record<string, string | number | boolean>) => {
	track(eventName, properties);
};
