# RCCM GigBook — Guitar Chords, Lyrics & Setlist PWA

A production-ready, enterprise-grade Progressive Web App for live worship performance, featuring real-time chord sheets, setlist management, and multi-role access control. Hosted on GitHub Pages with Firebase Firestore as the real-time backend.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Firebase Setup](#firebase-setup)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [Environment Configuration](#environment-configuration)
7. [PWA Asset Requirements](#pwa-asset-requirements)
8. [Role & Permission Matrix](#role--permission-matrix)
9. [Feature Reference](#feature-reference)
10. [Firestore Security Rules](#firestore-security-rules)
11. [Local Development](#local-development)
12. [Troubleshooting](#troubleshooting)

---

## Project Overview

RCCM GigBook is a single-file PWA designed for live worship teams. It provides:
- Real-time chord sheet viewing with transposition
- Setlist creation and management
- Role-based access control (Admin, Sub-Admin, Lead, Musician, Singer, Tech)
- Cross-device real-time sync via Firebase Firestore
- Offline-capable PWA with install support
- Bracket-free chord/lyric parsing engine

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, Vanilla JavaScript (ES6+) |
| CSS Framework | Tailwind CSS v4 (Browser CDN) |
| UI Components | FlyonUI v1.1.0 |
| Icons | Iconify Engine v2.1.0 |
| Backend | Firebase Firestore (real-time) |
| Auth | Firebase Authentication (Google OAuth) |
| Hosting | GitHub Pages |
| PWA | Web App Manifest + Service Worker |

---

## Directory Structure

```
rccm-gigbook/
├── index.html          # Complete single-file application
├── manifest.json       # PWA web app manifest
├── sw.js               # Service worker (offline caching)
├── README.md           # This documentation file
└── icons/
    ├── logo.png        # App brand logo (displayed in nav + splash)
    ├── icon-192.png    # PWA icon 192×192px
    ├── icon-512.png    # PWA icon 512×512px
    └── icon-maskable.png  # PWA maskable icon (512×512px with safe zone)
```

---

## Firebase Setup

### Step 1: Create a Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Enter project name: `rccm-gigbook`
3. Disable Google Analytics (optional) → Click **"Create Project"**

### Step 2: Enable Authentication
1. In the Firebase Console, go to **Build → Authentication**
2. Click **"Get Started"**
3. Under **Sign-in method**, enable **Google**
4. Set your **Project support email**
5. Click **Save**

### Step 3: Create Firestore Database
1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** (we'll add rules later)
4. Choose your preferred region (e.g., `us-central1`)
5. Click **Enable**

### Step 4: Register Web App
1. In the Firebase Console, click the **Web** icon (`</>`) on the project overview page
2. Register the app with nickname: `rccm-gigbook-web`
3. Enable **Firebase Hosting** (optional — we're using GitHub Pages)
4. Copy the `firebaseConfig` object

### Step 5: Update Firebase Config in index.html
Replace the placeholder `firebaseConfig` in `index.html` with your actual config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 6: Add Authorized Domains
1. Go to **Authentication → Settings → Authorized domains**
2. Add: `danaglinao0522.github.io`
3. Add: `localhost` (for local development)

---

## GitHub Pages Deployment

### Step 1: Create Repository
```bash
# Initialize git repo (if not already done)
git init
git add .
git commit -m "Initial commit: RCCM GigBook PWA"
```

### Step 2: Push to GitHub
```bash
# Create repo at github.com/danaglinao0522/rccm-gigbook
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings → Pages**
3. Under **Source**, select `Deploy from a branch`
4. Select branch: `main`, folder: `/ (root)`
5. Click **Save**
6. Your site will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

### Step 4: Verify Deployment
After a few minutes, visit `https://danaglinao0522.github.io/rccm-gigbook/` to confirm the app loads.

---

## Environment Configuration

### Admin Account Setup
The primary Admin is hardcoded to the email address:
```
buenavistaaglinaodanny@gmail.com
```

This is defined in `index.html`:
```javascript
const ADMIN_EMAIL = 'buenavistaaglinaodanny@gmail.com';
```

To change the Admin email, update this constant and redeploy.

### App URL Lock
The URL lock is set in `index.html`:
```javascript
const APP_URL = 'https://danaglinao0522.github.io/rccm-gigbook/';
```

Update this if your GitHub Pages URL differs.

---

## PWA Asset Requirements

### Required Icon Files
Create and place these files in the `/icons/` directory:

| File | Size | Purpose |
|------|------|---------|
| `logo.png` | Flexible (recommended: 512×512) | Brand logo shown in splash/nav |
| `icon-192.png` | 192×192 px | Standard PWA icon |
| `icon-512.png` | 512×512 px | Large PWA icon |
| `icon-maskable.png` | 512×512 px | Maskable PWA icon (safe zone: inner 80%) |

### Icon Design Guidelines
- Use transparent or solid background
- Keep content within the safe zone for maskable icons
- PNG format required
- Match your brand's color scheme

---

## Service Worker Setup

Create a `sw.js` file in the project root:

```javascript
const CACHE_NAME = 'rccm-gigbook-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match('/index.html'));
    })
  );
});
```

---

## Role & Permission Matrix

| Feature | Admin | Sub-Admin | Lead | Musician | Singer | Tech |
|---------|-------|-----------|------|----------|--------|------|
| Bottom Nav Tabs | 4 | 4 | 2 | 2 | 2 | 2 |
| View All Songs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Songs | ✅ | ✅ | — | — | — | — |
| Delete Songs | ✅ | ✅ | — | — | — | — |
| Edit Songs | ✅ | ✅ | — | — | — | — |
| Create Setlists | ✅ (∞) | ✅ (5) | ✅ (5) | ✅ (2) | ✅ (2) | — |
| Create Custom Groups | ✅ | ✅ | ✅ | — | — | — |
| View All Setlists | ✅ | ✅ | — | Own/Public | Own/Public | ✅ |
| User Directory | ✅ | ✅ | — | — | — | — |
| Edit Users | ✅ | ✅* | — | — | — | — |
| Delete Users | ✅ | — | — | — | — | — |
| Admin Panel | ✅ | ✅ | — | — | — | — |
| Transpose/Capo | ✅ | ✅ | ✅ | ✅ | — | — |
| Lyrics-Only Toggle | ✅ | ✅ | ✅ | ✅ | Locked | Locked |
| Chord Display | ✅ | ✅ | ✅ | ✅ | — | — |

*Sub-Admin cannot edit/delete the primary Admin

### Setlist Creation Limits
| Role | Max Setlists | Max Tracks/Setlist |
|------|-------------|-------------------|
| Admin | Unlimited | Configurable (default: 4) |
| Sub-Admin | 5 | Configurable (default: 4) |
| Lead/Facilitator | 5 | Configurable (default: 4) |
| Musician | 2 | Configurable (default: 4) |
| Singer | 2 | Configurable (default: 4) |
| Custom Group Setlist | Any | Unlimited |

---

## Feature Reference

### Chord Sheet Parsing
The app uses a bracket-free regex parser. Format your chord sheets as:

```
VERSE 1
G    Em   C    D
Amazing grace how sweet the sound

CHORUS
G         D        Am
How great thou art how great thou art
```

**Rules:**
- Section headers: Lines matching `VERSE`, `CHORUS`, `BRIDGE`, `INTRO`, `OUTRO`, etc. (case-insensitive)
- Chord lines: Lines containing ONLY valid chord notation (A-G, #, b, m, maj, 7, sus4, dim, add9, /)
- Lyric lines: Any line with non-chord characters

### Transposition
- Select a new key from the Key dropdown
- Capo suggestion automatically appears if transposing down
- Transposition is LOCAL ONLY — never writes to database
- Other users see the original key

### Auto-Scroll
- Drag the slider to set scroll speed (0 = off)
- Speed range: 0–10 (higher = faster)
- Tap the stop button to halt scrolling

### Font Scaling
- **Touch devices:** Pinch two fingers inside the song sheet area
- **Desktop:** Use A- and A+ buttons (bottom-left corner)

---

## Firestore Security Rules

Apply these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }

    function isAdmin() {
      return isAuthenticated() && getUserData().role == 'admin';
    }

    function isSubAdmin() {
      return isAuthenticated() && getUserData().role == 'subadmin';
    }

    function isAdminOrSubAdmin() {
      return isAdmin() || isSubAdmin();
    }

    function isLead() {
      return isAuthenticated() && getUserData().role == 'lead';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if isAuthenticated();
      allow create: if isAdminOrSubAdmin() || getUserData().canAddSongs == true;
      allow update: if isAdminOrSubAdmin() || getUserData().canAddSongs == true;
      allow delete: if isAdminOrSubAdmin() || getUserData().canDeleteSongs == true;
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if isAuthenticated() && (
        isAdminOrSubAdmin() ||
        getUserData().role == 'tech' ||
        resource.data.isPublic == true ||
        resource.data.createdBy == request.auth.uid ||
        (resource.data.isCustomGroup == true && request.auth.uid in resource.data.whitelist)
      );
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        isAdminOrSubAdmin() ||
        resource.data.createdBy == request.auth.uid
      );
      allow delete: if isAuthenticated() && (
        isAdminOrSubAdmin() ||
        resource.data.createdBy == request.auth.uid
      );
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isAuthenticated() && (
        request.auth.uid == userId ||
        isAdminOrSubAdmin()
      );
      allow delete: if isAdmin();
    }

    // App config (Admin only for writes)
    match /config/{docId} {
      allow read: if isAuthenticated();
      allow write: if isAdminOrSubAdmin();
    }
  }
}
```

---

## Firestore Indexes

Create these composite indexes in Firebase Console → Firestore → Indexes:

| Collection | Fields | Order |
|-----------|--------|-------|
| `songs` | `title` | Ascending |
| `setlists` | `createdAt` | Descending |
| `setlists` | `isPublic`, `createdAt` | Ascending, Descending |

---

## Local Development

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local HTTP server (required for Service Worker and Firebase Auth)

### Option 1: VS Code Live Server
1. Install **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Update `APP_URL` in `index.html` to `http://localhost:5500/`
4. Add `localhost` to Firebase Authorized Domains

### Option 2: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Then visit: http://localhost:8000
```

### Option 3: Node.js HTTP Server
```bash
npx serve .
# Then visit: http://localhost:3000
```

### Development Notes
- Firebase Auth requires HTTPS or localhost — do not use `file://` protocol
- Temporarily set `APP_URL` to your localhost URL while developing
- Clear browser cache after making changes to `sw.js`

---

## Troubleshooting

### "Sign In" fails / popup blocked
- Enable popups for your domain in the browser
- Verify your domain is in Firebase Authorized Domains
- Check browser console for specific Firebase errors

### Songs not loading
- Verify Firebase config keys are correct in `index.html`
- Check Firestore Security Rules allow reads for authenticated users
- Ensure Firestore is in the correct region

### App not installing (no install prompt)
- Must be served over HTTPS
- Must have a valid `manifest.json`
- Must have a registered service worker (`sw.js`)
- Chrome requires user interaction before showing the prompt

### Theme not saving across devices
- Verify Firestore write rules for `config` collection
- Confirm Admin is logged in when saving settings

### Transposition not working
- Ensure the original key is set correctly when adding a song
- Check that chord lines follow the format: `G  Em  C  D` (only chord notation, no other text)

### PWA icons not showing
- Ensure all icon files exist in `/icons/` directory
- Icons must be square PNG files
- `icon-maskable.png` requires content within the inner 80% safe zone

---

## Changelog

### v1.0.0 (Initial Release)
- Complete single-file PWA implementation
- Firebase Auth with Google Sign-In
- Real-time Firestore sync
- Role-based access control (6 roles)
- Bracket-free chord/lyric parser
- 5 high-contrast theme presets
- Custom theme builder
- Setlist management with ACL
- Auto-scroll engine
- Pinch-to-zoom (touch) and A-/A+ (desktop)
- TTL auto-expiration for setlists
- PWA install support
- Hardware back button interception

---

## License

This project is private and intended exclusively for RCCM worship team use.

---

## Support

For technical issues, contact the system Admin at: `buenavistaaglinaodanny@gmail.com`
