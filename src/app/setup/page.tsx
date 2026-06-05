import Link from "next/link";

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Nav */}
      <nav className="sticky top-0 bg-slate-950/90 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center gap-4 z-50">
        <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1">
          ← Back
        </Link>
        <span className="text-2xl">🎸</span>
        <h1 className="font-bold text-lg text-white">GigBook – Setup Guide</h1>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-10">

        {/* Overview */}
        <div className="bg-indigo-950 border border-indigo-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-indigo-300 mb-3">📌 Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "App File", value: "index.html (single file)", icon: "📄" },
              { label: "Hosting", value: "GitHub Pages (free)", icon: "🌐" },
              { label: "Backend", value: "Firebase (Auth + Firestore)", icon: "🔥" },
            ].map(item => (
              <div key={item.label} className="bg-indigo-900/40 rounded-xl p-4">
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xs text-indigo-400 font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-white font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1 */}
        <Step number={1} title="Create Firebase Project" color="orange">
          <ol className="space-y-3 text-sm text-slate-300">
            <li><strong className="text-white">1.</strong> Go to <a href="https://console.firebase.google.com" target="_blank" className="text-indigo-400 hover:underline">console.firebase.google.com</a></li>
            <li><strong className="text-white">2.</strong> Click <Badge>Add project</Badge> → Name it <code className="bg-slate-800 px-1 rounded">gigbook-app</code> → Continue</li>
            <li><strong className="text-white">3.</strong> Firebase Console → <Badge>Authentication</Badge> → Sign-in method → Enable <Badge color="blue">Google</Badge> → Save</li>
            <li><strong className="text-white">4.</strong> Firebase Console → <Badge>Firestore Database</Badge> → Create database → Production mode → Enable</li>
            <li><strong className="text-white">5.</strong> Go to Firestore <Badge>Rules</Badge> tab and paste the security rules below</li>
          </ol>

          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Firestore Security Rules:</p>
            <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-green-300 overflow-x-auto leading-relaxed">{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    match /songs/{songId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid))
          .data.isAdmin == true;
    }
    match /setlists/{setlistId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid))
           .data.isAdmin == true);
    }
  }
}`}</pre>
          </div>
        </Step>

        {/* Step 2 */}
        <Step number={2} title="Get Firebase Config & Update App" color="yellow">
          <ol className="space-y-3 text-sm text-slate-300">
            <li><strong className="text-white">1.</strong> Firebase Console → ⚙️ Project Settings → General → Your apps → Click <Badge>{"</>"}</Badge> (Web)</li>
            <li><strong className="text-white">2.</strong> App nickname: <code className="bg-slate-800 px-1 rounded">GigBook</code> → Register app</li>
            <li><strong className="text-white">3.</strong> Copy the <code className="bg-slate-800 px-1 rounded">firebaseConfig</code> object</li>
            <li><strong className="text-white">4.</strong> Open <code className="bg-slate-800 px-1 rounded">index.html</code> and find the config section (around line 60)</li>
            <li><strong className="text-white">5.</strong> Replace the placeholder values with your actual config</li>
            <li><strong className="text-white">6.</strong> Add your GitHub Pages domain to Firebase Auth → Settings → <Badge color="blue">Authorized domains</Badge></li>
          </ol>

          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Find & replace this in index.html:</p>
            <pre className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs text-yellow-300 overflow-x-auto">{`const firebaseConfig = {
  apiKey: "YOUR_API_KEY",           // ← Replace
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};`}</pre>
          </div>
        </Step>

        {/* Step 3 */}
        <Step number={3} title="Deploy to GitHub Pages" color="green">
          <ol className="space-y-3 text-sm text-slate-300">
            <li><strong className="text-white">1.</strong> Go to <a href="https://github.com/new" target="_blank" className="text-indigo-400 hover:underline">github.com/new</a> → Create a public repo named <code className="bg-slate-800 px-1 rounded">gigbook</code></li>
            <li><strong className="text-white">2.</strong> Upload these 4 files to the repository root:</li>
          </ol>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-4">
            {["index.html", "songs-data.js", "manifest.json", "sw.js"].map(f => (
              <div key={f} className="bg-slate-800 border border-slate-700 rounded-lg p-2 text-center">
                <div className="text-lg mb-1">📄</div>
                <code className="text-xs text-green-400">{f}</code>
              </div>
            ))}
          </div>

          <ol className="space-y-3 text-sm text-slate-300" start={3}>
            <li><strong className="text-white">3.</strong> Repo Settings → <Badge>Pages</Badge> → Source: Deploy from branch → Branch: main → / (root) → Save</li>
            <li><strong className="text-white">4.</strong> Wait ~2 minutes → Your app: <code className="bg-slate-800 px-1 rounded text-indigo-400">https://USERNAME.github.io/gigbook/</code></li>
          </ol>

          <div className="mt-4 bg-slate-900 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400 mb-2 font-semibold">OR use Git CLI:</p>
            <pre className="text-xs text-green-300 leading-relaxed">{`git init
