'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
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
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`pointer-events-auto flex items-center gap-2 sm:gap-4 pl-2 pr-2 py-2 rounded-full border transition-all duration-500 ${
            scrolled
              ? 'navbar-blur border-zinc-200/80 shadow-xl shadow-zinc-200/40 bg-white/80'
              : 'bg-white/60 backdrop-blur-md border-zinc-200/40 shadow-lg shadow-zinc-200/20'
          }`}
        >
          {/* Logo / Avatar */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            className="flex items-center group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-9 h-9 rounded-full flex items-center justify-center bg-zinc-900 border border-white/20 shadow-sm group-hover:scale-110 transition-all overflow-hidden relative">
                <Image src="/favicon.png" alt="AJ Logo" fill className="object-cover" />
              </div>
              <span className="font-display font-black text-zinc-900 text-base tracking-tighter group-hover:text-indigo-600 transition-colors hidden sm:block">AJ</span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center px-2">
            <div className="flex items-center gap-1">
              {navLinks.filter(l => l.label !== 'Contact').map((link) => {
                const sectionId = link.href.replace('#', '');
                const isActive = activeSection === sectionId;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link.href);
                    }}
                    className={`relative px-4 py-2 text-[13px] font-semibold transition-all rounded-full hover:bg-zinc-100 ${
                      isActive ? 'text-zinc-900 bg-zinc-50' : 'text-zinc-500 hover:text-zinc-900'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute bottom-1 left-4 right-4 h-0.5 bg-zinc-900 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>
          </nav>

          {/* CTA Area */}
          <div className="flex items-center gap-1">
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                handleLinkClick('#contact');
              }}
              className="bg-zinc-900 text-white text-[13px] font-bold px-6 py-2.5 rounded-full hover:bg-zinc-800 transition-all hover:scale-105 active:scale-95 shadow-md shadow-zinc-200"
            >
              Contact
            </a>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden w-10 h-10 flex flex-col justify-center items-center gap-1.5 rounded-full bg-zinc-50 hover:bg-zinc-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-4 h-0.5 bg-zinc-900 rounded-full"
                animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6.5 : 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-4 h-0.5 bg-zinc-900 rounded-full"
                animate={{ opacity: menuOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block w-4 h-0.5 bg-zinc-900 rounded-full"
                animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6.5 : 0 }}
                transition={{ duration: 0.2 }}
              />
            </button>
          </div>
        </motion.header>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-[88px] z-40 bg-white/95 backdrop-blur-xl border border-zinc-200 shadow-2xl rounded-3xl overflow-hidden md:hidden"
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
