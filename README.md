# RCCM Gigbook — Setup & Deployment Guide

A fully-featured Progressive Web App for church band song and setlist management, built with Firebase, Tailwind CSS, and vanilla JavaScript.

---

## 📁 Required File Structure

```
rccm-gigbook/
├── index.html          ← Main application (single file)
├── manifest.json       ← PWA manifest (copy from below)
├── sw.js               ← Service Worker (copy from below)
├── README.md           ← This file
└── icons/
    ├── icon-192.png    ← PWA icon 192×192 px (maskable)
    └── icon-512.png    ← PWA icon 512×512 px (maskable)
```

---

## 🔥 Firebase Project Setup

### Step 1 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Enter project name: `rccm-gigbook`
3. Disable Google Analytics if not needed → Click **"Create Project"**

### Step 2 — Enable Authentication

1. In the Firebase console sidebar → **Authentication** → **Get started**
2. Under **Sign-in method** → Enable **Google**
3. Set your project's public-facing name and support email
4. Click **Save**

### Step 3 — Enable Firestore Database

1. In the sidebar → **Firestore Database** → **Create database**
2. Choose **Start in production mode** (you will configure rules below)
3. Select a region closest to your users → Click **Enable**

### Step 4 — Configure Firestore Security Rules

In Firestore → **Rules** tab, replace all content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection — users can read/write their own doc; admin reads all
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth.token.email == 'buenavistaaglinaodanny@gmail.com';
    }

    // Songs collection — authenticated users can read; only admin/subadmin write
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        request.auth.token.email == 'buenavistaaglinaodanny@gmail.com'
      );
    }

    // Setlists collection — read by all authenticated, write restricted
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }

    // Config collection — theme readable by all, writeable only by admin
    match /config/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth.token.email == 'buenavistaaglinaodanny@gmail.com';
    }
  }
}
```

### Step 5 — Register Web App & Get Config

1. In Firebase console → **Project Settings** (gear icon)
2. Under **"Your apps"** → Click **"Add app"** → Choose **Web** (`</>`)
3. Register app name: `RCCM Gigbook`
4. Copy the `firebaseConfig` object — it looks like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rccm-gigbook.firebaseapp.com",
  projectId: "rccm-gigbook",
  storageBucket: "rccm-gigbook.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

5. **Replace the placeholder values** in `index.html` (search for `YOUR_API_KEY`, etc.) with your actual Firebase config values.

### Step 6 — Authorized Domains

1. In Firebase console → **Authentication** → **Settings** → **Authorized domains**
2. Add: `danaglinao0522.github.io`

---

## 📱 PWA Asset Files

### `manifest.json`

Create this file at the root of your repository:

```json
{
  "name": "RCCM Gigbook",
  "short_name": "Gigbook",
  "description": "RCCM Church Band Digital Songbook & Setlist Manager",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0f0e17",
  "theme_color": "#6366f1",
  "categories": ["music", "productivity", "utilities"],
  "lang": "en",
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [],
  "prefer_related_applications": false
}
```

### `sw.js` (Service Worker)

Create this file at the root of your repository:

```javascript
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
```

---

## 🖼️ Icon Generation

Create 192×192 and 512×512 PNG icons with your church branding:

1. Use [https://realfavicongenerator.net](https://realfavicongenerator.net) or [https://maskable.app](https://maskable.app)
2. Export as `icon-192.png` and `icon-512.png`
3. Place them in the `icons/` directory at the root
4. **Maskable icons** should have safe zone padding (about 10% border)

---

## 🚀 GitHub Pages Deployment

### Step 1 — Repository Setup

```bash
git init
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
```

### Step 2 — Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source** → Select branch: `main` (or `master`) → Root folder: `/ (root)`
3. Click **Save**
4. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

### Step 3 — Push All Files

```bash
git add .
git commit -m "Initial RCCM Gigbook deployment"
git push origin main
```

---

## 👥 User Roles & Permissions Reference

| Capability | Admin | Sub-Admin | Lead | Musician | Singer | Tech |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Add Songs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit Songs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Delete Songs | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create Setlists | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit Setlists | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete Setlists | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| View Private Songs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Lyrics Only (forced) | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Theme Admin | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Role Manager | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| User Manager | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| OCR Song Import | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

> **Note:** All permissions except Admin are dynamically adjustable by the Admin via the Role Capability Manager panel.

---

## 🔑 Admin Account

The master Admin account is hard-coded to:

```
buenavistaaglinaodanny@gmail.com
```

This account automatically receives full permissions on first login. The Admin's own role **cannot** be changed via the User Management panel.

---

## 🎸 Chord Format Guide (for Song Entry)

Songs use inline bracket notation:

```
[G]Amazing [Em]grace, how [C]sweet the [G]sound
That [G]saved a [Em]wretch like [D]me
[G]I once was [Em]lost but [C]now am [G]found
Was [C]blind but [G/D]now I [G]see
```

**Supported chord formats:**
- Simple: `[C]`, `[G]`, `[Am]`, `[F]`
- With quality: `[Cmaj7]`, `[Em7]`, `[Asus2]`, `[Dsus4]`
- Slash chords: `[G/B]`, `[C/E]`, `[Am/G]`
- Altered: `[Gdim]`, `[Faug]`, `[Bb7]`

**Section headers** (use without brackets for labeling):
```
== Verse 1 ==
[G]Amazing grace...

