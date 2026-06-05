// ChordBook Service Worker v1.0
const CACHE_NAME = "chordbook-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/songs-data.js",
  "/manifest.json"
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // Skip non-GET and Firebase/CDN requests
  if (event.request.method !== "GET") return;
  if (url.hostname.includes("firebase") || url.hostname.includes("gstatic")) return;
  if (url.hostname.includes("jsdelivr") || url.hostname.includes("tailwindcss")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
