'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github, ExternalLink, X, ChevronLeft, ChevronRight, Lightbulb, BarChart3 } from 'lucide-react';
import { projects } from '@/data/portfolio';

const categories = ['Featured Projects', 'All Projects', 'Web Applications', 'Desktop Applications', 'AI Projects', 'Data Science'];

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
  const [selectedProject, setSelectedProject] = useState<any>(null);

  let filteredProjects = projects;
  if (activeCategory === 'Featured Projects') {
    filteredProjects = projects.filter((p) => p.featured);
  } else if (activeCategory === 'Web Applications') {
    filteredProjects = projects.filter((p) => p.category === 'Web Application' || p.category === 'Web Development');
  } else if (activeCategory === 'Desktop Applications') {
    filteredProjects = projects.filter((p) => p.category === 'Desktop Application');
  } else if (activeCategory === 'AI Projects') {
    filteredProjects = projects.filter((p) => p.category === 'Machine Learning');
  } else if (activeCategory === 'Data Science') {
    filteredProjects = projects.filter((p) => p.category === 'Data Science');
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
            <motion.p variants={headItem} className="section-label mb-3">05 — Projects</motion.p>
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
                className="group relative rounded-[2.5rem] overflow-hidden border border-zinc-100 bg-white shadow-xl shadow-zinc-200/50 hover:shadow-2xl transition-all duration-500 flex flex-col"
              >
                {/* Project Image + Hover Overlay */}
                <div className="aspect-[16/10] bg-zinc-900 relative overflow-hidden shrink-0">
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
                  <div className="absolute inset-0 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 scale-90 group-hover:scale-100 z-20">
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
                    {(project as any).gallery && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedProject(project); }}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all duration-300 shadow-2xl"
                        title="View Details"
                      >
                        <BarChart3 size={20} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <ProjectCardContent project={project} onOpenDetail={() => setSelectedProject(project)} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCardContent({ project, onOpenDetail }: { project: any; onOpenDetail: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const hasDetail = !!(project.gallery || project.insights);

  return (
    <div className="p-8 md:p-10 flex flex-col flex-1">
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3 className="font-display font-bold text-2xl md:text-3xl uppercase tracking-tighter text-zinc-900 leading-none group-hover:text-indigo-600 transition-colors duration-300">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="hover:underline underline-offset-4"
          >
            {project.title}
          </a>
        </h3>
        <ArrowUpRight size={20} className="text-zinc-300 group-hover:text-indigo-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
      
      {project.subtitle && (
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-500/70 mb-3">{project.subtitle}</p>
      )}

      <div className="relative mb-6 flex-1">
        <p className={`text-zinc-500 text-sm md:text-base leading-relaxed font-medium transition-all duration-500 ${expanded ? '' : 'line-clamp-3'}`}>
          {project.description}
        </p>
        {project.description.length > 120 && (
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold uppercase tracking-widest text-indigo-500 mt-3 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
          >
            {expanded ? 'Show Less' : 'Read More About Project'}
          </button>
        )}
      </div>

      {/* View Details Button for projects with gallery */}
      {hasDetail && (
        <button
          onClick={onOpenDetail}
          className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-emerald-700 transition-colors group/detail"
        >
          <BarChart3 size={14} className="group-hover/detail:scale-110 transition-transform" />
          View Outputs & Insights
        </button>
      )}

      {/* Technology Stack Tags */}
      <div className="flex flex-wrap gap-2 pt-8 border-t border-zinc-100 mt-auto">
        {project.tags.map((tag: string) => (
          <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-zinc-600 transition-colors px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}


/* ─── Project Detail Modal ─────────────────────────────────────── */

function ProjectDetailModal({ project, onClose }: { project: any; onClose: () => void }) {
  const [activeSlide, setActiveSlide] = useState(0);
  const gallery: { src: string; caption: string }[] = project.gallery || [];
  const insights: string[] = project.insights || [];
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setActiveSlide((s) => Math.min(s + 1, gallery.length - 1));
      if (e.key === 'ArrowLeft') setActiveSlide((s) => Math.max(s - 1, 0));
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [gallery.length, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm" />

      {/* Modal Content */}
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.92, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-all"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="px-8 md:px-12 pt-10 pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">
              {project.category}
            </span>
            {project.subtitle && (
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                {project.subtitle}
              </span>
            )}
          </div>
          <h3 className="font-display font-extrabold text-3xl md:text-4xl uppercase tracking-tight text-zinc-900 mb-3">
            {project.title}
          </h3>
          <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-3xl">
            {project.description}
          </p>

          {/* Tech Tags */}
          <div className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((tag: string) => (
              <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3 py-1.5 rounded-full bg-zinc-50 border border-zinc-100">
                {tag}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex gap-3 mt-6">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:text-indigo-600 transition-colors bg-zinc-50 hover:bg-indigo-50 px-5 py-2.5 rounded-full border border-zinc-200 hover:border-indigo-200"
              >
                <Github size={14} />
                View on GitHub
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white bg-zinc-900 hover:bg-indigo-600 px-5 py-2.5 rounded-full transition-colors"
              >
                <ExternalLink size={14} />
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Image Gallery */}
        {gallery.length > 0 && (
          <div className="px-8 md:px-12 py-8">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-6">
              <BarChart3 size={14} className="text-emerald-500" />
              Project Outputs
            </h4>

            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="relative w-full" style={{ paddingBottom: '52%' }}>
                      <Image
                        src={gallery[activeSlide].src}
                        alt={gallery[activeSlide].caption}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, 800px"
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {gallery.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveSlide((s) => Math.max(s - 1, 0))}
                      disabled={activeSlide === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-zinc-900 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      onClick={() => setActiveSlide((s) => Math.min(s + 1, gallery.length - 1))}
                      disabled={activeSlide === gallery.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-zinc-900 shadow-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* Caption */}
              <p className="text-center text-sm text-zinc-500 font-medium mt-4">
                {gallery[activeSlide].caption}
              </p>

              {/* Thumbnail Dots */}
              {gallery.length > 1 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {gallery.map((_: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                        idx === activeSlide
                          ? 'bg-indigo-500 scale-125'
                          : 'bg-zinc-300 hover:bg-zinc-400'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Thumbnail Strip */}
              {gallery.length > 1 && (
                <div className="flex gap-3 mt-5 justify-center">
                  {gallery.map((img: any, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`relative w-24 h-16 md:w-32 md:h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        idx === activeSlide
                          ? 'border-indigo-500 shadow-lg shadow-indigo-200/50 scale-105'
                          : 'border-zinc-200 hover:border-zinc-300 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img.src}
                        alt={img.caption}
                        fill
                        className="object-cover"
                        sizes="128px"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Key Insights */}
        {insights.length > 0 && (
          <div className="px-8 md:px-12 pb-10">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-5">
              <Lightbulb size={14} className="text-amber-500" />
              Key Insights
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {insights.map((insight: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 bg-gradient-to-r from-amber-50/80 to-orange-50/40 rounded-xl px-5 py-4 border border-amber-100/60"
                >
                  <span className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-zinc-700 font-medium leading-relaxed">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
