# 🎸 RCCM GigBook — Guitar Chords, Lyrics & Setlist PWA

A full-featured Progressive Web App for musicians, singers, and worship teams.  
Built with HTML, Tailwind CSS, Iconify, and Firebase Firestore. Deployable to GitHub Pages.

---

## 🚀 Quick Setup Guide

### Step 1 — Clone the Repository

```bash
git clone https://github.com/danaglinao0522/rccm-gigbook.git
cd rccm-gigbook
```

---

### Step 2 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Name it `rccm-gigbook` → Continue
3. Disable Google Analytics (optional) → Click **"Create project"**

---

### Step 3 — Enable Firebase Authentication

1. In your Firebase project, go to **Build → Authentication**
2. Click **"Get started"**
3. Under **Sign-in method**, enable **Google**
4. Add your GitHub Pages domain to the **Authorized domains** list:
   ```
   danaglinao0522.github.io
   ```

---

### Step 4 — Enable Cloud Firestore

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development
4. Select a region close to your users → Click **"Enable"**

> **Security Rules (Recommended for Production):**
> ```js
> rules_version = '2';
> service cloud.firestore {
>   match /databases/{database}/documents {
>     match /songs/{songId} {
>       allow read: if request.auth != null;
>       allow write: if request.auth != null && 
>         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in 
>         ['admin', 'sub-admin', 'lead'];
>     }
>     match /setlists/{setlistId} {
>       allow read: if request.auth != null;
>       allow write: if request.auth != null;
>     }
>     match /users/{userId} {
>       allow read: if request.auth != null;
>       allow write: if request.auth != null && request.auth.uid == userId;
>       allow write: if request.auth != null && 
>         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
>     }
>     match /settings/{docId} {
>       allow read: if request.auth != null;
>       allow write: if request.auth != null && 
>         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email == 
>         'buenavistaaglinaodanny@gmail.com';
>     }
>   }
> }
> ```

---

### Step 5 — Get Firebase Config Keys

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Under **"Your apps"**, click **"Add app"** → choose **Web (</>)**
3. Register app name: `rccm-gigbook-web` → Click **"Register app"**
4. Copy the config object shown:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "rccm-gigbook.firebaseapp.com",
  projectId: "rccm-gigbook",
  storageBucket: "rccm-gigbook.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

5. Open `index.html` and replace the placeholder config at line ~35:
```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",            // ← Replace this
  authDomain: "YOUR_AUTH_DOMAIN",    // ← Replace this
  projectId: "YOUR_PROJECT_ID",      // ← Replace this
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

### Step 6 — Set Up Admin Account

1. Sign in to the app with the account: `buenavistaaglinaodanny@gmail.com`
2. After role selection, manually update the Firestore document:
   - Go to **Firestore → users → [your UID]**
   - Set field `role` to `"admin"`
3. The app will now recognize this email as the permanent system Admin

---

### Step 7 — Create PWA Icons

Create an `/icons/` folder in the project root and add:

| File | Size | Purpose |
|------|------|---------|
| `icon-192.png` | 192×192px | Android home screen, splash |
| `icon-512.png` | 512×512px | PWA install prompt, splash screen |
| `icon-maskable-192.png` | 192×192px | Android adaptive icon (safe zone) |
| `icon-maskable-512.png` | 512×512px | Android adaptive icon large |

**Recommended:** Use [https://realfavicongenerator.net](https://realfavicongenerator.net) to generate all sizes from a single source image.

---

### Step 8 — Create `manifest.json`

Create `manifest.json` in the project root:

```json
{
  "name": "RCCM GigBook",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics & Setlist App for Worship Teams",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1e1b4b",
  "background_color": "#1e1b4b",
  "categories": ["music", "utilities", "productivity"],
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-maskable-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-maskable-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "screenshots/home.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow",
      "label": "Songs Feed"
    }
  ]
}
```

---

### Step 9 — Deploy to GitHub Pages

1. Push all files to your `main` branch:
```bash
git add .
git commit -m "Initial GigBook deployment"
git push origin main
```

2. In GitHub repo → **Settings → Pages**
3. Set Source to: **Deploy from branch → main → / (root)**
4. Your app will be live at:
   ```
   https://danaglinao0522.github.io/rccm-gigbook/
   ```

---

## 📁 Project File Structure

```
rccm-gigbook/
├── index.html              ← Main app (self-contained)
├── manifest.json           ← PWA manifest (create manually)
├── README.md               ← This file
└── icons/
    ├── icon-192.png        ← Required
    ├── icon-512.png        ← Required
    ├── icon-maskable-192.png
    └── icon-maskable-512.png
```

---

## 👥 Role Hierarchy

| Role | Setlists | Songs/Setlist | Chords View | Edit Songs | Manage Users |
|------|----------|--------------|-------------|------------|--------------|
| Admin | Unlimited | Unlimited | ✅ | ✅ | ✅ Full |
| Sub-Admin | 15 | Unlimited | ✅ | ✅ | ✅ Limited |
| Lead | 15 | Unlimited | ✅ | ✅ | ❌ |
| Musician | 5 | 4 | ✅ Toggle | ❌ | ❌ |
| Singer | 5 | 4 | ❌ Lyrics Only | ❌ | ❌ |
| Tech | 5 | 4 | ❌ Lyrics Only | ❌ | ❌ |

---

## 🎵 Chord Sheet Format

Songs use inline bracket notation for chord placement:

```
[G]Amazing [D]grace, how [Em]sweet the [C]sound
That [G]saved a [D]wretch like [G]me
I [G]once was [D]lost, but [Em]now am [C]found
Was [G]blind, but [D]now I [G]see
```

The app auto-transposes all `[Chord]` tokens when shifting keys.  
For Singers/Tech in Lyrics Only mode, all `[Chord]` tokens are stripped before rendering.

---

## 🔧 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Install App" button not showing | App must be served over HTTPS (GitHub Pages is fine) |
| Google Sign-In fails | Ensure your domain is in Firebase Auth → Authorized Domains |
| Firestore permission denied | Check security rules and user role in Firestore |
| Icons not loading | Verify `/icons/` folder exists with correct filenames |
| App not updating live theme | Ensure Firestore real-time listeners are active (check browser console) |

---

## 📱 iOS Installation

1. Open the app URL in **Safari** (not Chrome)
2. Tap the **Share button** (box with arrow)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **"Add"** → App appears on your home screen

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, Tailwind CSS (Browser CDN v4), Iconify Icons
- **Backend:** Firebase Firestore (real-time NoSQL)
- **Auth:** Firebase Authentication (Google OAuth)
- **PWA:** Web App Manifest + `beforeinstallprompt` API
- **Hosting:** GitHub Pages (static, HTTPS)

---

*Built for RCCM worship teams. For support, contact the system administrator.*
