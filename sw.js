const CACHE_NAME = 'gigbook-v1';
const ASSETS = [
  '/rccm-gigbook/',
  '/rccm-gigbook/index.html',
  '/rccm-gigbook/manifest.json',
  '/rccm-gigbook/icons/icon-192.png',
  '/rccm-gigbook/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  if (
    url.includes('firestore.googleapis.com') ||
    url.includes('firebase') ||
    url.includes('gstatic.com') ||
    url.includes('googleapis.com') ||
    url.includes('iconify') ||
    url.includes('jsdelivr') ||
    url.includes('tailwindcss')
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request)
        .then((fetchResponse) => {
          if (fetchResponse && fetchResponse.status === 200 && event.request.method === 'GET') {
            const cloned = fetchResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
          }
          return fetchResponse;
        })
        .catch(() => {
          return caches.match('/rccm-gigbook/index.html');
        });
    })
  );
});
