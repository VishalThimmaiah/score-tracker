import { describe, it, expect, vi, beforeEach } from 'vitest';
import { trackGameEvent, trackCustomEvent } from '@/utils/analytics';

// Mock the @vercel/analytics module
vi.mock('@vercel/analytics', () => ({
	track: vi.fn(),
}));

import { track } from '@vercel/analytics';

describe('Analytics Utils', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('trackGameEvent', () => {
		it('should track game started event with correct parameters', () => {
			trackGameEvent.gameStarted('UNO', 4);

			expect(track).toHaveBeenCalledWith('Game Started', {
				gameType: 'UNO',
				playerCount: 4,
			});
		});

		it('should track game started event with default parameters when none provided', () => {
			trackGameEvent.gameStarted();

			expect(track).toHaveBeenCalledWith('Game Started', {
				gameType: 'unknown',
				playerCount: 0,
			});
		});

		it('should track score entered event', () => {
			trackGameEvent.scoreEntered('Player1', 25, 3);

			expect(track).toHaveBeenCalledWith('Score Entered', {
				playerName: 'Player1',
				score: 25,
				round: 3,
			});
		});

		it('should track game completed event', () => {
			trackGameEvent.gameCompleted('UNO', 4, 5, 'Player1');

			expect(track).toHaveBeenCalledWith('Game Completed', {
				gameType: 'UNO',
				playerCount: 4,
				totalRounds: 5,
				winner: 'Player1',
			});
		});

		it('should track player added event', () => {
			trackGameEvent.playerAdded('NewPlayer', 5);

			expect(track).toHaveBeenCalledWith('Player Added', {
				playerName: 'NewPlayer',
				totalPlayers: 5,
			});
		});

		it('should track theme changed event', () => {
			trackGameEvent.themeChanged('dark');

			expect(track).toHaveBeenCalledWith('Theme Changed', {
				theme: 'dark',
			});
		});

		it('should track history viewed event', () => {
			trackGameEvent.historyViewed();

			expect(track).toHaveBeenCalledWith('Game History Viewed');
		});

		it('should track PWA installed event', () => {
			trackGameEvent.pwaInstalled();

			expect(track).toHaveBeenCalledWith('PWA Installed');
		});
	});

	describe('trackCustomEvent', () => {
		it('should track custom event with properties', () => {
			trackCustomEvent('Custom Event', {
				customProp: 'value',
				numericProp: 42,
				booleanProp: true
			});

			expect(track).toHaveBeenCalledWith('Custom Event', {
				customProp: 'value',
				numericProp: 42,
				booleanProp: true,
			});
		});

		it('should track custom event without properties', () => {
			trackCustomEvent('Simple Event');

			expect(track).toHaveBeenCalledWith('Simple Event', undefined);
		});
	});
});
