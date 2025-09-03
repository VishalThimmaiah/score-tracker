// @ts-nocheck
// Service Worker runs in a different context than the main thread
const CACHE_NAME = 'deck-master-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Service Worker: Cache failed to open', error);
      })
  );
  self.skipWaiting();
});

// Fetch event - COMPLETELY DISABLED FOR DEVELOPMENT
// During development, let the browser handle all requests normally
// This prevents any interference with Next.js hot reloading and CSS loading
self.addEventListener('fetch', (event) => {
  // Do nothing - let all requests pass through to the network
  // This ensures CSS, JS, and other resources load normally during development
  return;
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
