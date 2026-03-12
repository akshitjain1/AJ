'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GraduationCap, Award } from 'lucide-react';
import { education } from '@/data/portfolio';

const headReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const headItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end center'],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  return (
    <section id="journey" className="py-24 md:py-32 bg-white border-t border-zinc-200">
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
            <motion.p variants={headItem} className="section-label mb-3">07 — Education</motion.p>
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              MY
              <br />
              JOURNEY
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right">
            A timeline of my academic milestones and professional growth.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <div ref={containerRef} className="relative">
          {/* Vertical line base */}
          <div className="absolute left-[27px] md:left-[39px] top-0 bottom-0 w-px bg-zinc-200 hidden md:block" />
          {/* Animated filled line */}
          <motion.div 
            style={{ height: lineHeight }} 
            className="absolute left-[27px] md:left-[39px] top-0 w-px bg-zinc-400 hidden md:block origin-top z-0" 
          />

          <div className="flex flex-col gap-8">
            {education.map((item, i) => (
              <div key={item.id} className="flex gap-8 md:gap-12 items-start group relative">
                {/* Timeline dot */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="hidden md:flex flex-col items-center shrink-0 mt-7 z-10"
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      item.current
                        ? 'border-zinc-900 bg-zinc-900 timeline-dot-active'
                        : 'border-zinc-300 bg-white group-hover:border-zinc-600'
                    } transition-colors relative`}
                  />
                </motion.div>

                {/* Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.65, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1 border border-zinc-200 rounded-2xl p-7 md:p-9 bg-white hover:border-zinc-300 hover:shadow-md transition-all z-10 journey-card-interactive"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap size={14} className="text-zinc-400" />
                        <span className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                          Education
                        </span>
                        {item.current && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                            Current
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold uppercase text-xl md:text-2xl text-zinc-900 tracking-tight leading-tight">
                        {item.degree}
                      </h3>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full whitespace-nowrap">
                      {item.period}
                    </span>
                  </div>

                  <p className="font-medium text-zinc-700 text-sm mb-1">{item.institution}</p>
                  <p className="text-zinc-400 text-xs mb-4">{item.location}</p>

                  <p className="text-zinc-500 text-sm leading-relaxed mb-5">{item.description}</p>

                  <div className="divider mb-4" />

                  <div className="flex flex-wrap gap-2">
                    {item.highlights.map((h) => (
                      <span
                        key={h}
                        className="flex items-center gap-1.5 text-xs text-zinc-600 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-full"
                      >
                        <Award size={10} className="text-zinc-400" />
                        {h}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            ))}

            {/* "What's Next" card */}
            <div className="flex gap-8 md:gap-12 items-start relative mt-4">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="hidden md:flex flex-col items-center shrink-0 mt-7 z-10"
              >
                <div className="w-4 h-4 rounded-full border-2 border-dashed border-zinc-400 bg-white relative" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 border border-dashed border-zinc-300 rounded-2xl p-7 md:p-9 bg-zinc-50 z-10"
              >
                <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-3">
                  What&apos;s Next
                </p>
                <h3 className="font-display font-bold uppercase text-xl md:text-2xl text-zinc-700 tracking-tight mb-3">
                  ACTIVELY SEEKING OPPORTUNITIES
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  I&apos;m actively seeking opportunities in machine learning and software development. My goal is
                  to work on projects that make a real impact while continuing to learn and grow as a developer.
                </p>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="inline-flex items-center gap-2 mt-5 text-sm font-medium bg-zinc-900 text-white px-5 py-2.5 rounded-md hover:bg-zinc-700 transition-colors"
                >
                  Let&apos;s Connect
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
