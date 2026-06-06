# RCCM GigBook — Setup & Configuration Guide

A Progressive Web App for Guitar Chords, Lyrics, and Setlist management powered by Firebase Firestore.

---

## 🚀 Quick Setup

### 1. Firebase Project Setup

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `rccm-gigbook` → Continue
3. Enable **Google Analytics** (optional) → Create project

### 2. Enable Firebase Services

**Authentication:**
- In Firebase Console → **Authentication** → **Sign-in method**
- Enable **Google** provider → Save

**Firestore Database:**
- In Firebase Console → **Firestore Database** → **Create database**
- Start in **production mode** → Choose a region → Done

### 3. Get Your Firebase Config

1. In Firebase Console → **Project Settings** (gear icon)
2. Under "Your apps" → Click **"</> Web"** → Register app
3. Copy the `firebaseConfig` object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

4. Paste this into `index.html` replacing the placeholder `firebaseConfig` block.

### 4. Firestore Security Rules

Go to **Firestore → Rules** and paste:

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
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin']);
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin'];
    }

    // Songs collection
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.addSongs == true);
      allow update: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.addSongs == true);
      allow delete: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.permissions.deleteSongs == true);
    }

    // Setlists collection
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin']);
      allow delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'SubAdmin']);
    }

    // App Settings (Admin only write)
    match /appSettings/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

---

## 📱 PWA Assets Setup

### Create the `icons/` directory in your project root:

```
/icons/
  logo.png          ← Your brand logo (shown on splash screen) — recommended 512×512 px
  icon-192.png      ← PWA icon for Android/iOS — exactly 192×192 px
  icon-512.png      ← PWA icon for splash screens — exactly 512×512 px
```

### Create `manifest.json` in your project root:

```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics & Setlist App",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#4f46e5",
  "theme_color": "#4f46e5",
  "lang": "en",
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
  "categories": ["music", "productivity"],
  "shortcuts": [
    {
      "name": "Songs",
      "short_name": "Songs",
      "description": "Browse all songs",
      "url": "/rccm-gigbook/",
      "icons": [{ "src": "icons/icon-192.png", "sizes": "192x192" }]
    }
  ]
}
```

---

## 🌐 GitHub Pages Deployment

1. Push all files to your GitHub repository: `danaglinao0522/rccm-gigbook`
2. Go to **Repository Settings** → **Pages**
3. Set **Source** to `main` branch, `/ (root)` folder → **Save**
4. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

**Important:** The `start_url` and `scope` in `manifest.json` must match your GitHub Pages path exactly.

---

## 🔥 Firebase Hosting (Alternative to GitHub Pages)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

In `firebase.json`:
```json
{
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

---

## 👤 Admin Account

The master Admin is hardcoded to:
```
buenavistaaglinaodanny@gmail.com
```

This account gets **Admin role automatically** on first login and **cannot be demoted** by anyone.

---

## 📋 Role Hierarchy

| Role | Songs | Setlists | Users | Admin Panel |
|------|-------|----------|-------|-------------|
| **Admin** | Full CRUD | Unlimited | Manage All | ✅ Full Access |
| **Sub-Admin** | Full CRUD | Max 5 | Manage (no delete Admin) | ✅ Full Access |
| **Lead/Facilitator** | View | Max 5, Custom Groups | ❌ | ❌ |
| **Musician** | View + Chords | Max 2 (Public/Private) | ❌ | ❌ |
| **Singer** | Lyrics Only | Max 2 | ❌ | ❌ |
| **Tech** | Lyrics Only | View All | ❌ | ❌ |

---

## 🗂️ Firestore Data Structure

```
/users/{uid}
  - uid, email, displayName, photoURL
  - role: 'Admin' | 'SubAdmin' | 'Lead' | 'Musician' | 'Singer' | 'Tech'
  - instruments: ['Guitar', 'Keyboard', 'Djembe']
  - canSing: boolean
  - isTech: boolean
  - maxSetlistOverride: number (0 = use default)
  - permissions: { addSongs: boolean, deleteSongs: boolean }
  - tutorialEnabled: boolean
  - createdAt: timestamp

/songs/{songId}
  - title, artist, content (chord sheet text)
  - createdBy, createdByName, createdByPhoto
  - createdAt: timestamp

/setlists/{setlistId}
  - name
  - visibility: 'public' | 'private'
  - isCustomGroup: boolean
  - whitelist: [uid, ...]   ← only for custom groups
  - songs: [songId, ...]
  - createdBy, creatorName, creatorPhoto
  - createdAt: timestamp   ← auto-deleted after 1 month

/appSettings/config
  - name, icon
  - primaryColor, secondaryColor, bgColor, surfaceColor, textColor
  - songCap: number
```

---

## 🎸 Chord Sheet Format Guide

The app automatically parses chord sheets **without requiring brackets**:

```
VERSE 1
G       Em      C       D
Amazing grace how sweet the sound
G       Em      C
That saved a wretch like me

CHORUS
C           G
I once was lost but now am found
Em      D       G
Was blind but now I see
```

**Rules:**
- Lines with only chord names (A-G with modifiers) → rendered as **chord lines** (blue)
- Lines with words → rendered as **lyric lines**
- Lines matching `VERSE`, `CHORUS`, `BRIDGE`, etc. → rendered as **section headers**
- Blank lines → rendered as spacing

---

## 🛠️ Troubleshooting

**"Permission Denied" errors in Firestore:**
→ Check your Firestore Security Rules are published correctly.

**Google Sign-In popup blocked:**
→ Ensure your domain is added to Firebase Auth's **Authorized Domains** list.

**PWA Install button not showing:**
→ The app must be served over HTTPS. GitHub Pages provides HTTPS automatically.

**Songs not loading:**
→ Check browser console for Firebase config errors. Verify `projectId` is correct.

**OCR not working:**
→ Tesseract.js requires a modern browser with WebAssembly support. Ensure the app is served over HTTPS.

---

## 📞 Support

For configuration assistance, check the Firebase documentation at [https://firebase.google.com/docs](https://firebase.google.com/docs).
