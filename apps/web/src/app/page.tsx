import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="min-h-screen max-w-3xl mx-auto px-6 py-16 flex flex-col justify-between bg-[#f7f6f3]">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 mb-16">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#6B60A8] to-[#D5E0DA] flex items-center justify-center text-white font-bold text-lg shadow-sm">
            R
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">ReadOnePage</h1>
            <span className="text-[10px] uppercase tracking-widest text-[#6B60A8] font-bold">digital home</span>
          </div>
        </div>
        <Link
          href="/login"
          className="inline-flex justify-center items-center px-5 py-2 text-xs font-bold bg-[#6B60A8] text-white hover:bg-[#554C8C] transition shadow-sm"
        >
          Sign in
        </Link>
      </header>

      {/* Hero Section */}
      <section className="mb-20 text-center sm:text-left">
        <div className="label-premium inline-block px-3 py-1 bg-[#F2F0FA] text-[#554C8C] mb-6">
          A digital home on the internet.
        </div>
        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight mb-6">
          Your digital home <br />
          on the internet.
        </h2>
        <p className="text-lg text-gray-600 font-medium max-w-xl mb-8 leading-relaxed">
          Instead of just a list of links, ReadOnePage is a premium, minimal page where anyone can understand who you are, what you build, and how to contact you in <span className="text-[#6B60A8] font-bold">60 seconds</span>.
        </p>

        {/* Search Bar for username claiming */}
        <div className="max-w-md">
          <form action="/login" className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 font-semibold text-sm">readonepage.xyz/</span>
            <input 
              name="username" 
              type="text" 
              placeholder="username" 
              required
              className="w-full pl-[135px] pr-32 py-4 bg-white border border-[#eae8e2] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#D2CCE9] focus:border-transparent transition shadow-sm font-semibold"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-5 bg-[#6B60A8] text-white text-xs font-bold hover:bg-[#554C8C] transition">
              Claim Link
            </button>
          </form>
        </div>
      </section>

      {/* Interactive Feature Grid */}
      <section className="mb-20">
        <div className="label-premium">The Workflow</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-premium">
            <div className="text-2xl mb-3">🔑</div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">One URL</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              LinkedIn + GitHub + Resume + Portfolio merged into one beautiful, fast, and unified link.
            </p>
          </div>
          <div className="card-premium">
            <div className="text-2xl mb-3">🧩</div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Sections System</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Power your profile with modular, structured sections (Links, Projects, Experience, About) without database hassle.
            </p>
          </div>
          <div className="card-premium">
            <div className="text-2xl mb-3">⚡</div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Premium & Minimal</h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Designed to look high-end. Blazing fast load times. Optimized for visitors to read in 60 seconds.
            </p>
          </div>
        </div>
      </section>

      {/* Visual Preview Card */}
      <section className="mb-20">
        <div className="label-premium">Profile Mockup — readonepage.xyz/uday</div>
        <div className="bg-gradient-to-br from-[#F2F0FA] to-[#EEEFFE] p-8 border border-[#eae8e2] shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left mb-6">
            <div className="w-16 h-16 bg-[#D2CCE9] text-white font-bold text-2xl flex items-center justify-center shadow-md">
              U
            </div>
            <div>
              <h3 className="font-extrabold text-xl text-[#423B6D]">Uday Kiran</h3>
              <p className="text-xs text-[#554C8C] font-semibold mt-0.5">@uday · Systems Engineer</p>
              <p className="text-sm font-serif-premium italic text-[#554C8C] mt-2 max-w-md">
                "Building developer tools and scalable systems. Passionate about API design and monorepos."
              </p>
            </div>
          </div>
          
          {/* Section preview */}
          <div className="space-y-3 max-w-lg">
            <div className="bg-white/70 backdrop-blur-sm border border-[#D2CCE9]/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#554C8C] mb-2">💻 What I'm Building</div>
              <div className="flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-gray-900">ReadOnePage</span>
                  <p className="text-[10px] text-gray-500">A digital home for developers and creators</p>
                </div>
                <span className="px-2.5 py-0.5 bg-[#EEF3F0] text-[#557A68] font-bold text-[9px]">Shipped</span>
              </div>
            </div>
            
            <div className="bg-white/70 backdrop-blur-sm border border-[#D2CCE9]/30 p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#554C8C] mb-2">🔗 Connect</div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 bg-gray-100 border border-[#eae8e2] text-[10px] font-bold text-gray-700">GitHub</span>
                <span className="px-3 py-1.5 bg-gray-100 border border-[#eae8e2] text-[10px] font-bold text-gray-700">Twitter</span>
                <span className="px-3 py-1.5 bg-gray-100 border border-[#eae8e2] text-[10px] font-bold text-gray-700">LinkedIn</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#eae8e2] pt-8 text-center text-xs text-gray-400">
        <p className="font-serif-premium italic text-sm text-[#554C8C] mb-1">Make your internet home today.</p>
        <p>&copy; {new Date().getFullYear()} ReadOnePage. All rights reserved.</p>
      </footer>
    </main>
  );
}

