'use client';

import { useEffect, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement, config: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken: response.credential }),
      });

      if (res.ok) {
        const data = await res.json();
        if (!data.user.isOnboarded) {
          window.location.href = '/onboarding';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        console.error('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, []);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.google?.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      const buttonDiv = document.getElementById('google-signin-button');
      if (buttonDiv) {
        window.google?.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          width: 320,
          text: 'signin_with',
        });
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [handleCredentialResponse]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl">🪞</span>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Mirror</h1>
        </div>

        <div className="card-premium text-center py-8">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Welcome</h2>
          <p className="text-sm text-gray-500 mb-6">
            Sign in to view your feedback and patterns.
          </p>

          {/* Google Sign In — rendered by Google Identity Services SDK */}
          <div id="google-signin-button" className="flex justify-center" />

          {!GOOGLE_CLIENT_ID && (
            <p className="mt-5 text-xs text-[#854F0B] bg-[#FAEEDA] rounded-xl px-4 py-3 border border-[#ECD0A9]">
              Set <code className="bg-[#f4f3ef] px-1.5 py-0.5 rounded text-[11px]">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> in your <code className="bg-[#f4f3ef] px-1.5 py-0.5 rounded text-[11px]">.env</code> to enable Google Sign-In.
            </p>
          )}
        </div>

        <p className="mt-6 text-[11px] text-gray-400">
          By signing in, you agree to our terms of service and privacy policy.
        </p>
      </div>
    </main>
  );
}
