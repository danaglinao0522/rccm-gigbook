# 🎸 RCCM GigBook — Guitar Chords, Lyrics & Setlist PWA

A full-featured Progressive Web App for managing guitar chord sheets, song lyrics, and service setlists. Built with HTML, Tailwind CSS, FlyonUI, and Firebase.

---

## ✅ Approved & Checked Feature List

| # | Feature | Status |
|---|---------|--------|
| 1 | Iconify CDN loaded in `<head>` for instant icon render | ✅ |
| 2 | Permanent PWA install button (never hidden after onboarding) | ✅ |
| 3 | `manifest.json` link + Apple `apple-touch-icon` tags | ✅ |
| 4 | Zero heavy frameworks — vanilla JS + Tailwind + FlyonUI CDN | ✅ |
| 5 | Songs cached in `localStorage` (5 min TTL) | ✅ |
| 6 | DOM dynamically rendered — no hidden zombie elements | ✅ |
| 7 | URL always locked to base path via History API | ✅ |
| 8 | `popstate` back-button interceptor cycles to Home | ✅ |
| 9 | Dynamic top navbar (app title / contextual home button) | ✅ |
| 10 | Home button appears on song view & setlist detail | ✅ |
| 11 | Clicking app title or Home resets all filters | ✅ |
| 12 | Fixed bottom nav — 2 tabs standard / 3 tabs admin | ✅ |
| 13 | Real-time global text search (title, artist, lyrics) | ✅ |
| 14 | Collapsible filter panel (key + tag/genre) | ✅ |
| 15 | Dismissible active filter badge pills with ✕ icon | ✅ |
| 16 | Google Auth sign-in via Firebase | ✅ |
| 17 | Role selection modal on first sign-up | ✅ |
| 18 | Admin (`buenavistaaglinaodanny@gmail.com`) — full access | ✅ |
| 19 | Sub-Admin — edit songs, max 15 setlists, no user management | ✅ |
| 20 | Lead — elevated viewer, max 15 setlists, chords visible | ✅ |
| 21 | Musician — chord+lyrics toggle, max 5 setlists / 4 songs | ✅ |
| 22 | Singer & Tech — lyrics-only default, max 5 setlists / 4 songs | ✅ |
| 23 | Lyrics-only regex strips `[Chord]` notation absolutely | ✅ |
| 24 | Key panel / transpose arrows hidden in lyrics-only mode | ✅ |
| 25 | Capo suggestion tool (e.g., G→A = Capo 2) | ✅ |
| 26 | Incremental step arrows for key transposition | ✅ |
| 27 | Click key badge to open dropdown key selector | ✅ |
| 28 | Auto-scroll toggle + FlyonUI range slider for speed | ✅ |
| 29 | Touch swipe left/right to navigate songs | ✅ |
| 30 | Setlists — Public / Private visibility toggle | ✅ |
| 31 | Public setlists show creator's profile name | ✅ |
| 32 | Add/edit/delete songs (admin/subadmin only) | ✅ |
| 33 | Setlist create / edit / delete with limits enforced | ✅ |
| 34 | Add songs to setlist with per-role song count limits | ✅ |
| 35 | Admin Panel — view/change user roles, delete users | ✅ |
| 36 | All modal close buttons + backdrop click dismissal mapped | ✅ |
| 37 | Event listeners delegated for dynamic lists | ✅ |
| 38 | Profile modal — avatar, role badge, change role, sign out | ✅ |
| 39 | `sw.js` Service Worker registration | ✅ |
| 40 | PWA `manifest.json` configuration documented below | ✅ |

---

## 📐 App Layout Structure

