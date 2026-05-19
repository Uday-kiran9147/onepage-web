'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileUpdateSchema, type ProfileUpdate } from '@mirror/shared';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  
  // Keep track of original username so we don't say it's taken if it's theirs
  const [originalUsername, setOriginalUsername] = useState('');

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
    async function fetchMe() {
      try {
        const res = await fetch(`${API_URL}/api/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setValue('username', data.user.username);
          setValue('name', data.user.name);
          setValue('bio', data.user.bio);
          setOriginalUsername(data.user.username);
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
  }, [usernameValue, originalUsername]);

  const onSubmit = async (data: ProfileUpdate) => {
    if (usernameStatus === 'taken') return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

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

      setOriginalUsername(data.username || '');
      setUsernameStatus('idle');
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
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
    <main className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-xl">🪞</span>
            <span className="font-bold text-lg text-gray-900 tracking-tight">Mirror</span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#534AB7] hover:text-[#3C3489] transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="label-premium">Profile Settings</div>
        <div className="card-premium">
          {error && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#FAECE7] border border-[#E05A2B]/30 text-[#B23D19] text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-[#E1F5EE] border border-[#80C8B0]/50 text-[#0F6E56] text-sm flex justify-between items-center transition-all">
              <span>Profile updated successfully!</span>
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

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting || usernameStatus === 'taken' || !isValid}
                className="px-6 py-3 rounded-2xl bg-[#534AB7] text-white font-semibold text-sm hover:bg-[#3C3489] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </main>
  );
}
