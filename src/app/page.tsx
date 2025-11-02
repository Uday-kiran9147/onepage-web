"use client";
import React, { JSX } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Quote, Shield, BookOpen, Clock, Menu, CheckCircle } from "lucide-react";
import Image from "next/image";
import { DownloadButtons } from "@/app/components/DownloadButtons";
import { AppData } from "@/data/app_data";
// NOTE: metadata cannot be exported from a client component.
// Move metadata to a server component (e.g. export const metadata from app/layout.tsx or app/page.tsx without "use client").

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({
  id,
  children,
  className,
}) => (
  <section id={id} className={`px-4 sm:px-8 lg:px-12 ${className || ""}`}>
    {children}
  </section>
);


const features = [
  {
    key: "one-page",
    title: "One Page a Day",
    desc: "A single, focused page daily — bite-sized, high-value ideas to read and remember.",
    Icon: Sparkles,
    accent: "from-yellow-300 to-amber-400",
  },
  {
    key: "two-minute",
    title: "2-Minute Rituals",
    desc: "Quick intentional reading designed to rebuild attention without friction.",
    Icon: Clock,
    accent: "from-cyan-300 to-sky-400",
  },
  {
    key: "no-distractions",
    title: "Distraction-Free",
    desc: "Minimal UI, no feeds — just a calm page for deep attention.",
    Icon: Shield,
    accent: "from-violet-300 to-indigo-400",
  },
  {
    key: "curated",
    title: "Curated & Timeless",
    desc: "Selections sourced from science, philosophy, and practical creativity.",
    Icon: BookOpen,
    accent: "from-rose-300 to-fuchsia-400",
  },
];

export default function Page(): JSX.Element {
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-[#FFFDF8] to-[#FAF3E0] text-slate-900 antialiased">
      {/* Premium navbar */}
      <nav className="backdrop-blur-sm sticky top-0 z-30 w-full bg-white/30 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Image src="/icon.png" alt="OnePage logo" width={40} height={40} className="rounded-lg shadow-sm" />
            <div>
              <h1 className="text-slate-900 text-lg font-extrabold tracking-tight">OnePage</h1>
              <p className="text-xs text-slate-600 -mt-1">Daily focus, beautifully delivered</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <a href="#features" className="hidden md:inline text-sm text-slate-700 hover:text-slate-900">Features</a>
            <a href={AppData.play_store_link} className="text-sm text-slate-700 hover:text-slate-900">Download</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-24 pb-12">
        <Section>
          <motion.div initial="hidden" animate="show" className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {AppData.h1}
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-slate-700 max-w-2xl mx-auto">
              {AppData.abstract}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#features"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:opacity-95"
                aria-label="Explore Features"
              >
                Explore Features
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={AppData.play_store_link}
                className="inline-flex items-center gap-2 border border-slate-900 bg-white text-slate-900 px-6 py-3 rounded-xl font-semibold shadow-sm"
                aria-label="Download App"
              >
                Download App
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="mt-10 flex items-center justify-center gap-4 text-sm text-slate-600">
              <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-500" /> Curated daily
              </div>
              <div className="inline-flex items-center gap-2 bg-white/60 rounded-full px-3 py-1 shadow-sm">
                <Clock className="w-4 h-4 text-cyan-500" /> 2 minutes
              </div>
            </div>
          </motion.div>
        </Section>
      </header>

      {/* Features */}
      <Section id="features" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl sm:text-4xl font-bold">{AppData.h2}</h3>
            <p className="mt-2 text-slate-600 max-w-2xl mx-auto">Gentle, repeatable practices to build a lasting reading habit — no feeds, no distractions.</p>
          </div>

          <motion.div initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <article
                key={f.key}
                className="rounded-3xl p-6 shadow-lg bg-white/80 hover:shadow-2xl transition-shadow transform hover:-translate-y-1"
                aria-labelledby={`${f.key}-title`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.accent} flex items-center justify-center shadow-inner`}>
                    <f.Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 id={`${f.key}-title`} className="text-lg font-semibold text-slate-900">{f.title}</h4>
                    <p className="mt-1 text-slate-600 text-sm">{f.desc}</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-slate-700 font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 text-slate-700" />
                </div>
              </article>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Callouts */}
      <Section className="py-12">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-4xl font-bold text-center mb-12">{AppData.h3}</h3>
            <p className="mt-3 text-slate-700">
              OnePage is engineered around the psychology of attention — short, high-signal reads that fit anywhere in your day.
            </p>
            <ul className="mt-6 space-y-6">

              {AppData.h3_list_items.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 text-emerald-500">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 bg-gradient-to-br from-white to-slate-50 shadow-lg">
            <div className="text-sm text-slate-600">Preview</div>
            <div className="mt-4 rounded-xl border border-slate-100 p-6 bg-white shadow-inner">
              <h4 className="font-semibold text-slate-900">Today's page</h4>
              <p className="mt-2 text-slate-600 text-sm">"Focus is the new luxury. Reduce input, amplify attention."</p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs text-slate-500">2 min read</span>
                <span className="px-2 py-1 rounded bg-slate-100 text-xs text-slate-700">Curated</span>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold">Loved by readers</h3>
          <p className="mt-2 text-slate-600">Short, memorable, and habit-forming — real people, real results.</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { name: "Aditi", text: "I replaced my morning doomscroll with OnePage. My focus feels restored.", rating: 5 },
              { name: "Karan", text: "Two minutes is all it takes. My streak motivates me daily.", rating: 5 },
              { name: "Rohan", text: "The selections are sharp and lasting. I actually remember what I read.", rating: 4 },
            ].map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                className="bg-white rounded-2xl p-6 shadow text-left"
              >
                <Quote className="w-5 h-5 text-slate-400" />
                <blockquote className="mt-3 text-slate-800">{t.text}</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm text-slate-600">
                  <span className="font-medium">{t.name}</span>
                  <span className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`w-4 h-4 ${idx < t.rating ? "text-yellow-400" : "text-slate-300"}`} />
                    ))}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </Section>

      {/* Download */}
      <Section id="download" className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 text-center lg:text-left">
            {/* App Icon */}
            <div className="flex-shrink-0">
              <div className="relative flex justify-center">
                <Image
                  src="/icon.png"
                  alt="OnePage App Icon"
                  width={160}
                  height={160}
                  className="rounded-3xl shadow-lg shadow-sky-500/20"
                />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-sky-400/20 to-indigo-500/20 blur-xl -z-10" />
              </div>
            </div>

            {/* Text + Buttons */}
            <div>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Start your first page
              </h3>
              <p className="mt-3 text-slate-600 text-base sm:text-lg max-w-md mx-auto lg:mx-0">
                Available on Android — simple, intentional reading in one lightweight app.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <DownloadButtons />
              </div>
            </div>
          </div>
        </div>
      </Section>


      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[#FFF8E7] py-8">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-700">
          <div>© {new Date().getFullYear()} OnePage. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:underline" href="https://x.com/uday_krn" target="_blank" rel="noreferrer">X</a>
            <a className="hover:underline" href="https://github.com/uday-kiran9147" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </main>
  );
}