```
┌─────────────────────────────────────────────┐
│  TOP NAVBAR                                 │
│  [← Home] 🎸 GigBook    [⬇] [▶] [🎵] [👤]  │
├─────────────────────────────────────────────┤
│  SEARCH BAR (songs tab only)                │
│  [ 🔍 Search...                ] [⚙ Filter] │
├─────────────────────────────────────────────┤
│  FILTER PANEL (collapsible)                 │
│  Key: [C] [D] [E] [G] [A]...               │
│  Tags: [Praise] [Ballad] [Rock]...          │
├─────────────────────────────────────────────┤
│  ACTIVE FILTER BADGES                       │
│  Active: [Key: G ✕] [Praise & Worship ✕]   │
├─────────────────────────────────────────────┤
│                                             │
│  MAIN CONTENT (scrollable)                  │
│                                             │
│  ┌ Song List ─────────────────────────────┐ │
│  │ [G] Amazing Grace       Traditional   │ │
│  │     [Hymn] [Praise]          72bpm    │ │
│  │ [A] Way Maker           Sinach        │ │
│  │     [Contemporary]           74bpm    │ │
│  └────────────────────────────────────── ┘ │
│                                             │
│  ┌ Song View ──────────────────────────── ┐ │
│  │ Key: [−] [G▾] [+]   🎸 Capo 2        │ │
│  │ {{Verse 1}}                           │ │
│  │ G       G7     C      G               │ │
│  │ Amazing grace, how sweet the sound   │ │
│  └────────────────────────────────────── ┘ │
│                                             │
│  ┌ Setlist Tab ────────────────────────── ┐ │
│  │ 📋 Sunday Morning Service             │ │
│  │    2025-06-01 • Public • 6 songs      │ │
│  └────────────────────────────────────── ┘ │
│                                             │
├─────────────────────────────────────────────┤
│  BOTTOM NAV                                 │
│  [🎵 Songs] [📋 Setlist] [🛡 Admin]*        │
└─────────────────────────────────────────────┘
  * Admin tab visible to Admin & Sub-Admin only
```

---

## 🚀 Setup Instructions

### Prerequisites
- A **Firebase project** with Firestore and Google Authentication enabled
- A **GitHub repository** for hosting (GitHub Pages recommended)
- Node.js (optional, only for local dev testing)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/danaglinao0522/rccm-gigbook.git
cd rccm-gigbook
```

---

### Step 2 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `rccm-gigbook` → Continue
3. Enable **Google Analytics** (optional) → Create project

#### Enable Authentication
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your GitHub Pages domain to **Authorized domains**:
   - `danaglinao0522.github.io`

#### Enable Firestore
1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** → Select your region → Enable
3. After creation, go to **Rules** tab and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'subadmin'
      );
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        resource.data.visibility == 'public'
      );
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'subadmin'
      );
    }
  }
}
```

---

### Step 3 — Get Firebase Config

1. Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **Web** icon (`</>`)
3. Register app name: `rccm-gigbook` → **Register app**
4. Copy the `firebaseConfig` object

---

### Step 4 — Update `index.html`

Open `index.html` and replace the placeholder Firebase config:

```javascript
// ── ⚠️ REPLACE WITH YOUR FIREBASE CONFIG ──
const firebaseConfig = {
  apiKey: "AIzaSy...",               // ← Your actual API key
  authDomain: "rccm-gigbook.firebaseapp.com",
  projectId: "rccm-gigbook",
  storageBucket: "rccm-gigbook.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

---

### Step 5 — Create PWA Assets

#### `manifest.json`
Create a file named `manifest.json` in the root of your repository:

```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics & Setlist App for RCCM",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#1e1b2e",
  "theme_color": "#7c3aed",
  "categories": ["music", "productivity", "utilities"],
  "icons": [
    {
      "src": "icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png"
    },
    {
      "src": "icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png"
    },
    {
      "src": "icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png"
    },
    {
      "src": "icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png"
    },
    {
      "src": "icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png"
    },
    {
      "src": "icons/icon-167.png",
      "sizes": "167x167",
      "type": "image/png"
    },
    {
      "src": "icons/icon-180.png",
      "sizes": "180x180",
      "type": "image/png"
    },
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "screenshots/screen-mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Songs list on mobile"
    }
  ],
  "shortcuts": [
    {
      "name": "Songs",
      "short_name": "Songs",
      "description": "Browse all songs",
      "url": "/rccm-gigbook/?tab=songs",
      "icons": [{ "src": "icons/icon-96.png", "sizes": "96x96" }]
    },
    {
      "name": "My Setlists",
      "short_name": "Setlists",
      "description": "View my setlists",
      "url": "/rccm-gigbook/?tab=setlist",
      "icons": [{ "src": "icons/icon-96.png", "sizes": "96x96" }]
    }
  ]
}
```

#### `sw.js` (Service Worker)
Create `sw.js` in the root:

```javascript
const CACHE_NAME = 'gigbook-v1';
const SHELL = [
  './',
  './index.html',
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/flyonui@1.2.9/dist/main.min.css',
  'https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('firebasejs') ||
      e.request.url.includes('googleapis')) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
