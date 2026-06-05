# 🎸 ChordBook — Guitar Chords, Lyrics & Setlist App

A Progressive Web App (PWA) for managing guitar chord sheets, lyrics, and setlists. Installable on iOS and Android. Hosted on GitHub Pages with Firebase as the backend.

---

## 📋 What You'll Need
- A **GitHub account**
- A **Firebase account** (free)
- A **Google account** (same one used for Firebase)

---

## 🚀 Step-by-Step Setup

### STEP 1 — Create a Firebase Project

1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → Enter name (e.g. `ChordBook`) → Continue
3. Disable Google Analytics (optional) → **Create project**

---

### STEP 2 — Enable Google Sign-In

1. In Firebase Console → **Authentication** → **Get started**
2. Click **Google** under Sign-in providers
3. Toggle **Enable** → Enter your **support email** → **Save**

---

### STEP 3 — Set Up Firestore Database

1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (we'll add rules later) → **Next**
3. Pick a server location close to you → **Enable**

---

### STEP 4 — Add Firestore Security Rules

1. In Firestore → **Rules** tab → Replace all content with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Songs: anyone logged in can read, only admins can write
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    // Users: users can read/write their own profile
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

2. Click **Publish**

---

### STEP 5 — Get Your Firebase Config

1. In Firebase Console → ⚙️ **Project Settings** (gear icon, top left)
2. Scroll to **"Your apps"** → Click **</>** (Web app)
3. Register app with name `ChordBook` → **Continue**
4. Copy the `firebaseConfig` object shown — it looks like:

```js
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

---

### STEP 6 — Update index.html with Your Config

1. Open `index.html` in a text editor
2. Find the section marked:
   ```
   // 🔥 FIREBASE CONFIGURATION — Replace with your own project config
   ```
3. Replace the placeholder `firebaseConfig` values with **your actual values** from Step 5

---

### STEP 7 — Add Authorized Domain in Firebase

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Add your GitHub Pages domain: `yourusername.github.io`

---

### STEP 8 — Upload to GitHub Pages

1. Create a new **public** GitHub repository (e.g. `chordbook`)
2. Upload all these files to the repo:
   - `index.html`
   - `songs-data.js`
   - `manifest.json`
   - `sw.js`
   - `README.md`
3. Go to repo **Settings** → **Pages**
4. Under **Source**: Select branch `main`, folder `/ (root)` → **Save**
5. Your app will be live at: `https://yourusername.github.io/chordbook`

---

### STEP 9 — Install on Phone

**On iPhone (iOS Safari):**
1. Open the app URL in **Safari**
2. Tap the **Share** button (box with arrow up)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **Add** — the app icon appears on your home screen!

**On Android (Chrome):**
1. Open the app URL in **Chrome**
2. Tap the **3-dot menu** (top right)
3. Tap **"Add to Home screen"** or **"Install app"**
4. Tap **Install** — done!

---

## 👤 Admin Account

The admin email is: **buenavistaaglinaodanny@gmail.com**

Admin can:
- ➕ Add, ✏️ edit, 🗑️ delete songs
- 👥 View all users and assign/remove admin roles
- 📷 Scan/upload images to extract chord sheets via OCR

---

## 🎵 Adding Songs

**Manual Entry:**
1. Sign in as admin → tap **Admin** tab in Profile
2. Tap **"Add New Song"**
3. Fill in Title, Artist, Key, Genre
4. In the **Chord Sheet** field, format like this:

```
[Verse 1]
G        Em
Here are the lyrics with chords above
C        D
Second line of verse

[Chorus]
Am   F   C   G
This is the chorus line
```

**Via Image Scan (OCR):**
1. In Add Song screen, tap the **📷 Scan or Upload Image** area
2. Take a photo or select an existing image of the chord sheet
3. The app will automatically extract the text
4. Review and adjust the extracted text before saving

---

## 📁 songs-data.js

- All sample songs are stored in `songs-data.js`
- This file is auto-loaded and seeded to Firestore on first run
- After first run, songs are managed entirely via Firestore
- You can pre-populate songs by editing this file before first launch

---

## 🔧 Updating Songs via GitHub

If Firebase is unavailable, songs fall back to `songs-data.js`:
1. Edit `songs-data.js` to add/modify songs
2. Commit and push to GitHub — the app updates automatically

---

## ✅ Features Summary

| Feature | Details |
|---|---|
| 🔑 Google Sign-in | Firebase Authentication |
| 🎸 Chord Sheets | Full chord + lyrics display |
| 🔄 Key Transpose | Shift ±12 semitones or pick manually |
| 🎤 Lyrics-Only Mode | Singer mode hides chords |
| 📋 Setlists | Up to 4 songs per setlist |
| 👆 Swipe Navigation | Swipe left/right through setlist songs |
| 📷 OCR Scan | Extract chord sheets from images |
| 🔍 Search & Filter | Filter by genre or search by title/artist |
| 👑 Admin Panel | Manage songs and users |
| 📲 PWA Install | Works on iOS and Android |
| 🌐 Offline Ready | Cached for offline use |

---

*Questions? Contact the admin at buenavistaaglinaodanny@gmail.com*
