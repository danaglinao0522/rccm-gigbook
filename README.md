# 🎸 RCCM Gigbook — Production Deployment Guide

## Overview
A production-ready Progressive Web App (PWA) for guitar chords, lyrics, and setlist management. Built with HTML5, Tailwind CSS, and Firebase Firestore for real-time collaborative performance management.

---

## 🚀 Quick Start

### Prerequisites
- A [Firebase](https://firebase.google.com) project with Firestore and Authentication enabled
- A [GitHub](https://github.com) repository with Pages enabled
- Node.js (optional, for local dev server)

---

## 🔥 Firebase Setup

### Step 1 — Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add Project** → name it `rccm-gigbook`
3. Disable Google Analytics (optional)
4. Click **Create Project**

### Step 2 — Enable Authentication
1. Navigate to **Build → Authentication → Sign-in method**
2. Enable **Google** provider
3. Set your authorized domain: `danaglinao0522.github.io`
4. Save

### Step 3 — Enable Firestore
1. Navigate to **Build → Firestore Database**
2. Click **Create Database**
3. Choose **Start in Production Mode**
4. Select your preferred region (e.g., `asia-southeast1`)
5. Click **Done**

### Step 4 — Firestore Security Rules
Navigate to **Firestore → Rules** and paste the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        request.auth.uid == userId ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']
      );
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead'] ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.addSongs == true
      );
      allow update: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead']
      );
      allow delete: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin'] ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.deleteSongs == true
      );
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.creatorUid == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']
      );
      allow delete: if request.auth != null && (
        resource.data.creatorUid == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']
      );
    }

    // Config collection (Admin only writes)
    match /config/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

### Step 5 — Get Firebase Config
1. Go to **Project Settings → General**
2. Scroll to **Your apps** → click **Web** icon (`</>`)
3. Register app as `rccm-gigbook-web`
4. Copy the `firebaseConfig` object

### Step 6 — Update index.html
Open `index.html` and replace the `firebaseConfig` block with your real credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 📁 Project File Structure

```
rccm-gigbook/
├── index.html          # Main application (complete PWA)
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (create as below)
├── README.md           # This file
└── icons/
    ├── logo.png        # App logo (used in header + splash)
    ├── icon-192.png    # PWA icon 192x192
    ├── icon-512.png    # PWA icon 512x512
    └── icon-apple.png  # Apple touch icon 180x180
```

---

## 🔧 Service Worker (sw.js)
Create a file named `sw.js` in the root directory:

```javascript
const CACHE_NAME = 'gigbook-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
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
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis')) return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    })
  );
});
```

---

## 🌐 GitHub Pages Deployment

### Step 1 — Repository Setup
```bash
git init
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
git add .
git commit -m "Initial production deployment"
git push -u origin main
```

### Step 2 — Enable GitHub Pages
1. Go to your repository on GitHub
2. Navigate to **Settings → Pages**
3. Under **Source**, select `main` branch, root folder `/`
4. Click **Save**
5. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

### Step 3 — Add Firebase Authorized Domain
1. In Firebase Console → Authentication → Settings → Authorized domains
2. Add `danaglinao0522.github.io`

---

## 🖼️ Required Icons
Place these in the `/icons/` folder:

| File | Size | Purpose |
|------|------|---------|
| `logo.png` | Any (recommended 256×256) | Splash screen + top nav |
| `icon-192.png` | 192×192 | PWA icon (Android) |
| `icon-512.png` | 512×512 | PWA icon (high-res) |

