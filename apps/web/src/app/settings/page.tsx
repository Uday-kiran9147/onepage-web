'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { ProfileUpdateSchema, type ProfileUpdate } from '@mirror/shared';
import Link from 'next/link';
import { auth, db } from '../../lib/firebase';

const RESERVED_USERNAMES = new Set(['admin', 'support', 'root', 'api', 'team']);

export default function SettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
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
  const avatarWatch = watch('avatarUrl');

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      setCurrentUser(user);

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setValue('username', userData.username || '');
          setValue('name', userData.name || '');
          setValue('bio', userData.bio || '');
          setValue('avatarUrl', userData.avatarUrl || '');
          setOriginalUsername(userData.username || '');
        } else {
          router.push('/onboarding');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, setValue]);

  // Username validation
  useEffect(() => {
    if (!usernameValue || usernameValue.length < 3 || usernameValue === originalUsername) {
      setUsernameStatus('idle');
      return;
    }

    const cleaned = usernameValue.toLowerCase().trim();
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
        console.error(e);
        setUsernameStatus('error');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [usernameValue, originalUsername, currentUser]);

  const onSubmit = async (data: ProfileUpdate) => {
    if (!currentUser || usernameStatus === 'taken') return;
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    const newUsername = data.username ? data.username.toLowerCase().trim() : '';
    const oldUsername = originalUsername.toLowerCase().trim();

    try {
      const userRef = doc(db, 'users', currentUser.uid);

      if (newUsername && newUsername !== oldUsername) {
        // Double check username availability
        const isReserved = RESERVED_USERNAMES.has(newUsername);
        if (isReserved) throw new Error('Username is reserved.');

        const usernameRef = doc(db, 'usernames', newUsername);
        const usernameDoc = await getDoc(usernameRef);
        if (usernameDoc.exists() && usernameDoc.data()?.uid !== currentUser.uid) {
          throw new Error('Username is already taken.');
        }

        // Run batch updates
        const batch = writeBatch(db);
        if (oldUsername) {
          batch.delete(doc(db, 'usernames', oldUsername));
        }
        batch.set(doc(db, 'usernames', newUsername), { uid: currentUser.uid });
        batch.update(userRef, {
          username: newUsername,
          name: data.name,
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
        });

        await batch.commit();
        setOriginalUsername(newUsername);
      } else {
        // Just update user doc
        await updateDoc(userRef, {
          name: data.name,
          bio: data.bio || '',
          avatarUrl: data.avatarUrl || '',
        });
      }

      setUsernameStatus('idle');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while saving settings.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex items-center justify-center w-16 h-16 rounded-full bg-[#EEF3F0]"></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-12 bg-[#f7f6f3]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#eae8e2] pb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#6B60A8] to-[#D5E0DA] flex items-center justify-center text-white font-bold text-lg shadow-sm">
              R
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">ReadOnePage</span>
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-bold text-[#6B60A8] hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="label-premium">Profile Settings</div>
        <div className="card-premium bg-white">
          {error && (
            <div className="mb-6 px-4 py-3 bg-[#FAF0ED] border border-[#ECD5CC]/30 text-[#A66E58] text-sm">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 px-4 py-3 bg-[#EEF3F0] border border-[#D5E0DA]/50 text-[#557A68] text-sm flex justify-between items-center transition-all">
              <span>Profile updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Avatar URL & Preview */}
            <div className="flex items-center gap-4 pb-2 border-b border-[#eae8e2]/50">
              <div className="w-16 h-16 bg-gray-100 border border-[#eae8e2] flex items-center justify-center overflow-hidden shadow-inner">
                {avatarWatch ? (
                  <img src={avatarWatch} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">👤</span>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#999] mb-1.5">
                  Avatar Image URL
                </label>
                <input
                  type="text"
                  {...register('avatarUrl')}
                  className="w-full px-4 py-2.5 bg-[#f1efea] border border-[#eae8e2] text-gray-900 text-xs focus:outline-none"
                  placeholder="https://example.com/avatar.jpg"
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
                    errors.username || usernameStatus === 'taken' 
                      ? 'border-[#ECD5CC] focus:ring-[#ECD5CC]' 
                      : usernameStatus === 'available'
                      ? 'border-[#D5E0DA] focus:ring-[#1D9E75]'
                      : 'border-[#eae8e2] focus:ring-[#D2CCE9]'
                  } text-gray-900 text-sm font-bold focus:outline-none focus:ring-2 focus:border-transparent transition`}
                />
                <div className="absolute right-4 flex items-center justify-center">
                  {usernameStatus === 'checking' && <div className="w-4 h-4 border-2 border-gray-300 border-t-[#6B60A8] animate-spin"></div>}
                  {usernameStatus === 'available' && <span className="text-[#557A68] font-bold">✓</span>}
                  {usernameStatus === 'taken' && <span className="text-[#A66E58] font-bold">✕</span>}
                </div>
              </div>
              {errors.username && (
                <p className="mt-1.5 text-xs text-[#A66E58]">{errors.username.message}</p>
              )}
              {usernameStatus === 'taken' && !errors.username && (
                <p className="mt-1.5 text-xs text-[#A66E58]">Username is already taken or reserved</p>
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
                rows={3}
                placeholder="Write a brief professional description..."
                className="w-full px-4 py-3 bg-[#f1efea] border border-[#eae8e2] text-gray-900 placeholder-gray-400 text-sm focus:outline-none resize-none font-medium"
              />
              {errors.bio && (
                <p className="mt-1.5 text-xs text-[#A66E58]">{errors.bio.message}</p>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={submitting || usernameStatus === 'taken' || !isValid}
                className="px-6 py-3.5 bg-[#6B60A8] text-white font-extrabold text-xs hover:bg-[#554C8C] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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

