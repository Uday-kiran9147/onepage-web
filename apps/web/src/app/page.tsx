import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto px-4 py-12">
      <header className="mb-10">
        <div className="text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-1">
              <Image src="/logo.png" alt="Mirror Logo" width={32} height={32} className="rounded-xl shadow-sm" />
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mirror</h1>
            </div>
            <p className="text-sm text-gray-500">
              readonepage.xyz — Anonymous, honest feedback from people who know you.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex justify-center items-center px-4 py-2 text-sm font-semibold rounded-full bg-[#534AB7] text-white hover:bg-[#3C3489] transition"
          >
            Sign in
          </Link>
        </div>

        {/* Search Bar for Feedback */}
        <div className="mt-8 max-w-sm mx-auto sm:mx-0">
          <form action="/search" className="relative flex items-center">
            <span className="absolute left-4 text-gray-400 font-medium">@</span>
            <input 
              name="q" 
              type="text" 
              placeholder="Search a username to give feedback..." 
              required
              className="w-full pl-8 pr-24 py-3.5 rounded-2xl bg-white border border-[#e8e5de] text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#AFA9EC] focus:border-transparent transition shadow-sm"
            />
            <button type="submit" className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-[#534AB7] text-white text-xs font-bold hover:bg-[#3C3489] transition">
              Find
            </button>
          </form>
        </div>
      </header>

      {/* Core Idea Section */}
      <section className="mb-10">
        <div className="label-premium">core idea</div>
        <div className="highlight-premium">
          <p className="text-[#26215C] text-base sm:text-lg font-semibold leading-relaxed mb-2 font-serif-premium italic">
            "You create a profile. Share your link. People in your life tell you — honestly — what they really think about your habits, attitude, and personality. No names. No filters."
          </p>
          <p className="text-[#534AB7] font-medium text-sm">
            The goal isn't validation. It's growth.
          </p>
        </div>
      </section>

      {/* User Flow Section */}
      <section className="mb-12">
        <div className="label-premium">user flow</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-center">
          <div className="bg-[#f4f3ef] border border-[#e8e5de] rounded-xl p-3 text-center min-h-[96px] flex flex-col justify-center">
            <span className="text-lg">📝</span>
            <div className="font-semibold text-xs mt-1 text-gray-900">Sign up</div>
            <div className="text-[10px] text-gray-500 font-normal">get @username</div>
          </div>
          <div className="hidden sm:block text-center text-gray-300 text-lg">→</div>
          <div className="bg-[#f4f3ef] border border-[#e8e5de] rounded-xl p-3 text-center min-h-[96px] flex flex-col justify-center">
            <span className="text-lg">🔗</span>
            <div className="font-semibold text-xs mt-1 text-gray-900">Share link</div>
            <div className="text-[10px] text-gray-500 font-normal">to your circle</div>
          </div>
          <div className="hidden sm:block text-center text-gray-300 text-lg">→</div>
          <div className="bg-[#f4f3ef] border border-[#e8e5de] rounded-xl p-3 text-center min-h-[96px] flex flex-col justify-center col-span-2 sm:col-span-1">
            <span className="text-lg">🗣️</span>
            <div className="font-semibold text-xs mt-1 text-gray-900">They answer</div>
            <div className="text-[10px] text-gray-500 font-normal">guided prompts</div>
          </div>
        </div>
      </section>

      <hr className="border-t border-[#e8e5de] my-10" />

      {/* Public Profile Mock Section */}
      <section className="mb-10">
        <div className="label-premium">your public profile — readonepage.xyz/@uday</div>
        <div className="bg-gradient-to-br from-[#EEEDFE] to-[#E1F5EE] rounded-2xl p-6 text-center border border-[#e8e5de]">
          <div className="w-14 h-14 rounded-full bg-[#AFA9EC] text-white font-bold text-xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            U
          </div>
          <h3 className="font-bold text-lg text-[#26215C]">Uday</h3>
          <p className="text-xs text-[#534AB7] mt-0.5">@uday · 12 feedbacks received</p>
          <p className="text-sm font-serif-premium italic text-[#3C3489] mt-3 max-w-sm mx-auto">
            "I want honest feedback to grow as a person. Be real."
          </p>
          <div className="bg-white/80 backdrop-blur-sm border border-[#AFA9EC] rounded-xl py-2 px-4 text-xs font-semibold text-[#534AB7] inline-block mt-4 hover:bg-white transition cursor-pointer">
            readonepage.xyz/@uday · Give anonymous feedback →
          </div>
        </div>
      </section>

      {/* Why This Beats Others */}
      <section className="mb-12">
        <div className="label-premium">why this beats NGL / Sarahah</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="card-premium">
            <h3 className="font-bold text-sm text-gray-900 mb-1">🧭 Structured prompts</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Not a blank box. Guided questions produce specific, useful feedback — not generic messages.
            </p>
          </div>
          <div className="card-premium">
            <h3 className="font-bold text-sm text-gray-900 mb-1">🤖 AI pattern clustering</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              5 people saying the same thing differently gets surfaced as one pattern. Signal over noise.
            </p>
          </div>
          <div className="card-premium">
            <h3 className="font-bold text-sm text-gray-900 mb-1">🌱 Growth framing</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every prompt ends with: "What could they do about it?" Actionable by design.
            </p>
          </div>
          <div className="card-premium">
            <h3 className="font-bold text-sm text-gray-900 mb-1">🔒 Zero troll design</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Prompts are specific. 50-char minimum enforced. AI moderation before delivery.
            </p>
          </div>
        </div>
      </section>

      {/* Virality Section */}
      <section className="mb-12">
        <div className="label-premium">virality mechanic</div>
        <div className="card-premium divide-y divide-[#f0ede6]">
          <div className="py-3 first:pt-0">
            <h4 className="font-bold text-xs text-gray-900 mb-0.5">The link IS the product</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sharing your profile link is the core action. Every share = new givers = new users who make their own profiles.
            </p>
          </div>
          <div className="py-3">
            <h4 className="font-bold text-xs text-gray-900 mb-0.5">Shareable insight cards</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              "5 people think I'm a good listener 🟢 · 4 say I quit too easily 🔴" — postable to Instagram stories.
            </p>
          </div>
          <div className="py-3 last:pb-0">
            <h4 className="font-bold text-xs text-gray-900 mb-0.5">Peer pressure hook</h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              If your friend shares their profile and asks for feedback, you feel compelled to create your own. Natural referral loop.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Guardrails */}
      <section className="mb-12">
        <div className="label-premium">safety guardrails (non-negotiable)</div>
        <div className="card-premium divide-y divide-[#f0ede6]">
          <div className="py-3 first:pt-0 flex justify-between items-baseline gap-4">
            <span className="font-bold text-xs text-gray-900">50-char minimum</span>
            <span className="text-xs text-gray-500 text-right">Kills one-word insults and lazy hate.</span>
          </div>
          <div className="py-3 flex justify-between items-baseline gap-4">
            <span className="font-bold text-xs text-gray-900">AI moderation</span>
            <span className="text-xs text-gray-500 text-right">Flag and hold hate speech, slurs, and abuse before delivery.</span>
          </div>
          <div className="py-3 flex justify-between items-baseline gap-4">
            <span className="font-bold text-xs text-gray-900">Hide / report</span>
            <span className="text-xs text-gray-500 text-right">Receiver can hide any feedback from their view.</span>
          </div>
          <div className="py-3 flex justify-between items-baseline gap-4">
            <span className="font-bold text-xs text-gray-900">No identity fishing</span>
            <span className="text-xs text-gray-500 text-right">No "who sent this?" feature. Ever. Core trust promise.</span>
          </div>
          <div className="py-3 last:pb-0 flex justify-between items-baseline gap-4">
            <span className="font-bold text-xs text-gray-900">IP rate limiting</span>
            <span className="text-xs text-gray-500 text-right">Max 3 submissions per IP per profile per day.</span>
          </div>
        </div>
      </section>

      {/* Monetisation */}
      <section className="mb-12">
        <div className="label-premium">monetisation</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card-premium flex flex-col justify-between text-center">
            <div>
              <div className="text-2xl mb-2">🆓</div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Free</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                Unlimited feedback received. Basic dashboard. Shareable profile link.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#534AB7] bg-[#EEEDFE] py-1 rounded-full">Included</div>
          </div>
          <div className="card-premium border-[#AFA9EC] flex flex-col justify-between text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#534AB7] text-white text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase">
              Popular
            </div>
            <div>
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold text-sm text-[#26215C] mb-1">Pro</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                AI pattern clustering. Insight cards. Full history. Custom bio + theme.
              </p>
            </div>
            <div className="text-xs font-bold text-white bg-[#534AB7] py-1 rounded-full">₹99/mo</div>
          </div>
          <div className="card-premium flex flex-col justify-between text-center">
            <div>
              <div className="text-2xl mb-2">🏢</div>
              <h3 className="font-bold text-sm text-gray-900 mb-1">Teams</h3>
              <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
                Shared workspace. 360° peer review within a team or org.
              </p>
            </div>
            <div className="text-xs font-semibold text-gray-600 bg-gray-100 py-1 rounded-full">₹499/mo</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-gray-400 mt-16">
        <p className="font-serif-premium italic">Built for people who want to grow.</p>
      </footer>
    </main>
  );
}
