# RCCM Gigbook — Production Deployment Guide

A production-ready Progressive Web App for live worship performance management — Guitar Chords, Lyrics, and Setlist management with real-time Firebase Firestore sync.

---

## 📦 Repository Structure

```
rccm-gigbook/
├── index.html          ← Complete SPA application (all HTML/CSS/JS)
├── manifest.json       ← PWA manifest configuration
├── README.md           ← This deployment guide
└── icons/
    ├── logo.png        ← App brand logo (splash + nav bar)
    ├── icon-192.png    ← PWA home screen icon (192×192)
    └── icon-512.png    ← PWA splash icon (512×512)
```

---

## 🔧 Firebase Setup Protocol

### Step 1 — Create Firebase Project
1. Navigate to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add Project"** → Name it `rccm-gigbook`
3. Disable Google Analytics (optional) → Click **Create Project**

### Step 2 — Enable Authentication
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** as a Sign-in Provider
3. Set your project's **Authorized Domain** to:
   ```
   danaglinao0522.github.io
   ```

### Step 3 — Enable Firestore Database
1. In Firebase Console → **Firestore Database** → **Create Database**
2. Choose **Production Mode**
3. Select your nearest region (e.g., `asia-southeast1` for Philippines)

### Step 4 — Firestore Security Rules
Paste the following rules in **Firestore → Rules**:

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
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin'
      );
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead'] ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canAddSongs == true
      );
      allow delete: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'] ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canDeleteSongs == true
      );
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.createdBy == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead']
      );
      allow delete: if request.auth != null && (
        resource.data.createdBy == request.auth.uid ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']
      );
    }

    // Global config (Admin only write)
    match /config/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

### Step 5 — Get Firebase Config Keys
1. In Firebase Console → **Project Settings** (gear icon) → **General**
2. Scroll down to **"Your apps"** → Click **"</>"** (Web)
3. Register app name: `rccm-gigbook`
4. Copy the `firebaseConfig` object

### Step 6 — Inject Config into index.html
Replace the placeholder config block in `index.html` (line ~340):

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

## 🚀 GitHub Pages Deployment

### Step 1 — Initialize Repository
```bash
git init
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
```

### Step 2 — Add Required Assets
Ensure the following files exist before pushing:
```
icons/logo.png       (Your brand logo — recommended: 512×512px, transparent PNG)
icons/icon-192.png   (PWA icon — exactly 192×192px)
icons/icon-512.png   (PWA icon — exactly 512×512px)
```

### Step 3 — Commit and Push
```bash
git add .
git commit -m "feat: initial RCCM Gigbook production build"
git push -u origin main
```

### Step 4 — Enable GitHub Pages
1. Go to your repository on GitHub
2. **Settings** → **Pages**
3. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
4. Click **Save**
5. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

---

## 👤 Admin Account Setup

The primary Admin account is hardcoded to:
```
buenavistaaglinaodanny@gmail.com
```

**First-time Admin login flow:**
1. Sign in with the Admin Google account
2. The system auto-assigns the `Admin` role — no onboarding modal is shown
3. Navigate to the **Admin Panel** tab (4th tab in bottom nav)
4. Configure themes, typography, and global settings

---

## 🎭 Role Hierarchy Summary

| Role | Setlist Limit | Song Access | User Management | Admin Panel |
|------|--------------|-------------|-----------------|-------------|
| Admin | Unlimited | Full CRUD | Full (except self-demotion) | ✅ Full |
| Sub-Admin | 5 max | Add + Delete | View only (no role changes) | ❌ |
| Lead | 5 max | Add | View only | ❌ |
| Musician | 2 max | Read only* | ❌ | ❌ |
| Singer | 2 max | Read (Lyrics Only) | ❌ | ❌ |
| Tech | — | Read (Lyrics Only, all sets) | ❌ | ❌ |

*Unless `canAddSongs` permission is granted by Admin

---

## 📱 PWA Installation Instructions

### iOS (Safari)
1. Open `https://danaglinao0522.github.io/rccm-gigbook/` in Safari
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **"Add"**

### Android (Chrome)
1. Open the URL in Chrome
2. Tap the **3-dot menu** → **"Add to Home Screen"**
3. Or tap the **"Install App"** button shown on the sign-in screen

---

## 🔥 Firestore Collections Reference

| Collection | Purpose |
|-----------|---------|
| `users` | User profiles, roles, permissions, preferences |
| `songs` | Song library with chord/lyric sheets |
| `setlists` | Setlists with song arrays, ACL whitelists, TTL timestamps |
| `config/global` | Global theme, typography, and app settings |

---

## 🔒 Security Notes

- Never expose Firebase Admin SDK keys in client-side code
- Firestore Security Rules enforce all role-based access server-side
- The Admin email is hardcoded client-side for UI routing only — server rules enforce actual permissions
- All transposition operations are local-only and never write to Firestore

---

## 🛠 Local Development

No build tools required. Open `index.html` directly in a browser.

For Firebase emulation (optional):
```bash
npm install -g firebase-tools
firebase login
firebase emulators:start --only firestore,auth
```

Then update the app to point to local emulators by adding before `firebase.initializeApp()`:
```javascript
firebase.firestore().useEmulator('localhost', 8080);
firebase.auth().useEmulator('http://localhost:9099');
```

---

## 📋 Changelog

| Version | Date | Notes |
|---------|------|-------|
| 1.0.0 | 2025 | Initial production release |
