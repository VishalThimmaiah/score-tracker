import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PWAUpdateNotifier from '@/components/PWAUpdateNotifier'
import type { ServiceWorkerUpdateInfo } from '@/utils/sw-registration'

// Mock the service worker manager
vi.mock('@/utils/sw-registration', () => ({
	swManager: {
		onUpdateAvailable: vi.fn(),
		skipWaiting: vi.fn()
	}
}))

// Import the mocked module
import { swManager } from '@/utils/sw-registration'

// Get typed mock functions
const mockOnUpdateAvailable = vi.mocked(swManager.onUpdateAvailable)
const mockSkipWaiting = vi.mocked(swManager.skipWaiting)

describe('PWAUpdateNotifier', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockOnUpdateAvailable.mockReturnValue(() => {}) // Mock unsubscribe function
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should not render when no update is available', () => {
		render(<PWAUpdateNotifier />)
		
		// Should not show any update notification
		expect(screen.queryByText('App Update Available')).not.toBeInTheDocument()
	})

	it('should render update notification when update is available', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		render(<PWAUpdateNotifier />)

		// Simulate update available
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: { postMessage: vi.fn() } as unknown as ServiceWorker
			})
		}

		await waitFor(() => {
			expect(screen.getByText('App Update Available')).toBeInTheDocument()
		})

		expect(screen.getByText(/A new version of Deck Master is ready/)).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Update Now/i })).toBeInTheDocument()
		expect(screen.getByRole('button', { name: /Later/i })).toBeInTheDocument()
	})

	it('should handle update button click', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		mockSkipWaiting.mockResolvedValue(undefined)

		render(<PWAUpdateNotifier />)

		// Simulate update available
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: { postMessage: vi.fn() } as unknown as ServiceWorker
			})
		}

		await waitFor(() => {
			expect(screen.getByText('App Update Available')).toBeInTheDocument()
		})

		// Click update button
		const updateButton = screen.getByRole('button', { name: /Update Now/i })
		fireEvent.click(updateButton)

		// Should show updating state
		await waitFor(() => {
			expect(screen.getByText('Updating...')).toBeInTheDocument()
		})

		// Should call skipWaiting
		expect(mockSkipWaiting).toHaveBeenCalled()
	})

	it('should handle update error', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		mockSkipWaiting.mockRejectedValue(new Error('Update failed'))

		render(<PWAUpdateNotifier />)

		// Simulate update available
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: { postMessage: vi.fn() } as unknown as ServiceWorker
			})
		}

		await waitFor(() => {
			expect(screen.getByText('App Update Available')).toBeInTheDocument()
		})

		// Click update button
		const updateButton = screen.getByRole('button', { name: /Update Now/i })
		fireEvent.click(updateButton)

		// Should show updating state initially
		await waitFor(() => {
			expect(screen.getByText('Updating...')).toBeInTheDocument()
		})

		// Should return to normal state after error
		await waitFor(() => {
			expect(screen.getByText('Update Now')).toBeInTheDocument()
		})

		expect(mockSkipWaiting).toHaveBeenCalled()
	})

	it('should handle dismiss button click', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		render(<PWAUpdateNotifier />)

		// Simulate update available
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: { postMessage: vi.fn() } as unknown as ServiceWorker
			})
		}

		await waitFor(() => {
			expect(screen.getByText('App Update Available')).toBeInTheDocument()
		})

		// Click dismiss button
		const dismissButton = screen.getByRole('button', { name: /Later/i })
		fireEvent.click(dismissButton)

		// Should hide the notification
		await waitFor(() => {
			expect(screen.queryByText('App Update Available')).not.toBeInTheDocument()
		})
	})

	it('should not render when newWorker is missing', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		render(<PWAUpdateNotifier />)

		// Simulate update available without newWorker
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: undefined
			})
		}

		// Should not show notification without newWorker
		expect(screen.queryByText('App Update Available')).not.toBeInTheDocument()
	})

	it('should unsubscribe from updates on unmount', () => {
		const mockUnsubscribe = vi.fn()
		
		mockOnUpdateAvailable.mockReturnValue(mockUnsubscribe)

		const { unmount } = render(<PWAUpdateNotifier />)

		// Unmount component
		unmount()

		// Should call unsubscribe function
		expect(mockUnsubscribe).toHaveBeenCalled()
	})

	it('should handle update button click without newWorker', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		render(<PWAUpdateNotifier />)

		// Simulate update available with undefined newWorker from the start
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: undefined
			})
		}

		// Should not show notification without newWorker
		expect(screen.queryByText('App Update Available')).not.toBeInTheDocument()

		// Should not call skipWaiting since no notification is shown
		expect(mockSkipWaiting).not.toHaveBeenCalled()
	})

	it('should display correct icons and styling', async () => {
		let updateCallback: ((info: ServiceWorkerUpdateInfo) => void) | null = null
		
		mockOnUpdateAvailable.mockImplementation((callback: (info: ServiceWorkerUpdateInfo) => void) => {
			updateCallback = callback
			return () => {} // Mock unsubscribe function
		})

		render(<PWAUpdateNotifier />)

		// Simulate update available
		if (updateCallback) {
			updateCallback({
				isUpdateAvailable: true,
				newWorker: { postMessage: vi.fn() } as unknown as ServiceWorker
			})
		}

		await waitFor(() => {
			expect(screen.getByText('App Update Available')).toBeInTheDocument()
		})

		// Check for proper styling classes - find the div with bg-blue-600 class
		const container = screen.getByText('App Update Available').closest('[class*="bg-blue-600"]')
		expect(container).toHaveClass('bg-blue-600')

		// Check for update button styling
		const updateButton = screen.getByRole('button', { name: /Update Now/i })
		expect(updateButton).toHaveClass('bg-white', 'text-blue-600')

		// Check for dismiss button styling
		const dismissButton = screen.getByRole('button', { name: /Later/i })
		expect(dismissButton).toHaveClass('text-blue-100')
	})
})
