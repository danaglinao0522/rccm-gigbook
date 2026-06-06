# RCCM GigBook — Setup Guide

> Guitar Chords, Lyrics & Setlist PWA · Firebase Firestore · GitHub Pages

---

## 📁 Required Root File Structure

```
rccm-gigbook/
├── index.html          ← Main application (single file)
├── layout-checklist.html ← Feature checklist & visual layout breakdown
├── manifest.json       ← PWA manifest (see below)
├── README.md           ← This file
├── sw.js               ← Service Worker (see below)
└── icons/
    ├── logo.png        ← Brand logo shown on Sign-In screen (required)
    ├── icon-192.png    ← PWA icon 192×192 (required)
    └── icon-512.png    ← PWA icon 512×512 (required)
```

---

## 🔥 Step 1 — Firebase Project Setup

### 1.1 Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `rccm-gigbook`
3. Disable Google Analytics (optional) → **Create project**

### 1.2 Enable Authentication
1. In sidebar: **Build → Authentication → Get started**
2. Click **Sign-in method** tab
3. Enable **Google** provider → Set project support email → Save

### 1.3 Enable Firestore Database
1. In sidebar: **Build → Firestore Database → Create database**
2. Choose **Production mode** → Select your region → **Enable**
3. Go to **Rules** tab and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null &&
        (request.auth.uid == userId ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Sub-Admin');
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Sub-Admin');
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Sub-Admin');
      allow delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin');
    }

    // App settings (Admin only write)
    match /settings/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

### 1.4 Get Firebase Config
1. In Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll to **"Your apps"** → Click **Web** (`</>`) icon
3. Register app name → Copy the `firebaseConfig` object

---

## ⚙️ Step 2 — Configure `index.html`

Open `index.html` and replace the placeholder config block:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

With your actual values from Firebase Console. Example:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbc123DefGhi456JklMno789",
  authDomain: "rccm-gigbook.firebaseapp.com",
  projectId: "rccm-gigbook",
  storageBucket: "rccm-gigbook.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## 📋 Step 3 — Create `manifest.json`

Create `manifest.json` in the root directory with this content:

```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics & Setlist App for RCCM worship team",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#121212",
  "theme_color": "#121212",
  "lang": "en",
  "categories": ["music", "productivity", "utilities"],
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

> ⚠️ **Important:** Update `start_url` and `scope` to match your GitHub Pages URL path (e.g., `/rccm-gigbook/`).

---

## 🔧 Step 4 — Create `sw.js` (Service Worker)

Create `sw.js` in the root directory for offline caching:

```javascript
const CACHE_NAME = 'rccm-gigbook-v1';
const STATIC_ASSETS = [
  '/rccm-gigbook/',
  '/rccm-gigbook/index.html',
  '/rccm-gigbook/manifest.json',
  '/rccm-gigbook/icons/logo.png',
  '/rccm-gigbook/icons/icon-192.png',
  '/rccm-gigbook/icons/icon-512.png',
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
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      });
    }).catch(() => caches.match('/rccm-gigbook/index.html'))
  );
});
```

Add this snippet inside the `<head>` of `index.html` to register the service worker:

```html
<script>
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/rccm-gigbook/sw.js')
        .then(reg => console.log('SW registered:', reg.scope))
        .catch(err => console.warn('SW registration failed:', err));
    });
  }
