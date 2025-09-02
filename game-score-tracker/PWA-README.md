# PWA (Progressive Web App) Implementation

This document explains the offline functionality that has been added to the Deck Master app.

## What is PWA?

Progressive Web App (PWA) technology allows web applications to work offline and be installed on devices like native apps.

## Features Added

### ✅ Offline Functionality
- **Service Worker**: Caches app resources for offline use
- **Local Storage**: All game data is stored locally using Zustand persist
- **Offline Indicator**: Shows when the user is offline
- **Seamless Experience**: App works identically online and offline

### ✅ Installable App
- **Web App Manifest**: Defines app metadata and icons
- **Install Prompt**: Users can install the app on their devices
- **Standalone Mode**: Runs like a native app when installed

### ✅ Caching Strategy
- **App Shell**: HTML, CSS, JS files are cached
- **Images**: Logo and icons are cached
- **Network First**: Tries network first, falls back to cache
- **Cache Management**: Old caches are automatically cleaned up

## Files Added/Modified

### New Files
- `public/manifest.json` - Web app manifest with metadata
- `public/sw.js` - Service worker for caching and offline functionality
- `src/components/PWAInstaller.tsx` - Registers the service worker
- `src/components/OfflineIndicator.tsx` - Shows offline status

### Modified Files
- `src/app/layout.tsx` - Added PWA meta tags and components
- `next.config.ts` - Simplified configuration (removed next-pwa dependency)

## How It Works

### 1. Service Worker Registration
The PWAInstaller component automatically registers the service worker when the app loads.

### 2. Caching Process
- On first visit: Service worker caches essential files
- Subsequent visits: App loads from cache instantly
- Updates: New versions are cached in background

### 3. Offline Detection
The OfflineIndicator component monitors network status and shows a banner when offline.

### 4. Data Persistence
All game data (players, scores, settings, history) is stored in browser's local storage via Zustand persist middleware.

## User Experience

### Online
- App loads normally from network
- All features work as expected
- Data syncs to local storage

### Offline
- App loads instantly from cache
- All game functionality works
- Orange banner shows "You're offline - App continues to work!"
- Data persists locally

### Installation
Users can install the app by:
1. Opening the app in a browser
2. Looking for "Install" or "Add to Home Screen" option
3. Following browser prompts

## Testing Offline Functionality

### In Browser
1. Open Developer Tools (F12)
2. Go to Network tab
3. Check "Offline" checkbox
4. Refresh the page - app should still work

### On Mobile
1. Turn off WiFi and mobile data
2. Open the app - should work normally
3. Create games, add players, track scores

## Technical Details

### Cache Strategy
- **Static Assets**: Cached with StaleWhileRevalidate
- **App Shell**: Cached with CacheFirst
- **Fallback**: Returns cached homepage for navigation requests

### Storage
- **Game Data**: Zustand persist (localStorage)
- **App Resources**: Service Worker cache (Cache API)
- **Total Storage**: Minimal footprint, efficient caching

### Browser Support
- **Modern Browsers**: Full PWA support
- **Older Browsers**: Graceful degradation, still functional
- **Mobile**: Excellent support on iOS Safari and Android Chrome

## Benefits

1. **Works Offline**: Complete functionality without internet
2. **Fast Loading**: Instant startup from cache
3. **Installable**: Native app-like experience
4. **Reliable**: No network dependency for core features
5. **Efficient**: Smart caching reduces data usage

## Maintenance

The service worker automatically:
- Updates caches when new versions are deployed
- Cleans up old cached files
- Handles cache versioning

No manual maintenance required for offline functionality.
