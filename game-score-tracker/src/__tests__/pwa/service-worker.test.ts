import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock service worker environment
const mockServiceWorker = {
	register: vi.fn(),
	addEventListener: vi.fn(),
	controller: null,
	ready: Promise.resolve({
		active: { postMessage: vi.fn() },
		waiting: null,
		installing: null,
		update: vi.fn(),
		unregister: vi.fn(),
		addEventListener: vi.fn()
	})
}

const mockNavigator = {
	serviceWorker: mockServiceWorker,
	onLine: true
}

// Mock global objects
Object.defineProperty(global, 'navigator', {
	value: mockNavigator,
	writable: true
})

Object.defineProperty(global, 'window', {
	value: {
		addEventListener: vi.fn(),
		location: { reload: vi.fn() }
	},
	writable: true
})

Object.defineProperty(global, 'document', {
	value: {
		addEventListener: vi.fn(),
		hidden: false
	},
	writable: true
})

describe('Service Worker Registration', () => {
	beforeEach(() => {
		vi.clearAllMocks()
		// Reset service worker mock
		mockServiceWorker.register.mockResolvedValue({
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should register service worker successfully', async () => {
		const { registerServiceWorker } = await import('@/utils/sw-registration')

		const result = await registerServiceWorker()

		expect(result.isSupported).toBe(true)
		expect(result.error).toBeUndefined()
		expect(result.registration).toBeDefined()
		expect(mockServiceWorker.register).toHaveBeenCalledWith('/sw-enhanced.js', {
			scope: '/',
			updateViaCache: 'none'
		})
	})

	it('should handle unsupported browsers', async () => {
		// Temporarily remove service worker support
		const originalNavigator = global.navigator
		Object.defineProperty(global, 'navigator', {
			value: {},
			writable: true
		})

		const { registerServiceWorker } = await import('@/utils/sw-registration')

		const result = await registerServiceWorker()

		expect(result.isSupported).toBe(false)
		expect(result.registration).toBeUndefined()

		// Restore navigator
		Object.defineProperty(global, 'navigator', {
			value: originalNavigator,
			writable: true
		})
	})

	it('should handle registration errors', async () => {
		const error = new Error('Registration failed')
		mockServiceWorker.register.mockRejectedValue(error)

		const { registerServiceWorker } = await import('@/utils/sw-registration')

		const result = await registerServiceWorker()

		expect(result.isSupported).toBe(true)
		expect(result.error).toBe(error)
		expect(result.registration).toBeUndefined()
	})

	it('should handle service worker updates', async () => {
		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: { postMessage: vi.fn() },
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Simulate update available
		const updateCallback = vi.fn()
		swManager.onUpdateAvailable(updateCallback)

		// Trigger update found event
		const updateFoundCallback = mockRegistration.addEventListener.mock.calls
			.find(call => call[0] === 'updatefound')?.[1]

		if (updateFoundCallback) {
			updateFoundCallback()
		}

		expect(mockRegistration.addEventListener).toHaveBeenCalledWith('updatefound', expect.any(Function))
	})

	it('should send messages to service worker', async () => {
		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Mock MessageChannel
		const mockMessageChannel = {
			port1: { onmessage: null },
			port2: {}
		}

		Object.defineProperty(global, 'MessageChannel', {
			value: vi.fn(() => mockMessageChannel),
			writable: true
		})

		// Send message
		const messagePromise = swManager.sendMessage({ type: 'TEST' })

		// Simulate response
		setTimeout(() => {
			if (mockMessageChannel.port1.onmessage) {
				mockMessageChannel.port1.onmessage({ data: { success: true } })
			}
		}, 0)

		const response = await messagePromise
		expect(response).toEqual({ success: true })
		expect(mockRegistration.active.postMessage).toHaveBeenCalledWith(
			{ type: 'TEST' },
			[mockMessageChannel.port2]
		)
	})

	it('should skip waiting for new service worker', async () => {
		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: { postMessage: vi.fn() },
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Skip waiting
		await swManager.skipWaiting()

		expect(mockRegistration.waiting.postMessage).toHaveBeenCalledWith({
			type: 'SKIP_WAITING'
		})
	})

	it('should unregister service worker', async () => {
		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn().mockResolvedValue(true),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Unregister
		const result = await swManager.unregister()

		expect(result).toBe(true)
		expect(mockRegistration.unregister).toHaveBeenCalled()
	})

	it('should check if service worker is active', async () => {
		// Clear module cache to get fresh instance
		vi.resetModules()

		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Before registration
		expect(swManager.isActive()).toBe(false)

		// After registration
		await swManager.registerServiceWorker()
		expect(swManager.isActive()).toBe(true)
	})
})

describe('Service Worker Manager', () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should handle periodic update checks', async () => {
		const mockSetInterval = vi.fn()
		Object.defineProperty(global, 'setInterval', {
			value: mockSetInterval,
			writable: true
		})

		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Verify that setInterval was called for periodic updates
		expect(mockSetInterval).toHaveBeenCalled()
	})

	it('should handle visibility change updates', async () => {
		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Verify that document visibility change listener was added
		expect(document.addEventListener).toHaveBeenCalledWith(
			'visibilitychange',
			expect.any(Function)
		)
	})

	it('should handle controller change events', async () => {
		const mockRegistration = {
			active: { postMessage: vi.fn() },
			waiting: null,
			installing: null,
			update: vi.fn(),
			unregister: vi.fn(),
			addEventListener: vi.fn()
		}

		mockServiceWorker.register.mockResolvedValue(mockRegistration)

		const { swManager } = await import('@/utils/sw-registration')

		// Register service worker
		await swManager.registerServiceWorker()

		// Verify that controller change listener was added
		expect(mockServiceWorker.addEventListener).toHaveBeenCalledWith(
			'controllerchange',
			expect.any(Function)
		)
	})
})
