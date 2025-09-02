import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster position="top-center" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
