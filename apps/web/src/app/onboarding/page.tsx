'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileUpdateSchema, type ProfileUpdate } from '@mirror/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [originalUsername, setOriginalUsername] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<ProfileUpdate>({
    resolver: zodResolver(ProfileUpdateSchema),
    mode: 'onChange',
  });

  const usernameValue = watch('username');

  useEffect(() => {
    // Fetch initial user data
    async function fetchMe() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setValue('username', data.user.username);
          setOriginalUsername(data.user.username);
          setValue('name', data.user.name);
          setValue('bio', data.user.bio);
          if (data.user.isOnboarded) {
             router.push('/dashboard');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [router, setValue]);

  useEffect(() => {
    // Debounce username check
    if (!usernameValue || usernameValue.length < 3 || usernameValue === originalUsername) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API_URL}/api/profile/check-username?username=${usernameValue}`);
        if (res.ok) {
          const data = await res.json();
          setUsernameStatus(data.available ? 'available' : 'taken');
        } else {
          setUsernameStatus('error');
        }
      } catch (e) {
        setUsernameStatus('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameValue]);

  const onSubmit = async (data: ProfileUpdate) => {
    if (usernameStatus === 'taken') return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || 'Failed to update profile');
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center justify-center w-16 h-16 rounded-full bg-[#E1F5EE]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-white sm:bg-[#f9f8f5]">
      <div className="w-full max-w-md">
        
        {/* Onboarding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#EEEDFE] mb-4">
             <span className="text-xl">🪞</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Set up your Mirror</h1>
          <p className="text-sm text-gray-500 mt-2">Claim your public profile link</p>
        </div>

        <div className="sm:card-premium bg-white sm:bg-white rounded-3xl p-6 sm:p-8">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#FAECE7] border border-[#E05A2B]/30 text-[#B23D19] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-2">
                Your Link
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 font-medium text-sm">readonepage.xyz/</span>
                <input
                  type="text"
                  {...register('username')}
                  className={`w-full pl-[135px] pr-10 py-3 rounded-2xl bg-[#f4f3ef] border ${
                    errors.username || usernameStatus === 'taken' 
                      ? 'border-[#E05A2B] focus:ring-[#E05A2B]' 
                      : usernameStatus === 'available'
                      ? 'border-[#80C8B0] focus:ring-[#1D9E75]'
                      : 'border-[#e8e5de] focus:ring-[#AFA9EC]'
                  } text-gray-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
                <div className="absolute right-4 flex items-center justify-center">
                  {usernameStatus === 'checking' && <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-[#534AB7] animate-spin"></div>}
                  {usernameStatus === 'available' && <span className="text-[#0F6E56]">✓</span>}
                  {usernameStatus === 'taken' && <span className="text-[#B23D19]">✕</span>}
                </div>
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-[#B23D19]">{errors.username.message}</p>
              )}
              {usernameStatus === 'taken' && !errors.username && (
                <p className="mt-1.5 text-xs text-[#B23D19]">Username is already taken</p>
              )}
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-2">
                Display Name
              </label>
              <input
                type="text"
                {...register('name')}
                className="w-full px-4 py-3 rounded-2xl bg-[#f4f3ef] border border-[#e8e5de] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFA9EC] focus:border-transparent transition"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-[#B23D19]">{errors.name.message}</p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-2">
                Bio / Prompt
              </label>
              <textarea
                {...register('bio')}
                rows={2}
                placeholder="I want honest feedback to grow as a person. Be real."
                className="w-full px-4 py-3 rounded-2xl bg-[#f4f3ef] border border-[#e8e5de] text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFA9EC] focus:border-transparent transition resize-none font-serif-premium italic"
              />
              {errors.bio && (
                <p className="mt-1.5 text-xs text-[#B23D19]">{errors.bio.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || usernameStatus === 'taken' || !isValid}
              className="w-full py-3.5 rounded-2xl bg-[#534AB7] text-white font-semibold text-sm hover:bg-[#3C3489] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? 'Saving...' : 'Finish Setup →'}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}