git add index.html songs-data.js manifest.json sw.js
git commit -m "Initial GigBook"
git branch -M main
git remote add origin https://github.com/USERNAME/gigbook.git
git push -u origin main`}</pre>
          </div>
        </Step>

        {/* Step 4 */}
        <Step number={4} title="Install as App on Devices" color="purple">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="text-2xl mb-2">🍎</div>
              <h4 className="font-bold text-white mb-2">iOS (Safari)</h4>
              <ol className="text-sm text-slate-300 space-y-1">
                <li>1. Open app URL in <strong className="text-white">Safari</strong></li>
                <li>2. Tap the <strong className="text-white">Share button</strong> (↑)</li>
                <li>3. Scroll → <Badge color="blue">Add to Home Screen</Badge></li>
                <li>4. Tap <strong className="text-white">Add</strong> ✅</li>
              </ol>
              <p className="text-xs text-slate-500 mt-2">⚠️ Must use Safari — Chrome on iOS won&apos;t show the install option</p>
            </div>
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-4">
              <div className="text-2xl mb-2">🤖</div>
              <h4 className="font-bold text-white mb-2">Android (Chrome)</h4>
              <ol className="text-sm text-slate-300 space-y-1">
                <li>1. Open app URL in <strong className="text-white">Chrome</strong></li>
                <li>2. Tap <strong className="text-white">3-dot menu</strong> (⋮)</li>
                <li>3. Tap <Badge color="blue">Add to Home screen</Badge></li>
                <li>4. OR wait for install banner ✅</li>
              </ol>
              <p className="text-xs text-slate-500 mt-2">✅ Works with Chrome, Edge, or Samsung Internet</p>
            </div>
          </div>
        </Step>

        {/* Step 5 */}
        <Step number={5} title="Admin Features (buenavistaaglinaodanny@gmail.com)" color="red">
          <p className="text-sm text-slate-300 mb-4">
            Sign in with the admin email to automatically get admin privileges. No setup needed.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "➕", title: "Add Songs", desc: "Add chords/lyrics manually or scan a printed chord sheet via camera" },
              { icon: "✏️", title: "Edit & Delete", desc: "Edit song details, key, content, or remove songs from library" },
              { icon: "📷", title: "OCR Image Scan", desc: "Photograph any printed chord sheet — Tesseract.js extracts the text" },
              { icon: "👥", title: "User Management", desc: "View all users, assign admin role, or remove admin access" },
            ].map(f => (
              <div key={f.title} className="bg-slate-900 border border-slate-700 rounded-xl p-4">
                <div className="text-xl mb-1">{f.icon}</div>
                <div className="font-semibold text-white text-sm">{f.title}</div>
                <div className="text-xs text-slate-400 mt-1">{f.desc}</div>
              </div>
            ))}
          </div>
        </Step>

        {/* Chord format guide */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h3 className="font-bold text-white text-lg mb-4">📝 Chord Sheet Format Guide</h3>
          <p className="text-sm text-slate-400 mb-4">Use bracket notation for chords: <code className="bg-slate-800 px-1 rounded text-yellow-400">[C]</code>, <code className="bg-slate-800 px-1 rounded text-yellow-400">[Am]</code>, <code className="bg-slate-800 px-1 rounded text-yellow-400">[F#m7]</code></p>
          <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs leading-relaxed overflow-x-auto">{`[Verse 1]
