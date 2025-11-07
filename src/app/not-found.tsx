// app/not-found.tsx
"use client";

import { DownloadButtons } from "@/app/components/DownloadButtons";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#FFFDF8] to-[#FAF3E0] text-center text-slate-900 px-6">
      <h1 className="text-3xl font-bold mb-3">Open in OnePage App</h1>
      <p className="text-slate-600 max-w-md mb-8">
        This link is meant to open directly inside the OnePage mobile app.  
        If the app isn’t installed, download it below to continue.
      </p>

      <DownloadButtons />

      <p className="mt-10 text-sm text-slate-500">
        Once installed, tap this link again to open the page inside the app.
      </p>
    </main>
  );
}
