'use client';

import { motion } from 'framer-motion';
import { Download, Mail, ArrowUpRight, Play, Pause } from 'lucide-react';
import { personal } from '@/data/portfolio';
import { useState } from 'react';

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } 
  },
};

const headReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const headItem = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Resume() {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSmooth = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="resume" className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <motion.div
          variants={headReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <motion.p variants={headItem} className="section-label mb-3">06 — Experience</motion.p>
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              MY <br /> RESUME
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right font-light">
            A comprehensive overview of my professional experience, education, and technical background.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-16"
        >
          {/* Left: Resume Preview Embedded Viewer */}
          <motion.div variants={fadeUpVariants} className="w-full h-full min-h-[600px] bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-2 lg:p-4">
            <div className="w-full h-full bg-zinc-100 rounded-2xl overflow-hidden relative">
              <iframe
                src={personal.resume}
                title="Resume Preview"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </motion.div>

          {/* Right: Actions Container */}
          <motion.div variants={fadeUpVariants} className="flex flex-col gap-5">
            <div className="border border-zinc-200 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-display font-bold uppercase text-2xl tracking-tight text-zinc-900 mb-2">
                Let&apos;s Work Together
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                I&apos;m currently available for full-time opportunities and freelance projects. Let&apos;s discuss how I can bring value to your team.
              </p>

              <div className="flex flex-col gap-4">
                <a
                  href={personal.resume}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold text-[15px] px-6 py-4 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-500/30"
                >
                  <Download size={18} /> Download Resume
                </a>
                
                <a
                  href="#contact"
                  onClick={handleSmooth('#contact')}
                  className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 text-zinc-800 font-semibold text-[15px] px-6 py-4 rounded-xl bg-zinc-50 hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-colors duration-300"
                >
                  <Mail size={18} /> Contact Me
                </a>

                <a
                 href="#projects"
                 onClick={handleSmooth('#projects')}
                 className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 text-zinc-800 font-semibold text-[15px] px-6 py-4 rounded-xl bg-white hover:bg-zinc-50 hover:-translate-y-0.5 transition-all"
                >
                  View Projects <ArrowUpRight size={18} className="text-zinc-400" />
                </a>
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="border border-emerald-200 rounded-2xl p-6 bg-emerald-50">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-sm font-semibold text-emerald-800">
                  {personal.availability}
                </p>
              </div>
            </div>

          </motion.div>
        </motion.div>

        {/* ── Video Resume ───────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 border border-zinc-200 rounded-3xl bg-white shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <div>
              <h3 className="font-display font-bold uppercase text-xl tracking-tight text-zinc-900">
                Video Resume
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">A short personal introduction</p>
            </div>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-2 text-sm font-medium border border-zinc-200 text-zinc-600 px-4 py-2 rounded-xl hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Download size={14} /> Download Video
            </a>
          </div>

          {/* Video Player Area */}
          <div className="relative aspect-video bg-zinc-950 overflow-hidden">
            {/* Subtle grid overlay */}
            <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

            {/* Placeholder content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              {/* Pulsing ring behind button */}
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                <button
                  aria-label="Play video"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="relative w-20 h-20 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <Pause size={28} className="text-white" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8 ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="text-center">
                <p className="text-white/90 font-semibold text-lg tracking-tight">
                  Video Resume Coming Soon
                </p>
                <p className="text-white/40 text-sm mt-1">
                  Stay tuned for a personal video introduction
                </p>
              </div>
            </div>
          </div>

          {/* Player Controls Bar */}
          <div className="bg-zinc-900 px-6 py-3 flex items-center gap-4">
            <button
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={() => setIsPlaying((p) => !p)}
              className="w-8 h-8 bg-zinc-700 hover:bg-zinc-600 rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              {isPlaying ? (
                <Pause size={14} className="text-white" />
              ) : (
                <svg viewBox="0 0 24 24" fill="white" className="w-3.5 h-3.5 ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Progress track */}
            <div className="flex-1 h-1 bg-zinc-700 rounded-full overflow-hidden">
              <div className="h-full w-0 bg-indigo-400 rounded-full transition-all" />
            </div>

            <span className="text-zinc-500 text-xs font-medium tabular-nums shrink-0">
              0:00 / 0:00
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