```

#### Icons Directory
Create an `icons/` folder. Generate icon files at these sizes:
- `icon-16.png`, `icon-32.png`, `icon-72.png`, `icon-96.png`
- `icon-128.png`, `icon-144.png`, `icon-152.png`
- `icon-167.png`, `icon-180.png`
- `icon-192.png`, `icon-192-maskable.png`
- `icon-512.png`, `icon-512-maskable.png`

**Free icon generator:** [https://www.pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator)
Upload a 512×512 PNG of the GigBook logo (🎸 guitar icon on purple `#7c3aed` background).

---

### Step 6 — Deploy to GitHub Pages

#### Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `(root)` → Save

Your app will be live at:
```
https://danaglinao0522.github.io/rccm-gigbook/
```

#### Push all files:
```bash
git add .
git commit -m "Initial GigBook PWA deploy"
git push origin main
```

---

### Step 7 — First Launch & Admin Setup

1. Open `https://danaglinao0522.github.io/rccm-gigbook/`
2. Sign in with Google using `buenavistaaglinaodanny@gmail.com`
3. You will be automatically assigned **Admin** role
4. Populate songs via **"Add New Song"** button in the Songs tab

---

## 📱 Installing the PWA

### Android (Chrome)
1. Open the app URL in Chrome
2. Tap the **"⬇ Install App"** button in the top bar OR
3. Tap browser menu → **"Add to Home screen"**

### iOS (Safari)
1. Open the app URL in Safari
2. Tap **Share** → **"Add to Home Screen"**
3. The custom icon will appear on your home screen

---

## 🎵 Chord Sheet Formatting Guide

When adding songs, use this format for the lyrics/chord field:

```
{{Verse 1}}
[G]Amazing [G7]grace, how [C]sweet the [G]sound
That saved a [G]wretch like [D]me

{{Chorus}}
[C]Amazing [G]grace, how [Em]sweet the [D]sound
```

- **Section labels:** Wrap in `{{...}}` — e.g., `{{Verse 1}}`, `{{Chorus}}`, `{{Bridge}}`
- **Chord markers:** Place `[ChordName]` immediately before the syllable it falls on
- **Supported chord formats:** `[G]`, `[Am]`, `[F#m]`, `[Bb]`, `[C/E]`, `[Gmaj7]`, `[Am/G]`

---

## 🔑 User Roles Summary

| Role | Chord View | Edit Songs | Max Setlists | Songs/Setlist | Admin Panel |
|------|-----------|-----------|-------------|--------------|-------------|
| **Admin** | ✅ | ✅ | ∞ | ∞ | ✅ Full |
| **Sub-Admin** | ✅ | ✅ | 15 | ∞ | ✅ Limited |
| **Lead** | ✅ | ❌ | 15 | ∞ | ❌ |
| **Musician** | ✅ Toggle | ❌ | 5 | 4 | ❌ |
| **Singer** | ❌ Lyrics only | ❌ | 5 | 4 | ❌ |
| **Tech** | ❌ Lyrics only | ❌ | 5 | 4 | ❌ |

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | App structure |
| **Tailwind CSS** (CDN) | Utility-first styling |
| **FlyonUI** (CDN) | UI component library |
| **Iconify** (CDN) | Icon rendering |
| **Firebase Auth** | Google Sign-In |
| **Cloud Firestore** | Song & setlist database |
| **Service Worker** | PWA offline caching |
| **localStorage** | Client-side song cache |
| **Web History API** | Back-button URL lock |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Firebase not configured" toast | Replace the `firebaseConfig` in `index.html` with your project values |
| Google sign-in fails | Add your GitHub Pages domain to Firebase Auth → Authorized domains |
| Songs not loading | Check Firestore Security Rules — ensure authenticated read is allowed |
| Install button not showing | Test in Chrome on Android or use a real HTTPS domain (not localhost) |
| Icons not showing on iOS | Ensure `apple-touch-icon` links point to real PNG files in `icons/` folder |
| Back button exits app | Ensure `sw.js` is deployed and the History API pushState is running |

---

## 📄 License

MIT License — Free to use, modify, and distribute.

Built with ❤️ for the RCCM worship team.
