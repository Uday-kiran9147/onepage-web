import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface LinkItem {
  label: string;
  url: string;
  icon: string;
}

interface ProjectItem {
  name: string;
  description: string;
  url: string;
  tags: string[];
  status: 'in-progress' | 'shipped' | 'archived';
}

interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  description: string;
}

interface Section {
  id: string;
  type: 'links' | 'projects' | 'experience' | 'about';
  title: string;
  data: {
    links?: LinkItem[];
    projects?: ProjectItem[];
    items?: ExperienceItem[];
    content?: string;
  };
  order: number;
}

interface ProfileData {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  sections: Section[];
  createdAt: string;
}

async function getProfile(username: string): Promise<ProfileData | null> {
  try {
    const usernameCleaned = username.toLowerCase().trim();
    const usernameRef = doc(db, 'usernames', usernameCleaned);
    const usernameSnap = await getDoc(usernameRef);

    if (!usernameSnap.exists()) return null;

    const uid = usernameSnap.data()?.uid;
    if (!uid) return null;

    // Fetch user profile
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) return null;

    const profileData = userSnap.data();
    if (!profileData.isOnboarded) return null;

    // Fetch user sections
    const sectionsRef = collection(db, 'users', uid, 'sections');
    const q = query(sectionsRef, orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);

    const sections: Section[] = [];
    querySnapshot.forEach((docSnap) => {
      sections.push({
        id: docSnap.id,
        ...docSnap.data(),
      } as Section);
    });

    return {
      id: uid,
      name: profileData.name || '',
      username: profileData.username || '',
      bio: profileData.bio || '',
      avatarUrl: profileData.avatarUrl || '',
      sections,
      createdAt: profileData.createdAt || '',
    };
  } catch (err) {
    console.error('Error fetching profile:', err);
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const profile = await getProfile(params.username);
  if (!profile) return { title: 'Profile Not Found — ReadOnePage' };
  return {
    title: `${profile.name} (@${profile.username}) — ReadOnePage`,
    description: profile.bio || `${profile.name}'s digital home on the internet.`,
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
    <main className="min-h-screen flex flex-col items-center justify-between px-6 py-16 bg-[#f7f6f3]">
      <div className="w-full max-w-xl flex-1">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Avatar image or fallback letter */}
          <div className="w-24 h-24 border border-[#eae8e2] bg-[#F2F0FA] flex items-center justify-center overflow-hidden shadow-md mb-4">
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-extrabold text-[#6B60A8]">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-black text-gray-900 tracking-tight">{profile.name}</h1>
          <p className="text-xs font-bold text-[#6B60A8] mt-0.5">readonepage.xyz/{profile.username}</p>
          
          {profile.bio && (
            <p className="text-sm font-serif-premium italic text-[#554C8C] max-w-sm mt-4 leading-relaxed">
              &ldquo;{profile.bio}&rdquo;
            </p>
          )}
        </div>

        {/* Sections Listing */}
        <div className="space-y-10">
          {profile.sections && profile.sections.length > 0 ? (
            profile.sections.map((section) => (
              <section key={section.id} className="animate-fade-in">
                {/* Section Header */}
                <h3 className="label-premium border-b border-[#eae8e2] pb-1.5 mb-4">
                  {section.title}
                </h3>

                {/* --- LINKS SECTION --- */}
                {section.type === 'links' && section.data.links && (
                  <div className="grid grid-cols-1 gap-3">
                    {section.data.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-between items-center px-5 py-4 bg-white border border-[#eae8e2] hover:border-[#D2CCE9] text-gray-800 hover:text-[#6B60A8] hover:-translate-y-0.5 transition duration-200 shadow-sm"
                      >
                        <span className="text-sm font-bold flex items-center gap-2">
                          <span>🔗</span>
                          {link.label}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                      </a>
                    ))}
                  </div>
                )}

                {/* --- PROJECTS SECTION --- */}
                {section.type === 'projects' && section.data.projects && (
                  <div className="grid grid-cols-1 gap-4">
                    {section.data.projects.map((proj, i) => (
                      <div
                        key={i}
                        className="card-premium bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900 flex items-center gap-1.5">
                              {proj.name}
                            </h4>
                            {proj.url && (
                              <a
                                href={proj.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#6B60A8] font-semibold hover:underline"
                              >
                                View Project ↗
                              </a>
                            )}
                          </div>
                          
                          {/* Status Badge */}
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                            proj.status === 'shipped' 
                              ? 'bg-[#EEF3F0] text-[#557A68]' 
                              : proj.status === 'in-progress'
                              ? 'bg-[#F2F0FA] text-[#554C8C]'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {proj.status === 'in-progress' ? '🏗️ Building' : proj.status}
                          </span>
                        </div>

                        {proj.description && (
                          <p className="text-xs text-gray-500 leading-relaxed mb-3">
                            {proj.description}
                          </p>
                        )}

                        {/* Project Tech Tags */}
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {proj.tags.map((tag, tagIdx) => (
                              <span
                                key={tagIdx}
                                className="text-[9px] font-bold px-2 py-0.5 bg-[#f1efea] border border-[#eae8e2] text-gray-500"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* --- EXPERIENCE SECTION --- */}
                {section.type === 'experience' && section.data.items && (
                  <div className="relative border-l-2 border-[#eae8e2] ml-3 pl-6 space-y-6 py-1">
                    {section.data.items.map((item, i) => (
                      <div key={i} className="relative">
                        {/* Timeline point */}
                        <div className="absolute -left-[31px] top-1.5 w-3 h-3 bg-[#6B60A8] border-2 border-white shadow-sm" />
                        
                        <div className="flex justify-between items-baseline mb-1">
                          <h4 className="font-extrabold text-sm text-gray-900">
                            {item.role} <span className="font-normal text-gray-400">at</span> {item.company}
                          </h4>
                          <span className="text-[10px] text-gray-400 font-bold bg-[#f1efea] px-2 py-0.5 border border-[#eae8e2]">
                            {item.duration}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-gray-500 leading-relaxed">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* --- ABOUT SECTION --- */}
                {section.type === 'about' && section.data.content && (
                  <div className="highlight-premium bg-white border-[#eae8e2] p-6 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {section.data.content}
                  </div>
                )}

              </section>
            ))
          ) : (
            <div className="text-center py-10 text-xs text-gray-400 italic">
              No sections have been added to this profile yet.
            </div>
          )}
        </div>

      </div>

      {/* Footer Branding */}
      <footer className="w-full text-center text-[10px] text-gray-400 mt-16 pt-8 border-t border-[#eae8e2]/55">
        <Link href="/" className="hover:underline font-bold text-[#6B60A8]">
          Create your own digital home with ReadOnePage 🏠
        </Link>
      </footer>
    </main>
  );
}
