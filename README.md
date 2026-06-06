# RCCM GigBook — Guitar Chords, Lyrics & Setlist PWA

A Progressive Web App (PWA) for managing guitar chords, lyrics, and setlists. Built with HTML, Tailwind CSS, Firebase Firestore, and Firebase Authentication.

---

## 📁 Required File Structure

```
/
├── index.html              ← Main app (single-file PWA)
├── manifest.json           ← PWA manifest
├── README.md               ← This file
└── icons/
    ├── logo.png            ← App logo used on splash/sign-in page (required!)
    ├── icon-192.png        ← PWA icon 192×192px
    └── icon-512.png        ← PWA icon 512×512px
```

> ⚠️ **IMPORTANT:** The `icons/logo.png` file must exist for the splash screen branding to display correctly. This is the ONLY accepted source for the logo — no external URLs or generated fallbacks are used.

---

## 🔥 Firebase Setup

### Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add Project"** → Name it (e.g. `rccm-gigbook`)
3. Disable Google Analytics (optional) → **Create Project**

### Step 2: Enable Google Authentication

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Enable **Google** provider
3. Set **Project support email** (required)
4. Click **Save**

### Step 3: Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose your region (e.g. `us-central1`)

### Step 4: Set Firestore Security Rules

Go to **Firestore Database → Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      // Admin can write any user doc
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }

    // Songs - anyone logged in can read; only authorized roles can write
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin'] ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canAddSongs == true ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canDeleteSongs == true);
    }

    // Setlists - authenticated users can read public setlists and their own
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.createdByUid == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['Admin', 'Sub-Admin', 'Lead']);
    }

    // App settings - only Admin can write
    match /settings/{docId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'Admin';
    }
  }
}
```

### Step 5: Register a Web App

1. In Firebase Console → **Project Overview** → click **`</>`** (Web icon)
2. Register app with a nickname (e.g. `rccm-gigbook-web`)
3. **Do NOT** enable Firebase Hosting yet (you'll use GitHub Pages)
4. Copy the `firebaseConfig` object shown

### Step 6: Configure the App

In `index.html`, find this section and replace with your config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Step 7: Add Authorized Domain for Auth

1. Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your GitHub Pages domain: `danaglinao0522.github.io`

---

## 🌐 GitHub Pages Deployment

1. Push all files to your GitHub repo: `danaglinao0522/rccm-gigbook`
2. Go to **Settings → Pages**
3. Source: **Deploy from a branch** → Branch: `main` → Folder: `/ (root)`
4. Your app will be live at: `https://danaglinao0522.github.io/rccm-gigbook/`

---

## 📱 manifest.json Configuration

Create a `manifest.json` file in your project root:

```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics & Setlist App for RCCM",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#0b0f19",
  "theme_color": "#0b0f19",
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
  ]
}
```

---

## 👤 Role System

| Role | Setlist Limit | Song View | Can Create Songs | Special Access |
|------|--------------|-----------|-----------------|----------------|
| **Admin** (`buenavistaaglinaodanny@gmail.com`) | Unlimited | Full | ✅ | Everything + Theme Panel |
| **Sub-Admin** | 5 | Full | ✅ | User directory, Group setlists |
| **Lead/Facilitator** | 5 | Full | ❌ | Group setlists, User directory |
| **Musician** | 2 | Chords + Lyrics | ❌ | Lyrics-only toggle |
| **Singer** | 2 | Lyrics only | ❌ | — |
| **Tech** | 2 | Lyrics only | ❌ | Sees all setlists/songs |

---

## 📋 Onboarding Flow

1. **First-time users** are shown a role selection screen
2. **Musician** → selects instruments (Guitar, Keyboard, Djembe) + optional Singer/Tech tags
3. **Singer** → locked to Lyrics-Only view automatically
4. **Tech** → can view all songs and all setlists regardless of visibility

---

## ⏱ Setlist Expiration

All setlists are **automatically deleted after 1 month** from their creation date. Users are notified of this upon creating a setlist.

---

## 🎨 Theme Presets (Admin Only)

| Preset | Background | Buttons | Chords |
|--------|-----------|---------|--------|
| Worship Night Dark | `#0b0f19` | `#4338ca` | `#fbbf24` |
| Clean Modern Light | `#f8fafc` | `#059669` | `#dc2626` |
| Cyberpunk Sanctuary | `#121214` | `#06b6d4` | `#eab308` |

---

## 🔧 Chord Sheet Format

Use this format when entering chord sheets:

```
[Verse 1]
G        Em
Amazing grace how sweet the sound
C          G
That saved a wretch like me

[Chorus]
G      D      Em
How great Thou art
C         G
How great Thou art
```

- Lines starting with `[` and ending with `]` are section labels
- Lines with only chord symbols (A-G with optional modifiers) are chord lines
- All other lines are treated as lyrics

---

## 🛠 OCR Text Extraction

The app includes a built-in OCR tool powered by **Tesseract.js**:

1. In the "Add New Song" form, scroll to **Media Extraction Toolkit**
2. Click **Upload Image** or **Camera OCR**
3. The engine extracts text from the image
4. Review/edit the text in the output box
5. Click **Apply to Chord Sheet** to insert it

---

## 📞 Support

For technical issues with Firebase configuration, refer to:
- [Firebase Docs](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth/web/google-signin)
- [Firestore Getting Started](https://firebase.google.com/docs/firestore/quickstart)