> **Tip:** Use [Favicon.io](https://favicon.io) or [RealFaviconGenerator](https://realfavicongenerator.net) to generate all sizes from a single source image.

---

## 👑 Admin Account Setup
The primary Admin email is hardcoded as:
```
buenavistaaglinaodanny@gmail.com
```
- Sign in with this Google account first
- Admin role is auto-assigned, onboarding is skipped
- This account cannot be demoted or deleted

---

## 🔐 Role Permissions Matrix

| Feature | Admin | Sub-Admin | Lead | Musician | Singer | Tech |
|---------|-------|-----------|------|----------|--------|------|
| View Songs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Songs | ✅ | ✅ | ✅ | ❌* | ❌* | ❌ |
| Delete Songs | ✅ | ✅ | ❌ | ❌* | ❌ | ❌ |
| View Setlists | All | All | All | Own/Public | Own/Public | All |
| Create Setlists | ∞ | 5 max | 5 max | 2 max | 2 max | ❌ |
| Manage Users | ✅ | View | View | ❌ | ❌ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Change Themes | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Chord View | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Key/Capo Tools | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |

*Can be individually granted via User Edit Modal

---

## 🗄️ Firestore Data Schema

### `users/{uid}`
```json
{
  "uid": "string",
  "email": "string",
  "displayName": "string",
  "photoURL": "string",
  "role": "Admin | Sub-Admin | Lead | Musician | Singer | Tech",
  "instruments": ["Guitar", "Keyboard", "Djembe"],
  "canSing": false,
  "inTechToo": false,
  "permissions": {
    "addSongs": false,
    "deleteSongs": false
  },
  "customMaxSetlists": null,
  "showTutorial": true,
  "createdAt": "timestamp"
}
```

### `songs/{songId}`
```json
{
  "title": "string",
  "artist": "string",
  "key": "string (e.g. G, C#)",
  "sheet": "string (raw text, bracket-free format)",
  "createdBy": "uid",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `setlists/{setlistId}`
```json
{
  "name": "string",
  "eventDate": "string",
  "isPublic": true,
  "isCustomGroup": false,
  "aclUsers": ["uid1", "uid2"],
  "songs": ["songId1", "songId2"],
  "creatorUid": "uid",
  "creatorName": "string",
  "creatorPhoto": "string (URL)",
  "createdAt": "timestamp"
}
```

### `config/settings`
```json
{
  "appName": "RCCM Gigbook",
  "appIcon": "icons/logo.png",
  "maxTracksPerSetlist": 4,
  "theme": {
    "canvas": "#121212",
    "lyrics": "#FFFFFF",
    "chord": "#FBBF24"
  },
  "typography": {
    "fontFamily": "system-ui, sans-serif",
    "navFontSize": 13,
    "btnFontSize": 13,
    "metaFontSize": 14
  }
}
```

---

## 🎼 Chord Sheet Format Guide
The app uses **bracket-free** intelligent parsing:

```
VERSE 1
G  D/F#  Em  C
Amazing grace how sweet the sound

CHORUS
C    G    Am   F
That saved a wretch like me

BRIDGE
Em    C    G    D
Words go here under chords
```

**Rules:**
- Lines with ONLY chord names → rendered as chord rows (colored)
- Lines beginning with `VERSE`, `CHORUS`, `BRIDGE`, `INTRO`, `OUTRO`, etc. → section headers
- All other lines → lyrics (white/configured color)
- Chord detection regex validates: `A-G`, `#/b`, `m/maj/dim/sus/add9/7` etc.

---

## 📱 PWA Features
- **Offline Support:** Static assets cached via Service Worker
- **Install Prompt:** Native `beforeinstallprompt` capture
- **iOS Support:** `apple-mobile-web-app-capable` meta tag
- **No Pull-to-Refresh:** `overscroll-behavior-y: contain`
- **Hardware Back Button:** `popstate` event interceptors
- **Pinch-to-Zoom:** Isolated to `.songSheetContent` only

---

## 🌡️ Theme Presets

| Name | Canvas | Lyrics | Chords |
|------|--------|--------|--------|
| Gigbook Classic | `#121212` | `#FFFFFF` | `#FBBF24` |
| Nordic Studio | `#1E293B` | `#F0FAFA` | `#34D399` |
| Vintage Parchment | `#FDFBF7` | `#1F2937` | `#B91C1C` |
| Cyber Neon | `#0F172A` | `#EC4899` | `#06B6D4` |
| Minimalist Charcoal | `#1F2937` | `#9CA3AF` | `#38BDF8` |

---

## 🔄 Automated TTL Expiration
Setlists older than **1 calendar month** are automatically deleted from Firestore on app boot. This runs via `cleanExpiredSetlists()` which queries `createdAt < (now - 1 month)` and batch-deletes stale documents.

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Sign-in popup blocked | Allow popups for your GitHub Pages domain |
| Firebase permission denied | Check Firestore security rules + authorized domains |
| App won't install | Ensure HTTPS + valid manifest.json + SW registered |
| Songs not loading | Verify Firestore collection name = `songs` (lowercase) |
| Theme not persisting | Check `config/settings` document write permissions |

---

## 📞 Support
For issues, open a GitHub Issue at the repository or contact the system administrator.

---

*RCCM Gigbook — Built for live worship performance. © 2025*
