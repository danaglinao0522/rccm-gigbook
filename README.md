# 🎸 RCCM GigBook — Guitar Chords, Lyrics & Setlist PWA

A full-featured Progressive Web App for managing guitar chords, lyrics, and worship setlists. Built with vanilla JavaScript, Tailwind CSS, and Firebase.

**Live URL:** `https://danaglinao0522.github.io/rccm-gigbook/`

---

## 📋 Table of Contents

1. [Features Overview](#features-overview)
2. [Prerequisites](#prerequisites)
3. [Firebase Setup](#firebase-setup)
4. [GitHub Pages Deployment](#github-pages-deployment)
5. [PWA Icon Generation](#pwa-icon-generation)
6. [manifest.json Configuration](#manifestjson-configuration)
7. [Service Worker (sw.js)](#service-worker-swjs)
8. [File Structure](#file-structure)
9. [Role Permissions Reference](#role-permissions-reference)
10. [Troubleshooting](#troubleshooting)

---

## ✅ Features Overview

| Feature | Status |
|---|---|
| Google Sign-In (Firebase Auth) | ✅ |
| Role-based access control (6 roles) | ✅ |
| Song list with real-time search | ✅ |
| Collapsible filter panel (Key + Tags) | ✅ |
| Active filter badges (dismissible) | ✅ |
| Song chords + lyrics rendering | ✅ |
| Lyrics-only mode (Singer/Tech) | ✅ |
| Key transposition engine | ✅ |
| Capo suggestion calculator | ✅ |
| Autoscroll with speed control | ✅ |
| Touch swipe left/right navigation | ✅ |
| Setlist creation/editing | ✅ |
| Public / Private setlist toggle | ✅ |
| Add/Remove songs from setlists | ✅ |
| Song limits per role | ✅ |
| Admin panel (role change, delete) | ✅ |
| PWA installable (Android + iOS) | ✅ |
| Hardware back button intercept | ✅ |
| Offline cache (localStorage) | ✅ |
| Fixed URL routing | ✅ |
| Install banner + top-bar button | ✅ |

---

## 🔧 Prerequisites

- A **Google account** (for Firebase)
- A **GitHub account** with a repository at `danaglinao0522/rccm-gigbook`
- A **modern browser** (Chrome, Safari, Firefox)
- Basic ability to edit text files

---

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"**
3. Name it `rccm-gigbook` (or any name you choose)
4. Disable Google Analytics (optional) → Click **"Create project"**

### Step 2: Enable Google Authentication

1. In the Firebase Console sidebar, go to **Build → Authentication**
2. Click **"Get started"**
3. Select **"Google"** under Sign-in providers
4. Toggle it to **Enabled**
5. Add your **Project support email**
6. Click **"Save"**

### Step 3: Add Your GitHub Pages Domain to Authorized Domains

1. Still in **Authentication**, click the **"Settings"** tab
2. Under **"Authorized domains"**, click **"Add domain"**
3. Add: `danaglinao0522.github.io`
4. Click **"Add"**

### Step 4: Create Firestore Database

1. In the sidebar, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → Click **"Next"**
4. Choose a region closest to you (e.g., `asia-southeast1` for Philippines) → Click **"Enable"**

### Step 5: Set Firestore Security Rules

In Firestore, click the **"Rules"** tab and paste the following:

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
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'subadmin'];
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'subadmin'];
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null &&
        (resource.data.ownerId == request.auth.uid ||
         resource.data.visibility == 'public');
      allow create: if request.auth != null &&
        request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth != null &&
        resource.data.ownerId == request.auth.uid;
    }
  }
}
```

Click **"Publish"**.

### Step 6: Get Your Firebase Config

1. In the Firebase Console, click the **gear icon ⚙️** → **"Project settings"**
2. Scroll down to **"Your apps"** → Click **"</> Web"** icon
3. Register your app with nickname `GigBook Web`
4. **Copy the `firebaseConfig` object** — it looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rccm-gigbook.firebaseapp.com",
  projectId: "rccm-gigbook",
  storageBucket: "rccm-gigbook.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### Step 7: Paste Config into index.html

Open `index.html` and find this section near the top of the `<script>` tag:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace each `"YOUR_..."` value with your actual Firebase config values.

---

## 🌐 GitHub Pages Deployment

### Step 1: Create Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Repository name: `rccm-gigbook`
3. Set to **Public**
4. Click **"Create repository"**

### Step 2: Upload Files

Upload all files from this project to the root of your repository:
- `index.html`
- `manifest.json`
- `sw.js`
- `icons/` folder (with all icon PNG files)

You can drag-and-drop files directly on GitHub.com or use Git:

```bash
git init
git add .
git commit -m "Initial GigBook deployment"
git branch -M main
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository → **Settings** tab
2. In the left sidebar, click **"Pages"**
3. Under **"Source"**, select `Deploy from a branch`
4. Set branch to `main` and folder to `/ (root)`
5. Click **"Save"**
6. Wait ~2 minutes, then your app will be live at:
   `https://danaglinao0522.github.io/rccm-gigbook/`

---

## 🎨 PWA Icon Generation

You need PNG icons in these sizes. Create them from a single master icon (1024×1024 PNG):

| File | Size | Purpose |
|---|---|---|
| `icons/icon-72.png` | 72×72 | Android legacy |
| `icons/icon-96.png` | 96×96 | Android |
| `icons/icon-128.png` | 128×128 | Android |
| `icons/icon-144.png` | 144×144 | Android |
| `icons/icon-152.png` | 152×152 | iPad |
| `icons/icon-167.png` | 167×167 | iPad Pro |
| `icons/icon-180.png` | 180×180 | iPhone (iOS) |
| `icons/icon-192.png` | 192×192 | Android home screen ★ |
| `icons/icon-512.png` | 512×512 | Android splash / PWA ★ |
| `icons/icon-maskable-192.png` | 192×192 | Android maskable |
| `icons/icon-maskable-512.png` | 512×512 | Android maskable |

**Free Icon Generator Tools:**
- [https://www.pwabuilder.com/imageGenerator](https://www.pwabuilder.com/imageGenerator)
- [https://realfavicongenerator.net](https://realfavicongenerator.net)
- [https://maskable.app](https://maskable.app) (for maskable icons)

**Quick tip:** Use the app's built-in SVG guitar icon design — export it at 1024×1024 with a `#6366f1` to `#8b5cf6` gradient background.

---

## 📄 manifest.json Configuration

Create a file called `manifest.json` in the **root** of your project (same folder as `index.html`) with this content:

```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics & Setlist App for RCCM Church",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0f0f1a",
  "theme_color": "#6366f1",
  "lang": "en",
  "categories": ["music", "productivity", "utilities"],
  "icons": [
    {
      "src": "icons/icon-72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-167.png",
      "sizes": "167x167",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-180.png",
      "sizes": "180x180",
      "type": "image/png",
      "purpose": "any"
    },
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
      "src": "icons/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "screenshots/songs-view.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Songs List View"
    },
    {
      "src": "screenshots/song-detail.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Song Chords & Lyrics"
    }
  ]
}
```

> **Note:** Screenshots are optional but improve the Play Store / App Store install experience. You can omit the `screenshots` array if you don't have them yet.

---

## ⚙️ Service Worker (sw.js)

Create a file called `sw.js` in the root of your project. This enables offline caching:

```javascript
const CACHE_NAME = 'gigbook-v1';
const BASE_PATH = '/rccm-gigbook';

const STATIC_ASSETS = [
  BASE_PATH + '/',
  BASE_PATH + '/index.html',
  BASE_PATH + '/manifest.json',
  BASE_PATH + '/icons/icon-192.png',
  BASE_PATH + '/icons/icon-512.png',
];

// Install — cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — remove old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch — network first, fallback to cache
self.addEventListener('fetch', event => {
  // Skip Firebase API calls from caching
  if (event.request.url.includes('firebaseapp.com') ||
      event.request.url.includes('googleapis.com') ||
      event.request.url.includes('gstatic.com') ||
      event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
```

---

## 📁 File Structure

```
rccm-gigbook/
├── index.html           ← Main app (all-in-one)
├── manifest.json        ← PWA manifest
├── sw.js                ← Service worker
├── README.md            ← This file
└── icons/
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-167.png
    ├── icon-180.png
    ├── icon-192.png      ← Required for iOS
    ├── icon-512.png      ← Required for Android
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

---

## 👥 Role Permissions Reference

| Role | Add/Edit Songs | Delete Songs | Admin Panel | Change Roles | Delete Users | Max Setlists | Songs/Setlist |
|---|---|---|---|---|---|---|---|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ∞ | ∞ |
| **Sub-Admin** | ✅ | ✅ | ✅ (view only) | ❌ | ❌ | 15 | ∞ |
| **Lead** | ❌ | ❌ | ❌ | ❌ | ❌ | 15 | ∞ |
| **Musician** | ❌ | ❌ | ❌ | ❌ | ❌ | 5 | 4 |
| **Singer** | ❌ | ❌ | ❌ | ❌ | ❌ | 5 | 4 |
| **Tech** | ❌ | ❌ | ❌ | ❌ | ❌ | 5 | 4 |

**Chord Visibility:**
- Admin / Sub-Admin / Lead / Musician → Full chords + lyrics, key transposition, capo suggestions
- Singer / Tech → Lyrics only (chords are completely hidden)

---

## 📱 iOS Installation Instructions (Share with Users)

1. Open Safari on iPhone/iPad
2. Navigate to `https://danaglinao0522.github.io/rccm-gigbook/`
3. Tap the **Share button** (box with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Name it `GigBook` → Tap **"Add"**
6. The app icon will appear on your home screen ✅

---

## 🤖 Android Installation Instructions (Share with Users)

1. Open **Chrome** on Android
2. Navigate to `https://danaglinao0522.github.io/rccm-gigbook/`
3. Tap the **three-dot menu (⋮)** in the top right
4. Tap **"Add to Home screen"** or **"Install app"**
5. Tap **"Install"** ✅

---

## 🔑 Admin Account Setup

The admin account is **hardcoded** to the email:
```
buenavistaaglinaodanny@gmail.com
```

When this account signs in for the first time, it is **automatically assigned the Admin role**. No manual setup required.

---

## 🐛 Troubleshooting

### "Sign-in failed" error
- Make sure `danaglinao0522.github.io` is added to Firebase Authorized Domains
- Check that Google Sign-in provider is enabled in Firebase Auth

### Songs not loading
- Check your Firestore Security Rules (see Step 5)
- Ensure Firestore is in the correct region
- Check the browser console for error details

### App not installing as PWA
- Must be served over HTTPS (GitHub Pages does this automatically)
- `manifest.json` must be accessible at the root URL
- `sw.js` must be at the root URL
- All icon files must exist at the paths defined in `manifest.json`

### iOS icon not showing
- Make sure `icons/icon-192.png` exists and is a valid PNG
- The `<link rel="apple-touch-icon">` tag must point to a valid PNG file
- iOS only uses PNG — do not use SVG or WebP

### Firebase quota/billing
- The free Spark plan is sufficient for a church band app
- Firestore free tier: 1GB storage, 50K reads/day, 20K writes/day
- Auth is free for unlimited users

---

## 📞 Support

For setup help, contact the app developer or refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [PWA Builder](https://www.pwabuilder.com)

---

*RCCM GigBook v1.0 — Built with ❤️ for worship teams*
