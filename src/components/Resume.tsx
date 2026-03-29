'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Download, Mail, ArrowUpRight, Play, Pause } from 'lucide-react';
import { personal } from '@/data/portfolio';
import { useState, useEffect, useRef } from 'react';

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
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Resume() {
  const [mounted, setMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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
            <motion.h2 variants={headItem} className="font-display font-extrabold uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
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
          <motion.div variants={fadeUpVariants} className="w-full h-full min-h-[600px] bg-white rounded-[2.5rem] border border-zinc-100 shadow-xl shadow-zinc-200/50 overflow-hidden p-3 md:p-5 transition-transform duration-500 hover:scale-[1.01]">
            <div className="w-full h-full bg-zinc-100 rounded-[2rem] overflow-hidden relative">
              <iframe
                src={personal.resume}
                title="Resume Preview"
                className="absolute inset-0 w-full h-full border-0"
              />
            </div>
          </motion.div>

          {/* Right: Actions Container */}
          <motion.div variants={fadeUpVariants} className="flex flex-col gap-6">
            <div className="border border-zinc-100 rounded-[2.5rem] p-10 bg-white shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
              <h3 className="font-display font-extrabold uppercase text-3xl tracking-tighter text-zinc-900 mb-4">
                Let&apos;s Work Together
              </h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-10 font-medium">
                I&apos;m currently available for full-time opportunities and freelance projects. Let&apos;s discuss how I can bring value to your team.
              </p>

              <div className="flex flex-col gap-4">
                <a
                  href="/Akshit_jain_master_CV.pdf"
                  download="Akshit_jain_master_CV.pdf"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold text-sm px-8 py-4 rounded-full hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-200 hover:scale-105 active:scale-95"
                >
                  <Download size={18} /> Download Master Resume
                </a>

                <a
                  href={personal.resume}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 text-zinc-800 font-bold text-sm px-8 py-4 rounded-full bg-white hover:bg-blue-500 hover:text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Download size={18} /> Download Resume
                </a>
                
                <a
                  href="#contact"
                  onClick={handleSmooth('#contact')}
                  className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 text-zinc-800 font-bold text-sm px-8 py-4 rounded-full bg-white hover:bg-zinc-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  <Mail size={18} /> Contact Me
                </a>

                <a
                 href="#projects"
                 onClick={handleSmooth('#projects')}
                 className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 text-zinc-800 font-semibold text-[15px] px-6 py-4 rounded-xl bg-white hover:bg-black hover:text-white transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                >
                  View Projects <ArrowUpRight size={18} className="text-zinc-400" />
                </a>
              </div>
            </div>

            {/* Availability Indicator */}
            <div className="border border-emerald-100 rounded-[2rem] p-8 bg-emerald-50/50 shadow-sm shadow-emerald-100/50">
              <div className="flex items-center gap-4">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <p className="text-sm font-bold text-emerald-800 uppercase tracking-widest">
                  Available for opportunities
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
          className="mt-12 border border-zinc-100 rounded-[2.5rem] bg-white shadow-xl shadow-zinc-200/50 overflow-hidden"
        >
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
            <div>
              <h3 className="font-display font-bold uppercase text-xl tracking-tight text-zinc-900">
                Video Resume
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">A personal introduction & story</p>
            </div>
            <a
              href="/video_cv.mp4"
              download
              className="inline-flex items-center gap-2 text-sm font-medium border border-zinc-200 text-zinc-600 px-4 py-2 rounded-xl hover:bg-zinc-50 hover:-translate-y-0.5 transition-all duration-200"
            >
              <Download size={14} /> Download Video
            </a>
          </div>

          {/* Video Player Area */}
          <div className="relative aspect-video bg-zinc-950 overflow-hidden group">
            {/* The Video Element */}
            {mounted && (
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onClick={() => {
                  if (videoRef.current) {
                    if (videoRef.current.paused) videoRef.current.play();
                    else videoRef.current.pause();
                  }
                }}
                onTimeUpdate={(e) => {
                  const v = e.target as HTMLVideoElement;
                  const progress = (v.currentTime / v.duration) * 100;
                  if (progressRef.current) {
                    progressRef.current.style.width = `${progress}%`;
                  }
                  
                  if (timeRef.current) {
                    const formatTime = (t: number) => {
                      const m = Math.floor(t / 60);
                      const s = Math.floor(t % 60);
                      return `${m}:${s.toString().padStart(2, '0')}`;
                    };
                    timeRef.current.innerText = `${formatTime(v.currentTime)} / ${formatTime(v.duration || 0)}`;
                  }
                }}
              >
                <source src="/video_cv.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}

            {/* Subtle grid overlay */}
            <div className={`absolute inset-0 grid-bg opacity-10 pointer-events-none transition-opacity duration-500 ${isPlaying ? 'opacity-0' : 'opacity-10'}`} />

            {/* Play Button Overlay (fades out when playing) */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-zinc-900/20 backdrop-blur-[2px]"
                >
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                    <button
                      aria-label="Play video"
                      onClick={() => {
                        if (videoRef.current) videoRef.current.play();
                      }}
                      className="relative w-24 h-24 bg-white text-zinc-900 rounded-full flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 shadow-2xl"
                    >
                      <Play size={32} fill="currentColor" className="ml-1" />
                    </button>
                  </div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center"
                  >
                    <p className="text-white font-bold text-xl tracking-tight uppercase">Watch My Journey</p>
                    <p className="text-white/60 text-xs mt-1 uppercase tracking-widest font-medium">Click to Play</p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player Controls Bar */}
          <div className="bg-zinc-900 px-6 py-4 flex items-center gap-4">
            <button
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={() => {
                if (videoRef.current) {
                  if (videoRef.current.paused) videoRef.current.play();
                  else videoRef.current.pause();
                }
              }}
              className="w-10 h-10 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full flex items-center justify-center transition-colors shrink-0"
            >
              {isPlaying ? (
                <Pause size={16} fill="currentColor" />
              ) : (
                <Play size={16} fill="currentColor" className="ml-0.5" />
              )}
            </button>

            {/* Progress track */}
            <div 
              className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden cursor-pointer relative"
              onClick={(e) => {
                if (videoRef.current) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const p = x / rect.width;
                  videoRef.current.currentTime = p * videoRef.current.duration;
                }
              }}
            >
              <div ref={progressRef} className="h-full w-0 bg-indigo-500 rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
            </div>

            <span ref={timeRef} className="text-zinc-500 text-xs font-bold tracking-widest tabular-nums shrink-0 uppercase">
              0:00 / 0:00
            </span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
