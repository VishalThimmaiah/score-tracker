/**
 * SEO Configuration for Deck Master
 * Centralized configuration for all SEO-related metadata
 */

export const seoConfig = {
	// Basic metadata
	title: "Deck Master - Card Game Score Tracker Online | Free Digital Scorer",
	description: "Free online card game score tracker for 5 Cards, Secret 7, Rummy, Poker, and custom card games. Best digital scorekeeper with player elimination, game history, and multiplayer support. Perfect web-based score tracking tool for family game nights and tournaments.",

	// Keywords organized by category for better maintainability
	keywords: [
		// Primary keywords
		"deck master",
		"card game scorer",
		"card game score tracker",
		"card game score tracker online",
		"digital scorekeeper",
		"online card game scorer",

		// Game-specific keywords
		"5 cards game",
		"secret 7 card game",
		"rummy scorer",
		"poker score tracker",
		"card game app",
		"score tracking app",
		"game night app",
		"card game scoring app",
		"online card game app",

		// Feature keywords
		"multiplayer card games",
		"player elimination tracker",
		"game history tracker",
		"card game rules",
		"score calculator",
		"tournament scorer",
		"card game counter",
		"score keeper app",
		"game score manager",

		// Mobile/web keywords
		"mobile card game scorer",
		"web card game tracker",
		"online scorekeeper",
		"card game scoring system",
		"digital score pad",
		"electronic score sheet",
		"browser card game scorer",
		"web-based score tracker",
		"online game scorer",

		// Casual keywords
		"family game night",
		"card party scorer",
		"game night tracker",
		"card game organizer",
		"score management",
		"game session tracker",
		"card game helper",
		"score tracking tool",

		// Long-tail keywords for better targeting
		"free card game score tracker",
		"best card game scorer online",
		"card game score keeper free",
		"online card game score calculator",
		"digital card game scorepad",
		"card game scoring website",
		"web card game score tracker",
		"card game score tracking software",
		"online score tracker for card games",
		"card game score counter online",

		// Alternative spellings and variations
		"cardgame scorer",
		"card-game score tracker",
		"scorekeeper for card games",
		"card games score tracker",
		"online card scorer",
		"digital game scorer",
		"card game point tracker",
		"game scoring app online"
	],

	// Author and publisher info
	author: "Deck Master Team",
	creator: "Deck Master",
	publisher: "Deck Master",

	// Social media metadata
	openGraph: {
		title: "Deck Master - Free Online Card Game Score Tracker",
		description: "Best free online card game score tracker for 5 Cards, Secret 7, Rummy, Poker and custom variants. Digital scorekeeper with player elimination, game history, and tournament support. Perfect web-based scoring tool.",
		siteName: "Deck Master",
		imageAlt: "Deck Master - Card Game Score Tracker Logo",
	},

	// Twitter metadata
	twitter: {
		title: "Deck Master - Free Online Card Game Score Tracker",
		description: "Free online card game score tracker for 5 Cards, Secret 7, Rummy, Poker. Best digital scorekeeper for game nights and tournaments with player elimination tracking.",
		creator: "@deckmaster",
	},

	// Structured data for rich snippets
	structuredData: {
		name: "Deck Master",
		alternateName: "Deck Master Card Game Score Tracker",
		description: "Professional digital scorekeeper for card games including 5 Cards, Secret 7, Rummy, Poker and custom variants. Features player elimination tracking, game history, and tournament support.",
		applicationCategory: "GameApplication",
		operatingSystem: "Web Browser",
		isAccessibleForFree: true,
		browserRequirements: "Requires JavaScript. Modern web browser recommended.",
		softwareVersion: "1.0.0",
		datePublished: "2025-01-01",
		dateModified: "2025-01-06",

		// Supported games
		gameItems: [
			{
				name: "5 Cards",
				description: "Classic elimination card game with 100 point limit"
			},
			{
				name: "Secret 7",
				description: "Strategic 7-round card game with lowest score wins"
			},
			{
				name: "Custom Card Games",
				description: "Configurable rules for various card game variants"
			}
		],

		// Features
		features: [
			"Card game score tracking",
			"Player elimination system",
			"Game history and statistics",
			"Multiple game variants support",
			"Tournament mode",
			"Mobile responsive design",
			"Offline capability"
		]
	}
} as const

// Helper function to get keywords as comma-separated string
export const getKeywordsString = () => seoConfig.keywords.join(',')

// Helper function to get keywords as array
export const getKeywordsArray = () => [...seoConfig.keywords]

// Base URL configuration
export const getBaseUrl = () => {
	return process.env.NEXT_PUBLIC_APP_URL || 'https://deckmaster.vishalthimmaiah.com'
}
