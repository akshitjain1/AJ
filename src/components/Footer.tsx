'use client';

import { ArrowUpRight, Github, Linkedin, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';
import { personal } from '@/data/portfolio';

const quickLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-zinc-900 text-white pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-12 mb-12 pb-12 border-b border-zinc-800">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center overflow-hidden relative">
                <Image 
                  src="/favicon.png" 
                  alt="AJ Logo" 
                  fill 
                  className="object-cover"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight">Akshit Jain</span>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs">
              ML Engineer & Developer building intelligent solutions. Always learning, always growing.
            </p>
            <div className="flex items-center gap-4 mt-5">
              {[
                { icon: Github, href: personal.social.github, label: 'GitHub' },
                { icon: Linkedin, href: personal.social.linkedin, label: 'LinkedIn' },
                { icon: Twitter, href: personal.social.twitter, label: 'Twitter' },
                { icon: Instagram, href: personal.social.instagram, label: 'Instagram' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-all"
                >
                  <Icon size={13} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-5">Quick Links</p>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="text-sm text-zinc-400 hover:text-white transition-colors hover-underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium mb-5">Get In Touch</p>
            <div className="flex flex-col gap-3">
              <a
                href={`mailto:${personal.email}`}
                className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              >
                {personal.email}
                <ArrowUpRight size={11} />
              </a>
              <p className="text-sm text-zinc-500">{personal.location}</p>
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                Available for work
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-zinc-500 text-xs">
            © {year} Akshit Jain. All rights reserved.
          </p>
          <p className="text-zinc-600 text-xs">
            Designed & built by{' '}
            <span className="text-zinc-400 font-medium">Akshit Jain</span>
            {' '}· Next.js · Tailwind · Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
