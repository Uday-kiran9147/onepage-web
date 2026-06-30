'use client';

import { useState } from 'react';
import Link from 'next/link';

interface MockSection {
  title: string;
  type: 'links' | 'projects' | 'experience' | 'about';
  data: any;
}

const MOCK_SECTIONS: MockSection[] = [
  {
    title: 'Connect',
    type: 'links',
    data: {
      links: [
        { label: 'GitHub', url: 'https://github.com' },
        { label: 'Twitter / X', url: 'https://x.com' },
        { label: 'LinkedIn', url: 'https://linkedin.com' },
      ],
    },
  },
  {
    title: 'Featured Projects',
    type: 'projects',
    data: {
      projects: [
        {
          name: 'Antigravity AI',
          description: 'Autonomous coding agent platform designed for fast and scalable software engineering.',
          status: 'shipped',
          tags: ['TypeScript', 'Next.js', 'Go'],
        },
        {
          name: 'OnePage Manager',
          description: 'A minimal dashboard to orchestrate links, portfolios, and online workspaces.',
          status: 'building',
          tags: ['React', 'Firebase', 'Tailwind'],
        },
      ],
    },
  },
  {
    title: 'Experience',
    type: 'experience',
    data: {
      items: [
        {
          role: 'Staff Systems Engineer',
          company: 'Hyperlink Labs',
          duration: '2024 - Present',
          description: 'Designing distributed services and high-throughput developer tooling.',
        },
        {
          role: 'Full Stack Developer',
          company: 'Pixel Craft Studio',
          duration: '2022 - 2024',
          description: 'Built customer portals, fast static pages, and modular dashboard widgets.',
        },
      ],
    },
  },
  {
    title: 'About Me',
    type: 'about',
    data: {
      content: 'I am a software engineer focused on building clean, high-performance web products. I believe the internet should be simple, beautifully typeset, and blazingly fast.',
    },
  },
];

