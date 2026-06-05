# 🎸 RCCM GigBook — Guitar Chords, Lyrics & Setlist PWA

> A Progressive Web App (PWA) for the RCCM worship team. Manage songs, chord charts, lyrics, and setlists — with smart key transposition, capo suggestions, and role-based access.

**Live URL:** `https://danaglinao0522.github.io/rccm-gigbook/`

---

## 📋 Table of Contents

1. [App Layout Overview](#-app-layout-overview)
2. [Tech Stack](#-tech-stack)
3. [User Roles & Permissions](#-user-roles--permissions)
4. [Firebase Setup](#-firebase-setup)
5. [GitHub Pages Deployment](#-github-pages-deployment)
6. [Adding / Managing Songs](#-adding--managing-songs)
7. [PWA Installation](#-pwa-installation)
8. [Feature Guide](#-feature-guide)
9. [Firestore Security Rules](#-firestore-security-rules)
10. [Troubleshooting](#-troubleshooting)

---

## 🗺 App Layout Overview

```
┌─────────────────────────────────────────────────┐
│  TOP NAV BAR (fixed)                            │
│  [← Home] [🎸 GigBook]    [🔍] [▶] [Avatar]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  CONTENT AREA (scrollable, full height)         │
│  ┌───────────────────────────────────────────┐  │
│  │  SONGS TAB (default)                      │  │
│  │  ┌─ Search Bar (toggleable) ───────────┐  │  │
│  │  │  [🔍 Search songs, artists...]      │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  │  [Filter ▼] [Key: G ×] [Worship ×]        │  │
│  │  ┌── Filter Panel (collapsible) ────────┐  │  │
│  │  │  Key: C | C# | D | Eb | E | F...    │  │  │
│  │  │  Tags: [Worship] [Hymn] [Gospel]... │  │  │
│  │  └──────────────────────────────────────┘  │  │
│  │  ─────────────────────────────────────     │  │
│  │  🎵 Amazing Grace          [G] 72 BPM     │  │
│  │  🎵 10,000 Reasons         [G] 73 BPM     │  │
│  │  🎵 Oceans                 [D] 68 BPM     │  │
│  │  ...                                       │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
│  SONG VIEW (full overlay, scrollable)           │
│  ┌───────────────────────────────────────────┐  │
│  │  Song Title             [D] 68 BPM 4/4   │  │
│  │  Artist Name            [Worship] [Ballad]│  │
│  │  [+ Add to Setlist] [Edit] [Delete]       │  │
│  │  ─────────────────────────────────────    │  │
│  │  Key Engine: [G] ← [D] → | Capo Hint     │  │
│  │  ─────────────────────────────────────    │  │
│  │  [Verse 1]                                │  │
│  │  G          D                             │  │  ← chords (hidden for Singer/Tech)
│  │  Amazing grace, how sweet the sound       │  │  ← lyrics
│  │  ...                                      │  │
│  │  ← swipe to go prev/next song →           │  │
│  └───────────────────────────────────────────┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│  BOTTOM NAV (fixed)                             │
│  [🎵 Songs]  [📋 Setlist]  [🛡 Admin]*         │
│                            *Admin/SubAdmin only  │
└─────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | Tailwind CSS v4 (Browser CDN) + DaisyUI v5 |
| **Icons** | Iconify (Tabler Icons set via CDN) |
| **Auth** | Firebase Authentication (Google Sign-In) |
| **Database** | Firebase Firestore |
| **Hosting** | GitHub Pages |
| **PWA** | Web App Manifest + Service Worker |
| **JavaScript** | Vanilla JS (zero frameworks) |

---

## 👥 User Roles & Permissions

| Role | Chords View | Add/Edit Songs | Delete Songs | Manage Users | Setlists | Songs/Setlist |
|------|:-----------:|:--------------:|:------------:|:------------:|:--------:|:-------------:|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ∞ | ∞ |
| **Sub-Admin** | ✅ | ✅ | ✅ | ❌ | 15 | ∞ |
| **Lead** | ✅ | ✅ | ❌ | ❌ | 15 | ∞ |
| **Musician** | ✅ | ❌ | ❌ | ❌ | 5 | 4 |
| **Singer** | ❌ | ❌ | ❌ | ❌ | 5 | 4 |
| **Tech** | ❌ | ❌ | ❌ | ❌ | 5 | 4 |

**Admin email (hardcoded):** `buenavistaaglinaodanny@gmail.com`

---

## 🔥 Firebase Setup

### Step 1 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Name it `rccm-gigbook`
3. Disable Google Analytics (optional) → **Create Project**

### Step 2 — Enable Google Authentication

1. In the Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, click **Google**
4. Toggle **Enable** → Add your support email → **Save**
5. Under **Authorized domains**, add:
   - `danaglinao0522.github.io`
   - `localhost` (for local testing)

### Step 3 — Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** → **Next**
4. Select your nearest region → **Done**

### Step 4 — Get Firebase Config

1. Go to **Project Settings** (gear icon ⚙️)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → Choose **Web** `</>`
4. Register app name: `rccm-gigbook`
5. Copy the `firebaseConfig` object

### Step 5 — Paste Config into index.html

Open `index.html` and find this section:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Replace every `YOUR_*` placeholder with your actual values from the Firebase Console.

---

## 🚀 GitHub Pages Deployment

### Step 1 — Create GitHub Repository

1. Go to [https://github.com/new](https://github.com/new)
2. Create a **public** repository named: `rccm-gigbook`
3. Don't initialize with README (you already have one)

### Step 2 — Push Files to GitHub

```bash
# Initialize git in your project folder
git init
git add .
git commit -m "Initial commit: RCCM GigBook PWA"

# Connect to GitHub
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
git branch -M main
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. In your GitHub repo, go to **Settings → Pages**
2. Under **Source**, select **"Deploy from a branch"**
3. Select **`main`** branch and **`/ (root)`** folder
4. Click **Save**
5. Wait 1-2 minutes, then visit: `https://danaglinao0522.github.io/rccm-gigbook/`

### Files Required in Root

```
rccm-gigbook/
├── index.html       ← Main app (all code here)
├── manifest.json    ← PWA manifest
├── sw.js            ← Service Worker
├── songs-data.js    ← Song database (optional external file)
└── README.md        ← This file
```

---

## 🎵 Adding / Managing Songs

### Method 1: In-App (Recommended for Admins)

1. Sign in as Admin or Sub-Admin
2. Tap the **+** floating button (bottom right)
3. Fill in: Title, Artist, Key, Time Signature, Tempo, Tags, Chord Chart + Lyrics
4. Tap **Save Song** — saves to Firestore instantly

### Method 2: Edit songs-data.js (Base Song Library)

Open `songs-data.js` and add entries to the `window.SONGS_DATA` array:

```javascript
{
  id: "s11",                          // Unique ID (prefix s + number)
  title: "Holy Spirit",
  artist: "Francesca Battistelli",
  key: "C",
  tempo: 70,
  time: "4/4",
  tags: ["Worship", "Contemporary"],  // Pick from ALL_TAGS list
  lyrics: `[Verse 1]
C              G
There's nothing worth more
Am             F
That could ever come close
...`
}
```

**Available tags:** `Praise & Worship`, `Worship`, `Hymn`, `Ballad`, `Rock`, `Pop`, `Gospel`, `Contemporary`, `Traditional`

**Available keys:** `C`, `C#`, `Db`, `D`, `D#`, `Eb`, `E`, `F`, `F#`, `Gb`, `G`, `G#`, `Ab`, `A`, `A#`, `Bb`, `B`

### Chord Chart Formatting

```
[Section Name]          ← Renders as bold purple header
G          C    Em      ← Chord line (auto-detected, hidden for Singer/Tech)
Amazing grace...        ← Lyric line
```

---

## 📱 PWA Installation

### Android (Chrome)

1. Open Chrome → Navigate to the app URL
2. Tap the **menu** (⋮) → **"Add to Home screen"**
3. Confirm → App installs like a native app

### iOS (Safari)

1. Open Safari → Navigate to the app URL
2. Tap the **Share** button (box with arrow)
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add** → App appears on your home screen

### Features when installed:

- ✅ Full-screen (no browser UI)
- ✅ Works offline (cached content)
- ✅ Hardware back button handled (won't exit app)
- ✅ App icon on home screen

---

## 📖 Feature Guide

### 🔍 Search & Filter

- Tap the **🔍 search icon** in the top bar to reveal the search field
- Search matches: **Song title**, **Artist name**, and **Lyrics content**
- Tap **Filter** button to expand the filter panel
  - Filter by: **Musical Key** or **Genre/Tag**
  - Active filters appear as dismissible **pill badges**
- Tap the **GigBook logo** or **Home button** to clear ALL filters

### 🎵 Song View

- Tap any song card to open the full chord/lyric sheet
- **Chord lines** shown in purple monospace (hidden for Singer/Tech roles)
- **Swipe left** → Next song | **Swipe right** → Previous song
- Navigation counter shows `2 / 8` position in current list

### 🎼 Key Transposition (Musicians, Leads, Admins only)

- The **Original Key** is shown on the left of the key engine bar
- Use **‹ ›** arrows to shift the key by semitones
- Or click the **Target Key** button to pick from a dropdown menu
- **Capo Suggestion** auto-appears when keys differ:
  - Example: Original `G` → Target `A` = `Capo 2 fret — Play in G shapes`
- Transpositions are **local only** — never saves to server

### ▶ Auto-Scroll

- Tap the **▶ play button** in the top bar while in a song view
- Adjust speed using the **slider** that appears beside the button
- Scroll pauses automatically at the end of the song
- Progress bar shows reading position at top of screen

### 📋 Setlists

- **Create:** Setlist tab → **New** button → Enter name, date, set public/private
- **Add songs:** Open any song → **"Add to Setlist"** button
- **Navigate setlist:** Open setlist → tap song → swipe between songs
- **Public setlists:** Visible to all signed-in users; visitors can transpose keys locally

### 🛡 Admin Panel

- Accessible to **Admin** and **Sub-Admin** roles via bottom nav
- View all registered users with their assigned roles
- **Admin only:** Change any user's role via dropdown
- **Admin only:** Remove users from the system
- Use the **+** FAB to add new songs

---

## 🔐 Firestore Security Rules

Paste these rules in **Firebase Console → Firestore → Rules**:

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
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'
      );
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'subadmin', 'lead']
      );
      allow delete: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'subadmin']
      );
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'subadmin']
      );
      allow delete: if request.auth != null && (
        resource.data.ownerId == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'subadmin']
      );
    }

  }
}
```

---

## 🔧 Troubleshooting

### "Sign-in failed" on Google Auth
- Make sure your GitHub Pages domain is listed in Firebase → Authentication → **Authorized domains**
- Add: `danaglinao0522.github.io`

### Songs not loading
- Check browser console for Firebase config errors
- Ensure Firestore database has been created in Firebase Console
- Verify your `firebaseConfig` values in `index.html` are correct

### App not installing as PWA
- Must be served over **HTTPS** (GitHub Pages provides this)
- `manifest.json` and `sw.js` must be in the root directory
- Open Chrome DevTools → **Application** tab to debug PWA status

### Back button exits the app
- This is handled by the `popstate` event listener
- If it still exits: ensure the app is **installed as PWA** (standalone mode)
- In browser mode, the first back press may go to the previous page before the lock kicks in

### Chords not transposing
- Chord detection requires chord lines to have chords followed by spaces
- Format: `G          D      Em` (chord symbols with whitespace between)
- Lines that mix lyrics and chords may not transpose correctly — put chords on their own line

### Cache issues (old songs showing)
- The app caches song data for 1 hour in `localStorage`
- To force refresh: open browser DevTools → **Application → Local Storage** → delete `rccm_songs_cache`
- Or update the `CACHE_TTL` constant in `index.html`

---

## 📁 Project Structure

```
rccm-gigbook/
├── index.html        ← Complete single-page application
│                       - Firebase config & initialization
│                       - All UI (Tailwind CSS + DaisyUI + Iconify)
│                       - Full application logic (Vanilla JS)
│                       - Embedded sample song data (fallback)
│
├── songs-data.js     ← External song database
│                       - Add new songs here
│                       - Loaded and cached in localStorage
│
├── manifest.json     ← PWA Web App Manifest
│                       - App name, icons, display mode
│
├── sw.js             ← Service Worker
│                       - Offline caching strategy
│                       - Cache-first for app shell
│                       - Network-first for Firebase
│
└── README.md         ← This documentation file
```

---

## 🙏 Credits

Built for **RCCM Worship Team** with ❤️  
Powered by Firebase · Tailwind CSS · DaisyUI · Iconify · GitHub Pages

---

*For support or changes, contact the Admin: `buenavistaaglinaodanny@gmail.com`*
