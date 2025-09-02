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
  title: "Deck Master - Card Game Scoring Made Simple",
  description: "Track scores for card games like 5 Cards, Secret 7, and custom variants. Simple, elegant scoring with player elimination and game history.",
  keywords: ["card games", "score tracker", "5 cards", "secret 7", "game scoring", "multiplayer games", "deck master"],
  authors: [{ name: "Deck Master" }],
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
    title: "Deck Master - Card Game Scoring Made Simple",
    description: "Track scores for card games like 5 Cards, Secret 7, and custom variants. Simple, elegant scoring with player elimination and game history.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/logo.png",
        width: 126,
        height: 122,
        alt: "Deck Master Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Deck Master - Card Game Scoring Made Simple",
    description: "Track scores for card games like 5 Cards, Secret 7, and custom variants. Simple, elegant scoring with player elimination and game history.",
    images: ["/logo.png"],
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