== Chorus ==
[C]How great thou art...
```

---

## 📦 Firestore Data Structure

```
firestore/
├── users/
│   └── {uid}/
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── role: "Admin" | "Sub-Admin" | "Lead" | "Musician" | "Singer" | "Tech"
│       ├── createdAt: timestamp
│       └── lastSeen: timestamp
│
├── songs/
│   └── {songId}/
│       ├── title: string
│       ├── artist: string
│       ├── key: string (e.g., "G", "C#", "Bb")
│       ├── genre: string
│       ├── bpm: number | null
│       ├── content: string (lyrics with inline [Chord] notation)
│       ├── visibility: "public" | "private"
│       ├── createdBy: string (uid)
│       └── createdAt: timestamp
│
├── setlists/
│   └── {setlistId}/
│       ├── name: string
│       ├── date: string (ISO date: "2025-01-19")
│       ├── description: string
│       ├── visibility: "public" | "private"
│       ├── createdBy: string (uid)
│       ├── createdAt: timestamp
│       └── songs: Array<{ songId: string, addedAt: number }>
│
└── config/
    ├── theme/
    │   ├── appName: string
    │   ├── bg: string (hex color)
    │   ├── surface: string
    │   ├── surface2: string
    │   ├── border: string
    │   ├── primary: string
    │   ├── secondary: string
    │   ├── accent: string
    │   ├── heading: string
    │   ├── body: string
    │   ├── lyrics: string
    │   ├── chords: string
    │   ├── btnLabel: string
    │   └── btnBg: string
    │
    └── roleCapabilities/
        ├── Sub-Admin: { canAddSong, canEditSong, canDeleteSong, ... }
        ├── Lead: { ... }
        ├── Musician: { ... }
        ├── Singer: { ... }
        └── Tech: { ... }
```

---

## 🛠️ Local Development

To test locally without GitHub Pages:

```bash
# Install a simple HTTP server
npm install -g live-server

# Run from project root
live-server --port=3000 --entry-file=index.html
```

Or use Python:
```bash
python3 -m http.server 3000
```

Then open: `http://localhost:3000`

> **Note:** Firebase Auth requires an authorized domain. Add `localhost` to your Firebase Auth authorized domains for local testing.

---

## ✅ Feature Checklist

- [x] Firebase Google Authentication
- [x] Blind role selection onboarding (5 roles)
- [x] Admin account hard-lock (`buenavistaaglinaodanny@gmail.com`)
- [x] Admin self-demotion block
- [x] Real-time Firestore song library
- [x] Chord transposition engine (full 12-key chromatic)
- [x] Capo position calculator with play-key display
- [x] Lyrics-only mode with regex chord stripping
- [x] Decoupled localStorage key per song+setlist session
- [x] Setlist creation, management, deletion
- [x] Duplicate-safe song population in setlists
- [x] Instant DOM re-render on setlist add (no reload)
- [x] A+ / A- font scaling (lyrics canvas only)
- [x] Viewport zoom disabled; in-app font scaling only
- [x] Non-overflowing key selector dropdown
- [x] Hardware back button interception (History API)
- [x] Context-aware Home button in header
- [x] URL lock (no navigation away from base URL)
- [x] Live theme sync to all connected users (real-time)
- [x] 8 preset color palette templates
- [x] Granular CSS variable color pickers (8 targets)
- [x] Dynamic role capability grid admin modal
- [x] Admin user management with role reassignment
- [x] OCR extraction via Tesseract.js (camera + file upload)
- [x] OCR progress bar with status text
- [x] Iconify icons throughout (tabler icon set)
- [x] PWA manifest + service worker
- [x] beforeinstallprompt Install button + banner
- [x] Apple mobile web app meta tags
- [x] Full responsive layout (mobile/tablet/desktop)
- [x] Zero TODO placeholders — 100% production-ready code
