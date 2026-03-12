'use client';

import { motion } from 'framer-motion';
import { capabilities } from '@/data/portfolio';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const rowVariants = {
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

export default function WhatIDo() {
  return (
    <section id="services" className="py-24 md:py-32 bg-white">
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
            <motion.p variants={headItem} className="section-label mb-3">02 — What I do</motion.p>
            <motion.h2 variants={headItem} className="font-display font-extrabold uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              WHAT I CAN
              <br />
              DO FOR YOU
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed font-light md:text-right">
            As a software engineer, I craft data-driven solutions that connect robust backend logic with elegant user interfaces.
          </motion.p>
        </motion.div>

        {/* Services Continuous Loop */}
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden">
          <motion.div
            animate={{ x: [0, -1600] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear",
            }}
            whileHover={{ animationPlayState: "paused" }}
            className="flex gap-8 px-10 w-max"
          >
            {[...capabilities, ...capabilities, ...capabilities].map((cap, idx) => (
              <div
                key={`${cap.id}-${idx}`}
                className="group border border-zinc-200 rounded-2xl p-8 md:p-10 bg-white hover:bg-indigo-50/60 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.18)] hover:-translate-y-2 hover:border-indigo-200 transition-all duration-400 flex flex-col min-h-[280px] w-[350px] md:w-[450px] shrink-0"
              >
                {/* Number */}
                <span className="font-display font-bold text-5xl text-zinc-100 leading-none mb-5 select-none group-hover:text-indigo-100 transition-colors">
                  {cap.id}
                </span>

                {/* Title */}
                <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-zinc-900 leading-tight group-hover:text-indigo-600 transition-colors mb-5">
                  {cap.title}
                </h3>

                {/* Items */}
                <ul className="flex flex-col gap-2.5 mt-auto">
                  {cap.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 mt-[7px] flex-shrink-0 group-hover:bg-indigo-400 transition-colors" />
                      <span className="text-zinc-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
