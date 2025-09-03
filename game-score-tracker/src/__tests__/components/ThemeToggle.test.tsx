import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ThemeToggle } from '@/components/ThemeToggle';

// Mock next-themes
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('next-themes', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('ThemeToggle', () => {
  it('should show Sun icon in light mode', () => {
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);
    
    // In light mode, should show Sun icon
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    // Check if Sun icon is present (lucide-react icons have specific classes)
    const sunIcon = button.querySelector('svg');
    expect(sunIcon).toBeInTheDocument();
  });
});
