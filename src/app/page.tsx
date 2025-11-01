"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Quote, Shield } from "lucide-react";
import Image from "next/image";
import { DownloadButtons } from "@/app/components/DownloadButtons";

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({
  id,
  children,
  className,
}) => (
  <section id={id} className={`px-4 sm:px-8 lg:px-12 ${className || ""}`}>
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

      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-4 sm:px-10 py-3 sm:py-4 bg-black/30 backdrop-blur-md z-50">
        <div className="flex items-center gap-2 sm:gap-3">
          <Image src="/icon.png" alt="OnePage logo" width={32} height={32} className="rounded-md" />
          <h2 className="text-white text-lg sm:text-xl font-bold tracking-tight">OnePage</h2>
        </div>

        {/* Google Play Button */}
        <a
          href="https://play.google.com/store/apps/details?id=com.onepage.onepage"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-transform hover:scale-105"
        >
          <Image
            src="/Google_Play_Store.png"
            alt="Get it on Google Play"
            width={140}
            height={45}
            className="rounded-md shadow-md"
          />
        </a>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-24 sm:pt-32 pb-20 sm:pb-28">
        <Section>
          <div className="mx-auto max-w-5xl text-center">
            <motion.div initial="hidden" animate="show" variants={containerVariants}>
              <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1 text-xs sm:text-sm text-white/80 backdrop-blur rounded-full">
                <Sparkles className="size-3.5 sm:size-4 text-yellow-300" />
                Rebuild your focus — one page a day
              </div>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="mt-8 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            >
              OnePage for the Distracted Generation
            </motion.h1>

            <p className="mx-auto mt-5 max-w-xl text-white/80 text-base sm:text-lg leading-relaxed">
              Available on your favorite app stores. Start your focus journey today.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <a
                href="https://play.google.com/store/apps/details?id=com.onepage.onepage"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-400 to-indigo-500 px-6 py-3 text-base font-semibold text-slate-900 rounded-xl hover:opacity-95 shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]"
              >
                Download Now
                <ArrowRight className="size-4" />
              </a>
            </motion.div>
          </div>
        </Section>
      </div>

      {/* What is OnePage */}
      <Section id="about" className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            What is OnePage?
          </h2>
          <p className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed">
            OnePage delivers just one powerful page every day — short, meaningful reads designed to make you
            smarter, calmer, and more focused.
          </p>
          
        </div>
      </Section>

      {/* Why You’ll Love It */}
      <Section id="features" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            Why You’ll Love It
          </h2>
          <p className="mt-3 text-white/80">Simple. Calming. Consistent.</p>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { title: "1 Page a Day", desc: "Spend 2 minutes reading something that actually matters.", icon: Sparkles },
              { title: "Focus Streaks", desc: "Build your reading habit with milestones that keep you motivated.", icon: Star },
              { title: "Distraction-Free", desc: "No ads. No scroll traps. Just pure reading flow.", icon: Shield },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition"
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
            Loved by Users
          </h2>
          <p className="mt-3 text-white/80 text-sm sm:text-base">
            Real voices from readers who replaced doomscrolling with mindful reading.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {[
              { name: "Aditi", text: "I used to open Instagram first thing in the morning. Now it’s OnePage.", rating: 5 },
              { name: "Karan", text: "Feels like my attention span is healing. One page at a time.", rating: 5 },
              { name: "Rohan", text: "Short, deep, and surprisingly memorable.", rating: 4 },
            ].map((t, i) => (
              <motion.figure
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="w-full sm:w-[280px] md:w-[300px] rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur text-left"
              >
                <Quote className="size-5 text-white/50" />
                <blockquote className="mt-3 text-white/90 text-sm sm:text-base">{t.text}</blockquote>
                <figcaption className="mt-4 flex items-center justify-between text-sm text-white/70">
                  <span>{t.name}</span>
                  <span className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star
                        key={idx}
                        className={`size-4 ${idx < t.rating ? "text-yellow-300" : "text-white/30"}`}
                      />
                    ))}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </Section>

      {/* Download Section */}
      <Section id="download" className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-6">
            <Image
              src="/icon.png"
              alt="OnePage App Icon"
              width={100}
              height={100}
              className="rounded-2xl shadow-lg"
            />
          </div>
 
          <h3 className="text-2xl sm:text-3xl font-bold text-white">Download Now</h3>
          <p className="mt-2 text-white/80 text-sm sm:text-base">
            Available on your favorite app stores. Start your focus journey today.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
            <DownloadButtons />
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/70">
          <div>© {new Date().getFullYear()} OnePage. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a className="hover:text-white" href="https://x.com/uday_krn" target="_blank" rel="noreferrer">X</a>
            <a className="hover:text-white" href="https://github.com/uday-kiran9147" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
