# RCCM Gigbook — Guitar Chords, Lyrics & Setlist PWA

> A production-ready, enterprise-grade Progressive Web App for church worship teams. Built with HTML5, Tailwind CSS v4, FlyonUI, Firebase Firestore, and vanilla JavaScript.

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Live Deployment URL](#live-deployment-url)
3. [Tech Stack](#tech-stack)
4. [Firebase Setup](#firebase-setup)
5. [GitHub Pages Deployment](#github-pages-deployment)
6. [PWA Asset Requirements](#pwa-asset-requirements)
7. [Firebase Firestore Security Rules](#firebase-firestore-security-rules)
8. [Role Permission Matrix](#role-permission-matrix)
9. [Feature Reference](#feature-reference)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

RCCM Gigbook is a real-time chord sheet, lyrics, and setlist management app for worship teams. It supports:
- Real-time Firebase Firestore sync across all concurrent sessions
- Role-based access control (Admin → Sub-Admin → Lead → Musician/Singer/Tech)
- Bracket-free intelligent chord/lyric sheet parsing engine
- Local key transposition with capo suggestions
- Auto-scroll for live stage performance
- Custom theme engine with 5 high-contrast presets
- PWA installable on iOS and Android

---

## Live Deployment URL

```
https://danaglinao0522.github.io/rccm-gigbook/
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | Tailwind CSS v4 (Browser CDN) |
| Component Library | FlyonUI v1.1.0 |
| Icons | Iconify 2.1.0 |
| Backend | Firebase Firestore (compat SDK 10.8.0) |
| Auth | Firebase Google OAuth |
| Hosting | GitHub Pages |
| Architecture | Single-file PWA (`index.html`) |

---

## Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Enter project name: `rccm-gigbook`
3. Disable Google Analytics (optional) → Click **Create project**

### Step 2: Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Add your GitHub Pages domain to **Authorized domains**:
   - `danaglinao0522.github.io`
   - `localhost` (for local testing)

### Step 3: Create Firestore Database

1. Firebase Console → **Firestore Database** → **Create database**
2. Select **Production mode** (you'll apply rules below)
3. Choose a region (e.g., `us-central`)

### Step 4: Get Your Firebase Config

1. Firebase Console → **Project Settings** → **Your apps** tab
2. Click **"Add app"** → Select **Web** (`</>`)
3. Register app name: `rccm-gigbook`
4. Copy the `firebaseConfig` object

### Step 5: Update `index.html`

Replace the placeholder `firebaseConfig` in `index.html` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## GitHub Pages Deployment

### Method 1: Repository-based (Recommended)

1. **Create Repository:**
   ```bash
   git init
   git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
   ```

2. **Add Required Files:**
   ```
   /index.html       ← Main application
   /manifest.json    ← PWA manifest
   /README.md        ← This file
   /icons/
     logo.png        ← App logo (192×192 minimum, transparent bg)
     icon-192.png    ← PWA icon 192×192
     icon-512.png    ← PWA icon 512×512
   ```

3. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial production deployment"
   git push -u origin main
   ```

4. **Enable GitHub Pages:**
   - Repository → **Settings** → **Pages**
   - Source: **Deploy from a branch**
   - Branch: `main` / `root`
   - Click **Save**

5. **Access:**
   ```
   https://danaglinao0522.github.io/rccm-gigbook/
   ```

### Method 2: GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

---

## PWA Asset Requirements

Create an `icons/` folder with the following assets:

| File | Size | Purpose |
|------|------|---------|
| `icons/logo.png` | 192×192+ | App logo shown in header & splash |
| `icons/icon-192.png` | 192×192 | PWA manifest icon |
| `icons/icon-512.png` | 512×512 | PWA manifest icon (high-res) |

**Logo Design Guidelines:**
- Use PNG format with transparent background
- Minimum 192×192px (recommend 512×512 master)
- Ensure high contrast on dark backgrounds
- No text that would be illegible at small sizes

---

## Firebase Firestore Security Rules

Apply these rules in Firebase Console → **Firestore** → **Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuth() {
      return request.auth != null;
    }
    function isAdmin() {
      return isAuth() && request.auth.token.email == 'buenavistaaglinaodanny@gmail.com';
    }
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    function hasRole(roles) {
      return isAuth() && getUserData().role in roles;
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuth();
      allow create: if isAuth() && request.auth.uid == userId;
      allow update: if isAuth() && (
        request.auth.uid == userId ||
        isAdmin() ||
        hasRole(['subadmin'])
      );
      allow delete: if isAdmin();
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if isAuth();
      allow create: if isAuth() && (
        isAdmin() ||
        hasRole(['subadmin', 'lead']) ||
        getUserData().canAddSongs == true
      );
      allow update: if isAuth() && (
        isAdmin() ||
        hasRole(['subadmin', 'lead'])
      );
      allow delete: if isAuth() && (
        isAdmin() ||
        getUserData().canDeleteSongs == true
      );
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if isAuth() && (
        isAdmin() ||
        hasRole(['subadmin', 'lead', 'tech']) ||
        resource.data.privacy == 'public' ||
        resource.data.createdBy == request.auth.uid ||
        request.auth.uid in resource.data.members
      );
      allow create: if isAuth() && (
        isAdmin() ||
        hasRole(['subadmin', 'lead', 'musician', 'singer'])
      );
      allow update: if isAuth() && (
        isAdmin() ||
        hasRole(['subadmin']) ||
        resource.data.createdBy == request.auth.uid
      );
      allow delete: if isAuth() && (
        isAdmin() ||
        resource.data.createdBy == request.auth.uid
      );
    }

    // App configuration (Admin only write)
    match /config/{configId} {
      allow read: if isAuth();
      allow write: if isAdmin();
    }
  }
}
```

---

## Role Permission Matrix

| Feature | Admin | Sub-Admin | Lead | Musician | Singer | Tech |
|---------|-------|-----------|------|----------|--------|------|
| View Songs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Add Songs | ✅ | ✅ | ✅ | ⚙️ | ⚙️ | ❌ |
| Delete Songs | ✅ | ⚙️ | ❌ | ⚙️ | ❌ | ❌ |
| Chord View | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Lyrics Only | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Transposition | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Create Setlist | ✅ | ✅ (max 5) | ✅ (max 5) | ✅ (max 2) | ✅ (max 2) | ❌ |
| Custom Group Setlist | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View All Setlists | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| User Management | ✅ | 👁️ | 👁️ | ❌ | ❌ | ❌ |
| Admin Panel | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Change Roles | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

> ✅ = Full Access | ❌ = No Access | ⚙️ = Conditional/Permission-Based | 👁️ = Read Only

---

## Feature Reference

### Hardcoded Admin Account
```
Email: buenavistaaglinaodanny@gmail.com
Role:  Admin (permanent, cannot be changed or removed)
```

### Setlist Expiry
- All setlists automatically expire **1 month** from creation date
- Users are warned at creation time via an alert overlay
- Expired setlists are deleted on app initialization

### Track Limits (Default)
- Standard setlist: **4 tracks** (configurable via Admin Panel)
- Custom Group setlists: **Unlimited tracks**
- Admin can override the global default in Admin Panel → App Configuration

### Chord Sheet Parser
The app uses a regex-based bracket-free parser:
- **Section headers**: Lines matching `VERSE`, `CHORUS`, `BRIDGE`, etc. → Bold headers
- **Chord lines**: Lines containing only valid chord notation → Amber colored, monospace
- **Lyric lines**: All other text → White, standard font
- Whitespace in chord lines is preserved for chord-above-lyric alignment

### Key Transposition
- Local only — never writes back to Firestore
- Supports all 12 chromatic keys with enharmonic equivalents
- Capo suggestion tooltip appears automatically for each selected key

### Auto-Scroll
- Range slider controls speed (0 = off)
- Play/Pause toggle button
- Resets when opening a new song

### Pinch Zoom (Touch)
- Pinch gesture on song sheet content only
- Two-finger pinch adjusts `--sheet-font-size` CSS variable
- Range: 10px – 32px
- Does not affect global layout

---

## Troubleshooting

### Firebase Auth Error: `auth/unauthorized-domain`
Add your GitHub Pages domain in Firebase Console → Authentication → Authorized Domains

### Songs not loading
1. Check Firestore security rules are published
2. Verify `firebaseConfig` values match your project
3. Check browser console for specific Firestore errors

### App won't install (PWA)
- Ensure `manifest.json` is accessible at the repo root
- Ensure `icons/icon-192.png` and `icons/icon-512.png` exist
- Serve over HTTPS (GitHub Pages does this automatically)

### Google Sign-In popup blocked
- On Safari/iOS: Sign-in popups may be blocked
- Alternative: The app uses `signInWithPopup` — ensure popups are allowed
- If consistently blocked, consider switching to `signInWithRedirect`

### Setlists not appearing
- Check that the `privacy` field is set correctly
- Verify user role is loaded before setlists are fetched
- Tech users see all setlists; Musician/Singer only see public or their own

---

## Local Development

```bash
# Option 1: Python HTTP Server (Python 3)
cd /path/to/rccm-gigbook
python3 -m http.server 8080
# Open: http://localhost:8080

# Option 2: Node.js http-server
npx http-server . -p 8080
# Open: http://localhost:8080

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> ⚠️ Firebase Google Auth requires an authorized domain. Add `localhost` to Firebase Console → Authentication → Authorized Domains for local testing.

---

## Project Structure

```
rccm-gigbook/
├── index.html          ← Complete single-file PWA application
├── manifest.json       ← PWA web app manifest
├── README.md           ← This documentation
└── icons/
    ├── logo.png        ← App logo (header, splash, auth screens)
    ├── icon-192.png    ← PWA icon (192×192)
    └── icon-512.png    ← PWA icon (512×512)
```

---

## License

MIT License — © 2025 RCCM Gigbook. All rights reserved.
