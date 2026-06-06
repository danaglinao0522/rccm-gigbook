// RCCM GigBook Service Worker v1.0.0
const CACHE_NAME = 'rccm-gigbook-v1.0.0';
const STATIC_ASSETS = [
  '/rccm-gigbook/',
  '/rccm-gigbook/index.html',
  '/rccm-gigbook/manifest.json',
  '/rccm-gigbook/icons/logo.png',
  '/rccm-gigbook/icons/icon-192.png',
  '/rccm-gigbook/icons/icon-512.png'
];

// Install: cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Non-fatal: some assets may not exist yet
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: network-first for Firebase, cache-first for static
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Firebase, Google APIs — always network
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebaseapp.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('google.com')
  ) return;

  // CDN resources: network-first with cache fallback
  if (
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('iconify.design') ||
    url.hostname.includes('tailwindcss.com')
  ) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // App shell: cache-first, then network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, cloned));
        }
        return response;
      }).catch(() => {
        // Offline fallback: return app shell
        return caches.match('/rccm-gigbook/index.html');
      });
    })
  );
});

// Message handler for cache updates
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
