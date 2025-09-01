'use client'

import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import GameSetup from '@/components/GameSetup'
import GameDashboard from '@/components/GameDashboard'
import GameHistory from '@/components/GameHistory'

export default function Home() {
	const { gameStatus } = useGameStore()
	const [showHistory, setShowHistory] = useState(false)

	// Handle history view
	if (showHistory) {
		return <GameHistory onBack={() => setShowHistory(false)} />
	}

	// Render the appropriate component based on game status
	switch (gameStatus) {
		case 'setup':
			return <GameSetup />
		case 'playing':
		case 'finished':
			return <GameDashboard onShowHistory={() => setShowHistory(true)} />
		default:
			return <GameSetup />
	}
}
