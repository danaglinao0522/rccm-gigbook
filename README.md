# RCCM Gigbook — Guitar Chords, Lyrics & Setlist PWA

A full-featured Progressive Web App for worship teams — manage songs, chord sheets, and setlists in real time with Firebase Firestore.

---

## 🚀 Quick Setup

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project (e.g., `rccm-gigbook`).
2. Enable **Google Authentication**:
   - Go to **Authentication → Sign-in method → Google → Enable**.
3. Create a **Firestore Database**:
   - Go to **Firestore Database → Create database → Start in production mode**.
4. Register a **Web App** under your Firebase project:
   - Go to **Project Settings → General → Your apps → Add app → Web**.
   - Copy the `firebaseConfig` object provided.

---

### 2. Configure `index.html`

Open `index.html` and replace the placeholder `firebaseConfig` near line ~430 with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Also confirm the admin email constant matches your master account:

```javascript
const ADMIN_EMAIL = 'buenavistaaglinaodanny@gmail.com';
```

---

### 3. Firestore Security Rules

Go to **Firestore → Rules** and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null &&
        (request.auth.uid == userId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']);
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'];
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canAddSongs == true);
      allow update, delete: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canDeleteSongs == true);
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']);
      allow delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']);
    }

    // Config collection (admin only writes)
    match /config/{configId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

---

### 4. Asset Icons Setup

Create an `icons/` folder in the root directory with the following files:

```
icons/
├── logo.png          ← Your app logo (displayed on the Sign-In page)
├── icon-192.png      ← PWA icon 192×192px (Apple touch icon)
├── icon-512.png      ← PWA icon 512×512px (used in manifest)
└── icon-maskable.png ← Maskable PWA icon 512×512px
```

> Use any image editor or [favicon.io](https://favicon.io/) to generate these icons.

---

### 5. `manifest.json` Configuration

Create a `manifest.json` file in the root directory:

```json
{
  "name": "RCCM Gigbook",
  "short_name": "Gigbook",
  "description": "Guitar Chords, Lyrics and Setlist App for worship teams",
  "start_url": "https://danaglinao0522.github.io/rccm-gigbook/",
  "scope": "https://danaglinao0522.github.io/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#121212",
  "theme_color": "#121212",
  "categories": ["music", "productivity"],
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [],
  "prefer_related_applications": false
}
```

---

### 6. Service Worker (`sw.js`)

Create `sw.js` in the root for full PWA offline support:

```javascript
const CACHE_NAME = 'rccm-gigbook-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icons/logo.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
```

Then register it by adding this inside your `index.html` `<script>` block:

```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('SW registered:', reg.scope))
    .catch(err => console.error('SW error:', err));
}
```

---

### 7. GitHub Pages Deployment

1. Push all files to your GitHub repository.
2. Go to **Settings → Pages → Branch: main / root**.
3. The app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

> Make sure your Firebase project's **Authorized Domains** includes your GitHub Pages URL:
> Firebase Console → Authentication → Settings → Authorized domains → Add `danaglinao0522.github.io`

---

## 📱 Installing the PWA

### Android (Chrome)
- Open the app in Chrome → tap the **Install App** button or use the browser's **"Add to Home Screen"** option from the overflow menu.

### iOS (Safari)
- Open the app in Safari → tap the **Share** button (box with arrow) → **"Add to Home Screen"**.

> The Install App button auto-hides once the app is already installed or running in standalone mode.

---

## 🎭 Role Hierarchy

| Role | Setlist Limit | Songs Per Setlist | Chord View | Key/Capo | Admin Panel |
|------|---------------|-------------------|------------|----------|-------------|
| Admin | Unlimited | Unlimited | ✅ | ✅ | ✅ |
| Sub-Admin | 5 | Global Cap | ✅ | ✅ | ✅ |
| Lead | 5 | Global Cap | ✅ | ✅ | ❌ |
| Musician | 2 | Global Cap | ✅ | ✅ | ❌ |
| Singer | 2 | Global Cap | Lyrics Only | ❌ | ❌ |
| Tech | 2 | Global Cap | Lyrics Only | ❌ | ❌ |

---

## 🔧 Troubleshooting

- **Google Sign-In popup blocked:** Make sure your domain is authorized in Firebase Console.
- **Permission denied errors:** Verify your Firestore Security Rules are published correctly.
- **App not installable:** Ensure `manifest.json` is correctly linked and `sw.js` is registered.
- **Songs not loading:** Check that Firestore is initialized and rules allow reads for authenticated users.

---

## 📂 File Structure

```
rccm-gigbook/
├── index.html          ← Main single-page app (all code)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
├── README.md           ← This file
└── icons/
    ├── logo.png
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable.png
```

---

*Built with ❤️ for RCCM Worship Team*
