'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { personal } from '@/data/portfolio';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Resume', href: '#resume' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracker via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['home', 'about', 'services', 'projects', 'skills', 'journey', 'certifications', 'profiles', 'contact'];
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: '-40% 0px -55% 0px' }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const handleLinkClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
          scrolled
            ? 'navbar-blur border-b border-zinc-200/60 shadow-sm shadow-zinc-100/50 py-3 bg-white/70'
            : 'bg-white/40 backdrop-blur-md border-b border-zinc-200/40 py-4'
        }`}
      >
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            {/* Logo / Avatar */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleLinkClick('#home'); }}
            className="flex items-center group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-zinc-900 text-white font-display font-bold text-sm border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
              AJ
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '');
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  className={`relative text-sm font-medium transition-colors hover-underline ${
                    isActive ? 'text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-px bg-zinc-900"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>
          </div>

          {/* Right Area: CTA and Hamburger */}
          <div className="flex items-center gap-2">
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); handleLinkClick('#contact'); }}
              className="bg-zinc-900 text-white text-[13px] font-medium px-5 py-2.5 rounded-full hover:bg-zinc-800 transition-colors hidden sm:block shadow-sm"
            >
              Contact
            </a>

            {/* Hamburger */}
            <button
              className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200 transition-colors ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <motion.span
              className="block w-5 h-0.5 bg-zinc-900 rounded-full"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 7 : 0 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-zinc-900 rounded-full"
              animate={{ opacity: menuOpen ? 0 : 1 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="block w-5 h-0.5 bg-zinc-900 rounded-full"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -7 : 0 }}
              transition={{ duration: 0.2 }}
            />
          </button>
        </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[73px] z-40 bg-white/95 backdrop-blur-xl border-b border-zinc-200 shadow-xl overflow-hidden"
          >
            <nav className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleLinkClick(link.href); }}
                  className="text-base font-medium text-zinc-600 hover:text-zinc-900 py-1 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-zinc-100 flex gap-3">
                <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                  Available for work
                </span>
                <a
                  href="#contact"
                  onClick={(e) => { e.preventDefault(); handleLinkClick('#contact'); }}
                  className="bg-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-full text-center flex-1"
                >
                  Contact
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
