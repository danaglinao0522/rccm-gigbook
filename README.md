# RCCM Gigbook — Production Deployment Guide

A production-ready, enterprise-grade Progressive Web App (PWA) for managing Guitar Chords, Lyrics, and Setlists. Built with HTML5, Tailwind CSS, FlyonUI, and Firebase Firestore as the real-time backend.

---

## 🚀 Live Deployment URL

```
https://danaglinao0522.github.io/rccm-gigbook/
```

---

## 📦 Project File Structure

```
rccm-gigbook/
├── index.html          # Complete single-file PWA application
├── manifest.json       # PWA web manifest
├── README.md           # This file
└── icons/
    ├── logo.png         # App brand logo (used in splash, nav header, auth view)
    ├── icon-192.png     # PWA icon — 192x192px (Apple Touch Icon)
    ├── icon-512.png     # PWA icon — 512x512px (Maskable)
    └── icon-192.png     # Shortcut icon reference
```

---

## 🔥 Firebase Project Setup

### Step 1 — Create Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add Project"** → Name it `rccm-gigbook`
3. Disable Google Analytics (optional)
4. Click **"Create Project"**

### Step 2 — Enable Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** as a sign-in provider
3. Set your **Authorized Domain** to: `danaglinao0522.github.io`

### Step 3 — Create Firestore Database

1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode**
3. Select your preferred server region (e.g., `us-central`)

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
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Sub-Admin'
      );
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead'] ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canAddSongs == true
      );
      allow update: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead']
      );
      allow delete: if request.auth != null && (
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin' ||
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Sub-Admin' ||
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

    // Global settings (Admin only write)
    match /settings/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

### Step 5 — Register Web App & Get Config

1. In Firebase Console → **Project Settings** → **Your Apps** → Click **`</>`** (Web)
2. Register app name as `RCCM Gigbook`
3. Copy the `firebaseConfig` object

### Step 6 — Insert Config into index.html

Replace the placeholder config block near the top of the `<script>` section in `index.html`:

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

## 📱 Required Icon Assets

Create and place these image files in the `icons/` folder:

| File | Size | Purpose |
|------|------|---------|
| `logo.png` | 512×512px | App brand logo (splash, header, auth) |
| `icon-192.png` | 192×192px | PWA home screen icon / Apple Touch Icon |
| `icon-512.png` | 512×512px | PWA splash screen icon |

> **Design Note:** Logo should have a transparent or solid background. The app applies `border-radius` styling automatically via CSS.

---

## 🌐 GitHub Pages Deployment

### Step 1 — Initialize Repository

```bash
git init
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
```

### Step 2 — Commit All Files

```bash
git add .
git commit -m "Initial production deploy — RCCM Gigbook PWA"
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your GitHub repository
2. **Settings** → **Pages**
3. Under **Source**, select `main` branch and `/ (root)` folder
4. Click **Save**
5. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

### Step 4 — Add GitHub Pages Domain to Firebase Auth

1. Firebase Console → **Authentication** → **Settings** → **Authorized Domains**
2. Click **Add domain** → Enter: `danaglinao0522.github.io`

---

## 👤 Role Hierarchy Reference

| Role | Setlist Limit | Song Limit | Users Tab | Admin Panel | Notes |
|------|---------------|------------|-----------|-------------|-------|
| **Admin** | Unlimited | Unlimited | ✅ | ✅ | Hardcoded: `buenavistaaglinaodanny@gmail.com` |
| **Sub-Admin** | 5 | Unlimited | ✅ | ❌ | Cannot delete users or change Admin config |
| **Lead** | 5 | — | ✅ (view) | ❌ | Can manage setlists & tracks |
| **Musician** | 2 | — | ❌ | ❌ | Full chord+lyric view, transposition |
| **Singer** | 2 | — | ❌ | ❌ | Lyrics-only view permanently |
| **Tech** | 2 | — | ❌ | ❌ | Lyrics-only, sees all setlists |

---

## ⚙️ Admin Configuration

Once logged in as Admin (`buenavistaaglinaodanny@gmail.com`):

- Navigate to the **Admin Panel** tab (4th tab in bottom nav)
- Configure:
  - **App Name** & **App Icon** path
  - **Global Song Limit** per setlist (overrides the default 4)
  - **Theme Presets** (5 high-contrast presets + custom hex builder)
  - **Typography** (font family, navbar size, button size, metadata size)

All Admin Panel changes sync in real-time to all connected client sessions via Firestore.

---

## 🔒 Security Notes

- The Admin email is hardcoded in JavaScript and enforced via Firestore rules
- No other user can be assigned the Admin role through the UI
- Custom-Group Setlists enforce ACL filtering client-side AND via Firestore reads
- All key transposition operations are purely local (client-only) — never written to Firestore
- TTL cleanup runs automatically on every app boot for setlists older than 1 month

---

## 📋 manifest.json Reference

See `manifest.json` in the project root for the complete PWA manifest configuration.

---

## 🛠️ Local Development

No build tools required. This is a single-file HTML app.

```bash
# Serve locally using any static file server:
npx serve .
# or
python -m http.server 8080
```

Open `http://localhost:8080` in your browser.

> **Note:** Firebase Authentication requires HTTPS or `localhost`. Local development on `localhost` works without HTTPS.

---

## 📦 Dependencies (All CDN — No npm Required)

| Library | Version | Purpose |
|---------|---------|---------|
| Tailwind CSS Browser | @4 | Utility-first styling |
| FlyonUI | 1.1.0 | UI component system |
| Iconify | 2.1.0 | Icon engine |
| Firebase App | 10.8.0 | Firebase core |
| Firebase Auth | 10.8.0 | Google authentication |
| Firebase Firestore | 10.8.0 | Real-time database |

---

## 📞 Support

For issues related to Firebase configuration, GitHub Pages deployment, or feature modifications, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
