import { db } from "@/db";
import { sql } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let dbStatus = "connected";
  try {
    await db.execute(sql`select 1`);
  } catch {
    dbStatus = "unavailable";
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-950 via-slate-900 to-violet-950 flex flex-col items-center justify-center p-6">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-8xl mb-4">🎸</div>
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2">GigBook</h1>
        <p className="text-indigo-300 text-lg">Guitar Chords · Lyrics · Setlist Manager</p>
        <p className="text-slate-500 text-sm mt-2">PWA for iOS & Android</p>
      </div>

      {/* Launch App CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mb-12">
        <a
          href="/index.html"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all shadow-lg shadow-indigo-900/50 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
        >
          🚀 Launch GigBook App
        </a>
        <Link
          href="/setup"
          className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl text-lg transition-all border border-white/20"
        >
          📖 Setup Instructions
        </Link>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full mb-10">
        {[
          { icon: "🎵", title: "Song Library", desc: "Chords & lyrics for all songs saved by admin. Searchable by title, artist, genre." },
          { icon: "🔑", title: "Key Transposer", desc: "Shift any song up or down semitones instantly. Pick any key from C to B." },
          { icon: "📋", title: "Setlists (up to 4)", desc: "Group songs into setlists. Swipe left/right to navigate during performance." },
          { icon: "🎤", title: "Singer / Musician Modes", desc: "Singers get lyrics-only view. Musicians can toggle between chords and lyrics." },
          { icon: "📷", title: "OCR Image Scan", desc: "Admin can scan printed chord sheets via camera to extract chords & lyrics automatically." },
          { icon: "🛡️", title: "Admin Panel", desc: "Add, edit, delete songs. Manage users and assign additional admin roles." },
        ].map((f) => (
          <div key={f.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors">
            <div className="text-3xl mb-2">{f.icon}</div>
            <h3 className="text-white font-bold mb-1">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Tech stack badges */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {["Firebase Auth", "Firestore DB", "PWA + Service Worker", "DaisyUI + Tailwind", "Tesseract.js OCR", "GitHub Pages"].map(t => (
          <span key={t} className="bg-indigo-900/60 text-indigo-300 text-xs font-mono px-3 py-1 rounded-full border border-indigo-700/50">{t}</span>
        ))}
      </div>

      <p className="text-slate-600 text-xs">
        DB Status: <span className={dbStatus === "connected" ? "text-green-500" : "text-yellow-500"}>{dbStatus}</span>
      </p>
    </main>
  );
}
