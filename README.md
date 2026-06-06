# GigBook — Guitar Chords, Lyrics & Setlist PWA

A Progressive Web App for managing guitar chord sheets, lyrics, and setlists. Built with HTML, Tailwind CSS, Iconify, and Firebase Firestore for real-time syncing.

---

## 🚀 Quick Setup Guide

### Step 1: Create a Firebase Project

1. Go to [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Click **"Add Project"** → name it `rccm-gigbook` → click through the setup wizard.
3. Once the project is created, go to **Project Settings** (gear icon) → **General** tab.
4. Under **"Your apps"**, click **"Add app"** → choose the **Web** icon (`</>`).
5. Register the app (nickname: `GigBook`) and copy the `firebaseConfig` object.

### Step 2: Enable Google Authentication

1. In the Firebase Console sidebar, go to **Authentication** → **Sign-in method**.
2. Click **Google** → enable it → set your project support email → click **Save**.
3. Under **Authorized domains**, add your GitHub Pages domain:
   ```
   danaglinao0522.github.io
   ```

### Step 3: Set Up Firestore Database

1. In the Firebase Console sidebar, go to **Firestore Database**.
2. Click **"Create database"** → choose **"Start in test mode"** for initial setup → select your region → click **Enable**.
3. After testing, go to **Rules** and replace the test rule with the following security rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      // Admin can write any user profile
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email == 'buenavistaaglinaodanny@gmail.com';
    }

    // Songs — authenticated read; privileged write
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin','subadmin','lead']
         || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canAddSongs == true);
      allow update, delete: if request.auth != null &&
        (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin','subadmin']
         || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.canDeleteSongs == true);
    }

    // Setlists — authenticated access with ACL enforcement in-app
    match /setlists/{setlistId} {
      allow read, write: if request.auth != null;
    }

    // App settings — admin-only write
    match /settings/{doc} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.email == 'buenavistaaglinaodanny@gmail.com';
    }
  }
}
```

### Step 4: Update the Firebase Config in `index.html`

Open `index.html` and find the `firebaseConfig` object near the top of the `<script type="module">` block. Replace the placeholder values with your actual Firebase project credentials:

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

## 📦 PWA Assets Setup

### Create the `/icons/` Folder

In the root of your repository, create a folder called `icons/` and place the following files inside:

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192×192 px | Standard PWA icon / Android |
| `icon-512.png` | 512×512 px | Large PWA splash icon |
| `icon-192-maskable.png` | 192×192 px | Maskable icon for Android adaptive icons |
| `logo.png` | Any (recommended 256×256 px) | Custom brand logo shown on Sign-In page |

> **Tip:** You can generate all icon sizes for free at [https://realfavicongenerator.net/](https://realfavicongenerator.net/) or [https://maskable.app/](https://maskable.app/).

---

## 📄 `manifest.json` Configuration

Create a file called `manifest.json` in the **root** of your repository with the following content:

```json
{
  "name": "GigBook — Chords & Setlists",
  "short_name": "GigBook",
  "description": "Guitar Chords, Lyrics and Setlist Progressive Web App",
  "start_url": "/rccm-gigbook/",
  "scope": "/rccm-gigbook/",
  "display": "standalone",
  "orientation": "portrait-primary",
  "background_color": "#0b0f19",
  "theme_color": "#0b0f19",
  "categories": ["music", "utilities"],
  "icons": [
    {
      "src": "icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "icons/icon-192-maskable.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any"
    }
  ],
  "screenshots": [],
  "related_applications": [],
  "prefer_related_applications": false
}
```

> **Important:** The `start_url` and `scope` must match your GitHub Pages subdirectory path exactly.  
> If your repository is at `https://danaglinao0522.github.io/rccm-gigbook/`, then both values should be `/rccm-gigbook/`.

---

## 🌐 GitHub Pages Deployment

