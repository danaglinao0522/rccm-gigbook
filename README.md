# RCCM GigBook — Cyber-Deck Edition

> **Purple Robotic Neon-Mech Single Page Application**
> A production-ready, standalone `index.html` Progressive Web App built with vanilla JavaScript, HTML5, CSS3, Tailwind CSS (v3 CDN), and Google Firebase v10 Compatibility Mode.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Feature Scope](#2-feature-scope)
3. [Technology Stack](#3-technology-stack)
4. [Architecture Diagram](#4-architecture-diagram)
5. [Design System](#5-design-system)
6. [Firebase Configuration](#6-firebase-configuration)
7. [Local Development Setup](#7-local-development-setup)
8. [Firestore Data Schema](#8-firestore-data-schema)
9. [Authentication & Role System](#9-authentication--role-system)
10. [PWA Configuration](#10-pwa-configuration)
11. [Production Deployment](#11-production-deployment)
12. [Security Rules (Firestore)](#12-security-rules-firestore)
13. [Environment Variables](#13-environment-variables)
14. [Contributing](#14-contributing)
15. [License](#15-license)

---

## 1. Project Overview

RCCM GigBook Cyber-Deck is a **cloud-connected band management SPA** designed for live music organizations. It enables musicians, singers, and tech crew members to manage song libraries, build setlists in real time, and coordinate across a multi-role permission system — all wrapped in an ultra-modern **purple robotic neon-mech aesthetic**.

The entire application is delivered as a **single `index.html` file** with zero build steps, zero npm dependencies, and zero local server requirements. It bootstraps entirely from CDN-hosted resources and connects live to Google Firebase (Firestore + Auth).

### Key Highlights

- **Zero-build deployment** — drop `index.html` on any static host
- **Real-time collaborative setlists** powered by Firestore `onSnapshot` listeners
- **Progressive Web App** — installable on Android, iOS, and desktop via `beforeinstallprompt`
- **Role-gated navigation** — dynamic sidebar adapts to each user's permission level
- **Admin OTA 2-step purge verification** — destructive operations require email-dispatched 6-digit token
- **Dual-scope theme laboratory** — broadcast CSS theme globally or lock it to admin-only localStorage
- **Fluid micro-animations** — `cubic-bezier(0.16,1,0.3,1)` physics-based transitions everywhere

---

## 2. Feature Scope

### Authentication & Onboarding
| Feature | Detail |
|---|---|
| Google OAuth Sign-In | Firebase `signInWithPopup` via `GoogleAuthProvider` |
| Auto Guest Assignment | New accounts receive `role: "Guest"` automatically — no onboarding modal |
| Direct Landing | New users bypass initialization and land directly in the Setlist view |
| PWA Install CTA | `beforeinstallprompt`-driven install button below sign-in card (hidden until installable) |

### Navigation & Roles
| Nav Item | Guest | Musician/Singer/Tech/Lead | Sub-Admin | Admin |
|---|---|---|---|---|
| Song List | ❌ Hidden | ✅ | ✅ | ✅ |
| Setlist | ✅ | ✅ | ✅ | ✅ |
| Users | ❌ Hidden | ❌ Hidden | ✅ | ✅ |
| Admin Panel | ❌ Hidden | ❌ Hidden | ❌ Hidden | ✅ |

### Setlist Engine
- All setlists are **public** — no private/group visibility filtering
- Real-time `onSnapshot` sync across all connected clients
- Song limit guard enforced per Admin configuration
- Setlist CRUD: Create, View, Add/Remove Songs, Delete
- Transpose engine with `CHROMATIC_SCALE` and `ENHARMONIC_MAP` constants

### Song Library
- Firestore-backed song collection with search, key filter, and genre filter
- Favorites persisted in `localStorage`
- Transposition modal with real-time chord/lyric mutation
- Freetext regex normalization for title/artist search

### Users Directory (Admin/Sub-Admin)
- **Roster sub-panel**: All users with assigned roles
- **Pending sub-panel**: Guest/unassigned accounts awaiting role promotion
- Inline role selector — writes `updateDoc` to Firestore in real time
- Self-role update detection — re-bootstraps sidebar without full page reload

### Admin Panel
| Section | Capability |
|---|---|
| App Branding | App name + tagline stored in `/admin_settings/general` |
| Song Limit Guards | Enforces max songs per setlist |
| Theme Presets | 4 built-in palettes (Purple Mech, Midnight Indigo, Neon Emerald, Crimson Flux) |
| Custom Theme Lab | Dual-scope color picker — global Firestore broadcast OR admin localStorage lock |
| Typography & Layout | Base font-size selector |
| System Purge Matrix | OTA-verified destructive reset operations |

### System Purge & Reset (OTA 2-Step)
- **Step 1**: Admin selects purge type → 6-digit code generated → dispatched to admin email
- **Step 2**: Admin enters code in verification terminal
- **Option A** (`purgeSetlists`): Batch-deletes all `/setlists` documents
- **Option B** (`purgeUsersAndSetlists`): Batch-deletes `/setlists` + `/users` (songs retained)

---

## 3. Technology Stack

| Layer | Technology | Source |
|---|---|---|
| **Markup** | HTML5 | Native |
| **Styling** | CSS3 + Tailwind CSS v3 | `https://cdn.tailwindcss.com` |
| **Typography** | Orbitron + Plus Jakarta Sans | Google Fonts CDN |
| **Icons** | Iconify Icon 2.1.0 | `https://code.iconify.design/iconify-icon/2.1.0/iconify-icon.min.js` |
| **Auth** | Firebase Authentication v10 | `https://www.gstatic.com/firebasejs/10.12.2/` |
| **Database** | Cloud Firestore v10 | `https://www.gstatic.com/firebasejs/10.12.2/` |
| **PWA** | Service Worker + Web Manifest | Native browser APIs |
| **Runtime** | Vanilla ES2022+ (ESM modules) | Native browser |

---

## 4. Architecture Diagram

```
index.html
│
├── <style> ─────────── CSS Custom Properties, Glassmorphism, Animation Keyframes
├── <script tailwind> ── Tailwind config (color tokens, font families)
│
├── #app (w-screen h-screen overflow-hidden)
│   ├── #nav-overlay ─── Click-away backdrop (z-40)
│   ├── #side-navbar ─── Sliding glass sidenav drawer (z-50)
│   │   ├── Logo + Close btn
│   │   ├── Nav links (role-filtered)
│   │   └── User profile footer
│   │
│   └── Main layout flex column
│       ├── #hamburger-btn ──── Fixed top-left (z-30)
│       ├── #floating-header ── Fixed search/filter bar (z-20)
│       └── #main-content
│           ├── #view-auth ──── Sign-in + PWA install
│           └── #view-app
│               ├── #view-songs ─── Song list (role-gated)
│               ├── #view-setlist ── Setlist management
│               ├── #view-users ─── User directory (Admin/Sub-Admin)
│               └── #view-admin ─── Admin control matrix
│
├── Modals (z-60/z-70)
│   ├── #song-modal
│   ├── #create-setlist-modal
│   ├── #setlist-detail-modal
│   ├── #purge-modal
│   └── #purge-verification-modal
│
└── <script type="module"> ─ Firebase ESM + App Logic
    ├── Firebase init
    ├── Auth (onAuthStateChanged, signInWithPopup, signOut)
    ├── Firestore subscriptions (onSnapshot)
    ├── View router (navigateTo)
    ├── Song engine (search, transpose, favorites)
    ├── Setlist engine (CRUD, song add/remove)
    ├── User management (role updates)
    ├── Admin system (branding, limits, theme, purge)
    └── PWA install handler
```

---

## 5. Design System

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--canvas-bg` | `#0b0914` | Page background |
| `--lyrics-color` | `#f3f4f6` | Body text, lyrics |
| `--chords-color` | `#a855f7` | Accent, chord highlights |
| `--glass-bg` | `rgba(20,16,36,0.65)` | Glass pane fills |
| `--glass-border` | `rgba(168,85,247,0.2)` | Glass pane borders |
| Neon Purple | `#a855f7` | Primary interactive accent |
| Laser Magenta | `#ec4899` | Secondary gradient accent |
| Titanium White | `#f3f4f6` | Primary text |
| Mechanical Gray | `#6b7280` | Secondary/muted text |

### Typography

| Use Case | Font | Weight |
|---|---|---|
| Headings, Logos, OTA Terminal | Orbitron | 400–900 |
| Body, Labels, Descriptions | Plus Jakarta Sans | 300–700 |

### Geometric Curvature Rules

| Element Type | Tailwind Class |
|---|---|
| Buttons, Pills, Filter Chips | `rounded-full` or `rounded-2xl` |
| Cards, Song Rows, Controls | `rounded-3xl` or `rounded-2xl` |
| Inputs, Textareas, Dropdowns | `rounded-2xl` |
| Modals, Drawers, Alerts | `rounded-[2rem]` or `rounded-3xl` |
| Sidebar right edge | `rounded-r-[2.5rem]` |

### Animation Timing

| Animation | Config |
|---|---|
| Sidebar sweep | `cubic-bezier(0.16, 1, 0.3, 1)` — 350ms |
| Modal appear | `cubic-bezier(0.16, 1, 0.3, 1)` — 350ms |
| Header morphing | `ease-out` — 300ms + `translateY(-10px)` |
| Button hover | `ease-out` — 300ms + `translateY(-2px)` |
| Overlay fade | `ease-out` — 350ms opacity |

### Glassmorphism Recipe

```css
backdrop-filter: blur(20px);
background: rgba(20, 16, 36, 0.65);
border: 1px solid rgba(168, 85, 247, 0.2);
box-shadow: inset 0 0 12px rgba(168, 85, 247, 0.1);
```

---

## 6. Firebase Configuration

The app uses the following Firebase project credentials:

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

### Enabled Firebase Services

| Service | Purpose |
|---|---|
| Authentication | Google OAuth sign-in |
| Cloud Firestore | Real-time database (songs, setlists, users, admin_settings) |

> **Note**: Firebase Storage is declared in config but not actively used in v1.

---

## 7. Local Development Setup

### Prerequisites

- Any modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- A text editor (VS Code recommended)
- Optional: [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for hot reload

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-org/rccm-gigbook.git
cd rccm-gigbook

# 2. Open index.html directly in browser
open index.html
# OR use Live Server in VS Code: right-click index.html → "Open with Live Server"
```

> No npm install. No bundler. No build step. Just open and go.

### Firebase Auth Domain Setup

For Google Sign-In to work locally, add your development origin to Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project `rccm-gigbook`
3. Navigate to: **Authentication → Settings → Authorized domains**
4. Add `localhost` (already present by default)
5. For file:// access, also add `127.0.0.1`

### Firestore Index Requirements

The setlists query uses `orderBy('createdAt', 'desc')`. Create this composite index:

1. Firebase Console → Firestore → Indexes → Add Index
2. Collection: `setlists`
3. Fields: `createdAt` (Descending)
4. Query scope: Collection

---

## 8. Firestore Data Schema

### `/users/{uid}`

```json
{
  "uid": "string",
  "displayName": "string",
  "email": "string",
  "photoURL": "string",
  "role": "Guest | Musician | Singer | Tech | Lead | Sub-Admin | Admin",
  "createdAt": "Timestamp"
}
```

### `/songs/{songId}`

```json
{
  "title": "string",
  "artist": "string",
  "key": "string (e.g. 'G', 'Bb', 'F#')",
  "genre": "string",
  "lyrics": "string (optional)",
  "chords": "string (optional)",
  "bpm": "number (optional)",
  "timeSignature": "string (optional)"
}
```

### `/setlists/{setlistId}`

```json
{
  "name": "string",
  "date": "string (YYYY-MM-DD)",
  "notes": "string",
  "songs": [
    {
      "id": "string",
      "title": "string",
      "artist": "string",
      "key": "string"
    }
  ],
  "createdBy": "uid string",
  "createdAt": "Timestamp"
}
```

### `/admin_settings/general`

```json
{
  "appName": "string",
  "tagline": "string",
  "songLimit": "number"
}
```

### `/admin_settings/theme`

```json
{
  "--canvas-bg": "#0b0914",
  "--lyrics-color": "#f3f4f6",
  "--chords-color": "#a855f7",
  "blur": "20px"
}
```

---

## 9. Authentication & Role System

### Role Hierarchy

```
Admin
  └── Sub-Admin
        └── Lead
              ├── Musician
              ├── Singer
              └── Tech
                    └── Guest  ← default for new users
```

### Role Permissions Matrix

| Capability | Guest | Musician/Singer/Tech | Lead | Sub-Admin | Admin |
|---|---|---|---|---|---|
| View Setlists | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Songs | ❌ | ✅ | ✅ | ✅ | ✅ |
| Create Setlist | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Users | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign Roles | ❌ | ❌ | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ❌ | ❌ | ✅ |
| Theme Lab | ❌ | ❌ | ❌ | ❌ | ✅ |
| Purge Matrix | ❌ | ❌ | ❌ | ❌ | ✅ |

### New User Flow

```
Google Sign-In
      │
      ▼
Check /users/{uid} exists?
      │
   No ──► Create document with role: "Guest"
      │
   Yes ──► Load existing profile
      │
      ▼
Land in Setlist view (all roles)
```

---

## 10. PWA Configuration

### manifest.json (create alongside index.html)

```json
{
  "name": "RCCM GigBook Cyber-Deck",
  "short_name": "GigBook",
  "description": "Purple Robotic Neon-Mech Band Management SPA",
  "start_url": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0b0914",
  "theme_color": "#a855f7",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Service Worker (sw.js — optional, for offline caching)

```javascript
const CACHE_NAME = 'rccm-gigbook-v1';
const STATIC_ASSETS = ['/', '/index.html'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
```

Register in `index.html` before closing `</body>`:

```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

### Install Button Behavior

The `#pwa-install-btn` element:
- Default state: `display: none` (invisible)
- Activation: Browser fires `beforeinstallprompt` → button fades in
- Trigger: Clicking calls `deferredInstallPrompt.prompt()`
- Post-install: Button hides, prompt reference cleared

---

## 11. Production Deployment

### Option A: Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (select "Hosting" only)
firebase init hosting
# Public directory: . (or the folder containing index.html)
# Single page app: Yes
# Overwrite index.html: No

# Deploy
firebase deploy --only hosting
```

Your app will be live at: `https://rccm-gigbook.web.app`

### Option B: Netlify

1. Drag and drop the project folder to [netlify.com/drop](https://app.netlify.com/drop)
2. Or connect GitHub repo → select branch → deploy
3. Build command: *(leave empty)*
4. Publish directory: `.` (root)

### Option C: Vercel

```bash
npm i -g vercel
vercel --prod
```

Select: Framework → Other, Root directory → `.`

### Option D: GitHub Pages

1. Push repo to GitHub
2. Settings → Pages → Source: Deploy from branch
3. Branch: `main`, Folder: `/ (root)`
4. Site URL: `https://your-org.github.io/rccm-gigbook/`

> **Important**: Add your deployed domain to Firebase Auth → Authorized Domains.

### Production Checklist

- [ ] Add production domain to Firebase Auth authorized domains
- [ ] Set Firestore Security Rules (see Section 12)
- [ ] Remove OTA code `console.warn` and dev toast in production
- [ ] Implement real email dispatch for OTA codes (EmailJS, SendGrid, or Firebase Cloud Functions)
- [ ] Generate PWA icons (192×192 and 512×512) and place in `/icons/`
- [ ] Create `manifest.json` at domain root
- [ ] Register `sw.js` service worker for offline support
- [ ] Enable Firestore indexes for `setlists.createdAt` descending
- [ ] Review Firebase API key restrictions (HTTP referrer restrictions in GCP Console)

---

## 12. Security Rules (Firestore)

Paste these rules in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isSignedIn() {
      return request.auth != null;
    }
    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() {
      return isSignedIn() && getUserRole() == 'Admin';
    }
    function isSubAdmin() {
      return isSignedIn() && getUserRole() in ['Admin', 'Sub-Admin'];
    }
    function isStaff() {
      return isSignedIn() && getUserRole() in ['Admin', 'Sub-Admin', 'Lead', 'Musician', 'Singer', 'Tech'];
    }

    // Users collection
    match /users/{uid} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == uid;
      allow update: if isAdmin() || request.auth.uid == uid;
      allow delete: if isAdmin();
    }

    // Songs collection — staff read, admin write
    match /songs/{songId} {
      allow read: if isStaff();
      allow write: if isAdmin();
    }

    // Setlists — all authenticated users (public)
    match /setlists/{setlistId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn();
      allow update: if isSignedIn();
      allow delete: if isAdmin() || (isSignedIn() && resource.data.createdBy == request.auth.uid);
    }

    // Admin settings — read all auth, write admin only
    match /admin_settings/{docId} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

---

## 13. Environment Variables

This app has **no build-time environment variables** — Firebase config is embedded directly in `index.html`. For production security:

1. **Restrict API key** in [Google Cloud Console](https://console.cloud.google.com/):
   - APIs & Services → Credentials → Select API key
   - Application restrictions: HTTP referrers
   - Add your production domains

2. **API key is safe to expose client-side** when:
   - Firestore Security Rules are properly configured
   - Auth Authorized Domains list is locked to your domains only

---

## 14. Contributing

```bash
# Fork & clone
git clone https://github.com/your-org/rccm-gigbook.git

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes to index.html
# Test in browser (no build needed)

# Commit with conventional commits
git commit -m "feat: add setlist export to PDF"

# Push and open PR
git push origin feature/your-feature-name
```

### Code Style

- All JS in `<script type="module">` block in `index.html`
- Tailwind utility classes preferred; custom CSS in `<style>` block for animations/keyframes
- All UI elements must respect the **ultra-rounded** geometric curvature rules
- All state mutations must trigger a smooth transition — never hard-show/hide

---

## 15. License

MIT License — Copyright © 2025 RCCM GigBook Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---

<p align="center">
  Built with ⚡ by the RCCM Engineering Team · Purple Mech Edition · 2025
</p>
