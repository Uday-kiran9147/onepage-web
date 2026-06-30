'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  writeBatch,
  query, 
  orderBy 
} from 'firebase/firestore';
import Link from 'next/link';
import { auth, db } from '../../lib/firebase';

interface Section {
  id: string;
  type: 'links' | 'projects' | 'experience' | 'about' | 'skills';
  title: string;
  data: any;
  order: number;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatarUrl: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Profile Edit fields
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  // Section Create Form fields
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [newSecType, setNewSecType] = useState<'links' | 'projects' | 'experience' | 'about' | 'skills'>('links');
  const [newSecTitle, setNewSecTitle] = useState('');
  const [typeDropdownOpen, setTypeDropdownOpen] = useState(false);

  // Active section editing
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSecTitle, setEditSecTitle] = useState('');
  const [editSecData, setEditSecData] = useState<any>(null);

  // Load Auth state and Firestore data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        router.push('/login');
        return;
      }

      try {
        // 1. Fetch profile from Firestore
        const userRef = doc(db, 'users', fbUser.uid);
        const userDoc = await getDoc(userRef);
        
        if (!userDoc.exists()) {
          router.push('/onboarding');
          return;
        }

        const userData = userDoc.data() as UserProfile;
        setUser(userData);
        setName(userData.name);
        setBio(userData.bio || '');
        setAvatarUrl(userData.avatarUrl || '');

        // 2. Fetch sections from Firestore subcollection
        const sectionsRef = collection(db, 'users', fbUser.uid, 'sections');
        const q = query(sectionsRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);
        
        const secList: Section[] = [];
        querySnapshot.forEach((docSnap) => {
          secList.push({
            id: docSnap.id,
            ...docSnap.data(),
          } as Section);
        });
        setSections(secList);
      } catch (err: any) {
        console.error('Failed to load dashboard data:', err);
        setError(err.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // --- Profile Actions ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSavingProfile(true);
    setError(null);
    try {
      const userRef = doc(db, 'users', user.id);
      await updateDoc(userRef, { name, bio, avatarUrl });
      
      setUser({
        ...user,
        name,
        bio,
        avatarUrl,
      });
      setIsEditingProfile(false);
      showSuccess('Profile updated successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // --- Section Actions ---
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newSecTitle) return;
    setError(null);

    // Default template data based on type
    let defaultData: any = {};
    if (newSecType === 'links') defaultData = { links: [] };
    else if (newSecType === 'projects') defaultData = { projects: [] };
    else if (newSecType === 'experience') defaultData = { items: [] };
    else if (newSecType === 'about') defaultData = { content: '' };
    else if (newSecType === 'skills') defaultData = { skills: [] };

    // Calculate next order
    let nextOrder = 0;
    if (sections.length > 0) {
      nextOrder = Math.max(...sections.map(s => s.order)) + 1;
    }

    try {
      const sectionsRef = collection(db, 'users', user.id, 'sections');
      const newSecPayload = {
        type: newSecType,
        title: newSecTitle,
        data: defaultData,
        order: nextOrder,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(sectionsRef, newSecPayload);

      setSections([...sections, {
        id: docRef.id,
        ...newSecPayload
      }]);
      setIsAddingSection(false);
      setNewSecTitle('');
      showSuccess('Section added successfully!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to add section');
    }
  };

  const handleStartEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setEditSecTitle(section.title);
    setEditSecData(JSON.parse(JSON.stringify(section.data)));
  };

  const handleSaveSection = async (sectionId: string) => {
    if (!user) return;
    setError(null);
    try {
      const sectionRef = doc(db, 'users', user.id, 'sections', sectionId);
      await updateDoc(sectionRef, {
        title: editSecTitle,
        data: editSecData,
      });

      setSections(sections.map((s) => (s.id === sectionId ? { ...s, title: editSecTitle, data: editSecData } : s)));
      setEditingSectionId(null);
      showSuccess('Section updated!');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!user || !confirm('Are you sure you want to delete this section?')) return;
    setError(null);
    try {
      const sectionRef = doc(db, 'users', user.id, 'sections', sectionId);
      await deleteDoc(sectionRef);

      setSections(sections.filter((s) => s.id !== sectionId));
      showSuccess('Section deleted.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete section');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    if (!user) return;
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const newSections = [...sections];
    const temp = newSections[currentIndex];
    newSections[currentIndex] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    // Instantly show visual update
    setSections(newSections);

    // Save to Firestore in a batch write
    try {
      const batch = writeBatch(db);
      newSections.forEach((sec, idx) => {
        const secRef = doc(db, 'users', user.id, 'sections', sec.id);
        batch.update(secRef, { order: idx });
      });
      await batch.commit();
    } catch (err) {
      console.error('Failed to save order:', err);
    }
  };

  // --- Sub-item mutations inside editing state ---
  const addLinkItem = () => {
    const links = editSecData.links || [];
    setEditSecData({
      ...editSecData,
      links: [...links, { label: '', url: '', icon: 'link' }],
    });
  };

  const updateLinkItem = (index: number, field: string, val: string) => {
    const links = [...editSecData.links];
    links[index] = { ...links[index], [field]: val };
    setEditSecData({ ...editSecData, links });
  };

  const deleteLinkItem = (index: number) => {
    const links = editSecData.links.filter((_: any, i: number) => i !== index);
    setEditSecData({ ...editSecData, links });
  };

  const addProjectItem = () => {
    const projects = editSecData.projects || [];
    setEditSecData({
      ...editSecData,
      projects: [...projects, { name: '', description: '', url: '', tags: [], status: 'shipped' }],
    });
  };

  const updateProjectItem = (index: number, field: string, val: any) => {
    const projects = [...editSecData.projects];
    projects[index] = { ...projects[index], [field]: val };
    setEditSecData({ ...editSecData, projects });
  };

  const deleteProjectItem = (index: number) => {
    const projects = editSecData.projects.filter((_: any, i: number) => i !== index);
    setEditSecData({ ...editSecData, projects });
  };

  const addExperienceItem = () => {
    const items = editSecData.items || [];
    setEditSecData({
      ...editSecData,
      items: [...items, { role: '', company: '', duration: '', description: '' }],
    });
  };

  const updateExperienceItem = (index: number, field: string, val: string) => {
    const items = [...editSecData.items];
    items[index] = { ...items[index], [field]: val };
    setEditSecData({ ...editSecData, items });
  };

  const deleteExperienceItem = (index: number) => {
    const items = editSecData.items.filter((_: any, i: number) => i !== index);
    setEditSecData({ ...editSecData, items });
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-[#6B60A8]"></div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen px-4 py-12 bg-[#f7f6f3]">
      <div className="max-w-2xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8 border-b border-[#eae8e2] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#eae8e2] bg-white flex items-center justify-center overflow-hidden shadow-sm">
              <img src="/logo.png" alt="ReadOnePage Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 tracking-tight block">ReadOnePage</span>
              <span className="text-[10px] text-gray-400">Dashboard</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href={`/${user.username}`}
              target="_blank"
              className="px-4 py-2 bg-[#6B60A8] hover:bg-[#554C8C] text-white text-xs font-bold transition shadow-sm"
            >
              Public Profile ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[#eae8e2] bg-white text-gray-700 text-xs font-bold hover:bg-gray-50 transition shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Global Messages */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-[#FAF0ED] border border-[#ECD5CC]/30 text-[#A66E58] text-xs font-semibold">
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 px-4 py-3 bg-[#EEF3F0] border border-[#D5E0DA]/50 text-[#557A68] text-xs font-bold">
            ✓ {success}
          </div>
        )}

        {/* ─── Profile Header Editor ────────────────────────────────── */}
        <div className="label-premium">Profile Header</div>
        <div className="card-premium mb-8 bg-white">
          {!isEditingProfile ? (
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-100 border border-[#eae8e2] flex items-center justify-center overflow-hidden shadow-inner">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">👤</span>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">{user.name}</h3>
                  <p className="text-xs text-[#6B60A8] font-semibold">@{user.username}</p>
                  {user.bio ? (
                    <p className="text-xs text-gray-500 mt-1 max-w-md">{user.bio}</p>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1 italic">No bio defined yet.</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="text-xs font-bold text-[#6B60A8] hover:underline"
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f1efea] border border-[#eae8e2] text-gray-900 font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#f1efea] border border-[#eae8e2] text-gray-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#f1efea] border border-[#eae8e2] text-gray-900 focus:outline-none resize-none font-serif-premium italic"
                  placeholder="Tell visitors about yourself in short sentences..."
                />
              </div>
              <div className="flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-4 py-2 bg-[#6B60A8] text-white hover:bg-[#554C8C]"
                >
                  {savingProfile ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ─── Sections System ──────────────────────────────────────── */}
        <div className="flex justify-between items-baseline mb-3">
          <div className="label-premium m-0">Your Sections</div>
          {!isAddingSection && (
            <button
              onClick={() => setIsAddingSection(true)}
              className="text-xs font-extrabold text-[#6B60A8] hover:underline"
            >
              + Add Section
            </button>
          )}
        </div>

        {/* Create Section Form */}
        {isAddingSection && (
          <div className="card-premium mb-6 bg-[#F2F0FA] border-[#D2CCE9] p-6">
            <h4 className="font-bold text-sm text-[#423B6D] mb-4">Add a new Profile Section</h4>
            <form onSubmit={handleAddSection} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#6B60A8] uppercase tracking-wider mb-1.5">Section Type</label>
                  {(() => {
                    const typeOptions: { value: 'links' | 'projects' | 'experience' | 'about' | 'skills'; label: string; icon: React.ReactNode }[] = [
                      { value: 'links', label: 'Social Links', icon: <svg className="w-4 h-4 text-[#554C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> },
                      { value: 'projects', label: 'Projects', icon: <svg className="w-4 h-4 text-[#557A68]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
                      { value: 'experience', label: 'Work Experience', icon: <svg className="w-4 h-4 text-[#9C7F59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2" /></svg> },
                      { value: 'about', label: 'Rich Text / About', icon: <svg className="w-4 h-4 text-[#A66E58]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h8" /></svg> },
                      { value: 'skills', label: 'Skills / Tech Stack', icon: <svg className="w-4 h-4 text-[#554C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> },
                    ];
                    const selected = typeOptions.find(o => o.value === newSecType) || typeOptions[0];
                    return (
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setTypeDropdownOpen(!typeDropdownOpen)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs bg-white border border-[#eae8e2] focus:outline-none text-left font-semibold text-gray-900"
                        >
                          {selected.icon}
                          <span className="flex-1">{selected.label}</span>
                          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                        </button>
                        {typeDropdownOpen && (
                          <div className="absolute z-20 mt-1 w-full bg-white border border-[#eae8e2] shadow-md">
                            {typeOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => { setNewSecType(opt.value); setTypeDropdownOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs text-left font-semibold transition hover:bg-[#F2F0FA] ${newSecType === opt.value ? 'bg-[#F2F0FA] text-[#554C8C]' : 'text-gray-700'}`}
                              >
                                {opt.icon}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#6B60A8] uppercase tracking-wider mb-1.5">Section Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. My Portfolio, Shipped Products"
                    value={newSecTitle}
                    onChange={(e) => setNewSecTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#eae8e2] focus:outline-none font-semibold text-gray-900"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setIsAddingSection(false)}
                  className="px-4 py-2 bg-white border border-[#eae8e2] text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#6B60A8] text-white hover:bg-[#554C8C]"
                >
                  Create Section
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Section List (Ordered) */}
        {sections.length === 0 ? (
          <div className="card-premium text-center py-12 bg-white">
            <svg className="w-8 h-8 mx-auto text-[#554C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            <p className="text-sm font-bold text-gray-600 mt-3 mb-1">Your home has no sections yet.</p>
            <p className="text-xs text-gray-400 mb-4">Add sections to list links, experience, or products.</p>
            <button
              onClick={() => setIsAddingSection(true)}
              className="px-4 py-2 bg-[#6B60A8] hover:bg-[#554C8C] text-white text-xs font-bold transition"
            >
              Add your first section
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {sections.map((section, idx) => {
              const isEditing = editingSectionId === section.id;
              
              return (
                <div key={section.id} className="card-premium bg-white">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 inline-flex items-center justify-center">
                        {section.type === 'links' && (
                          <svg className="w-5 h-5 text-[#554C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        )}
                        {section.type === 'projects' && (
                          <svg className="w-5 h-5 text-[#557A68]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                        )}
                        {section.type === 'experience' && (
                          <svg className="w-5 h-5 text-[#9C7F59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0h2a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2" /></svg>
                        )}
                        {section.type === 'about' && (
                          <svg className="w-5 h-5 text-[#A66E58]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h8" /></svg>
                        )}
                        {section.type === 'skills' && (
                          <svg className="w-5 h-5 text-[#554C8C]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        )}
                      </span>
                      {isEditing ? (
                        <input
                          type="text"
                          required
                          value={editSecTitle}
                          onChange={(e) => setEditSecTitle(e.target.value)}
                          className="px-2 py-0.5 border border-[#eae8e2] rounded-none font-bold text-sm text-gray-900 focus:outline-none"
                        />
                      ) : (
                        <span className="font-bold text-sm text-gray-900">{section.title}</span>
                      )}
                      <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-400 font-bold">
                        {section.type}
                      </span>
                    </div>
                    
                    {/* Controls */}
                    <div className="flex items-center gap-3">
                      {/* Order selectors */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleReorder(idx, 'up')}
                          disabled={idx === 0}
                          className="w-6 h-6 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-xs text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▲
                        </button>
                        <button
                          onClick={() => handleReorder(idx, 'down')}
                          disabled={idx === sections.length - 1}
                          className="w-6 h-6 bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-xs text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          ▼
                        </button>
                      </div>
                      
                      {!isEditing ? (
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <button
                            onClick={() => handleStartEditSection(section)}
                            className="text-[#6B60A8] hover:underline"
                          >
                            Edit
                          </button>
                          <span className="text-gray-200">|</span>
                          <button
                            onClick={() => handleDeleteSection(section.id)}
                            className="text-[#A66E58] hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-bold">
                          <button
                            onClick={() => handleSaveSection(section.id)}
                            className="text-[#557A68] hover:underline"
                          >
                            Save
                          </button>
                          <span className="text-gray-200">|</span>
                          <button
                            onClick={() => setEditingSectionId(null)}
                            className="text-gray-400 hover:underline"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Section Contents */}
                  <div className="border-t border-[#eae8e2]/55 pt-3 mt-3">
                    
                    {/* View mode */}
                    {!isEditing && (
                      <div className="text-xs text-gray-500 space-y-1">
                        {section.type === 'links' && (
                          <div className="flex flex-wrap gap-2">
                            {section.data.links?.length > 0 ? (
                              section.data.links.map((link: any, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-[#f1efea] border border-[#eae8e2] font-semibold text-gray-700">
                                  {link.label || 'Link'}
                                </span>
                              ))
                            ) : (
                              <p className="italic text-gray-400">No links added yet.</p>
                            )}
                          </div>
                        )}
                        {section.type === 'projects' && (
                          <div className="space-y-1.5">
                            {section.data.projects?.length > 0 ? (
                              section.data.projects.map((proj: any, i: number) => (
                                <div key={i} className="flex justify-between items-baseline bg-[#f1efea]/50 p-2 border border-[#eae8e2]/30">
                                  <span className="font-bold text-gray-800">{proj.name}</span>
                                  <span className="text-[10px] text-gray-400">{proj.status}</span>
                                </div>
                              ))
                            ) : (
                              <p className="italic text-gray-400">No projects added yet.</p>
                            )}
                          </div>
                        )}
                        {section.type === 'experience' && (
                          <div className="space-y-1.5">
                            {section.data.items?.length > 0 ? (
                              section.data.items.map((item: any, i: number) => (
                                <div key={i} className="flex justify-between items-baseline bg-[#f1efea]/50 p-2 border border-[#eae8e2]/30">
                                  <span className="font-bold text-gray-800">{item.role} @ {item.company}</span>
                                  <span className="text-[10px] text-gray-400">{item.duration}</span>
                                </div>
                              ))
                            ) : (
                              <p className="italic text-gray-400">No items added yet.</p>
                            )}
                          </div>
                        )}
                        {section.type === 'about' && (
                          <p className="whitespace-pre-wrap leading-relaxed">{section.data.content || <span className="italic text-gray-400">No text defined.</span>}</p>
                        )}
                        {section.type === 'skills' && (
                          <div className="flex flex-wrap gap-1.5">
                            {section.data.skills?.length > 0 ? (
                              section.data.skills.map((skill: string, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-[#F2F0FA] text-[#554C8C] border border-[#D2CCE9] font-bold text-[10px]">
                                  {skill}
                                </span>
                              ))
                            ) : (
                              <p className="italic text-gray-400">No skills added yet.</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Edit mode fields */}
                    {isEditing && (
                      <div className="space-y-4">
                        
                        {/* Skills section edit */}
                        {section.type === 'skills' && (
                          <div className="space-y-3">
                            <div className="flex flex-wrap gap-1.5 mb-2">
                              {editSecData.skills?.map((skill: string, skillIdx: number) => (
                                <div key={skillIdx} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F2F0FA] text-[#554C8C] border border-[#D2CCE9] font-bold text-xs">
                                  <span>{skill}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = (editSecData.skills || []).filter((_: any, i: number) => i !== skillIdx);
                                      setEditSecData({ ...editSecData, skills: updated });
                                    }}
                                    className="font-extrabold hover:text-red-700 ml-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                id="new-skill-input"
                                placeholder="Add skill tag (e.g. Next.js)"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    const val = (e.target as HTMLInputElement).value.trim();
                                    if (val && !(editSecData.skills || []).includes(val)) {
                                      setEditSecData({
                                        ...editSecData,
                                        skills: [...(editSecData.skills || []), val]
                                      });
                                      (e.target as HTMLInputElement).value = '';
                                    }
                                  }
                                }}
                                className="px-3 py-1.5 text-xs border border-[#eae8e2] bg-white focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById('new-skill-input') as HTMLInputElement;
                                  const val = input?.value.trim();
                                  if (val && !(editSecData.skills || []).includes(val)) {
                                    setEditSecData({
                                      ...editSecData,
                                      skills: [...(editSecData.skills || []), val]
                                    });
                                    if (input) input.value = '';
                                  }
                                }}
                                className="px-3 py-1.5 bg-[#6B60A8] text-white text-xs font-bold hover:bg-[#554C8C]"
                              >
                                Add
                              </button>
                            </div>
                            <p className="text-[10px] text-gray-400">Press Enter or click Add to append a skill tag.</p>
                          </div>
                        )}

                        {/* Links section edit */}
                        {section.type === 'links' && (
                          <div className="space-y-3">
                            {editSecData.links?.map((link: any, linkIdx: number) => (
                              <div key={linkIdx} className="flex items-center gap-2 bg-[#f1efea] p-3 border border-[#eae8e2]/60">
                                <input
                                  type="text"
                                  placeholder="Label (e.g. Portfolio)"
                                  value={link.label}
                                  onChange={(e) => updateLinkItem(linkIdx, 'label', e.target.value)}
                                  className="w-1/3 px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                />
                                <input
                                  type="text"
                                  placeholder="URL (https://...)"
                                  value={link.url}
                                  onChange={(e) => updateLinkItem(linkIdx, 'url', e.target.value)}
                                  className="flex-1 px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => deleteLinkItem(linkIdx)}
                                  className="text-xs font-bold text-[#A66E58] hover:underline px-1"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addLinkItem}
                              className="text-xs font-extrabold text-[#6B60A8] hover:underline"
                            >
                              + Add Link Item
                            </button>
                          </div>
                        )}

                        {/* Projects section edit */}
                        {section.type === 'projects' && (
                          <div className="space-y-4">
                            {editSecData.projects?.map((proj: any, projIdx: number) => (
                              <div key={projIdx} className="bg-[#f1efea] p-4 border border-[#eae8e2]/60 space-y-2 relative">
                                <button
                                  type="button"
                                  onClick={() => deleteProjectItem(projIdx)}
                                  className="absolute top-3 right-3 text-xs font-bold text-[#A66E58] hover:underline"
                                >
                                  ✕ Remove
                                </button>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Project Name"
                                    value={proj.name}
                                    onChange={(e) => updateProjectItem(projIdx, 'name', e.target.value)}
                                    className="px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Link URL"
                                    value={proj.url}
                                    onChange={(e) => updateProjectItem(projIdx, 'url', e.target.value)}
                                    className="px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Short Description"
                                  value={proj.description}
                                  onChange={(e) => updateProjectItem(projIdx, 'description', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Tags (comma-separated, e.g. React, Next.js)"
                                    value={proj.tags?.join(', ') || ''}
                                    onChange={(e) => updateProjectItem(projIdx, 'tags', e.target.value.split(',').map((t: string) => t.trim()))}
                                    className="px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                  />
                                  <select
                                    value={proj.status}
                                    onChange={(e) => updateProjectItem(projIdx, 'status', e.target.value)}
                                    className="px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none bg-white"
                                  >
                                    <option value="in-progress">🏗️ In Progress</option>
                                    <option value="shipped">🚀 Shipped</option>
                                    <option value="archived">📦 Archived</option>
                                  </select>
                                </div>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addProjectItem}
                              className="text-xs font-extrabold text-[#6B60A8] hover:underline"
                            >
                              + Add Project Item
                            </button>
                          </div>
                        )}

                        {/* Experience section edit */}
                        {section.type === 'experience' && (
                          <div className="space-y-4">
                            {editSecData.items?.map((item: any, itemIdx: number) => (
                              <div key={itemIdx} className="bg-[#f1efea] p-4 border border-[#eae8e2]/60 space-y-2 relative">
                                <button
                                  type="button"
                                  onClick={() => deleteExperienceItem(itemIdx)}
                                  className="absolute top-3 right-3 text-xs font-bold text-[#A66E58] hover:underline"
                                >
                                  ✕ Remove
                                </button>
                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Role (e.g. Designer)"
                                    value={item.role}
                                    onChange={(e) => updateExperienceItem(itemIdx, 'role', e.target.value)}
                                    className="col-span-1 px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Company / School"
                                    value={item.company}
                                    onChange={(e) => updateExperienceItem(itemIdx, 'company', e.target.value)}
                                    className="col-span-1 px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Duration (e.g. 2021 - 2023)"
                                    value={item.duration}
                                    onChange={(e) => updateExperienceItem(itemIdx, 'duration', e.target.value)}
                                    className="col-span-1 px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none"
                                  />
                                </div>
                                <textarea
                                  rows={2}
                                  placeholder="Job / course descriptions..."
                                  value={item.description}
                                  onChange={(e) => updateExperienceItem(itemIdx, 'description', e.target.value)}
                                  className="w-full px-2 py-1 text-xs border border-[#eae8e2] focus:outline-none resize-none"
                                />
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={addExperienceItem}
                              className="text-xs font-extrabold text-[#6B60A8] hover:underline"
                            >
                              + Add Experience Item
                            </button>
                          </div>
                        )}

                        {/* About section edit */}
                        {section.type === 'about' && (
                          <div>
                            <textarea
                              rows={5}
                              value={editSecData.content || ''}
                              onChange={(e) => setEditSecData({ ...editSecData, content: e.target.value })}
                              placeholder="Write anything you want in standard paragraphs..."
                              className="w-full px-3 py-2 text-xs bg-[#f1efea] border border-[#eae8e2] text-gray-900 focus:outline-none"
                            />
                          </div>
                        )}

                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </main>
  );
}

