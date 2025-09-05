import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import AddPlayerSheet from '@/components/AddPlayerSheet'
import { useGameStore } from '@/store/gameStore'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.ComponentProps<'div'>) => <div {...props}>{children}</div>
  }
}))

describe('AddPlayerSheet Layout', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useGameStore.getState()
    store.resetGame()
    store.addPlayer('Alice')
    store.addPlayer('Bob')
    store.addPlayer('Charlie')
    store.startGame()
  })

  it('should render with proper layout structure', () => {
    render(<AddPlayerSheet isOpen={true} onClose={() => {}} />)
    
    // Check that the dialog is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    
    // Check header elements are present
    expect(screen.getByText('Add Player Mid-Game')).toBeInTheDocument()
    expect(screen.getByText('Add a new player to the current game with appropriate starting points')).toBeInTheDocument()
    
    // Check main form sections are present
    expect(screen.getByText('Player Name')).toBeInTheDocument()
    expect(screen.getByText('Starting Points')).toBeInTheDocument()
    expect(screen.getByText('Player Position')).toBeInTheDocument()
    
    // Check action buttons are present
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /add player/i })).toBeInTheDocument()
  })

  it('should have scrollable content area for player position', () => {
    render(<AddPlayerSheet isOpen={true} onClose={() => {}} />)
    
    // Check that player list is rendered
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Charlie')).toBeInTheDocument()
    
    // Check position controls are present
    expect(screen.getByRole('button', { name: /move up/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /move down/i })).toBeInTheDocument()
  })

  it('should show auto-calculate points correctly', () => {
    const store = useGameStore.getState()
    // Simulate being in round 3 (so 2 completed rounds * 25 = 50 points)
    store.currentRound = 3
    
    render(<AddPlayerSheet isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByText('50 points (2 rounds × 25 points)')).toBeInTheDocument()
  })

  it('should not render when closed', () => {
    render(<AddPlayerSheet isOpen={false} onClose={() => {}} />)
    
    // Dialog should not be in the document when closed
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should handle empty player list gracefully', () => {
    const store = useGameStore.getState()
    store.resetGame()
    store.startGame()
    
    render(<AddPlayerSheet isOpen={true} onClose={() => {}} />)
    
    // Should still render the form sections
    expect(screen.getByText('Player Name')).toBeInTheDocument()
    expect(screen.getByText('Starting Points')).toBeInTheDocument()
    expect(screen.getByText('Player Position')).toBeInTheDocument()
    
    // Should show insertion point for empty list
    expect(screen.getByText('New Player will be inserted here')).toBeInTheDocument()
  })
})
