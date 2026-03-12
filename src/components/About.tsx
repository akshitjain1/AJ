'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { personal } from '@/data/portfolio';
import { ArrowUpRight, MapPin, BookOpen, Cpu } from 'lucide-react';

// Animated number counter — fires once when entering viewport
function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(0);
  const started = useRef(false);

  const match = value.match(/^(\d+)([+%k]?)$/);
  const target = match ? parseInt(match[1], 10) : 0;
  const suffix = match ? match[2] : '';

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const startTime = performance.now();
          const step = (now: number) => {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.6 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div
      ref={ref}
      className="border border-zinc-200 rounded-xl p-4 bg-white text-center shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 counter-live"
    >
      <p className="stat-number text-2xl text-zinc-900 tabular-nums">
        {count}{suffix}
      </p>
      <p className="text-xs text-zinc-400 mt-1 leading-tight">{label}</p>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mb-16 md:mb-20"
        >
          <motion.p
            variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            className="section-label mb-3"
          >01 — About me</motion.p>
          <motion.h2
            variants={{ hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } }}
            className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight"
          >
            ABOUT ME
          </motion.h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-16 lg:gap-24 items-start">
          {/* Left — Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name + title */}
            <h3 className="font-display font-bold text-3xl md:text-4xl uppercase tracking-tight text-zinc-900 mb-2">
              {personal.name}
            </h3>
            <p className="text-zinc-500 text-sm mb-8 flex items-center gap-2">
              <MapPin size={13} />
              {personal.location}
            </p>

            {/* Bio paragraph */}
            <p className="text-zinc-600 text-base md:text-lg leading-relaxed max-w-2xl mb-8 font-light">
              {personal.bio}
            </p>

            {/* Key cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                { icon: BookOpen, label: 'Education', value: '3rd Year BTech', sub: 'LPU, Phagwara' },
                { icon: Cpu, label: 'Focus', value: 'Machine Learning', sub: 'AI & Data Science' },
                { icon: ArrowUpRight, label: 'Experience', value: '2+ Years', sub: 'Building & Learning' },
              ].map(({ icon: Icon, label, value, sub }) => (
                <div
                  key={label}
                  className="group border border-zinc-200 rounded-xl p-5 bg-white shadow-sm hover:bg-indigo-500 hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Icon size={14} className="text-zinc-400 group-hover:text-indigo-200 transition-colors" />
                    <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider group-hover:text-indigo-100 transition-colors">{label}</span>
                  </div>
                  <p className="font-semibold text-zinc-900 text-sm group-hover:text-white transition-colors">{value}</p>
                  <p className="text-xs text-zinc-400 mt-0.5 group-hover:text-indigo-200 transition-colors">{sub}</p>
                </div>
              ))}
            </div>

            {/* Stats row — animated counters */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
              {personal.stats.map(({ label, value }) => (
                <StatCounter key={label} value={value} label={label} />
              ))}
            </div>

            {/* Social buttons */}
            <div className="flex flex-wrap gap-3 mt-10">
              <a
                href={personal.social.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium border border-zinc-200 px-4 py-2.5 rounded-md hover:bg-zinc-900 hover:text-white hover:border-zinc-900 transition-all"
              >
                GitHub Profile <ArrowUpRight size={13} />
              </a>
              <a
                href={personal.social.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium border border-zinc-200 px-4 py-2.5 rounded-md hover:border-zinc-900 hover-linkedin-bg transition-all"
              >
                LinkedIn <ArrowUpRight size={13} />
              </a>
              <a
                href={personal.resume}
                download
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium bg-zinc-900 text-white px-4 py-2.5 rounded-md hover:bg-zinc-700 transition-all"
              >
                Download CV <ArrowUpRight size={13} />
              </a>
            </div>
          </motion.div>

          {/* Right — Profile photo: enters from avatar’s position (morph illusion) */}
          <div className="flex flex-col gap-6">
            {/* Entrance: drops in from above with rotation — mirrors hero avatar’s last state */}
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.84, rotate: 9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              {/* Idle float loop — layered inside entrance wrapper */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="absolute inset-0 bg-zinc-200 rounded-2xl translate-x-2.5 translate-y-2.5" />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-zinc-200 bg-zinc-100 shadow-lg">
                  <Image
                    src={personal.profileImage}
                    alt={personal.firstName}
                    fill
                    className="object-cover object-top"
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
