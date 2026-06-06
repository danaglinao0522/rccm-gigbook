# RCCM Gigbook

A production-ready Progressive Web App (PWA) for managing guitar chords, lyrics, and setlists — built for live stage performance use.

---

## 🚀 Live URL

```
https://danaglinao0522.github.io/rccm-gigbook/
```

---

## 📁 Required File Structure

```
rccm-gigbook/
├── index.html          ← Main application (all-in-one)
├── manifest.json       ← PWA manifest
├── README.md           ← This file
└── icons/
    ├── logo.png        ← App brand logo (used in splash + header)
    ├── icon-192.png    ← PWA icon (192×192)
    └── icon-512.png    ← PWA icon (512×512)
```

> ⚠️ You must place your actual logo and icon image files inside the `icons/` folder before deploying.

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → Name it `rccm-gigbook`
3. Disable Google Analytics (optional)

### Step 2: Enable Authentication
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** as a provider
3. Set your **Authorized Domain** to: `danaglinao0522.github.io`

### Step 3: Enable Firestore
1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode**
3. Select your preferred server region

### Step 4: Firestore Security Rules
Go to **Firestore → Rules** and paste:

```rules
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
      allow create, update: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canAddSongs == true);
      allow delete: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canDeleteSongs == true);
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']);
      allow delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin']);
    }

    // Config collection
    match /config/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Themes collection
    match /themes/{themeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

### Step 5: Get Your Firebase Config
1. Firebase Console → **Project Settings** → **General**
2. Scroll to **Your apps** → Add a **Web app**
3. Copy the `firebaseConfig` object
4. In `index.html`, replace the placeholder config block:

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

## 🌐 GitHub Pages Deployment

### Step 1: Repository Setup
```bash
git init
git remote add origin https://github.com/danaglinao0522/rccm-gigbook.git
```

### Step 2: Push Files
```bash
git add .
git commit -m "Initial RCCM Gigbook deployment"
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. GitHub → Repository → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `root`
4. Save → Wait ~2 minutes for deployment

### Step 4: Add GitHub Pages Domain to Firebase
1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add: `danaglinao0522.github.io`

---

## 👤 Role Matrix

| Role | Setlist Limit | Track Limit | Song CRUD | User Management | Admin Panel |
|------|--------------|-------------|-----------|-----------------|-------------|
| Admin | ∞ | ∞ (configurable) | Full | Full | ✅ |
| Sub-Admin | 5 | Config default | Full | Edit only | ❌ |
| Lead/Facilitator | 5 | Config default | Read | ❌ | ❌ |
| Musician | 2 | Config default | Read | ❌ | ❌ |
| Singer | 2 | Config default | Read (Lyrics only) | ❌ | ❌ |
| Tech | ∞ (observer) | N/A | Read (Lyrics only) | ❌ | ❌ |

---

## 🔑 Admin Account

The hardcoded Admin account is:
```
buenavistaaglinaodanny@gmail.com
```
This account receives Admin role automatically on first login and cannot be demoted or deleted.

---

## 🎨 Firestore Collections

| Collection | Purpose |
|---|---|
| `users` | User profiles, roles, instruments, preferences |
| `songs` | Song library with chord/lyric sheets |
| `setlists` | Setlist documents with track arrays |
| `config/global` | App-wide configuration (max tracks, typography) |
| `themes` | Theme presets and custom themes |

---

## 📱 PWA Installation

### iOS (Safari)
1. Open the app URL in Safari
2. Tap the **Share** button (box with arrow)
3. Select **Add to Home Screen**

### Android (Chrome)
1. Open the app URL in Chrome
2. Tap the browser menu (⋮)
3. Select **Install App** or **Add to Home Screen**
4. Or tap the **Install App** button shown in the app's sign-in screen

---

## 🛠️ Icons Required

Place the following files in the `icons/` folder:

| File | Size | Purpose |
|---|---|---|
| `logo.png` | Any (recommend 512×512) | App brand logo in splash, header |
| `icon-192.png` | 192×192 | PWA home screen icon |
| `icon-512.png` | 512×512 | PWA splash icon |

All icons should have **transparent or brand-color backgrounds** for best display on both light and dark system themes.

---

## 🔧 Local Development

No build tools required. Open `index.html` directly in a browser or serve with any static server:

```bash
# Using Python
python -m http.server 8080

# Using Node.js (npx)
npx serve .

# Using VS Code
# Install "Live Server" extension and click "Go Live"
```

Then visit: `http://localhost:8080`

---

## ⚠️ Known Setup Notes

- The app requires a **valid Firebase project** with real credentials to function. The placeholder config in `index.html` will not connect to any real database.
- Camera OCR capture requires **HTTPS** (GitHub Pages satisfies this).
- PWA install prompt only appears in supported browsers (Chrome, Edge, Samsung Internet).
- The `display-mode: standalone` detection automatically hides the install button when the app is already installed.

---

## 📄 License

Internal use — RCCM Community. All rights reserved.
