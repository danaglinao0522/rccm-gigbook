# 🎸 GigBook — Guitar Chords, Lyrics & Setlist PWA

A fully featured Progressive Web App for managing guitar chord sheets, lyrics, and worship setlists. Built with HTML, Tailwind CSS, FlyonUI, and Firebase Firestore. Installable on iOS and Android.

---

## 🚀 Quick Start

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a **new project**.
2. Enable **Google Authentication**:
   - Go to **Authentication → Sign-in method → Google** → Enable
3. Enable **Cloud Firestore**:
   - Go to **Firestore Database → Create Database**
   - Start in **Production Mode**
4. Register a **Web App** in your project settings and copy the `firebaseConfig` object.

---

### 2. Configure Firebase in `index.html`

Find this block in `index.html` and replace with your actual values:

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

---

### 3. Firestore Security Rules

Go to **Firestore → Rules** and set the following:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'];
    }

    // Songs - anyone authenticated can read, privileged roles can write
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead'];
    }

    // Setlists - authenticated users can read/write (app handles ACL)
    match /setlists/{setlistId} {
      allow read, write: if request.auth != null;
    }

    // App settings - only admin can write
    match /settings/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

---

### 4. GitHub Pages Deployment

1. Push this repository to GitHub.
2. Go to **Settings → Pages → Source: Deploy from branch → main / root**.
3. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

---

### 5. Add PWA Icons

Create an `icons/` folder in your repo root and add:

| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | 192×192px | Android Home Screen |
| `icon-512.png` | 512×512px | Android Splash Screen |
| `icon-180.png` | 180×180px | Apple Touch Icon (iOS) |
| `icon-maskable.png` | 512×512px | Maskable Icon (with safe zone) |

**Free icon tools:**
- [Favicon.io](https://favicon.io/) — Generate from text/image
- [RealFaviconGenerator](https://realfavicongenerator.net/) — Multi-platform icons
- [PWA Image Generator](https://tools.crawlink.com/tools/pwa-icon-generator/) — All sizes at once

---

### 6. `manifest.json` Configuration

Create `manifest.json` in your project root:

```json
{
  "name": "GigBook - Guitar Chords & Setlists",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics, and Setlist management app for worship teams",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0b0f19",
  "theme_color": "#4338ca",
  "lang": "en",
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
    },
    {
      "src": "icons/icon-180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "shortcuts": [
    {
      "name": "Songs",
      "short_name": "Songs",
      "description": "Browse all chord sheets",
      "url": "/rccm-gigbook/",
      "icons": [{ "src": "icons/icon-192.png", "sizes": "192x192" }]
    },
    {
      "name": "Setlists",
      "short_name": "Setlists",
      "description": "View and manage setlists",
      "url": "/rccm-gigbook/",
      "icons": [{ "src": "icons/icon-192.png", "sizes": "192x192" }]
    }
  ],
  "screenshots": [
    {
      "src": "icons/screenshot-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "GigBook on Mobile"
    }
  ],
  "prefer_related_applications": false
}
```

---

### 7. Service Worker (`sw.js`)

Create `sw.js` in your project root for offline caching:

```javascript
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore') ||
      event.request.url.includes('firebase') ||
      event.request.url.includes('gstatic')) {
    return; // Don't cache Firebase requests
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => caches.match('/rccm-gigbook/index.html'));
    })
  );
});
```

---

## 👑 Admin Setup

1. The **Admin** account is hardcoded to: `buenavistaaglinaodanny@gmail.com`
2. Sign in with this Google account first — it will automatically get Admin role.
3. From the **Profile → Admin Panel**, you can:
   - Customize the theme (colors, app name, logo)
   - Manage user roles and instrument assignments
   - Configure role capabilities (what each role can do)

---

## 🎭 Role Reference

| Role | Setlist Cap | Song Cap | Chords | Directory |
|------|------------|----------|--------|-----------|
| **Admin** | Unlimited | Unlimited | ✅ | ✅ Full control |
| **Sub-Admin** | Unlimited | Unlimited | ✅ | ✅ View + Edit |
| **Lead** | Unlimited | Unlimited | ✅ | ✅ View |
| **Musician** | 5 | 4/setlist | ✅ | ❌ |
| **Vocals** | 5 | 4/setlist | ❌ Lyrics only | ❌ |
| **Tech** | 5 | 4/setlist | ❌ Lyrics only | ❌ |

---

## 📱 iOS PWA Installation

1. Open the app URL in **Safari** on iPhone/iPad.
2. Tap the **Share** button (box with arrow pointing up).
3. Tap **"Add to Home Screen"**.
4. Tap **"Add"** — the app icon will appear on your home screen.

> **Note:** On iOS, `beforeinstallprompt` is not supported. The "Install App" button shows instructions for iOS users.

---

## 🔧 Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| HTML5 | — | Structure |
| Tailwind CSS | Browser CDN | Utility styling |
| FlyonUI | 2.4.1 | Component library |
| Iconify | 2.1.0 | Icon system |
| Firebase Auth | 11.0.0 | Google Sign-In |
| Firebase Firestore | 11.0.0 | Real-time database |
| Service Worker | — | PWA offline support |

---

## 🗂 Folder Structure

```
rccm-gigbook/
├── index.html          # Main application (self-contained)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker
├── README.md           # This file
└── icons/
    ├── icon-192.png    # Android icon
    ├── icon-512.png    # Splash/store icon
    ├── icon-180.png    # Apple touch icon
    └── icon-maskable.png  # Maskable icon
```

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Sign-in failed" error | Add your GitHub Pages domain to Firebase Auth → Authorized Domains |
| Firestore permission denied | Check Firestore Security Rules match the rules above |
| App not installing | Ensure HTTPS, manifest.json is valid, and SW is registered |
| Theme not syncing | Check Firestore connection and browser console for errors |
| Songs not loading | Verify Firestore read rules allow authenticated users |

---

## 📄 License

MIT License — Free to use, modify, and distribute.

---

*Built for worship teams. Powered by Firebase. Designed for musicians.*
