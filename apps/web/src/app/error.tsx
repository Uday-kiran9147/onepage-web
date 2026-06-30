'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#f7f6f3] text-[#2d2d2d]">
      <div className="w-full max-w-sm text-center">
        
        {/* Branding Logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#6B60A8] to-[#D5E0DA] text-white font-bold text-lg shadow-sm mb-8">
          R
        </div>

        {/* Error Card */}
        <div className="card-premium bg-white p-8 border border-[#eae8e2] shadow-sm text-center space-y-6">
          <span className="text-3xl block">⚠️</span>
          
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Something went wrong
            </h2>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed">
              We encountered an unexpected error while loading this page.
            </p>
            {error?.message && (
              <pre className="mt-3 p-3 bg-[#FAF0ED] border border-[#ECD5CC] text-[10px] text-[#A66E58] text-left overflow-x-auto font-mono max-h-[80px]">
                {error.message}
              </pre>
            )}
          </div>

          <div className="pt-2 flex gap-2">
            <button
              onClick={() => reset()}
              className="flex-1 inline-flex justify-center items-center px-4 py-3 bg-[#6B60A8] text-white text-xs font-bold hover:bg-[#554C8C] transition"
            >
              Try again
            </button>
            <Link
              href="/"
              className="flex-1 inline-flex justify-center items-center px-4 py-3 border border-[#eae8e2] text-gray-700 text-xs font-bold hover:bg-gray-50 transition"
            >
              Return Home
            </Link>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-xs font-bold text-gray-400 hover:text-gray-600 hover:underline"
          >
            ← Back to ReadOnePage
          </Link>
        </div>

      </div>
    </main>
  );
}
