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
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
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
            <motion.h2 variants={headItem} className="font-display font-extrabold uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {visibleCerts.map((cert, i) => (
              <motion.div
                key={cert.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5, delay: (i % 6) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative rounded-[2.5rem] bg-zinc-50 border border-zinc-100 p-8 shadow-xl shadow-zinc-200/40 hover:shadow-2xl hover:bg-white transition-all duration-500 flex flex-col h-full overflow-hidden"
              >
                {/* Visual Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Header: Icon + Category */}
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 rounded-[1.25rem] bg-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <Award size={24} className="text-white" />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border shadow-sm
                                ${categoryColors[cert.category]?.replace('bg-', 'bg-white ') || 'bg-white text-zinc-600 border-zinc-200'}`}
                  >
                    {cert.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="relative z-10 font-display font-bold text-xl leading-tight text-zinc-900 mb-6 group-hover:text-indigo-600 transition-colors duration-300 flex-1">
                  {cert.title}
                </h3>

                {/* Footer: Meta Info */}
                <div className="relative z-10 mt-auto pt-6 border-t border-zinc-100 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Building2 size={12} className="text-zinc-500 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-[13px] font-bold text-zinc-700">{cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-zinc-50 flex items-center justify-center">
                      <Calendar size={12} className="text-zinc-400" />
                    </div>
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{cert.date}</span>
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
