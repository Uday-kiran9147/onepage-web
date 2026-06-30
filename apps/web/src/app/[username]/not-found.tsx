'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProfileNotFound() {
  const params = useParams();
  const username = params?.username as string || '';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16 bg-[#f7f6f3] text-[#2d2d2d]">
      <div className="w-full max-w-sm text-center">
        
        {/* Branding Logo */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#6B60A8] to-[#D5E0DA] text-white font-bold text-lg shadow-sm mb-8">
          R
        </div>

        {/* Not Found Card */}
        <div className="card-premium bg-white p-8 border border-[#eae8e2] shadow-sm text-center space-y-6">
          <span className="text-3xl block">🏠</span>
          
          <div>
            <h2 className="text-lg font-bold text-gray-900 leading-tight">
              Profile Not Available
            </h2>
            {username ? (
              <p className="text-xs text-gray-500 mt-2">
                The link <strong className="text-[#6B60A8]">readonepage.xyz/{username}</strong> is currently unclaimed or has not been fully set up yet.
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-2">
                This digital home doesn't exist or is undergoing construction.
              </p>
            )}
          </div>

          <div className="pt-2">
            <Link
              href={username ? `/login?username=${encodeURIComponent(username)}` : '/'}
              className="w-full inline-flex justify-center items-center px-4 py-3 bg-[#6B60A8] text-white text-xs font-bold hover:bg-[#554C8C] transition"
            >
              {username ? `Claim @${username}` : 'Create your digital home'}
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
