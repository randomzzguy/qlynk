// Minimal no-op service worker stub to prevent 404s
self.addEventListener('install', (event) => {
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
self.addEventListener('fetch', (event) => {
  // No-op: let requests go to network as usual
})
