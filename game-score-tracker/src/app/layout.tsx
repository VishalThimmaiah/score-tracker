import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWAInstaller from "@/components/PWAInstaller";
import OfflineIndicator from "@/components/OfflineIndicator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Deck Master - Card Game Score Tracker & Scorer App",
  description: "Professional card game score tracker for 5 Cards, Secret 7, Rummy, Poker, and custom card games. Digital scorekeeper with player elimination, game history, and multiplayer support. Perfect for family game nights and tournaments.",
  keywords: [
    // Primary keywords
    "deck master", "card game scorer", "card game score tracker", "digital scorekeeper",
    // Game-specific keywords
    "5 cards game", "secret 7 card game", "rummy scorer", "poker score tracker", 
    "card game app", "score tracking app", "game night app",
    // Feature keywords
    "multiplayer card games", "player elimination tracker", "game history tracker",
    "card game rules", "score calculator", "tournament scorer",
    // Mobile/web keywords
    "mobile card game scorer", "web card game tracker", "online scorekeeper",
    "card game scoring system", "digital score pad", "electronic score sheet",
    // Casual keywords
    "family game night", "card party scorer", "game night tracker",
    "card game organizer", "score management", "game session tracker"
  ],
  authors: [{ name: "Deck Master Team" }],
  creator: "Deck Master",
  publisher: "Deck Master",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Deck Master - Professional Card Game Score Tracker",
    description: "The ultimate digital scorekeeper for card games. Track scores for 5 Cards, Secret 7, Rummy, Poker and custom variants. Features player elimination, game history, and tournament support.",
    type: "website",
    locale: "en_US",
    siteName: "Deck Master",
    images: [
      {
        url: "/logo.png",
        width: 126,
        height: 122,
        alt: "Deck Master - Card Game Score Tracker Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Deck Master - Professional Card Game Score Tracker",
    description: "Digital scorekeeper for card games like 5 Cards, Secret 7, Rummy, Poker. Perfect for game nights and tournaments with player elimination tracking.",
    images: ["/logo.png"],
    creator: "@deckmaster",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://deckmaster.vishalthimmaiah.com'),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Deck Master",
    "alternateName": "Deck Master Card Game Score Tracker",
    "description": "Professional digital scorekeeper for card games including 5 Cards, Secret 7, Rummy, Poker and custom variants. Features player elimination tracking, game history, and tournament support.",
    "url": "https://deckmaster.vishalthimmaiah.com",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Card game score tracking",
      "Player elimination system",
      "Game history and statistics",
      "Multiple game variants support",
      "Tournament mode",
      "Mobile responsive design",
      "Offline capability"
    ],
    "gameItem": [
      {
        "@type": "Game",
        "name": "5 Cards",
        "description": "Classic elimination card game with 100 point limit"
      },
      {
        "@type": "Game", 
        "name": "Secret 7",
        "description": "Strategic 7-round card game with lowest score wins"
      },
      {
        "@type": "Game",
        "name": "Custom Card Games",
        "description": "Configurable rules for various card game variants"
      }
    ],
    "author": {
      "@type": "Organization",
      "name": "Deck Master"
    },
    "publisher": {
      "@type": "Organization", 
      "name": "Deck Master"
    },
    "inLanguage": "en-US",
    "isAccessibleForFree": true,
    "browserRequirements": "Requires JavaScript. Modern web browser recommended.",
    "softwareVersion": "1.0.0",
    "datePublished": "2025-01-01",
    "dateModified": "2025-01-06"
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Deck Master" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Deck Master" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="mask-icon" href="/logo.png" color="#000000" />
        <link rel="shortcut icon" href="/logo.png" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <OfflineIndicator />
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster position="top-center" richColors />
          <PWAInstaller />
        </ThemeProvider>
      </body>
    </html>
  );
}
