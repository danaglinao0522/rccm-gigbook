# 🎵 RCCM GigBook

> **Production-ready, single-file Band Setlist & Chord Sheet Management SPA** — built with vanilla JavaScript, HTML5, Tailwind CSS v4 (CDN), and Google Firebase v10+ (Compatibility Mode). Styled to mirror the Google Gemini App aesthetic with fluid micro-animations and a mathematically locked layout system.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Feature Matrix](#feature-matrix)
- [Design System](#design-system)
- [Tech Stack](#tech-stack)
- [Local Setup](#local-setup)
- [Firebase Configuration](#firebase-configuration)
- [Firestore Data Schema](#firestore-data-schema)
- [Role & Permission Matrix](#role--permission-matrix)
- [PWA Deployment](#pwa-deployment)
- [Production Deployment](#production-deployment)
- [Architecture Notes](#architecture-notes)
- [Known Limitations & Roadmap](#known-limitations--roadmap)

---

## Project Overview

RCCM GigBook is a **standalone single-file SPA** (`index.html`) that enables a worship band or performance group to:

- Maintain a centralized **Song Library** with chord sheets and metadata
- Create and manage **Setlists** tied to specific dates
- Perform songs live through a dedicated **Stage HUD** with transposition, capo adjustment, lyrics-only mode, and auto-scroll teleprompter
- Manage **User Roles** in real-time via an Admin-gated directory
- Configure the app's **Theme, Branding, and Song Limits** from an Admin Panel
- Operate under a strict **Guest/Role Permission** system with immutable Admin protection

---

## Feature Matrix

### 🎸 Song Library
| Feature | Details |
|---|---|
| Add Songs (Manual) | Title, key, artist, chord sheet (bracket notation `[Chord]`) |
| Add Songs (Scan) | File drop zone for `.pdf`, `.png`, `.jpg` with preview |
| Add Songs (Camera) | Live `getUserMedia` video stream + frame capture |
| Key Filter | Filter songs by musical key |
| Search | Real-time title/artist fuzzy search |
| Favorites | Heart-flag persisted to Firestore |
| Song Limit | Admin-configurable cap enforced client-side |
| Delete | Soft confirm → Firestore `deleteDoc` |

### 📋 Setlists
| Feature | Details |
|---|---|
| Create Setlists | Name, date, multi-song picker |
| View Detail | Tap to open song list with jump-to-stage |
| Public Model | All setlists visible to all authenticated users |
| Delete | Admin/authorized roles only |

### 🎭 Stage HUD (Performance Mode)
| Feature | Details |
|---|---|
| Chord Transposer | Chromatic ♭/♯ step controls, live re-render |
| Capo Adjuster | 0–12 fret range |
| Lyrics-Only Toggle | Hides all `[Chord]` tokens, strips chord lines |
| Auto-Scroll | Play/Pause, 6 speed presets (0.5x–2.0x), scroll-to-top |
| Back Button | Replaces hamburger, preserves state |

### 👥 User Directory (Admin/Sub-Admin)
| Feature | Details |
|---|---|
| Master Roster | All users with assigned roles |
| Pending Panel | New users stuck at "Guest" role |
| Role Assignment | Inline `<select>` → live Firestore write |
| Immutable Admin Guard | `role === 'Admin'` rows hard-disabled |

### 🛡️ Admin Panel
| Section | Details |
|---|---|
| App Branding | Configurable app name → Firestore |
| Song Limit | Numeric cap → Firestore config doc |
| Theme Presets | Gemini Dark, Midnight Purple, Forest, Ocean Blue |
| Theme Laboratory | Dual-scope: Global (Firestore broadcast) or Admin-local (`localStorage`) |
| System Purge | 2-step OTA verification → batch delete setlists and/or users |

### 🔐 Auth & Onboarding
| Feature | Details |
|---|---|
| Google Sign-In | Firebase `signInWithPopup` |
| Recent Account Cache | `localStorage` fast-track re-auth |
| Auto Guest Assignment | New users → `role: 'Guest'` (no manual picker) |
| PWA Install Prompt | `beforeinstallprompt` → conditional button reveal |

---

## Design System

### Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--canvas-bg` | `#131314` | Main app background |
| `--surface-bg` | `#1e1f20` | Sidebar, cards, modal bodies |
| `--surface-raised` | `#2a2b2c` | Input fields, inner chips |
| `--text-primary` | `#e3e3e3` | Headings, interactive labels |
| `--text-secondary` | `#b4b4b4` | Metadata, descriptions |
| `--accent-gradient` | `#4285f4 → #9b72cb → #d96570` | Gemini gradient accents |
| `--chords-color` | `#4285f4` | Chord tokens in sheet view |
| `--lyrics-color` | `#e3e3e3` | Lyric text |

### Typography
- **Primary Font:** `Plus Jakarta Sans` (via Google Fonts CDN)
- **Fallback:** `Google Sans`, `sans-serif`
- **Chord Sheet Font:** `Courier New` / `Consolas` (monospace, fixed-width chord alignment)

### Curvature Rules
| Element | Tailwind Class |
|---|---|
| Main sidebar, modals | `rounded-3xl` / `rounded-2xl` |
| Buttons, pills, FABs | `rounded-full` |
| Inputs, textareas, selects | `rounded-xl` / `rounded-2xl` |
| Card containers | `rounded-2xl` |

### Animation Specs
| Event | Timing |
|---|---|
| Global transitions | `transition-all duration-300 ease-out` |
| Sidebar drawer | `cubic-bezier(0.16, 1, 0.3, 1)` — spring kinetic |
| Modal entrance | `translateY(32px) scale(0.97)` → neutral |
| Hover cards/buttons | `translateY(-2px)` lift |
| FAB reveal/hide | Opacity + `translateY(16px) scale(0.9)` |
| Search row hide | `translateY(-10px)` + opacity fade |

---

## Tech Stack

| Layer | Technology | Source |
|---|---|---|
| Markup | HTML5 | Native |
| Styling | Tailwind CSS v4 | `cdn.jsdelivr.net/npm/@tailwindcss/browser@4` |
| Icons | Material Design Icons v7 | `cdn.jsdelivr.net/npm/@mdi/font@7.2.96` |
| Fonts | Plus Jakarta Sans | Google Fonts CDN |
| Auth | Firebase Auth v10 | `gstatic.com/firebasejs/10.12.0` |
| Database | Cloud Firestore v10 | `gstatic.com/firebasejs/10.12.0` |
| JS Paradigm | ES Modules (vanilla) | Native browser |
| PWA | Service Worker + Web Manifest | Manual |

---

## Local Setup

### Prerequisites
- Any modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- A text editor (VS Code recommended)
- A local static file server (required for ES module imports)

### Option A: VS Code Live Server (Recommended)
```bash
# 1. Clone or download the repository
git clone https://github.com/your-org/rccm-gigbook.git
cd rccm-gigbook

# 2. Open in VS Code
code .

# 3. Install the "Live Server" extension by Ritwick Dey
# 4. Right-click index.html → "Open with Live Server"
# 5. Browser opens at http://127.0.0.1:5500
```

### Option B: Python HTTP Server
```bash
# Python 3
python3 -m http.server 8080

# Then open: http://localhost:8080
```

### Option C: Node.js `serve`
```bash
npx serve .
# Then open: http://localhost:3000
```

> ⚠️ **Important:** Do NOT open `index.html` directly via `file://` — Firebase ES Module imports require an HTTP/HTTPS origin.

---

## Firebase Configuration

The app is pre-wired to the following Firebase project. To use your own:

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

### Firebase Console Setup Steps

1. Go to [Firebase Console](https://console.firebase.google.com)
2. **Authentication** → Sign-in methods → Enable **Google**
3. Add your deployment domain to **Authorized Domains**
4. **Firestore Database** → Create database (Production mode)
5. Apply the security rules below

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isSignedIn() { return request.auth != null; }
    function getRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }
    function isAdmin() { return getRole() == 'Admin'; }
    function isAdminOrSub() { return getRole() in ['Admin', 'Sub-Admin']; }

    match /songs/{songId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && getRole() != 'Guest';
      allow update, delete: if isAdminOrSub();
    }

    match /setlists/{setlistId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && getRole() != 'Guest';
      allow update, delete: if isAdminOrSub();
    }

    match /users/{userId} {
      allow read: if isSignedIn();
      allow create: if isSignedIn() && request.auth.uid == userId;
      allow update: if isAdmin() && resource.data.role != 'Admin';
      allow delete: if isAdmin() && resource.data.role != 'Admin';
    }

    match /admin_settings/{doc} {
      allow read: if isSignedIn();
      allow write: if isAdmin();
    }
  }
}
```

---

## Firestore Data Schema

### `/songs/{songId}`
```json
{
  "title": "Amazing Grace",
  "artist": "John Newton",
  "key": "G",
  "sheet": "[Verse 1]\n[G]Amazing [D]grace\nhow sweet the sound",
  "favorite": false,
  "createdBy": "uid_string",
  "createdAt": "Timestamp"
}
```

### `/setlists/{setlistId}`
```json
{
  "name": "Sunday Morning Service",
  "date": "2025-01-19",
  "songIds": ["songId1", "songId2"],
  "createdBy": "uid_string",
  "createdAt": "Timestamp"
}
```

### `/users/{uid}`
```json
{
  "uid": "firebase_uid",
  "displayName": "Jane Doe",
  "email": "jane@example.com",
  "photoURL": "https://...",
  "role": "Musician",
  "createdAt": "Timestamp"
}
```

### `/admin_settings/config`
```json
{
  "appName": "RCCM GigBook",
  "songLimit": 500
}
```

### `/admin_settings/theme`
```json
{
  "--canvas-bg": "#131314",
  "--surface-bg": "#1e1f20",
  "--lyrics-color": "#e3e3e3",
  "--chords-color": "#4285f4"
}
```

---

## Role & Permission Matrix

| Permission | Guest | Singer | Musician | Lead | Tech | Sub-Admin | Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| View Setlists | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| View Song Library | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Songs | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Setlists | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Delete Songs/Setlists | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Users Directory | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Assign Roles | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Access Admin Panel | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Execute System Purge | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Override Global Theme | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

> **Immutable Admin Rule:** An account with `role === 'Admin'` cannot have its role changed by any interface control. The dropdown is force-disabled and Firestore rules reject the write.

---

## Chord Sheet Notation Guide

The chord sheet parser uses bracket notation. Write chords inside square brackets on the same line as — or on the line before — lyrics.

```
[Verse 1]
[G]Amazing [D]grace how [Em]sweet the [C]sound
That [G]saved a [D]wretch like [G]me

[Chorus]
[C]My chains are [G]gone
I've been set [D]free
My God my [G]Savior [Em]has ransomed [C]me
```

**Section headers:** A line containing only `[SectionName]` (no spaces) renders as a gradient section label.

**Transposition:** All `[Root]` chord tokens are parsed via the `CHROMATIC_SCALE` array and `ENHARMONIC_MAP` dictionary, then re-rendered on each transpose step.

---

## PWA Deployment

### Create `manifest.json`
```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Band setlist & chord sheet manager",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#131314",
  "theme_color": "#131314",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

### Service Worker (`sw.js`)
```javascript
const CACHE = 'gigbook-v1';
const ASSETS = ['/', '/index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
```

Register in `index.html` before `</body>`:
```html
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
</script>
```

---

## Production Deployment

### Firebase Hosting (Recommended)

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize in project directory
firebase init hosting

# Settings:
#   Public directory: . (or dist)
#   Single-page app: No (static file)
#   GitHub Actions: Optional

# Deploy
firebase deploy --only hosting
```

**`firebase.json`:**
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "SAMEORIGIN" }
        ]
      }
    ]
  }
}
```

### Netlify / Vercel

```bash
# Netlify drag-and-drop or CLI
netlify deploy --prod --dir .

# Vercel
vercel --prod
```

No build step required — the file is entirely self-contained.

### GitHub Pages

1. Push repository to GitHub
2. Settings → Pages → Source: `main` branch, `/ (root)`
3. Access at `https://your-org.github.io/rccm-gigbook/`

> ⚠️ Add `https://your-org.github.io` to Firebase **Authorized Domains** before going live.

---

## Architecture Notes

### Single-File Pattern
All HTML, CSS (inline + `<style>`), and JavaScript reside in one `index.html`. This eliminates build tooling, module bundlers, and deployment complexity. Firebase is loaded via ES module CDN imports inside a `<script type="module">` block.

### State Management
App state is managed through module-scoped `let` variables:
- `allSongs[]` — Firestore snapshot cache
- `allSetlists[]` — Firestore snapshot cache
- `allUsers[]` — Admin-only Firestore cache
- `currentSong` — active stage view target
- `transpositionSteps` — chromatic offset (0–11)
- `capoPosition` — display fret counter
- `currentUserRole` — drives all permission gates

### Real-Time Sync
`onSnapshot()` listeners maintain live updates for songs, setlists, users, and the global theme document. Listeners are stored in `unsubX` variables and torn down on `signOut`.

### Chord Transposition Engine
```
Input chord → ENHARMONIC_MAP normalization → CHROMATIC_SCALE index lookup
→ index + transpositionSteps (mod 12) → CHROMATIC_SCALE output
```

Regex pattern: `/\[([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|\/[A-G][#b]?)?[0-9]*)\]/g`

---

## Known Limitations & Roadmap

| Limitation | Status | Notes |
|---|---|---|
| OCR (image/PDF text extraction) | 🔲 Planned | Requires backend (Cloud Functions + Vision API) |
| Email OTA code dispatch | 🔲 Planned | Requires Cloud Functions + SendGrid/Nodemailer |
| Offline song cache | 🔲 Planned | Firestore persistence + service worker |
| Drag-and-drop setlist reorder | 🔲 Planned | HTML5 drag API or Sortable.js |
| Multi-language support | 🔲 Planned | i18n string map |
| Song versioning / history | 🔲 Planned | Firestore subcollections |
| Beat/tempo sync | 🔲 Research | Web Audio API metronome |

---

## License

MIT © RCCM GigBook Contributors

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make changes to `index.html` only (single-file architecture)
4. Test across Chrome, Firefox, Safari, and mobile viewports
5. Submit a pull request with a clear description

---

*Built with ❤️ for worship teams and performing bands worldwide.*
