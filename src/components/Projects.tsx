'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { projects } from '@/data/portfolio';

const categories = ['Featured Projects', 'All Projects', 'Web Applications', 'Desktop Applications', 'AI Projects'];

const headReveal = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const headItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('Featured Projects');

  let filteredProjects = projects;
  if (activeCategory === 'Featured Projects') {
    filteredProjects = projects.filter((p) => p.featured);
  } else if (activeCategory === 'Web Applications') {
    filteredProjects = projects.filter((p) => p.category === 'Web Application' || p.category === 'Web Development');
  } else if (activeCategory === 'Desktop Applications') {
    filteredProjects = projects.filter((p) => p.category === 'Desktop Application');
  } else if (activeCategory === 'AI Projects') {
    filteredProjects = projects.filter((p) => p.category === 'Machine Learning');
  }

  return (
    <section id="projects" className="py-24 md:py-32 bg-white border-t border-zinc-200">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        
        {/* Header */}
        <motion.div
          variants={headReveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16"
        >
          <div>
            <motion.p variants={headItem} className="section-label mb-3">04 — Portfolio</motion.p>
            <motion.h2 variants={headItem} className="font-display font-extrabold uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
              MY
              <br />
              PROJECTS
            </motion.h2>
          </div>
          <motion.p variants={headItem} className="max-w-xs text-zinc-500 text-sm leading-relaxed md:text-right">
            Selected projects that reflect my passion for blending intelligent systems with practical software
            engineering.
          </motion.p>
        </motion.div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[13px] font-medium px-5 py-2 rounded-full border transition-all ${
                activeCategory === cat
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-sm'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 xl:gap-10"
          >
            {filteredProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -12 }}
                transition={{ 
                  delay: i * 0.05, 
                  duration: 0.7, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group relative rounded-[2.5rem] overflow-hidden border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-all duration-500"
              >
                {/* Project Image + Hover Overlay */}
                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-1000 ease-[0.16, 1, 0.3, 1] group-hover:scale-110 opacity-90 group-hover:opacity-100"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-6 left-6 z-10">
                    <span className="bg-white/95 backdrop-blur-md text-zinc-900 text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-full border border-zinc-100 shadow-xl">
                      {project.category}
                    </span>
                  </div>
                  
                  {/* Gradient Overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Hover Actions */}
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-zinc-900 hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-2xl"
                      title="View Code"
                    >
                      <Github size={20} />
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 text-white hover:bg-indigo-500 transition-all duration-300 shadow-2xl border border-zinc-800"
                        title="Live Demo"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-8 md:p-10">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tighter text-zinc-900 leading-none group-hover:text-indigo-600 transition-colors duration-300">
                      {project.title}
                    </h3>
                    <ArrowUpRight size={20} className="text-zinc-300 group-hover:text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <p className="text-zinc-500 text-sm md:text-base leading-relaxed mb-8 font-medium line-clamp-3">
                    {project.description}
                  </p>

                  {/* Technology Stack Tags */}
                  <div className="flex flex-wrap gap-2 pt-8 border-t border-zinc-100">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
