import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GameHistory from '@/components/GameHistory';
import { useGameStore } from '@/store/gameStore';

// Mock the store
const mockStore = {
	players: [
		{
			id: '1',
			name: 'Alice',
			scores: [10, 15, 20],
			totalScore: 45,
			isEliminated: false
		},
		{
			id: '2', 
			name: 'Bob',
			scores: [5, 25, 30],
			totalScore: 60,
			isEliminated: false
		}
	],
	gameSettings: {
		gameMode: 'points-based' as const,
		eliminationScore: 100
	},
	gameStatus: 'active' as const
};

// Mock the useGameStore hook
vi.mock('@/store/gameStore', () => ({
	useGameStore: vi.fn()
}));

describe('GameHistory - Frozen Table', () => {
	const mockOnBack = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		vi.mocked(useGameStore).mockReturnValue(mockStore);
	});

	it('should render table with sticky header row', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Check that the header exists
		expect(screen.getByText('Round')).toBeInTheDocument();
		expect(screen.getAllByText('Alice')[0]).toBeInTheDocument(); // First occurrence (table header)
		expect(screen.getAllByText('Bob')[0]).toBeInTheDocument(); // First occurrence (table header)
		
		// Check that the table structure is present
		const table = screen.getByRole('table');
		expect(table).toBeInTheDocument();
		
		// Verify sticky classes are applied to header
		const headerRow = screen.getByText('Round').closest('th');
		expect(headerRow).toHaveClass('sticky');
		expect(headerRow).toHaveClass('left-0');
		expect(headerRow).toHaveClass('z-30');
	});

	it('should render table with sticky first column', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Check that round numbers are present (without "Round" prefix)
		const table = screen.getByRole('table');
		expect(table).toBeInTheDocument();
		
		// Find the first column cells within the table specifically
		const roundCells = screen.getAllByText('1');
		const tableRoundCell = roundCells.find(cell => cell.closest('td'));
		expect(tableRoundCell).toBeInTheDocument();
		
		expect(screen.getAllByText('2')[0]).toBeInTheDocument();
		expect(screen.getAllByText('3')[0]).toBeInTheDocument();
		
		// Verify sticky classes are applied to first column cells
		const roundCell = tableRoundCell!.closest('td');
		expect(roundCell).toHaveClass('sticky');
		expect(roundCell).toHaveClass('left-0');
		expect(roundCell).toHaveClass('z-10');
	});

	it('should display score data correctly in the table', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Check that scores are displayed
		expect(screen.getByText('+10')).toBeInTheDocument();
		expect(screen.getByText('+15')).toBeInTheDocument();
		expect(screen.getByText('+20')).toBeInTheDocument();
		expect(screen.getByText('+5')).toBeInTheDocument();
		expect(screen.getByText('+25')).toBeInTheDocument();
		expect(screen.getByText('+30')).toBeInTheDocument();
		
		// Check running totals
		expect(screen.getByText('Total: 10')).toBeInTheDocument();
		expect(screen.getByText('Total: 25')).toBeInTheDocument();
		expect(screen.getByText('Total: 45')).toBeInTheDocument();
		expect(screen.getByText('Total: 5')).toBeInTheDocument();
		expect(screen.getByText('Total: 30')).toBeInTheDocument();
		expect(screen.getByText('Total: 60')).toBeInTheDocument();
	});

	it('should have proper z-index layering for sticky elements', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Header should have highest z-index (z-20)
		const thead = screen.getByText('Round').closest('thead');
		expect(thead).toHaveClass('z-20');
		
		// Header intersection cell should have highest z-index (z-30)
		const headerRoundCell = screen.getByText('Round').closest('th');
		expect(headerRoundCell).toHaveClass('z-30');
		
		// First column cells should have medium z-index (z-10)
		const roundCells = screen.getAllByText('1');
		const tableRoundCell = roundCells.find(cell => cell.closest('td'));
		const roundCell = tableRoundCell!.closest('td');
		expect(roundCell).toHaveClass('z-10');
	});

	it('should have scrollable container with max height', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Find the scrollable container
		const scrollContainer = screen.getByRole('table').closest('div');
		expect(scrollContainer).toHaveClass('overflow-auto');
		expect(scrollContainer).toHaveClass('max-h-96');
	});

	it('should apply proper background colors to sticky elements', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Header cells should have muted background
		const headerRoundCell = screen.getByText('Round').closest('th');
		expect(headerRoundCell).toHaveClass('bg-muted');
		
		const headerPlayerCell = screen.getAllByText('Alice')[0].closest('th'); // First occurrence (table header)
		expect(headerPlayerCell).toHaveClass('bg-muted');
		
		// First column cells should have card background
		const roundCells = screen.getAllByText('1');
		const tableRoundCell = roundCells.find(cell => cell.closest('td'));
		const roundCell = tableRoundCell!.closest('td');
		expect(roundCell).toHaveClass('bg-card');
		
		// Regular data cells should have card background
		const scoreCell = screen.getByText('+10').closest('td');
		expect(scoreCell).toHaveClass('bg-card');
	});

	it('should apply shadow to sticky elements for visual separation', () => {
		render(<GameHistory onBack={mockOnBack} />);
		
		// Header intersection cell should have shadow
		const headerRoundCell = screen.getByText('Round').closest('th');
		expect(headerRoundCell).toHaveClass('shadow-sm');
		
		// First column cells should have shadow
		const roundCells = screen.getAllByText('1');
		const tableRoundCell = roundCells.find(cell => cell.closest('td'));
		const roundCell = tableRoundCell!.closest('td');
		expect(roundCell).toHaveClass('shadow-sm');
	});
});