1. Push all files (`index.html`, `manifest.json`, `icons/` folder, `README.md`) to the `main` branch of your repository.
2. Go to your GitHub repository → **Settings** → **Pages**.
3. Under **Source**, select `Deploy from a branch` → choose `main` → folder `/root`.
4. Click **Save**. Your app will be live at:
   ```
   https://danaglinao0522.github.io/rccm-gigbook/
   ```
5. After the first deployment, go back to Firebase → **Authentication** → **Authorized domains** and confirm `danaglinao0522.github.io` is listed.

---

## 🔑 Admin Account Setup

The master Admin account is pre-configured to the following email address:

```
buenavistaaglinaodanny@gmail.com
```

When this Google account signs in for the first time, the system will automatically:
- Skip the onboarding role selection screen.
- Assign the `admin` role automatically in Firestore.
- Grant access to the Custom Theme panel and Role Configuration panel.
- Unlock unlimited setlist creation and song management.

This email is hardcoded in `index.html` as the `ADMIN_EMAIL` constant. **Do not change it** unless you intend to transfer admin ownership.

---

## ⚙️ Logo Toggle Configuration

Inside `index.html`, near the top of the `<script type="module">` block, you will find:

```javascript
const USE_LOCAL_LOGO = true; // Toggle: true = icons/logo.png, false = fallback icon
```

- **`true`** → Loads `icons/logo.png` as the brand logo on the Sign-In page (fully offline-capable).
- **`false`** → Displays the default guitar icon from Iconify as a fallback.

---

## 📱 iOS Installation Instructions (for end-users)

1. Open the app URL in **Safari** on iPhone or iPad.
2. Tap the **Share** button (box with upward arrow) at the bottom of the screen.
3. Scroll down and tap **"Add to Home Screen"**.
4. Confirm the app name and tap **"Add"**.
5. The app will appear on your Home Screen and run in full-screen standalone mode.

> **Note:** iOS does not support the `beforeinstallprompt` event, so the in-app "Install App" button will not appear on iOS Safari. Use the native share sheet method above.

---

## 🤖 Android Installation Instructions (for end-users)

1. Open the app URL in **Chrome** on your Android device.
2. Tap the **three-dot menu** (⋮) in the top-right corner.
3. Tap **"Add to Home screen"** or **"Install app"**.
4. Confirm by tapping **"Install"** in the popup dialog.
5. The app will be installed and available from your app drawer and home screen.

> **Alternatively:** The in-app **"Install App"** button will appear automatically on Android Chrome if the PWA install criteria are met (HTTPS, manifest, service worker). Tapping it will trigger the native install prompt directly.

---

## 📋 File Structure Overview

```
rccm-gigbook/
├── index.html          ← Complete single-page application
├── manifest.json       ← PWA manifest (create this manually)
├── README.md           ← This file
└── icons/
    ├── logo.png        ← Custom brand logo (Sign-In page)
    ├── icon-192.png    ← PWA icon (192×192)
    ├── icon-192-maskable.png  ← Maskable PWA icon (192×192)
    └── icon-512.png    ← Large PWA icon (512×512)
```

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| HTML5 | Single-file app structure |
| Tailwind CSS (Browser CDN) | Utility-first styling |
| Iconify (v2.1.0) | Icon system |
| Firebase Auth | Google Sign-In authentication |
| Firebase Firestore | Real-time cloud database |
| PWA APIs | Install prompt, standalone mode, offline capability |
| History API | URL lock to GitHub Pages base path |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---|---|
| "Sign in" popup blocked | Allow popups for your domain in browser settings |
| Firebase permission denied | Check Firestore security rules — ensure test mode is active or rules are correct |
| App not installable | Ensure site is served over HTTPS and `manifest.json` is present and valid |
| Logo not showing | Confirm `icons/logo.png` exists and `USE_LOCAL_LOGO` is set to `true` |
| Real-time sync not working | Check Firebase project ID and API key in the config — open browser console for errors |
| Songs not seeding | Make sure Firestore rules allow `admin` writes, or temporarily use test mode rules |

---

*GigBook — Built for worship teams, bands, and performers.*
