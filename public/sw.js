// GigBook Service Worker – Enables offline PWA capability
const CACHE_NAME = 'gigbook-v1.2';
const STATIC_ASSETS = [
  '/index.html',
  '/songs-data.js',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/daisyui@4.12.24/dist/full.min.css',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700;800&display=swap',
];

// Install – cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch – Cache-first for static, network-first for Firebase/API
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip Firebase, Google APIs (always fresh)
  if (url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis.com') ||
      url.hostname.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Return cached, but also update in background
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse;
      }

      // Not cached – fetch from network and cache it
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Background sync for song saves when offline
self.addEventListener('sync', event => {
  if (event.tag === 'sync-songs') {
    console.log('[SW] Background sync: songs');
  }
});
