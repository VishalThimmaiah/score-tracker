import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import PWAInstaller from "@/components/PWAInstaller";
import PWAUpdateNotifier from "@/components/PWAUpdateNotifier";
import OfflineIndicator from "@/components/OfflineIndicator";
import { seoConfig, getBaseUrl, getKeywordsArray } from "@/config/seo.config";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: seoConfig.title,
  description: seoConfig.description,
  keywords: getKeywordsArray(),
  authors: [{ name: seoConfig.author }],
  creator: seoConfig.creator,
  publisher: seoConfig.publisher,
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
    title: seoConfig.openGraph.title,
    description: seoConfig.openGraph.description,
    type: "website",
    locale: "en_US",
    siteName: seoConfig.openGraph.siteName,
    images: [
      {
        url: "/logo.png",
        width: 126,
        height: 122,
        alt: seoConfig.openGraph.imageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.twitter.title,
    description: seoConfig.twitter.description,
    images: ["/logo.png"],
    creator: seoConfig.twitter.creator,
  },
  metadataBase: new URL(getBaseUrl()),
  alternates: {
    canonical: getBaseUrl(),
  },
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
    "name": seoConfig.structuredData.name,
    "alternateName": seoConfig.structuredData.alternateName,
    "description": seoConfig.structuredData.description,
    "url": getBaseUrl(),
    "applicationCategory": seoConfig.structuredData.applicationCategory,
    "operatingSystem": seoConfig.structuredData.operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": seoConfig.structuredData.features,
    "gameItem": seoConfig.structuredData.gameItems.map(game => ({
      "@type": "Game",
      "name": game.name,
      "description": game.description
    })),
    "author": {
      "@type": "Organization",
      "name": seoConfig.creator
    },
    "publisher": {
      "@type": "Organization", 
      "name": seoConfig.publisher
    },
    "inLanguage": "en-US",
    "isAccessibleForFree": seoConfig.structuredData.isAccessibleForFree,
    "browserRequirements": seoConfig.structuredData.browserRequirements,
    "softwareVersion": seoConfig.structuredData.softwareVersion,
    "datePublished": seoConfig.structuredData.datePublished,
    "dateModified": seoConfig.structuredData.dateModified
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
        <PWAUpdateNotifier />
        <ThemeProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
          <Toaster position="top-center" richColors />
          <PWAInstaller />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
