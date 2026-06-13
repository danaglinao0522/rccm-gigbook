# 🎸 RCCM GigBook

> **A premium, production-ready band performance management SPA** — built with vanilla JavaScript, HTML5, CSS3, Tailwind CSS (v4 CDN), and Google Firebase v10 Compatibility Mode. Designed for live stage use with zero build-step, zero dependencies to install.

---

![RCCM GigBook Banner](https://img.shields.io/badge/RCCM-GigBook-8b5cf6?style=for-the-badge&logo=guitar&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v10-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Feature Inventory](#-feature-inventory)
3. [Visual Design System](#-visual-design-system)
4. [Architecture Overview](#-architecture-overview)
5. [Local Setup](#-local-setup)
6. [Firebase Configuration](#-firebase-configuration)
7. [Firestore Data Schema](#-firestore-data-schema)
8. [Role & Permission Matrix](#-role--permission-matrix)
9. [Production Deployment](#-production-deployment)
10. [PWA Configuration](#-pwa-configuration)
11. [Environment Variables & Security](#-environment-variables--security)
12. [Known Limitations & Roadmap](#-known-limitations--roadmap)
13. [Contributing](#-contributing)
14. [License](#-license)

---

## 🎯 Project Overview

**RCCM GigBook** is a single-file (`index.html`) Progressive Web Application designed to serve as the central hub for church bands, worship teams, and live performance groups. It delivers:

- 📋 **Song Library Management** — Store and manage songs with chord/lyric sheets, keys, tempos, and genres.
- 🎼 **Live Stage HUD** — A dedicated, distraction-free performance view with real-time chord transposition, capo adjustment, auto-scroll, and lyrics-only mode.
- 📂 **Public Setlist Engine** — Create, manage, and view public setlists accessible by all authenticated users.
- 👥 **User Directory & Role Management** — Hierarchical role system with real-time assignment controls.
- 🛡️ **Admin Control Panel** — Theme laboratory, song limits, branding, and a secured purge/reset console.
- 📱 **PWA Installable** — Full Progressive Web App support for mobile and desktop installation.

---

## ✨ Feature Inventory

### 🔐 Authentication & Onboarding
| Feature | Description |
|---|---|
| Google OAuth | Firebase Google Sign-In via popup |
| Recent Account Cache | Last-used account card shown on auth screen for 1-tap re-login |
| Auto Guest Assignment | New users automatically receive "Guest" role — no onboarding forms |
| PWA Install Button | Dynamic, event-driven install prompt (only shown when not already installed) |

### 🎵 Song Library (Song List View)
| Feature | Description |
|---|---|
| Real-time Sync | Firestore `onSnapshot` listener for instant updates |
| Search | Full-text search across title, artist, and genre |
| Key Filter | Filter chips by musical key |
| Genre Filter | Filter chips by genre/style tag |
| Add Song FAB | Floating action button (visible to non-Guest, Song List view only) |
| Edit / Delete | Inline controls for Admin, Sub-Admin, Lead roles |
| Card Layout | Glassmorphism song cards with rounded corners, key/genre badges |

### 🎤 Stage HUD (Performance View)
| Feature | Description |
|---|---|
| Full-Screen Mode | Hides navigation; shows focused performance workspace |
| Key Transposer | +/− semitone buttons with live chord re-rendering |
| Capo Adjuster | Visual capo fret tracker |
| Lyrics-Only Toggle | Hides all chord spans; collapses to clean lyric view |
| Auto-Scroll | Configurable speed (0.2x–5.0x); play/pause/reset controls |
| Chord Parsing | Inline `[Chord]` notation parsed and rendered in magenta-rose color |
| Back Navigation | Smooth return to previous view (setlist detail or song list) |

### 📋 Setlist Engine
| Feature | Description |
|---|---|
| Public Setlists | All setlists are globally visible to all authenticated users |
| Create Setlist FAB | Floating action button (Setlist view, non-Guest only) |
| Song Picker | Tap-to-add song selection modal with live list |
| Setlist Detail | Numbered song list; tap any song to open Stage HUD |
| Ordered Playlist | Songs stored in sequence for performance order |

### 👥 User Directory
| Feature | Description |
|---|---|
| Dual Sub-Panels | "Roster" (assigned roles) and "Pending/New" (Guest users) |
| Real-time Roster | Live Firestore sync of all user profiles |
| Role Assignment | Admin/Sub-Admin can change any user role via modal |
| Admin Lock Guard | Admin role row is permanently locked — no dropdown shown |
| Profile Cards | Circular avatar, display name, email, role badge |

### 🛡️ Admin Panel
| Feature | Description |
|---|---|
| App Branding | Set display name; persisted to Firestore |
| Song Limits | Configure max songs per setlist |
| Theme Laboratory | Dual-scope color customization (Global Broadcast / Admin Local Lock) |
| Custom Colors | Canvas BG, Lyrics Color, Chords Color, Blur intensity |
| System Purge Console | OTA-verified destructive reset operations |
| Purge Option 1 | Clear All Setlists (batch Firestore delete) |
| Purge Option 2 | Deep Factory Reset (Setlists + Users, preserving Songs) |
| OTA Code Verification | 6-digit random token must be entered before purge executes |

### 🎨 UI / UX
| Feature | Description |
|---|---|
| Glassmorphism | `backdrop-filter: blur(24px)` on all cards, panels, modals |
| Micro-animations | `transition-all duration-300 ease-out` universally applied |
| Sidebar Kinetics | `cubic-bezier(0.16, 1, 0.3, 1)` spring-easing on drawer open |
| FAB Visibility Engine | Role + view-context aware floating action buttons |
| Toast Notifications | Animated, color-coded feedback messages |
| Rounded Everything | `rounded-full`, `rounded-3xl`, `rounded-[2rem]` — strictly enforced |
| Plus Jakarta Sans | Geometric, premium font loaded from Google Fonts CDN |
| Keyboard Shortcuts | `Escape` closes sidebar and all modals |

---

## 🎨 Visual Design System

### Color Token System
| Token | Value | Usage |
|---|---|---|
| `--canvas-bg` | `#09070f` | Primary background — deep midnight obsidian |
| `--lyrics-color` | `#f9fafb` | Primary text, headings, lyric lines |
| `--chords-color` | `#ec4899` | Chord notation (magenta-rose) |
| `--purple` | `#8b5cf6` | Royal amethyst — primary accent, buttons, active states |
| `--pink` | `#ec4899` | Magenta-rose — secondary accent, FAB, badges |
| `--text-primary` | `#f9fafb` | Crisp ivory — high-contrast headers |
| `--text-muted` | `#9ca3af` | Warm charcoal-gray — metadata, labels |
| `--card-glass` | `rgba(18,14,28,0.6)` | Card background |
| `--sidebar-glass` | `rgba(18,14,28,0.85)` | Sidebar/navbar background |
| `--border-subtle` | `rgba(255,255,255,0.06)` | Subtle border lines |

### Typography
- **Font Family:** `Plus Jakarta Sans` (400–800 weight range)
- **Headings:** `font-weight: 800`, `color: var(--text-primary)`
- **Body/Labels:** `font-weight: 500–600`, `color: var(--text-muted)`
- **Chord Notation:** `font-weight: 700`, `color: var(--chords-color)`
- **Section Labels:** `uppercase`, `letter-spacing: 0.1em`, `color: var(--purple)`

### Glassmorphism Layers
```css
/* Standard Glass */
backdrop-filter: blur(24px);
background: rgba(18, 14, 28, 0.6);
border: 1px solid rgba(255, 255, 255, 0.06);
box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);

/* Strong Glass (Sidebar, Modals) */
backdrop-filter: blur(32px);
background: rgba(18, 14, 28, 0.85);
border: 1px solid rgba(255, 255, 255, 0.08);
box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.7);
```

### Rounding Standards
| Component | Tailwind Class | Pixel Value |
|---|---|---|
| Buttons, Pills, Inputs, FABs | `rounded-full` | 9999px |
| Song Cards, User Cards | `rounded-3xl` / `rounded-2xl` | 24px / 16px |
| Modals, Drawers | `rounded-[2rem]` | 32px |
| Sidebar right edge | `rounded-r-[2.5rem]` | 40px |
| Transposer capsules | `rounded-full` | 9999px |

---

## 🏗️ Architecture Overview

```
index.html
├── <head>
│   ├── Google Fonts (Plus Jakarta Sans)
│   ├── MDI Icons CDN (@mdi/font v7.4.47)
│   ├── Tailwind CSS v4 Browser CDN
│   └── <style> Custom CSS (tokens, glass, animations)
│
├── <body>
│   ├── #loading-screen        → Initial spinner overlay
│   ├── #auth-screen           → Google Sign-In + Recent Account + PWA Install
│   ├── #sidebar-overlay       → Backdrop tap-to-close
│   ├── #side-navbar           → Sliding glass nav panel (3 zones)
│   ├── #app
│   │   ├── #top-bar           → Hamburger/Back + Search + Filter
│   │   ├── #filter-panel      → Dropdown key/genre filter chips
│   │   ├── #main-content      → Scrollable view host
│   │   │   ├── #songs-view
│   │   │   ├── #setlist-view
│   │   │   ├── #users-view
│   │   │   ├── #admin-view
│   │   │   └── #setlist-detail-view
│   │   └── #stage-view        → Full-screen performance HUD
│   │       ├── #stage-toolbar (top)
│   │       ├── #song-sheet    → Scrollable chord/lyric canvas
│   │       └── #stage-tray   (bottom)
│   ├── #fab-container         → FAB buttons (role/view aware)
│   ├── #toast-container       → Toast notification stack
│   └── Modals (overlay pattern)
│       ├── #add-song-modal
│       ├── #add-setlist-modal
│       ├── #role-modal
│       ├── #purge-modal
│       ├── #otp-modal
│       └── #edit-song-modal
│
└── <script type="module">
    ├── Firebase Init (app, auth, db)
    ├── Constants (CHROMATIC_SCALE, ENHARMONIC_MAP, etc.)
    ├── State Management
    ├── Auth Handlers (onAuthStateChanged, signIn, signOut)
    ├── Navigation Router (navigateTo)
    ├── Firestore Listeners (onSnapshot)
    ├── Render Functions (songs, setlists, users)
    ├── Stage HUD Engine (transpose, capo, auto-scroll)
    ├── CRUD Operations
    ├── Admin Functions (theme, purge, branding)
    └── Utility Functions (toast, modal, escape)
```

---

## 🚀 Local Setup

### Prerequisites
- A modern web browser (Chrome 80+, Firefox 75+, Safari 14+, Edge 80+)
- A Firebase project (see [Firebase Configuration](#-firebase-configuration))
- A local HTTP server (required for Firebase Auth — `file://` protocol is blocked by CORS)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-org/rccm-gigbook.git
cd rccm-gigbook
```

### Step 2: Configure Firebase (if using your own project)
Open `index.html` and locate the `firebaseConfig` object inside the `<script type="module">` block. Replace the values with your own Firebase project credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 3: Serve Locally

**Option A: Python (built-in)**
```bash
python3 -m http.server 8080
# Open: http://localhost:8080
```

**Option B: Node.js `serve` package**
```bash
npx serve .
# Open: http://localhost:3000
```

**Option C: VS Code Live Server Extension**
- Install the "Live Server" extension by Ritwick Dey
- Right-click `index.html` → "Open with Live Server"

**Option D: Firebase Hosting emulator (recommended for full testing)**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase emulators:start
```

### Step 4: Set Up Firebase Auth
In the Firebase Console:
1. Navigate to **Authentication → Sign-in method**
2. Enable **Google** provider
3. Add `localhost` to authorized domains

### Step 5: Open the Application
Navigate to `http://localhost:8080` in your browser. You should see the loading screen, then the auth screen.

---

## 🔥 Firebase Configuration

### Project Details (Default)
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAlE76KUY17bv8J5mM_9SBN6p23gNUyc0Y",
  authDomain: "rccm-gigbook.firebaseapp.com",
  projectId: "rccm-gigbook",
  storageBucket: "rccm-gigbook.firebasestorage.app",
  messagingSenderId: "817371493392",
  appId: "1:817371493392:web:a7cec582390753b9104695"
};
```

### Required Firebase Services
| Service | Usage |
|---|---|
| **Authentication** | Google Sign-In provider |
| **Firestore** | Songs, Setlists, Users, Admin Settings |

### Firestore Security Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuth() { return request.auth != null; }
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() { return getUserRole() == 'Admin'; }
    function isSubAdmin() { return getUserRole() == 'Sub-Admin'; }
    function isLead() { return getUserRole() == 'Lead'; }
    function isPrivileged() { return isAdmin() || isSubAdmin() || isLead(); }

    // Songs collection — readable by all authenticated, writable by privileged
    match /songs/{songId} {
      allow read: if isAuth();
      allow write: if isAuth() && isPrivileged();
    }

    // Setlists — readable by all authenticated, writable by privileged
    match /setlists/{setlistId} {
      allow read: if isAuth();
      allow write: if isAuth() && isPrivileged();
    }

    // Users — own doc always readable/writable; full access for admin
    match /users/{userId} {
      allow read: if isAuth();
      allow create: if isAuth() && request.auth.uid == userId;
      allow update: if isAuth() && (request.auth.uid == userId || isAdmin() || isSubAdmin());
      allow delete: if isAuth() && isAdmin();
    }

    // Admin settings — readable by all, writable by admin only
    match /admin_settings/{docId} {
      allow read: if isAuth();
      allow write: if isAuth() && isAdmin();
    }
  }
}
```

### Setting the First Admin
Since the app auto-assigns "Guest" to new users, the first Admin must be set manually:

```bash
# Using Firebase CLI with Admin SDK
firebase firestore:set users/YOUR_UID '{"role": "Admin", "displayName": "Your Name", "email": "your@email.com"}'
```

Or via the Firebase Console:
1. Go to **Firestore → users → [your UID document]**
2. Edit the `role` field to `Admin`
3. Save

---

## 📊 Firestore Data Schema

### `/songs/{songId}`
```typescript
{
  title: string;           // Song title (required)
  artist: string;          // Artist or band name
  key: string;             // Musical key (e.g., "G", "C#", "Bb")
  tempo: number | null;    // BPM tempo
  genre: string;           // Genre/style tag
  lyrics: string;          // Chord+lyric content (see format below)
  createdBy: string;       // Firebase UID of creator
  createdAt: Timestamp;    // Firestore server timestamp
}
```

**Lyric/Chord Format:**
```
[Verse]
[G]Amazing [D]grace how [Em]sweet the [C]sound
That [G]saved a [D]wretch like [G]me

[Chorus]
[C]How great thou [G]art
[D]How great thou [G]art
```

### `/setlists/{setlistId}`
```typescript
{
  name: string;            // Setlist display name (required)
  venue: string;           // Event/venue name
  date: string;            // ISO date string (YYYY-MM-DD)
  songs: Array<{id: string}>; // Ordered array of song document references
  createdBy: string;       // Firebase UID of creator
  createdAt: Timestamp;    // Firestore server timestamp
}
```

### `/users/{uid}`
```typescript
{
  uid: string;             // Firebase Auth UID
  displayName: string;     // Google display name
  email: string;           // Google email address
  photoURL: string;        // Google profile photo URL
  role: string;            // Permission role (see Role Matrix)
  createdAt: Timestamp;    // First sign-in timestamp
}
```

### `/admin_settings/branding`
```typescript
{
  appName: string;         // Custom application display name
}
```

### `/admin_settings/limits`
```typescript
{
  maxSongsPerSetlist: number; // Maximum songs allowed per setlist
}
```

### `/admin_settings/theme`
```typescript
{
  '--canvas-bg': string;    // CSS hex color
  '--lyrics-color': string; // CSS hex color
  '--chords-color': string; // CSS hex color
}
```

---

## 🔒 Role & Permission Matrix

| Permission | Guest | Singer | Musician | Lead | Tech | Sub-Admin | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View Setlists | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Song List | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Open Stage HUD | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Songs | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Edit/Delete Songs | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Create Setlists | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| Delete Setlists | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| View Users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Admin Panel | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Modify Theme | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Execute Purge | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| FAB Add Song | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |
| FAB Add Setlist | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ |

### Navigation Visibility
| Nav Item | Guest | Singer/Musician/Tech | Lead | Sub-Admin | Admin |
|---|:---:|:---:|:---:|:---:|:---:|
| Song List | ❌ | ✅ | ✅ | ✅ | ✅ |
| Setlist | ✅ | ✅ | ✅ | ✅ | ✅ |
| Users | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🚀 Production Deployment

### Option 1: Firebase Hosting (Recommended)

**Install Firebase CLI:**
```bash
npm install -g firebase-tools
firebase login
```

**Initialize hosting:**
```bash
firebase init hosting
# Select your project: rccm-gigbook
# Public directory: . (current directory)
# Single-page app: Yes
# GitHub Actions: No (unless you want CI/CD)
```

**Deploy:**
```bash
firebase deploy --only hosting
```

Your app will be live at: `https://rccm-gigbook.web.app`

**firebase.json configuration:**
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "README.md",
      ".gitignore"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" }
        ]
      },
      {
        "source": "*.html",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache" }
        ]
      }
    ]
  }
}
```

---

### Option 2: Vercel

**Install Vercel CLI:**
```bash
npm install -g vercel
vercel login
```

**Deploy:**
```bash
vercel --prod
```

**`vercel.json` configuration:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

---

### Option 3: Netlify

1. Connect your GitHub repository to Netlify
2. Set build command: *(leave empty)*
3. Set publish directory: `.`
4. Create `_redirects` file in root:
```
/* /index.html 200
```

---

### Option 4: GitHub Pages

1. Go to your repository **Settings → Pages**
2. Source: **Deploy from branch**
3. Branch: `main` / root `/`
4. Update Firebase authorized domains to include `your-username.github.io`

---

## 📱 PWA Configuration

To enable full PWA functionality, add a `manifest.json` and service worker:

**`manifest.json`:**
```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Premium band performance management SPA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#09070f",
  "theme_color": "#8b5cf6",
  "orientation": "any",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

**Add to `<head>` in `index.html`:**
```html
<link rel="manifest" href="/manifest.json" />
```

**`sw.js` (Basic Service Worker):**
```javascript
const CACHE_NAME = 'rccm-gigbook-v1';
const ASSETS = ['/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

**Register service worker (add to `index.html` before `</body>`):**
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

## 🔐 Environment Variables & Security

### API Key Security
Firebase Web API keys are **designed to be public** — they identify your Firebase project. Security is enforced via:
1. **Firebase Security Rules** (Firestore) — controls data access per user
2. **Firebase App Check** — prevents unauthorized apps from using your backend
3. **Authorized Domains** — only listed domains can use your Auth configuration

### Enabling Firebase App Check (Production Recommended)
```javascript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const appCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true
});
```

### Admin Role Protection
- The Admin role can **only** be assigned manually via Firebase Console or Admin SDK
- The UI explicitly blocks assigning "Admin" role via the role dropdown
- Admin role rows are locked in the Users panel with a visual lock indicator
- The purge system requires OTA verification (6-digit code) before any destructive action

### localStorage Usage
| Key | Content | Purpose |
|---|---|---|
| `rccm_last_user` | `{displayName, email, photoURL}` | Recent account fast-login cache |
| `rccm_admin_local_theme` | `{"--canvas-bg": "#...", ...}` | Admin-only local theme overrides |

---

## 🧰 CDN Dependencies

All dependencies are loaded from CDN — no `npm install` required:

| Library | Version | CDN | Purpose |
|---|---|---|---|
| Firebase App | 10.12.2 | gstatic.com | Firebase core |
| Firebase Auth | 10.12.2 | gstatic.com | Google authentication |
| Firebase Firestore | 10.12.2 | gstatic.com | Database |
| Tailwind CSS | v4 Browser | jsdelivr.net | Utility CSS framework |
| MDI Icons | 7.4.47 | jsdelivr.net | Material Design Icons |
| Plus Jakarta Sans | Latest | fonts.googleapis.com | Premium typography |

---

## 🔧 Chord Format Reference

Songs support an inline bracket notation for chord placement:

```
[Section Name]
[Chord]Lyrics with chords [Chord]inline like this

[Verse 1]
[G]Amazing [D]grace, how [Em]sweet the [C]sound
That [G]saved a [D]wretch like [G]me

[Pre-Chorus]
[Am]I once was [F]lost

[Chorus]
[G]How great thou [D]art
[Em]How great thou [C]art

[Bridge]
[Bm]Then sings my soul
```

**Supported chord types:**
- Major: `[G]`, `[C#]`, `[Bb]`
- Minor: `[Em]`, `[Am]`, `[F#m]`
- Complex: `[G7]`, `[Cmaj7]`, `[Dsus4]`, `[G/B]`

---

## 🐛 Known Limitations & Roadmap

### Current Limitations
| Issue | Workaround |
|---|---|
| OTP not emailed (demo mode) | Code shown in description text and logged to console |
| No offline song caching | Service worker must be implemented separately |
| No drag-to-reorder setlist | Song order fixed at creation time |
| Image uploads not supported | Profile photos from Google OAuth only |

### Planned Features (Roadmap)
- [ ] **Email OTP Integration** — Connect to SendGrid/EmailJS for real email dispatch
- [ ] **Drag & Drop Setlist Ordering** — Reorder songs within a setlist
- [ ] **Offline Mode** — Cache songs for offline stage use via Service Worker + IndexedDB
- [ ] **Song Import** — Bulk import from ChordPro or plain text files
- [ ] **BPM Metronome** — Visual/audio metronome tied to song tempo
- [ ] **Multi-language Support** — i18n for international worship teams
- [ ] **Song Rating System** — Stars/favorites per user
- [ ] **Rehearsal Mode** — Section-by-section practice focus view
- [ ] **PDF Export** — Generate chord charts as printable PDFs
- [ ] **Backup & Restore** — JSON export/import of entire song library

---

## 🤝 Contributing

1. **Fork** the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes to `index.html` (single-file architecture)
4. Test locally with a live server
5. Commit: `git commit -m "feat: your descriptive commit message"`
6. Push: `git push origin feature/your-feature-name`
7. Open a **Pull Request** with a clear description

### Contribution Guidelines
- Maintain the single-file architecture (`index.html` only)
- Preserve the existing color token system and glassmorphism design language
- All new UI elements must use `rounded-full` or `rounded-2xl`/`rounded-3xl`
- All new interactive elements must include `transition-all duration-300 ease-out`
- No build tools, no package.json, no external files beyond CDN links
- Test on mobile viewport (375px) and desktop (1440px) before submitting

---

## 📄 License

```
MIT License

Copyright (c) 2025 RCCM GigBook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgements

- **Firebase** — Google's BaaS platform for auth and real-time database
- **Tailwind CSS** — Utility-first CSS framework
- **Material Design Icons** — Comprehensive icon library by Pictogrammers
- **Plus Jakarta Sans** — Premium geometric typeface by Tokotype

---

<div align="center">
  <strong>Built with ♥ for RCCM worship teams everywhere</strong><br/>
  <sub>May every performance be anointed 🎵</sub>
</div>
