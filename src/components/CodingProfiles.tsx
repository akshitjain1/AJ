'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { codingProfiles } from '@/data/portfolio';

const platforms = [
  {
    id: 'github',
    name: 'GitHub',
    handle: `@${codingProfiles.github.username}`,
    url: codingProfiles.github.url,
    color: '#0A0A0A',
    bgColor: '#F4F4F5',
    stats: [
      { label: 'Repositories', value: `${codingProfiles.github.repos}+` },
      { label: 'Contributions', value: `${codingProfiles.github.contributions}+` },
      { label: 'Top Language', value: codingProfiles.github.topLanguages[0] },
    ],
    description: 'Explore my open-source projects, ML models, and code repositories.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    id: 'leetcode',
    name: 'LeetCode',
    handle: `@${codingProfiles.leetcode.username}`,
    url: codingProfiles.leetcode.url,
    color: '#F7A41D',
    bgColor: '#FFFBF0',
    stats: [
      { label: 'Problems Solved', value: codingProfiles.leetcode.solved },
      { label: 'Focus', value: 'DSA & Algorithms' },
      { label: 'Approach', value: 'Daily Practice' },
    ],
    description: 'Solving algorithmic challenges daily — DSA, dynamic programming, and graphs.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
  },
  {
    id: 'gfg',
    name: 'GeeksforGeeks',
    handle: `@${codingProfiles.gfg.username}`,
    url: codingProfiles.gfg.url,
    color: '#2F8D46',
    bgColor: '#F0FAF3',
    stats: [
      { label: 'Coding Score', value: 'Active' },
      { label: 'Focus', value: 'CS Fundamentals' },
      { label: 'Topics', value: 'DSA, OS, DBMS' },
    ],
    description: 'Practising computer science fundamentals and interview preparation.',
    logo: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116.016 3.79 3.79 0 0 1-1.106-.695L12 11.648l-3.559 3.428a3.79 3.79 0 0 1-1.106.695 4.51 4.51 0 0 1-3.116-.016 3.69 3.69 0 0 1-1.104-.695 3.487 3.487 0 0 1-.565-.745 3.512 3.512 0 0 1 .565-4.162L9.15 4.833A3.765 3.765 0 0 1 12 3.589a3.765 3.765 0 0 1 2.85 1.244l6.035 5.32a3.512 3.512 0 0 1 .565 4.162zM12 5.52l-6.33 5.57a1.54 1.54 0 0 0 0 2.283L12 18.48l6.33-5.107a1.54 1.54 0 0 0 0-2.283z" />
      </svg>
    ),
  },
];

export default function CodingProfiles() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const headReveal = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const headItem = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id="profiles" className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Header */}
        <motion.div
          variants={headReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 md:mb-20"
        >
          <div>
            <motion.p variants={headItem} className="section-label mb-3">08 — Coding</motion.p>
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              CODE
              <br />
              PROFILES
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right">
            Real-time stats from my coding journey across multiple platforms.
          </motion.p>
        </motion.div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {platforms.map((platform, i) => {
            const isHovered = hoveredId === platform.id;
            return (
            <motion.a
              key={platform.id}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.4, 0, 0.2, 1] }}
              onHoverStart={() => setHoveredId(platform.id)}
              onHoverEnd={() => setHoveredId(null)}
              style={{
                borderColor: isHovered ? platform.color + 'a0' : '',
                boxShadow: isHovered
                  ? `0 20px 50px -12px ${platform.color}3a`
                  : '',
                transform: isHovered ? 'translateY(-7px) scale(1.015)' : '',
              }}
              className="profile-card group border border-zinc-200 rounded-2xl bg-white p-8
                         transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              {/* Logo + name */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: platform.bgColor, color: platform.color }}
                    animate={{ scale: isHovered ? 1.18 : 1, rotate: isHovered ? 4 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {platform.logo}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-zinc-900 text-sm">{platform.name}</p>
                    <p className="text-xs text-zinc-400">{platform.handle}</p>
                  </div>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-zinc-300 group-hover:text-zinc-700 transition-colors mt-1"
                  style={{ color: isHovered ? platform.color : '' }}
                />
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed mb-6">{platform.description}</p>

              <div className="divider mb-5" />

              {/* Stats */}
              <div className="flex flex-col gap-3 mt-auto">
                {platform.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-400">{stat.label}</span>
                    <span
                      className="text-sm font-semibold text-zinc-900 transition-colors duration-200"
                      style={{ color: isHovered ? platform.color : '' }}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </motion.a>
            );
          })}
        </div>

        {/* GitHub Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-8 border border-zinc-200 rounded-2xl bg-white p-7 md:p-10"
        >
          <h3 className="font-display font-bold uppercase text-xl tracking-tight text-zinc-900 mb-6">
            GitHub Activity
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
            {[
              { label: 'Total Repos', value: '20+' },
              { label: 'Contributions', value: '350+' },
              { label: 'Stars', value: '2' },
              { label: 'Top Language', value: 'Python' },
            ].map(({ label, value }) => (
              <div key={label} className="text-center border border-zinc-100 rounded-xl p-4 bg-zinc-50">
                <p className="stat-number text-2xl md:text-3xl text-zinc-900">{value}</p>
                <p className="text-xs text-zinc-400 mt-1">{label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {codingProfiles.github.topLanguages.map((lang) => (
              <span key={lang} className="tech-tag">{lang}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
