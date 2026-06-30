'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../../lib/firebase';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Claimed username passed from landing page if any
  const claimedUsername = searchParams.get('username') || '';

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Sign in with Google using Firebase Auth client SDK
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // 2. Check if user document exists in Firestore
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        const onboardingUrl = claimedUsername 
          ? `/onboarding?username=${encodeURIComponent(claimedUsername)}`
          : '/onboarding';
        router.push(onboardingUrl);
      } else {
        const userData = userDoc.data();
        if (!userData.isOnboarded) {
          const onboardingUrl = claimedUsername 
            ? `/onboarding?username=${encodeURIComponent(claimedUsername)}`
            : '/onboarding';
          router.push(onboardingUrl);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (err: any) {
      console.error('Sign-in error:', err);
      if (err?.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'An error occurred during Google Sign-In');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 bg-[#f7f6f3]">
      <div className="w-full max-w-sm text-center">
        
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#6B60A8] to-[#D5E0DA] flex items-center justify-center text-white font-bold text-xl shadow-md">
            R
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-black tracking-tight text-gray-900 leading-none">ReadOnePage</h1>
            <span className="text-[9px] uppercase tracking-widest text-[#6B60A8] font-bold">your digital home</span>
          </div>
        </div>

        <div className="card-premium text-center py-10 px-8 bg-white">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Claim your link</h2>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            {claimedUsername ? (
              <span>Sign in to claim <strong className="text-[#6B60A8]">readonepage.xyz/{claimedUsername}</strong></span>
            ) : (
              <span>Create your digital home in seconds.</span>
            )}
          </p>

          {error && (
            <div className="mb-6 px-4 py-3 bg-[#FAF0ED] border border-[#ECD5CC] text-[#A66E58] text-xs text-left">
              {error}
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-white border border-[#eae8e2] text-gray-700 text-sm font-bold hover:bg-gray-50 hover:border-gray-300 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-[#6B60A8] animate-spin"></div>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69a5.74 5.74 0 0 1-2.48 3.77v3.13h4.01c2.34-2.16 3.68-5.32 3.68-8.75Z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.97-1.08 7.96-2.91l-4.01-3.13c-1.12.75-2.55 1.19-3.95 1.19-2.73 0-5.04-1.84-5.86-4.31H1.99v3.23A11.96 11.96 0 0 0 12 24Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M6.14 14.84a7.19 7.19 0 0 1 0-4.57V7.04H1.99a11.97 11.97 0 0 0 0 9.93l4.15-3.13Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.43-3.43A11.95 11.95 0 0 0 1.99 7.04l4.15 3.23c.82-2.47 3.13-4.31 5.86-4.31Z"
                  />
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </div>

        <p className="mt-8 text-[11px] text-gray-400">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="animate-spin h-10 w-10 border-2 border-gray-300 border-t-[#6B60A8]"></div>
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}

