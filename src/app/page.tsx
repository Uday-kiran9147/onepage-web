"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles, Star, Quote, Mail, Shield } from "lucide-react";

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({ id, children, className }) => (
  <section id={id} className={`px-6 sm:px-8 lg:px-12 ${className || ""}`}>
    {children}
  </section>
);

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full text-foreground bg-[radial-gradient(1200px_800px_at_50%_-10%,#7dd3fc_0%,transparent_50%),radial-gradient(1000px_600px_at_80%_20%,#fca5a5_0%,transparent_50%),linear-gradient(to_bottom_right,#0f172a_0%,#111827_35%,#0b1220_100%)]">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_400px_at_10%_-10%,rgba(255,255,255,0.08),transparent),radial-gradient(600px_300px_at_90%_10%,rgba(255,255,255,0.06),transparent)]" />
        <Section className="pt-28 sm:pt-32 pb-20 sm:pb-28">
          <div className="mx-auto max-w-6xl text-center">
            <motion.div initial="hidden" animate="show" variants={containerVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs sm:text-sm text-white/80 backdrop-blur">
                <Sparkles className="size-3.5 sm:size-4 text-yellow-300" />
                Rebuild your focus — one page a day
              </div>
            </motion.div>
            <motion.h1
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="mt-6 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            >
              OnePage | Rebuild Focus.
            </motion.h1>
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { delay: 0.1, duration: 0.6 } },
              }}
              className="mx-auto mt-5 max-w-2xl text-center text-white/80"
            >
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
                👋 Lost focus to endless scrolling? You’re not alone.
              </h3>
              <p className="text-base sm:text-lg leading-relaxed">
                Most of us spend hours swiping through short videos, only to forget what we just saw.
                <br />
                Our attention spans are shrinking, and it’s getting harder to sit still and think.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 flex items-center justify-center gap-3"
            >
              <a
                href="#signup"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 text-base font-semibold text-slate-900 hover:opacity-95 active:opacity-90 shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]"
              >
                Get Early Access
                <ArrowRight className="size-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-base font-semibold text-white/90 hover:bg-white/10"
              >
                Learn more
              </a>
            </motion.div>
          </div>
        </Section>
      </div>

      {/* What is OnePage */}
      <Section id="about" className="py-16 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            What is OnePage?
          </h2>
          <p className="mt-4 text-white/80 text-lg">
            OnePage delivers just one powerful page every day — short, meaningful reads designed to make you smarter, calmer, and more focused.
            Not too long. Not too short. Just right to grow your mind in 2 minutes.
          </p>
        </div>
      </Section>

      {/* Why You'll Love It */}
      <Section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Why You’ll Love It
          </h2>
          <p className="mt-3 text-white/80">Simple. Calming. Consistent.</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: "1 Page a Day", desc: "Spend 2 minutes reading something that actually matters.", icon: Sparkles },
              { title: "Personalized Topics", desc: "Get daily pages based on what you love — history, psychology, and more.", icon: CheckCircle2 },
              { title: "Focus Streaks", desc: "Build your reading habit with milestones that keep you motivated.", icon: Star },
              { title: "Distraction-Free", desc: "No ads. No scroll traps. Just pure reading flow.", icon: Shield },
              { title: "Community Picks", desc: "Read what others loved most this week.", icon: CheckCircle2 },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.35)] transition"
              >
                <div className="flex items-start gap-4">
                  <div className="grid size-12 place-items-center rounded-xl bg-gradient-to-br from-white to-white text-slate-900 shadow-inner">
                    <f.icon className="size-6 text-slate-700" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{f.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Loved by readers
          </h2>
          <p className="mt-3 text-white/80">
            Real voices from our early community — readers who replaced doomscrolling with mindful reading.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { name: "Aditi", text: "I used to open Instagram first thing in the morning. Now it’s OnePage.", rating: 5 },
              { name: "Karan", text: "Feels like my attention span is slowly healing. One page at a time.", rating: 5 },
              { name: "Rohan", text: "Short, deep, and surprisingly memorable.", rating: 4 },
            ].map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="w-full sm:w-[300px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur text-left"
              >
                <Quote className="size-5 text-white/50" />
                <blockquote className="mt-3 text-white/90">{t.text}</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm text-white/70">
                  <span>{t.name}</span>
                  <span className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star key={idx} className={`size-4 ${idx < t.rating ? "text-yellow-300" : "text-white/30"}`} />
                    ))}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </Section>

      {/* Signup */}
      <Section id="signup" className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 backdrop-blur">
            <div className="absolute -top-20 -right-16 size-56 rounded-full bg-gradient-to-br from-sky-400/40 to-indigo-500/40 blur-3xl" />
            <div className="relative">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">Get early access</h3>
              <p className="mt-2 text-white/80">Be first in line. We’ll send a single invite—no spam, ever.</p>
              <form className="mt-6 flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/15 bg-white/10 pl-10 pr-4 py-3 text-white placeholder:text-white/50 outline-none focus:ring-2 focus:ring-sky-400/60"
                  />
                </div>
                <button className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 px-5 py-3 font-semibold text-slate-900 shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]">
                  Notify me
                </button>
              </form>
              <p className="mt-3 text-xs text-white/60 inline-flex items-center gap-1">
                <Shield className="size-3" /> We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <div>© {new Date().getFullYear()} OnePage. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="#features">Features</a>
            <a className="hover:text-white" href="#signup">Early Access</a>
            <a className="hover:text-white" href="https://x.com" target="_blank" rel="noreferrer">X</a>
            <a className="hover:text-white" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
