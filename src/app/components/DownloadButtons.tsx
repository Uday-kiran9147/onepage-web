"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import React, { JSX } from "react";

export function DownloadButtons(): JSX.Element {
  const buttons = [
    {
      href: "https://play.google.com/store/apps/details?id=com.onepage.onepage",
      src: "/Google_Play_Store.png",
      alt: "Get it on Google Play",
      label: "Google Play",
    },
    {
      href: "https://www.indusappstore.com/apps/books-and-reference/onepage/com.onepage.onepage?page=details&id=com.onepage.onepage",
      src: "/Indus_Appstore.png",
      alt: "Download on Indus Appstore",
      label: "Indus Appstore",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
      {buttons.map((btn, index) => (
        <motion.a
          key={index}
          href={btn.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ delay: index * 0.08, duration: 0.38, ease: "easeOut" }}
          viewport={{ once: true }}
          aria-label={btn.alt}
          className="relative group rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
        >
          {/* Gradient halo / border */}
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-sky-400/30 via-indigo-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-md pointer-events-none" />

          {/* Card */}
          <div className="relative z-10 rounded-xl overflow-hidden bg-white/95 backdrop-blur-sm px-3 py-2 flex items-center gap-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
            {/* store image */}
            <Image
              src={btn.src}
              alt={btn.alt}
              width={170}
              height={54}
              className="rounded-lg shadow-sm"
            />

            {/* label — visible on larger screens for clearer, premium CTA */}
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs text-slate-400">Available on</span>
              <span className="text-sm font-semibold text-slate-900">{btn.label}</span>
            </div>
          </div>
        </motion.a>
      ))}
    </div>
  );
}