</script>
```

---

## 🎸 Step 5 — Prepare Icon Assets

Place these files in the `icons/` folder:

| File | Size | Purpose |
|------|------|---------|
| `logo.png` | Any (recommended 256×256) | Sign-In screen brand logo |
| `icon-192.png` | 192×192 px | PWA home screen icon |
| `icon-512.png` | 512×512 px | PWA splash screen icon |

> Use [https://realfavicongenerator.net](https://realfavicongenerator.net) to generate all sizes from a single source image.

---

## 🚀 Step 6 — Deploy to GitHub Pages

### 6.1 Push to GitHub
```bash
git init
git add .
git commit -m "Initial RCCM GigBook deployment"
git branch -M main
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
git push -u origin main
```

### 6.2 Enable GitHub Pages
1. Go to your repo → **Settings → Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / Folder: `/ (root)`
4. Click **Save**
5. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

### 6.3 Configure Firebase Authorized Domains
1. Firebase Console → **Authentication → Settings → Authorized domains**
2. Add: `danaglinao0522.github.io`

---

## 👤 Step 7 — First Admin Login

1. Open your deployed app URL
2. Sign in with Google using `buenavistaaglinaodanny@gmail.com`
3. Complete onboarding (select **Musician** or your role)
4. After saving, the app will automatically detect the Admin email and assign the **Admin** role
5. You now have access to all 4 tabs including Users and Admin Panel

---

## 🔄 Firestore Data Structure Reference

```
firestore/
├── users/
│   └── {uid}
│       ├── uid: string
│       ├── email: string
│       ├── displayName: string
│       ├── photoURL: string
│       ├── role: "Admin" | "Sub-Admin" | "Lead" | "Tech" | "Singer" | "Musician"
│       ├── instruments: string[]        // ["Guitar", "Keyboard", "Djembe"]
│       ├── canSing: boolean
│       ├── inTechTeam: boolean
│       ├── tutorialEnabled: boolean
│       ├── maxSetlists: number | null   // null = use role default
│       ├── permissions: {
│       │     deleteSongs: boolean,
│       │     addSongs: boolean
│       │   }
│       └── createdAt: Timestamp
│
├── songs/
│   └── {songId}
│       ├── title: string
│       ├── artist: string
│       ├── content: string              // Raw chord/lyric sheet (no brackets)
│       ├── createdBy: string           // uid
│       └── createdAt: Timestamp
│
├── setlists/
│   └── {setlistId}
│       ├── name: string
│       ├── visibility: "public" | "private" | "custom-group"
│       ├── type: "standard" | "custom-group"
│       ├── songs: string[]             // Array of song IDs
│       ├── accessList: string[]        // Array of UIDs (custom-group only)
│       ├── createdBy: string           // uid
│       ├── createdByName: string
│       ├── createdByPhoto: string
│       └── createdAt: Timestamp
│
└── settings/
    └── app
        ├── appName: string
        ├── appIcon: string
        └── theme: string               // Theme preset name
```

---

## 📱 Installing on iOS (Safari)

1. Open the app URL in **Safari** (not Chrome)
2. Tap the **Share** button (box with arrow)
3. Scroll and tap **"Add to Home Screen"**
4. Tap **"Add"** — the app icon appears on your home screen
5. Launch from home screen for standalone PWA mode

## 🤖 Installing on Android (Chrome)

1. Open the app URL in **Chrome**
2. Tap the **three-dot menu** (⋮)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **"Install"** — the app icon appears on your home screen
5. The **"Install App"** button on the splash screen also triggers this flow

---

## 🎵 Song Sheet Format Guide

The app uses a **bracket-free intelligent chord parser**. Simply paste raw chord sheets:

```
VERSE 1
G                 D
What is our hope in life and death
        Em              C
Christ alone, Christ alone

CHORUS
       C              G
Hallelujah, praise the One who set us free
       C              D
Hallelujah, death has lost its grip on me
```

**Rules:**
- Lines with only chord names (A-G + extensions) → rendered as **chord lines** (amber)
- Lines with text → rendered as **lyric lines** (white)
- Lines matching VERSE/CHORUS/BRIDGE etc. → rendered as **section headers**
- No `[ ]` or `| |` required

---

## 🛡️ Security Notes

- The Admin email (`buenavistaaglinaodanny@gmail.com`) is hardcoded in the app and Firestore security rules as the immutable master admin
- Never commit your `firebaseConfig` API key to a public repository — use GitHub Secrets for CI/CD if needed
- Firestore rules enforce server-side role validation on all write operations

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Sign-in popup blocked | Allow popups for your domain in browser settings |
| "Firebase not configured" | Replace all `YOUR_*` placeholders in `firebaseConfig` |
| App icon not showing | Ensure `icons/logo.png`, `icons/icon-192.png` exist in repo |
| Install button not appearing | Must be on HTTPS (GitHub Pages is HTTPS by default) |
| Firestore permission denied | Check Authorized Domains in Firebase Auth settings |
| Songs not loading | Check Firestore rules and ensure user is authenticated |

---

*RCCM GigBook — Built for worship teams. All glory to God.*
