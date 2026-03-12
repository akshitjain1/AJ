'use client';

import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { skillCategories } from '@/data/portfolio';

const headReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const headItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function TechStack() {
  return (
    <section id="skills" className="py-24 md:py-32 bg-zinc-50 border-t border-zinc-200">
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
            <motion.p variants={headItem} className="section-label mb-3">05 — Skills</motion.p>
            <motion.h2 variants={headItem} className="font-display font-extrabold uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              MY TECH
              <br />
              STACK
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right">
            Tools and technologies I work with to bring ideas to life across ML,
            web development, and data science.
          </motion.p>
        </motion.div>

        {/* Category grids */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {skillCategories.map((cat, ci) => (
            <motion.div
              key={cat.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: ci * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-white border border-zinc-100 rounded-[2.5rem] p-8 shadow-xl shadow-zinc-200/50 hover:shadow-2xl hover:-translate-y-2 hover:bg-white transition-all duration-500 overflow-hidden"
            >
              {/* Soft decorative element */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] group-hover:bg-indigo-500 group-hover:scale-150 transition-all duration-700 ease-in-out -z-0 opacity-50 group-hover:opacity-10" />
              
              <h3 className="relative font-display font-bold uppercase text-xs tracking-widest text-zinc-500 mb-8 group-hover:text-zinc-900 transition-colors z-10">
                {cat.category}
              </h3>
              <div className="flex flex-col gap-6">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name} className="relative z-10 flex items-center justify-between py-1 group/skill">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 group-hover/skill:bg-indigo-500 group-hover/skill:text-white transition-all duration-300 group-hover:scale-110">
                        <Terminal size={12} />
                      </div>
                      <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 group-hover/skill:text-indigo-600 transition-colors uppercase tracking-tight">
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-end flex-col">
                      <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-500 tabular-nums uppercase tracking-widest leading-none mb-1">
                        Level
                      </span>
                      <span className="text-sm font-bold text-zinc-900 tabular-nums leading-none">
                        {skill.level}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-zinc-400 text-sm counter-live">
            Always learning —{' '}
            <span className="text-zinc-600 font-medium">5+ languages · 10+ frameworks · 15+ tools</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
