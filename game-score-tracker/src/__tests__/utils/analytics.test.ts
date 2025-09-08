import { describe, it, expect } from 'vitest';
import { trackGameEvent, trackCustomEvent } from '@/utils/analytics';

describe('Analytics Utils', () => {
	describe('trackGameEvent', () => {
		it('should have all required methods', () => {
			expect(typeof trackGameEvent.gameStarted).toBe('function');
			expect(typeof trackGameEvent.scoreEntered).toBe('function');
			expect(typeof trackGameEvent.gameCompleted).toBe('function');
			expect(typeof trackGameEvent.playerAdded).toBe('function');
			expect(typeof trackGameEvent.themeChanged).toBe('function');
			expect(typeof trackGameEvent.historyViewed).toBe('function');
			expect(typeof trackGameEvent.pwaInstalled).toBe('function');
		});

		it('should not throw errors when called', () => {
			expect(() => trackGameEvent.gameStarted('UNO', 4)).not.toThrow();
			expect(() => trackGameEvent.gameStarted()).not.toThrow();
			expect(() => trackGameEvent.scoreEntered('Player1', 25, 3)).not.toThrow();
			expect(() => trackGameEvent.gameCompleted('UNO', 4, 5, 'Player1')).not.toThrow();
			expect(() => trackGameEvent.playerAdded('NewPlayer', 5)).not.toThrow();
			expect(() => trackGameEvent.themeChanged('dark')).not.toThrow();
			expect(() => trackGameEvent.historyViewed()).not.toThrow();
			expect(() => trackGameEvent.pwaInstalled()).not.toThrow();
		});
	});

	describe('trackCustomEvent', () => {
		it('should be a function', () => {
			expect(typeof trackCustomEvent).toBe('function');
		});

		it('should not throw errors when called', () => {
			expect(() => trackCustomEvent('Custom Event', {
				customProp: 'value',
				numericProp: 42,
				booleanProp: true
			})).not.toThrow();

			expect(() => trackCustomEvent('Simple Event')).not.toThrow();
		});
	});
});
