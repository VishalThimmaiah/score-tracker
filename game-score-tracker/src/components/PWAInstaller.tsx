'use client'

import { useEffect, useState } from 'react'
import { registerServiceWorker } from '@/utils/sw-registration'

export default function PWAInstaller() {
	const [, setRegistrationStatus] = useState<'loading' | 'success' | 'error' | 'unsupported'>('loading')

	useEffect(() => {
		const initializeServiceWorker = async () => {
			try {
				const result = await registerServiceWorker()
				
				if (!result.isSupported) {
					setRegistrationStatus('unsupported')
					console.log('[PWA Installer] Service workers not supported')
					return
				}

				if (result.error) {
					setRegistrationStatus('error')
					console.error('[PWA Installer] Registration failed:', result.error)
					return
				}

				setRegistrationStatus('success')
				console.log('[PWA Installer] Service worker registered successfully')
			} catch (error) {
				setRegistrationStatus('error')
				console.error('[PWA Installer] Unexpected error during registration:', error)
			}
		}

		initializeServiceWorker()
	}, [])

	// This component doesn't render anything visible
	// It just handles the service worker registration
	return null
}