[C]Amazing grace, how [Am]sweet the sound
That [F]saved a wretch like [C]me
[C]I once was [Am]lost but now am [F]found
Was [G]blind but now I [C]see

[Chorus]
[G]My chains are [D]gone
I've been set [Em]free
My [C]God my [G]Savior has [D]ransomed me`}</pre>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="bg-purple-900/60 text-purple-300 px-2 py-1 rounded">Section labels: [Verse 1], [Chorus], [Bridge]</span>
            <span className="bg-yellow-900/60 text-yellow-300 px-2 py-1 rounded">Chords: [C], [Am], [F#m7], [Dsus4]</span>
            <span className="bg-green-900/60 text-green-300 px-2 py-1 rounded">Bass: [C/E], [G/B]</span>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6">
          <h3 className="font-bold text-white text-lg mb-4">🔧 Troubleshooting</h3>
          <div className="space-y-3">
            {[
              { q: "Sign-in fails with 'auth/unauthorized-domain'", a: "Add your GitHub Pages domain to Firebase Auth → Authorized domains" },
              { q: "OCR doesn't extract chords correctly", a: "Use high-contrast printed text. Best with black ink on white paper. Handwriting is less accurate." },
              { q: "App not installable on iOS", a: "Must use Safari browser. Chrome on iOS does not support PWA install." },
              { q: "Songs don't load / appear empty", a: "Check Firebase config values. App falls back to songs-data.js if Firebase is unavailable." },
              { q: "Admin panel not visible", a: "Sign in with buenavistaaglinaodanny@gmail.com — admin is granted automatically." },
            ].map(item => (
              <details key={item.q} className="bg-slate-800 rounded-xl p-4 cursor-pointer">
                <summary className="font-semibold text-sm text-yellow-400 list-none flex items-center gap-2">
                  <span>⚠️</span> {item.q}
                </summary>
                <p className="mt-2 text-sm text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center pb-10">
          <a
            href="/index.html"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-indigo-900/50"
          >
            🚀 Launch GigBook App
          </a>
          <p className="text-slate-600 text-xs mt-4">
            Admin: buenavistaaglinaodanny@gmail.com
          </p>
        </div>
      </div>
    </main>
  );
}

function Step({ number, title, color, children }: {
  number: number;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    orange: "border-orange-700 bg-orange-950/30",
    yellow: "border-yellow-700 bg-yellow-950/30",
    green: "border-green-700 bg-green-950/30",
    purple: "border-purple-700 bg-purple-950/30",
    red: "border-red-700 bg-red-950/30",
    blue: "border-blue-700 bg-blue-950/30",
  };
  const badgeColors: Record<string, string> = {
    orange: "bg-orange-600",
    yellow: "bg-yellow-600",
    green: "bg-green-600",
    purple: "bg-purple-600",
    red: "bg-red-600",
    blue: "bg-blue-600",
  };

  return (
    <div className={`border rounded-2xl p-6 ${colors[color] || colors.orange}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-8 h-8 rounded-full ${badgeColors[color] || badgeColors.orange} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {number}
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Badge({ children, color = "slate" }: { children: React.ReactNode; color?: string }) {
  const colors: Record<string, string> = {
    slate: "bg-slate-700 text-slate-200",
    blue: "bg-blue-800 text-blue-200",
    green: "bg-green-800 text-green-200",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
}
