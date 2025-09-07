/**
 * SEO Configuration for Deck Master
 * Centralized configuration for all SEO-related metadata
 */

export const seoConfig = {
	// Basic metadata
	title: "Deck Master - Card Game Score Tracker & Scorer App",
	description: "Professional card game score tracker for 5 Cards, Secret 7, Rummy, Poker, and custom card games. Digital scorekeeper with player elimination, game history, and multiplayer support. Perfect for family game nights and tournaments.",

	// Keywords organized by category for better maintainability
	keywords: [
		// Primary keywords
		"deck master",
		"card game scorer",
		"card game score tracker",
		"digital scorekeeper",

		// Game-specific keywords
		"5 cards game",
		"secret 7 card game",
		"rummy scorer",
		"poker score tracker",
		"card game app",
		"score tracking app",
		"game night app",

		// Feature keywords
		"multiplayer card games",
		"player elimination tracker",
		"game history tracker",
		"card game rules",
		"score calculator",
		"tournament scorer",

		// Mobile/web keywords
		"mobile card game scorer",
		"web card game tracker",
		"online scorekeeper",
		"card game scoring system",
		"digital score pad",
		"electronic score sheet",

		// Casual keywords
		"family game night",
		"card party scorer",
		"game night tracker",
		"card game organizer",
		"score management",
		"game session tracker"
	],

	// Author and publisher info
	author: "Deck Master Team",
	creator: "Deck Master",
	publisher: "Deck Master",

	// Social media metadata
	openGraph: {
		title: "Deck Master - Professional Card Game Score Tracker",
		description: "The ultimate digital scorekeeper for card games. Track scores for 5 Cards, Secret 7, Rummy, Poker and custom variants. Features player elimination, game history, and tournament support.",
		siteName: "Deck Master",
		imageAlt: "Deck Master - Card Game Score Tracker Logo",
	},

	// Twitter metadata
	twitter: {
		title: "Deck Master - Professional Card Game Score Tracker",
		description: "Digital scorekeeper for card games like 5 Cards, Secret 7, Rummy, Poker. Perfect for game nights and tournaments with player elimination tracking.",
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
