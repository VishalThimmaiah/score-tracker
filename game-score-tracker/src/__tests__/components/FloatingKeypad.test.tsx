import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FloatingKeypad } from '@/components/FloatingKeypad';

describe('FloatingKeypad', () => {
  const mockProps = {
    isVisible: true,
    position: { x: 100, y: 100, useCSSPositioning: false },
    currentValue: '',
    playerName: 'Test Player',
    onNumberPress: vi.fn(),
    onBackspace: vi.fn(),
    onClear: vi.fn(),
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    onMultiply: vi.fn(),
  };

  it('should render with improved mobile-friendly sizing', () => {
    render(<FloatingKeypad {...mockProps} />);
    
    // Check that the keypad is visible
    expect(screen.getByText('Test Player')).toBeInTheDocument();
    
    // Check that number buttons are present with improved sizing
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    
    // Check action buttons
    expect(screen.getByText('Clear')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('should handle number button clicks', () => {
    render(<FloatingKeypad {...mockProps} />);
    
    const button7 = screen.getByText('7');
    fireEvent.click(button7);
    
    expect(mockProps.onNumberPress).toHaveBeenCalledWith('7');
  });

  it('should display current value in the display area', () => {
    render(<FloatingKeypad {...mockProps} currentValue="123" />);
    
    expect(screen.getByText('123')).toBeInTheDocument();
  });

  it('should not render when not visible', () => {
    render(<FloatingKeypad {...mockProps} isVisible={false} />);
    
    expect(screen.queryByText('Test Player')).not.toBeInTheDocument();
  });
});
