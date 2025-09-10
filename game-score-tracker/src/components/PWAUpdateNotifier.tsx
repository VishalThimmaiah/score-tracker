'use client'

import React, { useState, useEffect } from 'react'
import { RefreshCw, Download } from 'lucide-react'
import { swManager, ServiceWorkerUpdateInfo } from '@/utils/sw-registration'

export default function PWAUpdateNotifier() {
	const [updateInfo, setUpdateInfo] = useState<ServiceWorkerUpdateInfo | null>(null)
	const [isUpdating, setIsUpdating] = useState(false)
	const [showNotification, setShowNotification] = useState(false)

	useEffect(() => {
		// Subscribe to update notifications
		const unsubscribe = swManager.onUpdateAvailable((info) => {
			console.log('[PWA Update] Update available:', info)
			setUpdateInfo(info)
			setShowNotification(true)
		})

		return unsubscribe
	}, [])

	const handleUpdate = async () => {
		if (!updateInfo?.newWorker) return

		setIsUpdating(true)

		try {
			// Skip waiting and activate the new service worker
			await swManager.skipWaiting()
			
			// The page will reload automatically when the new SW takes control
			// This is handled in the sw-registration utility
		} catch (error) {
			console.error('[PWA Update] Failed to update:', error)
			setIsUpdating(false)
		}
	}

	const handleDismiss = () => {
		setShowNotification(false)
		setUpdateInfo(null)
	}

	if (!showNotification || !updateInfo?.isUpdateAvailable) {
		return null
	}

	return (
		<div className="fixed top-16 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
			<div className="bg-blue-600 text-white rounded-lg shadow-lg p-4 border border-blue-500">
				<div className="flex items-start gap-3">
					<div className="flex-shrink-0">
						<Download className="h-5 w-5 mt-0.5" />
					</div>
					
					<div className="flex-1 min-w-0">
						<h3 className="font-semibold text-sm">
							App Update Available
						</h3>
						<p className="text-blue-100 text-xs mt-1">
							A new version of Deck Master is ready. Update now for the latest features and improvements.
						</p>
					</div>
				</div>

				<div className="flex gap-2 mt-4">
					<button
						onClick={handleUpdate}
						disabled={isUpdating}
						className="flex items-center gap-2 bg-white text-blue-600 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						{isUpdating ? (
							<>
								<RefreshCw className="h-3 w-3 animate-spin" />
								Updating...
							</>
						) : (
							<>
								<Download className="h-3 w-3" />
								Update Now
							</>
						)}
					</button>
					
					<button
						onClick={handleDismiss}
						className="text-blue-100 hover:text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
					>
						Later
					</button>
				</div>
			</div>
		</div>
	)
}
