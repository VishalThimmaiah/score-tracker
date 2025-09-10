// Legacy Service Worker - Redirects to Enhanced Version
// This file exists for backward compatibility and redirects to the enhanced service worker

console.log('[Legacy SW] Redirecting to enhanced service worker...');

// Import and run the enhanced service worker
importScripts('/sw-enhanced.js');