export default function LandingPage() {
  const [claimText, setClaimText] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'links' | 'projects' | 'experience' | 'about'>('all');

  const filteredSections = activeTab === 'all' 
    ? MOCK_SECTIONS 
    : MOCK_SECTIONS.filter(s => s.type === activeTab);

  const handleClaimChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize username input
    const val = e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    setClaimText(val);
  };

  return (
    <main className="min-h-screen bg-[#f7f6f3] text-[#2d2d2d] flex flex-col justify-between">
      
      {/* ─── Navigation Header ───────────────────────────────────── */}
      <header className="max-w-4xl w-full mx-auto px-6 py-6 flex items-center justify-between border-b border-[#eae8e2]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[#eae8e2] bg-white flex items-center justify-center overflow-hidden shadow-sm">
            <img src="/logo.png" alt="ReadOnePage Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">ReadOnePage</h1>
            <span className="text-[9px] uppercase tracking-widest text-[#6B60A8] font-extrabold block mt-0.5">digital home</span>
          </div>
        </div>
        <Link
          href="/login"
          className="inline-flex justify-center items-center px-5 py-2 text-xs font-bold bg-[#6B60A8] text-white hover:bg-[#554C8C] transition duration-150 shadow-sm"
        >
          Sign in
        </Link>
      </header>

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="max-w-4xl w-full mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Title & Claim */}
        <div className="md:col-span-7 space-y-6 text-center md:text-left">
          <div className="inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#F2F0FA] text-[#554C8C]">
            ✨ The Minimalist Linktree Alternative
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-[1.1]">
            Your digital home <br />
            in a single link.
          </h2>
          
          <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed max-w-lg">
            Instead of a boring list of URLs, ReadOnePage is a premium, minimal space where visitors can understand who you are, what you build, and how to contact you in <span className="text-[#6B60A8] font-bold">60 seconds</span>.
          </p>

          {/* Clean Claim Box */}
          <div className="max-w-md mx-auto md:mx-0">
            <form action="/login" className="relative flex items-center border border-[#eae8e2] bg-white p-1.5 focus-within:ring-2 focus-within:ring-[#D2CCE9] transition">
              <span className="pl-3 text-gray-400 font-semibold text-xs select-none">readonepage.xyz/</span>
              <input 
                name="username" 
                type="text" 
                value={claimText}
                onChange={handleClaimChange}
                placeholder="username" 
                required
                autoComplete="off"
                className="flex-1 min-w-0 pl-1 pr-2 py-2.5 bg-transparent text-gray-900 text-xs focus:outline-none font-bold"
              />
              <button 
                type="submit" 
                className="px-5 py-2.5 bg-[#6B60A8] text-white text-xs font-bold hover:bg-[#554C8C] transition"
              >
                Claim Link
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Interactive Mockup Profile */}
        <div className="md:col-span-5 w-full">
          <div className="label-premium text-center md:text-left">Live Interactive Preview</div>
          
          {/* Mockup Container */}
          <div className="card-premium bg-white border border-[#eae8e2] p-6 shadow-sm space-y-6">
            
            {/* Header info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-[#F2F0FA] border border-[#D2CCE9] mx-auto flex items-center justify-center text-xl font-bold text-[#6B60A8] shadow-sm mb-3">
                U
              </div>
              <h3 className="font-extrabold text-base text-gray-900">Uday Kiran</h3>
              <p className="text-[10px] text-[#6B60A8] font-bold">readonepage.xyz/uday</p>
              <p className="text-xs font-serif-premium italic text-[#554C8C] mt-2 max-w-[220px] mx-auto leading-relaxed">
                &ldquo;Building developer tools and scalable systems.&rdquo;
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 justify-center border-t border-b border-[#f1efea] py-2">
              {(['all', 'links', 'projects', 'experience', 'about'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-2 py-1 text-[9px] font-bold uppercase tracking-wider transition ${
                    activeTab === tab 
                      ? 'bg-[#F2F0FA] text-[#554C8C]' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Simulated Live Sections */}
            <div className="space-y-4 max-h-[160px] overflow-y-auto pr-1">
              {filteredSections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="text-[9px] uppercase tracking-wider text-gray-400 font-extrabold block border-b border-[#eae8e2]/60 pb-0.5">
                    {section.title}
                  </span>

                  {section.type === 'links' && (
                    <div className="grid grid-cols-3 gap-1">
                      {section.data.links.map((link: any, i: number) => (
                        <a
                          key={i}
                          href="#"
                          onClick={(e) => e.preventDefault()}
                          className="px-2 py-1.5 bg-[#f7f6f3] border border-[#eae8e2] text-[9px] font-semibold text-center text-gray-700 hover:border-[#D2CCE9] hover:text-[#6B60A8] transition"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}

                  {section.type === 'projects' && (
                    <div className="space-y-1.5">
                      {section.data.projects.map((proj: any, i: number) => (
                        <div key={i} className="p-2 border border-[#eae8e2] bg-[#f7f6f3]/30 flex justify-between items-start">
                          <div>
                            <span className="font-bold text-[10px] text-gray-800 block">{proj.name}</span>
                            <span className="text-[9px] text-gray-400 block leading-tight mt-0.5">{proj.description}</span>
                          </div>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 bg-[#EEF3F0] text-[#557A68] uppercase`}>
                            {proj.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'experience' && (
                    <div className="space-y-1.5">
                      {section.data.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between items-baseline text-[9px]">
                          <span className="font-bold text-gray-700">{item.role} @ {item.company}</span>
                          <span className="text-gray-400 font-medium">{item.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.type === 'about' && (
                    <p className="text-[10px] text-gray-500 leading-relaxed font-serif-premium italic">
                      {section.data.content}
                    </p>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ─── Workflow Features Grid ──────────────────────────────── */}
      <section className="max-w-4xl w-full mx-auto px-6 py-12 border-t border-[#eae8e2]">
        <div className="label-premium">The Workflow</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-premium bg-white">
            <svg className="w-5 h-5 text-[#554C8C] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="font-bold text-xs text-gray-900 mb-1">One URL</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              LinkedIn + GitHub + Resume + Portfolio merged into one beautiful, fast, and unified link.
            </p>
          </div>
          <div className="card-premium bg-white">
            <svg className="w-5 h-5 text-[#557A68] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <h3 className="font-bold text-xs text-gray-900 mb-1">Sections System</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Power your profile with modular, structured sections (Links, Projects, Experience, About) without database hassle.
            </p>
          </div>
          <div className="card-premium bg-white">
            <svg className="w-5 h-5 text-[#9C7F59] mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <h3 className="font-bold text-xs text-gray-900 mb-1">Premium & Minimal</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed to look high-end. Blazing fast load times. Optimized for visitors to read in 60 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer className="max-w-4xl w-full mx-auto px-6 py-8 border-t border-[#eae8e2] flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
        <div>
          <p className="font-serif-premium italic text-sm text-[#554C8C] mb-1">Make your internet home today.</p>
          <p>&copy; {new Date().getFullYear()} ReadOnePage. All rights reserved.</p>
        </div>
        <div className="flex gap-4 font-semibold">
          <a href="#" className="hover:underline text-gray-600">Privacy</a>
          <a href="#" className="hover:underline text-gray-600">Terms</a>
          <a href="#" className="hover:underline text-gray-600">Status</a>
        </div>
      </footer>

    </main>
  );
}
