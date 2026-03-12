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
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
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
              transition={{ duration: 0.6, delay: ci * 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="skill-card bg-white border border-zinc-200 rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:bg-slate-50/50 hover:border-zinc-300 transition-all duration-400 group tech-card-interactive"
            >
              <h3 className="font-display font-bold uppercase text-sm tracking-widest text-zinc-400 mb-6 tech-heading-interactive">
                {cat.category}
              </h3>
              <div className="flex flex-col gap-5">
                {cat.skills.map((skill, si) => (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="skill-icon-wrap text-zinc-400 group-hover:text-indigo-400 transition-colors">
                          <Terminal size={14} />
                        </div>
                        <span className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors">{skill.name}</span>
                      </div>
                      <span className="text-xs text-zinc-400">{skill.level}%</span>
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-zinc-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full group-hover:bg-indigo-500 transition-colors duration-400"
                        style={{ backgroundColor: 'rgb(24 24 27)' }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: ci * 0.1 + si * 0.08,
                          duration: 0.8,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                      />
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
