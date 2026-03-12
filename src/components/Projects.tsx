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
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
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
            <motion.h2 variants={headItem} className="font-display font-black uppercase text-5xl md:text-7xl lg:text-8xl text-zinc-900 leading-none tracking-tight">
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
                transition={{ delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="project-card group rounded-2xl overflow-hidden border border-zinc-200 bg-white"
              >
                {/* Project Image + Hover Overlay */}
                <div className="project-img-wrap aspect-[16/10] bg-zinc-100 relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="bg-white/95 backdrop-blur-md text-zinc-800 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border border-zinc-200 shadow-sm">
                      {project.category}
                    </span>
                  </div>
                  {/* Hover Overlay with Buttons */}
                  <div className="project-overlay rounded-none flex items-center justify-center gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="project-overlay-btn inline-flex items-center gap-2 font-medium bg-white text-zinc-900 px-5 py-2.5 rounded-full hover:bg-zinc-100 transition-colors shadow-lg"
                    >
                      <Github size={16} /> Code
                    </a>
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="project-overlay-btn inline-flex items-center gap-2 font-medium bg-zinc-900 text-white px-5 py-2.5 rounded-full border border-zinc-700 hover:bg-zinc-800 transition-colors shadow-lg"
                      >
                        <ExternalLink size={16} /> Demo
                      </a>
                    )}
                  </div>
                </div>

                {/* Card Content - Clean & Minimal */}
                <div className="p-6 md:p-8">
                  <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tight text-zinc-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-zinc-500 text-base leading-relaxed mb-6 font-light">
                    {project.description}
                  </p>

                  {/* Technology Stack Tags */}
                  <div className="flex flex-wrap gap-2 pt-6 border-t border-zinc-100 mt-auto">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-xs font-medium bg-zinc-50 text-zinc-600 border border-zinc-200 px-3 py-1.5 rounded-md">
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
