# 🎸 GigBook – Setup Instructions

## Overview
GigBook is a Progressive Web App (PWA) for Guitar Chords, Lyrics & Setlists.
- **Hosting**: GitHub Pages (free)
- **Database & Auth**: Firebase (Firestore + Google Auth)
- **Songs Data**: `songs-data.js` (flat file, loaded by HTML)

---

## STEP 1: Firebase Project Setup

### 1a. Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click **"Add project"** → Name it `gigbook-app` → Continue
3. Disable Google Analytics (optional) → **Create project**

### 1b. Enable Google Authentication
1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click **Google** → Enable → Set support email → **Save**

### 1c. Create Firestore Database
1. In Firebase Console → **Firestore Database** → **Create database**
2. Choose **Production mode** → Select your region → **Enable**
3. Go to **Rules** tab → Replace with:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    // Songs: anyone logged in can read, only admins can write
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    // Setlists: users can read/write their own setlists
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```
4. Click **Publish**

### 1d. Register Web App & Get Config
1. In Firebase Console → Project settings (gear icon) → **General**
2. Under "Your apps" → Click **</>** (Web)
3. App nickname: `GigBook Web` → **Register app**
4. Copy the `firebaseConfig` object — you'll need it in the next step

### 1e. Add Authorized Domains
1. Firebase Console → Authentication → **Settings** → **Authorized domains**
2. Add: `your-username.github.io`

---

## STEP 2: Update Firebase Config in App

Open `index.html` and find this section (~line 60):

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

Replace with your actual Firebase config values from Step 1d.

---

## STEP 3: GitHub Pages Hosting

### 3a. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `gigbook` (or anything you prefer)
3. Set to **Public**
4. Click **Create repository**

### 3b. Upload Files
Upload these files to your repository:
```
index.html        ← Main app
songs-data.js     ← Song library data
manifest.json     ← PWA manifest
sw.js             ← Service worker (offline support)
```

**Method A – GitHub Web UI:**
1. Go to your repo → **Add file** → **Upload files**
2. Drag all 4 files → **Commit changes**

**Method B – Git CLI:**
```bash
git init
git add index.html songs-data.js manifest.json sw.js
git commit -m "Initial GigBook release"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gigbook.git
git push -u origin main
```

### 3c. Enable GitHub Pages
1. Go to your repo → **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: **main** → Folder: **/ (root)** → **Save**
4. Wait 1-2 minutes → Your app URL: `https://YOUR_USERNAME.github.io/gigbook/`

---

## STEP 4: Install as PWA on Devices

### iOS (Safari):
1. Open `https://YOUR_USERNAME.github.io/gigbook/` in **Safari**
2. Tap the **Share** button (square with arrow)
3. Scroll down → **"Add to Home Screen"**
4. Tap **Add** → App icon appears on home screen ✅

### Android (Chrome):
1. Open the URL in **Chrome**
2. Tap the **3-dot menu** → **"Add to Home screen"**
   OR look for the **install banner** at the bottom of the screen
3. Tap **Install** → App icon appears on home screen ✅

---

## STEP 5: Admin Setup

### Set Yourself as Admin
1. Open the app and sign in with `buenavistaaglinaodanny@gmail.com`
2. The app automatically grants admin privileges to this email
3. You'll see the **🛡️ Admin Panel** option in the user menu

### Admin Capabilities:
- ➕ Add, edit, delete songs
- 📷 Scan chord sheets via camera (OCR)
- 👥 View all users and manage admin roles
- 📋 Manage all setlists

---

## STEP 6: Adding Songs (Admin Only)

### Manual Entry:
1. Click **+ Add Song** button in the library
2. Fill in: Title, Artist, Key, Tempo, Genre, Tags
3. In the **Chords & Lyrics** field, use this format:
```
[Verse 1]
[C]Amazing grace how [Am]sweet the sound
That [F]saved a wretch like [C]me

[Chorus]
[G]My chains are [D]gone I've been set [Em]free
```

### Via Image Scan (OCR):
1. Click **+ Add Song**
2. Under "Scan Chord Sheet Image" → tap **Choose File**
3. Take a photo or upload an image of a printed chord sheet
4. Wait for OCR to extract the text
5. Review and edit the extracted content → **Save Song**

---

## STEP 7: Updating songs-data.js (Backup/Offline Data)

The `songs-data.js` file is the **fallback data source** when Firebase is unavailable.
After adding songs via the app, export them:

1. Open Firebase Console → Firestore → `songs` collection
2. Export documents (or manually copy data)
3. Update `songs-data.js` with the exported songs
4. Push to GitHub

---

## Data Structure Reference

### Song Object:
```javascript
{
  id: "song_001",
  title: "Wonderwall",
  artist: "Oasis",
  key: "Em",          // Original key
  tempo: 87,           // BPM
  genre: "Rock",
  tags: ["90s", "acoustic"],
  content: "...",      // Chord+lyric sheet text
  addedBy: "user_uid",
  addedAt: "2024-01-15"
}
```

### Setlist Object:
```javascript
{
  id: "setlist_001",
  name: "Sunday Worship",
  songs: ["song_001", "song_002"],  // Max 4 song IDs
  createdBy: "user_uid",
  createdAt: "2024-01-20"
}
```

---

## Troubleshooting

**"Sign-in failed" error:**
- Ensure the app domain is added in Firebase Auth → Authorized domains
- Check that Google sign-in is enabled in Firebase Auth

**OCR not working:**
- OCR requires internet (loads Tesseract.js from CDN)
- Best results with clear, well-lit photos of printed text
- Handwritten chords work less reliably

**App not installing on iOS:**
- Must use Safari browser (not Chrome) on iOS
- The URL must be HTTPS (GitHub Pages provides this automatically)

**Songs not loading:**
- Check Firebase config values are correct
- Verify Firestore rules allow authenticated reads
- App falls back to `songs-data.js` if Firebase unavailable

---

## Support

Admin Email: buenavistaaglinaodanny@gmail.com

For issues or questions, open an issue on GitHub.
