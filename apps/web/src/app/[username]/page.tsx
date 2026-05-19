import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  isPro: boolean;
  createdAt: string;
}

async function getProfile(username: string): Promise<ProfileData | null> {
  try {
    const res = await fetch(`${API_URL}/api/profile/${username}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.profile;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getProfile(params.username);
  if (!profile) return { title: 'Profile Not Found — Mirror' };
  return {
    title: `${profile.name} (@${profile.username}) — Mirror`,
    description: profile.bio || `Give anonymous feedback to ${profile.name} on Mirror.`,
  };
}

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await getProfile(params.username);
  if (!profile) notFound();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Mirror Header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/logo.png" alt="Mirror Logo" width={32} height={32} className="rounded-xl shadow-sm" />
          <span className="font-bold text-lg text-gray-900 tracking-tight">Mirror</span>
        </div>

        {/* Public Profile Mock Visual Style from mirror-product-sketch.html */}
        <div className="bg-gradient-to-br from-[#EEEDFE] to-[#E1F5EE] rounded-3xl p-8 border border-[#e8e5de] shadow-sm">
          {/* Large initials avatar */}
          <div className="w-16 h-16 rounded-full bg-[#AFA9EC] text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            {profile.name.charAt(0).toUpperCase()}
          </div>

          <h1 className="text-xl font-bold text-[#26215C]">{profile.name}</h1>
          <p className="text-xs text-[#534AB7] mt-0.5 font-medium">@{profile.username}</p>

          {profile.bio ? (
            <p className="text-sm font-serif-premium italic text-[#3C3489] mt-4 leading-relaxed bg-white/40 rounded-2xl py-3 px-4 border border-[#AFA9EC]/30">
              "{profile.bio}"
            </p>
          ) : (
            <p className="text-sm font-serif-premium italic text-[#3C3489] mt-4 leading-relaxed bg-white/40 rounded-2xl py-3 px-4 border border-[#AFA9EC]/30">
              "I want honest feedback to grow as a person. Be real."
            </p>
          )}

          {/* Action to Give Feedback */}
          <Link
            href={`/${profile.username}/give`}
            className="block w-full mt-6 py-3 rounded-2xl bg-white border border-[#AFA9EC] text-[#534AB7] font-semibold text-xs hover:bg-[#EEEDFE]/50 transition shadow-sm"
          >
            Give anonymous feedback →
          </Link>
        </div>

        <Link
          href="/"
          className="inline-block mt-8 text-xs font-semibold text-gray-400 hover:text-gray-600 transition"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
