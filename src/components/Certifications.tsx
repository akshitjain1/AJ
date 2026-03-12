'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Calendar, Building2, ChevronDown } from 'lucide-react';
import { certifications } from '@/data/portfolio';

const categoryColors: Record<string, string> = {
  'Algorithms':       'bg-blue-50 text-blue-700 border-blue-200',
  'Programming':      'bg-purple-50 text-purple-700 border-purple-200',
  'Networking':       'bg-orange-50 text-orange-700 border-orange-200',
  'Web Dev':          'bg-green-50 text-green-700 border-green-200',
  'Computer Science': 'bg-zinc-100 text-zinc-700 border-zinc-300',
  'Systems':          'bg-red-50 text-red-700 border-red-200',
  'Hardware':         'bg-amber-50 text-amber-700 border-amber-200',
};

// Thin top-stripe accent per category
const categoryStripe: Record<string, string> = {
  'Algorithms':       'bg-blue-500',
  'Programming':      'bg-purple-500',
  'Networking':       'bg-orange-500',
  'Web Dev':          'bg-emerald-500',
  'Computer Science': 'bg-zinc-600',
  'Systems':          'bg-red-500',
  'Hardware':         'bg-amber-500',
};

export default function Certifications() {
  const [showAll, setShowAll] = useState(false);
  const visibleCerts = showAll ? certifications : certifications.slice(0, 6);

  const headReveal = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };
  const headItem = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
  };

  return (
    <section id="certifications" className="py-24 md:py-32 bg-white border-t border-zinc-200">
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
            <motion.p variants={headItem} className="section-label mb-3">09 — Credentials</motion.p>
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              CERTIFI-
              <br />
              CATIONS
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right">
            Professional credentials from Google, IBM, Coursera, LPU, and more — {certifications.length}+ total.
          </motion.p>
        </motion.div>

        {/* Certs grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {visibleCerts.map((cert, i) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                whileHover={{ y: -7, scale: 1.015 }}
                transition={{ duration: 0.45, delay: (i % 6) * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="cert-card group relative border border-zinc-200 rounded-2xl bg-white overflow-hidden
                           shadow-[0_2px_16px_-4px_rgba(0,0,0,0.08)]
                           hover:shadow-[0_22px_55px_-14px_rgba(0,0,0,0.18)]
                           hover:border-zinc-300 cursor-pointer flex flex-col h-full"
              >
                {/* Category colour stripe */}
                <div
                  className={`h-[3px] w-full shrink-0 ${categoryStripe[cert.category] || 'bg-zinc-300'}`}
                />

                <div className="p-6 flex flex-col h-full">
                  {/* Icon row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center
                                    transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 shrink-0">
                      <Award size={18} className="text-white" />
                    </div>
                    <span
                      className={`text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full border
                                  ${categoryColors[cert.category] || 'bg-zinc-50 text-zinc-600 border-zinc-200'}`}
                    >
                      {cert.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-zinc-900 text-[15px] leading-snug mb-auto flex-1
                                 group-hover:text-zinc-700 transition-colors duration-200">
                    {cert.title}
                  </h3>

                  {/* Divider + meta */}
                  <div className="pt-4 mt-4 border-t border-zinc-100 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Building2 size={11} className="text-zinc-400 shrink-0" />
                      <span className="text-xs font-medium text-zinc-600 truncate">{cert.issuer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={11} className="text-zinc-400 shrink-0" />
                      <span className="text-xs text-zinc-400">{cert.date}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show more */}
        {certifications.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 border border-zinc-200 text-zinc-700 font-medium text-sm px-6 py-3 rounded-md hover:bg-zinc-50 hover:border-zinc-300 transition-all"
            >
              {showAll ? 'Show Less' : `Show All ${certifications.length} Certifications`}
              <ChevronDown
                size={14}
                className={`transition-transform ${showAll ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
