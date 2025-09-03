'use client'

import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) {
		return (
			<Button variant="outline" size="icon" disabled>
				<Sun className="h-[1.2rem] w-[1.2rem]" />
			</Button>
		)
	}

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
		>
			{theme === 'dark' ? (
				<Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
			) : (
				<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
