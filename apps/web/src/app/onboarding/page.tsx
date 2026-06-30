'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, writeBatch, collection } from 'firebase/firestore';
import { ProfileUpdateSchema, type ProfileUpdate } from '@mirror/shared';
import { z } from 'zod';
import { auth, db } from '../../lib/firebase';

type FirstSectionType = 'none' | 'links' | 'about';

interface OnboardingFormInput extends ProfileUpdate {
  firstSectionType: FirstSectionType;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  aboutContent?: string;
}

const RESERVED_USERNAMES = new Set(['admin', 'support', 'root', 'api', 'team']);

function OnboardingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<OnboardingFormInput>({
    resolver: zodResolver(
      ProfileUpdateSchema.extend({
        firstSectionType: z.enum(['none', 'links', 'about']),
        githubUrl: z.string().optional(),
        twitterUrl: z.string().optional(),
        linkedinUrl: z.string().optional(),
        aboutContent: z.string().optional(),
      })
    ),
    mode: 'onChange',
    defaultValues: {
      firstSectionType: 'links',
      githubUrl: '',
      twitterUrl: '',
      linkedinUrl: '',
      aboutContent: '',
    }
  });

  const usernameValue = watch('username');
  const firstSectionType = watch('firstSectionType');

  // Claimed username passed from landing page if any
  useEffect(() => {
    const claimed = searchParams.get('username');
    if (claimed) {
      setValue('username', claimed.toLowerCase().replace(/[^a-z0-9_-]/g, ''));
    }
  }, [searchParams, setValue]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      
      setCurrentUser(user);
      
      try {
        // Fetch existing data if any
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isOnboarded) {
            router.push('/dashboard');
            return;
          }
          setValue('username', userData.username || '');
          setValue('name', userData.name || user.displayName || '');
          setValue('bio', userData.bio || '');
          setValue('avatarUrl', userData.avatarUrl || user.photoURL || '');
        } else {
          setValue('name', user.displayName || '');
          setValue('avatarUrl', user.photoURL || '');
          
          // Generate default username from email
          if (user.email) {
            const emailPrefix = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, '');
            setValue('username', emailPrefix);
          }
        }
      } catch (err) {
        console.error('Failed to load user info:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, setValue]);

  // Username validation
  useEffect(() => {
    if (!usernameValue || usernameValue.length < 3) {
      setUsernameStatus('idle');
      return;
    }

    const cleaned = usernameValue.toLowerCase().trim();

    // Check regex format
    const formatRegex = /^[a-z0-9_-]+$/;
    if (!formatRegex.test(cleaned)) {
      setUsernameStatus('invalid');
      return;
    }

    if (RESERVED_USERNAMES.has(cleaned)) {
      setUsernameStatus('taken');
      return;
    }

    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      try {
        const usernameRef = doc(db, 'usernames', cleaned);
        const usernameDoc = await getDoc(usernameRef);
        
        if (!usernameDoc.exists()) {
          setUsernameStatus('available');
        } else {
          const ownerUid = usernameDoc.data()?.uid;
          setUsernameStatus(ownerUid === currentUser?.uid ? 'available' : 'taken');
        }
      } catch (e) {
        console.error('Error checking username:', e);
        setUsernameStatus('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameValue, currentUser]);

  const onSubmit = async (data: OnboardingFormInput) => {
    if (!currentUser || usernameStatus === 'taken') return;
    setSubmitting(true);
    setError(null);

    const cleanedUsername = data.username!.toLowerCase().trim();

    try {
      const batch = writeBatch(db);

      // 1. Write User Profile
      const userRef = doc(db, 'users', currentUser.uid);
      batch.set(userRef, {
        id: currentUser.uid,
        email: currentUser.email || '',
        name: data.name,
        username: cleanedUsername,
        bio: data.bio || '',
        avatarUrl: data.avatarUrl || currentUser.photoURL || '',
        isOnboarded: true,
        createdAt: new Date().toISOString(),
      });

      // 2. Write to usernames registry
      const usernameRef = doc(db, 'usernames', cleanedUsername);
      batch.set(usernameRef, { uid: currentUser.uid });

      // 3. Write first section if any
      if (data.firstSectionType === 'links') {
        const links = [];
        if (data.githubUrl) links.push({ label: 'GitHub', url: data.githubUrl, icon: 'github' });
        if (data.twitterUrl) links.push({ label: 'Twitter', url: data.twitterUrl, icon: 'twitter' });
        if (data.linkedinUrl) links.push({ label: 'LinkedIn', url: data.linkedinUrl, icon: 'linkedin' });

        if (links.length > 0) {
          const sectionRef = doc(collection(db, 'users', currentUser.uid, 'sections'));
          batch.set(sectionRef, {
            type: 'links',
            title: 'Connect',
            data: { links },
            order: 0,
            createdAt: new Date().toISOString(),
          });
        }
      } else if (data.firstSectionType === 'about' && data.aboutContent) {
        const sectionRef = doc(collection(db, 'users', currentUser.uid, 'sections'));
        batch.set(sectionRef, {
          type: 'about',
          title: 'About Me',
          data: { content: data.aboutContent },
          order: 0,
          createdAt: new Date().toISOString(),
        });
      }

      await batch.commit();
      router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong during onboarding.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center justify-center w-16 h-16 bg-[#EEF3F0]"></div>
      </main>
    );
  }

  const avatarWatch = watch('avatarUrl');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-[#f7f6f3]">
      <div className="w-full max-w-xl">
        
        {/* Onboarding Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#6B60A8] to-[#D5E0DA] mb-4 shadow-sm text-white font-bold text-xl">
             R
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Set up your ReadOnePage</h1>
          <p className="text-sm text-gray-500 mt-1">Claim your public profile link and layout</p>
        </div>

        <div className="card-premium bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-6 px-4 py-3 bg-[#FAF0ED] border border-[#ECD5CC] text-[#A66E58] text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar URL / Preview */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-2">
              <div className="w-20 h-20 bg-gray-100 border border-[#eae8e2] flex items-center justify-center overflow-hidden shadow-inner">
                {avatarWatch ? (
                  <img src={avatarWatch} alt="Avatar Preview" className="w-full h-full object-cover" onError={(e) => {
                    (e.target as any).src = 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y';
                  }} />
                ) : (
                  <span className="text-2xl text-gray-400">👤</span>
                )}
              </div>
              <div className="flex-1 w-full">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/avatar.jpg"
                  {...register('avatarUrl')}
                  className="w-full px-4 py-2.5 bg-[#f1efea] border border-[#eae8e2] text-gray-900 text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-2">
                Your Link
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-gray-400 font-semibold text-sm">readonepage.xyz/</span>
                <input
                  type="text"
                  {...register('username')}
                  className={`w-full pl-[135px] pr-10 py-3.5 bg-[#f1efea] border ${
                    errors.username || usernameStatus === 'taken' || usernameStatus === 'invalid'
                      ? 'border-[#ECD5CC] focus:ring-[#ECD5CC]' 
                      : usernameStatus === 'available'
                      ? 'border-[#D5E0DA] focus:ring-[#557A68]'
                      : 'border-[#eae8e2] focus:ring-[#D2CCE9]'
                  } text-gray-900 text-sm font-bold focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
                <div className="absolute right-4 flex items-center justify-center">
                  {usernameStatus === 'checking' && <div className="w-4 h-4 border-2 border-gray-300 border-t-[#6B60A8] animate-spin"></div>}
                  {usernameStatus === 'available' && <span className="text-[#557A68] font-bold">✓</span>}
                  {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <span className="text-[#A66E58] font-bold">✕</span>}
                </div>
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-[#A66E58]">{errors.username.message}</p>
              )}
              {usernameStatus === 'taken' && !errors.username && (
                <p className="mt-1.5 text-xs text-[#A66E58]">Username is already taken or reserved</p>
              )}
              {usernameStatus === 'invalid' && !errors.username && (
                <p className="mt-1.5 text-xs text-[#A66E58]">Use lowercase letters, numbers, hyphens, or underscores only (no spaces)</p>
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
                placeholder="e.g. Uday Kiran"
                className="w-full px-4 py-3 bg-[#f1efea] border border-[#eae8e2] text-gray-900 text-sm font-semibold focus:outline-none"
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-[#A66E58]">{errors.name.message}</p>
              )}
            </div>

            {/* Bio Field */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-2">
                Bio Description
              </label>
              <textarea
                {...register('bio')}
                rows={2}
                placeholder="e.g. Systems Engineer • Building developer tools and scalable systems."
                className="w-full px-4 py-3 bg-[#f1efea] border border-[#eae8e2] text-gray-900 placeholder-gray-400 text-sm focus:outline-none resize-none font-medium"
              />
              {errors.bio && (
                <p className="mt-1.5 text-xs text-[#A66E58]">{errors.bio.message}</p>
              )}
            </div>

            {/* First Section Wizard */}
            <div className="border-t border-[#eae8e2] pt-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#6B60A8] mb-3">
                Create your first section
              </label>
              
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setValue('firstSectionType', 'links')}
                  className={`flex-1 py-2 px-3 text-xs border text-center font-bold transition ${
                    firstSectionType === 'links'
                      ? 'bg-[#F2F0FA] border-[#D2CCE9] text-[#6B60A8]'
                      : 'bg-white border-[#eae8e2] text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🔗 Social Links
                </button>
                <button
                  type="button"
                  onClick={() => setValue('firstSectionType', 'about')}
                  className={`flex-1 py-2 px-3 text-xs border text-center font-bold transition ${
                    firstSectionType === 'about'
                      ? 'bg-[#F2F0FA] border-[#D2CCE9] text-[#6B60A8]'
                      : 'bg-white border-[#eae8e2] text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  📝 About Text
                </button>
                <button
                  type="button"
                  onClick={() => setValue('firstSectionType', 'none')}
                  className={`flex-1 py-2 px-3 text-xs border text-center font-bold transition ${
                    firstSectionType === 'none'
                      ? 'bg-[#F2F0FA] border-[#D2CCE9] text-[#6B60A8]'
                      : 'bg-white border-[#eae8e2] text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  ⏭️ Skip
                </button>
              </div>

              {firstSectionType === 'links' && (
                <div className="bg-[#f1efea] p-4 space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#999] block">Quick Socials</span>
                  <div>
                    <input
                      type="text"
                      placeholder="GitHub URL (e.g., https://github.com/...)"
                      {...register('githubUrl')}
                      className="w-full px-3.5 py-2 text-xs border border-[#eae8e2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Twitter URL (e.g., https://x.com/...)"
                      {...register('twitterUrl')}
                      className="w-full px-3.5 py-2 text-xs border border-[#eae8e2] focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="LinkedIn URL (e.g., https://linkedin.com/...)"
                      {...register('linkedinUrl')}
                      className="w-full px-3.5 py-2 text-xs border border-[#eae8e2] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {firstSectionType === 'about' && (
                <div className="bg-[#f1efea] p-4">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#999] block mb-2">Detailed Writeup</span>
                  <textarea
                    rows={4}
                    placeholder="Write anything you want visitors to read... (e.g. what you are studying, your interests, current job description)"
                    {...register('aboutContent')}
                    className="w-full px-3.5 py-2 text-xs border border-[#eae8e2] focus:outline-none resize-none"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || usernameStatus === 'taken' || usernameStatus === 'invalid' || !isValid}
              className="w-full py-4 bg-[#6B60A8] text-white font-extrabold text-sm hover:bg-[#554C8C] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {submitting ? 'Saving Profile...' : 'Finish Setup →'}
            </button>
          </form>

        </div>
      </div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="animate-spin h-10 w-10 border-2 border-gray-300 border-t-[#6B60A8]"></div>
      </main>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

