// RCCM GigBook Service Worker v1.0
const CACHE_NAME = 'rccm-gigbook-v1';
const URLS_TO_CACHE = [
  '/rccm-gigbook/',
  '/rccm-gigbook/index.html',
  '/rccm-gigbook/manifest.json',
  '/rccm-gigbook/icons/icon-192.png',
  '/rccm-gigbook/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first strategy for Firebase calls
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) {
    event.respondWith(fetch(event.request).catch(() => caches.match(event.request)));
    return;
  }
  // Cache-first strategy for app assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      });
    })
  );
});
