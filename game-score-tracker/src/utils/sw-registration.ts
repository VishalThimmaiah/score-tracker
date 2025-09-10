// Enhanced Service Worker Registration Utility
// Handles registration, updates, and communication with the service worker

export interface ServiceWorkerUpdateInfo {
	isUpdateAvailable: boolean;
	newWorker?: ServiceWorker;
}

export interface ServiceWorkerRegistrationResult {
	registration?: ServiceWorkerRegistration;
	error?: Error;
	isSupported: boolean;
}

class ServiceWorkerManager {
	private registration: ServiceWorkerRegistration | null = null;
	private updateCallbacks: ((info: ServiceWorkerUpdateInfo) => void)[] = [];

	/**
	 * Register the service worker with enhanced error handling
	 */
	async registerServiceWorker(): Promise<ServiceWorkerRegistrationResult> {
		// Check if service workers are supported
		if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
			console.log('[SW Manager] Service workers not supported');
			return { isSupported: false };
		}

		try {
			console.log('[SW Manager] Registering service worker...');

			// Register the enhanced service worker
			const registration = await navigator.serviceWorker.register('/sw-enhanced.js', {
				scope: '/',
				updateViaCache: 'none' // Always check for updates
			});

			this.registration = registration;

			// Set up update handling
			this.setupUpdateHandling(registration);

			// Set up message handling
			this.setupMessageHandling();

			console.log('[SW Manager] Service worker registered successfully');

			return {
				registration,
				isSupported: true
			};
		} catch (error) {
			console.error('[SW Manager] Service worker registration failed:', error);
			return {
				error: error as Error,
				isSupported: true
			};
		}
	}

	/**
	 * Set up handling for service worker updates
	 */
	private setupUpdateHandling(registration: ServiceWorkerRegistration) {
		// Handle updates to the service worker
		registration.addEventListener('updatefound', () => {
			console.log('[SW Manager] Update found, installing new service worker...');

			const newWorker = registration.installing;
			if (!newWorker) return;

			newWorker.addEventListener('statechange', () => {
				if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
					console.log('[SW Manager] New service worker installed, update available');

					// Notify listeners about the update
					this.notifyUpdateCallbacks({
						isUpdateAvailable: true,
						newWorker
					});
				}
			});
		});

		// Handle controller changes (when new SW takes control)
		navigator.serviceWorker.addEventListener('controllerchange', () => {
			console.log('[SW Manager] Service worker controller changed');
			window.location.reload();
		});

		// Check for updates periodically
		this.setupPeriodicUpdateCheck(registration);
	}

	/**
	 * Set up periodic checks for service worker updates
	 */
	private setupPeriodicUpdateCheck(registration: ServiceWorkerRegistration) {
		// Check for updates every 30 minutes
		setInterval(() => {
			if (navigator.onLine) {
				console.log('[SW Manager] Checking for service worker updates...');
				registration.update().catch(error => {
					console.log('[SW Manager] Update check failed:', error);
				});
			}
		}, 30 * 60 * 1000); // 30 minutes

		// Also check when the page becomes visible
		document.addEventListener('visibilitychange', () => {
			if (!document.hidden && navigator.onLine) {
				registration.update().catch(error => {
					console.log('[SW Manager] Update check on visibility change failed:', error);
				});
			}
		});
	}

	/**
	 * Set up message handling with the service worker
	 */
	private setupMessageHandling() {
		navigator.serviceWorker.addEventListener('message', (event) => {
			console.log('[SW Manager] Message from service worker:', event.data);

			// Handle different message types
			if (event.data?.type === 'CACHE_UPDATED') {
				console.log('[SW Manager] Cache updated by service worker');
			}
		});
	}

	/**
	 * Send a message to the service worker
	 */
	async sendMessage(message: Record<string, unknown>): Promise<Record<string, unknown>> {
		if (!this.registration?.active) {
			throw new Error('No active service worker to send message to');
		}

		return new Promise((resolve, reject) => {
			const messageChannel = new MessageChannel();

			messageChannel.port1.onmessage = (event) => {
				if (event.data?.error) {
					reject(new Error(event.data.error));
				} else {
					resolve(event.data);
				}
			};

			this.registration!.active!.postMessage(message, [messageChannel.port2]);
		});
	}

	/**
	 * Skip waiting and activate new service worker immediately
	 */
	async skipWaiting(): Promise<void> {
		if (!this.registration?.waiting) {
			throw new Error('No waiting service worker to activate');
		}

		// Send skip waiting message
		this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
	}

	/**
	 * Get the current service worker version
	 */
	async getVersion(): Promise<string> {
		try {
			const response = await this.sendMessage({ type: 'GET_VERSION' });
			return (response.version as string) || 'unknown';
		} catch (error) {
			console.log('[SW Manager] Could not get version:', error);
			return 'unknown';
		}
	}

	/**
	 * Subscribe to update notifications
	 */
	onUpdateAvailable(callback: (info: ServiceWorkerUpdateInfo) => void): () => void {
		this.updateCallbacks.push(callback);

		// Return unsubscribe function
		return () => {
			const index = this.updateCallbacks.indexOf(callback);
			if (index > -1) {
				this.updateCallbacks.splice(index, 1);
			}
		};
	}

	/**
	 * Notify all update callbacks
	 */
	private notifyUpdateCallbacks(info: ServiceWorkerUpdateInfo) {
		this.updateCallbacks.forEach(callback => {
			try {
				callback(info);
			} catch (error) {
				console.error('[SW Manager] Error in update callback:', error);
			}
		});
	}

	/**
	 * Unregister the service worker (for debugging)
	 */
	async unregister(): Promise<boolean> {
		if (!this.registration) {
			return false;
		}

		try {
			const result = await this.registration.unregister();
			console.log('[SW Manager] Service worker unregistered:', result);
			return result;
		} catch (error) {
			console.error('[SW Manager] Failed to unregister service worker:', error);
			return false;
		}
	}

	/**
	 * Get registration status
	 */
	getRegistration(): ServiceWorkerRegistration | null {
		return this.registration;
	}

	/**
	 * Check if service worker is active
	 */
	isActive(): boolean {
		return !!(this.registration?.active);
	}
}

// Create singleton instance
export const swManager = new ServiceWorkerManager();

// Convenience function for simple registration
export async function registerServiceWorker(): Promise<ServiceWorkerRegistrationResult> {
	return swManager.registerServiceWorker();
}

// Export types for use in components
export type { ServiceWorkerManager };
