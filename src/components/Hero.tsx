'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { ArrowDown, Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { personal } from '@/data/portfolio';
import MagneticButton from './MagneticButton';

const heroTextAnim = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

const handleSmooth = (selector: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
};

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Scroll-driven avatar → profile photo morph
  // Avatar fades + rotates + shrinks — initiates the morph sequence
  const avatarOpacity  = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const avatarRotate   = useTransform(scrollYProgress, [0, 0.28], [0, 14]);
  const avatarScale    = useTransform(scrollYProgress, [0, 0.28], [1, 0.78]);
  // Profile photo card: materialises as avatar fades
  const photoOpacity   = useTransform(scrollYProgress, [0.15, 0.42], [0, 1]);
  // Container drifts far downward — creates genuine spatial travel illusion
  const containerScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.68]);
  const containerY     = useTransform(scrollYProgress, [0, 0.55], [0, 320]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const targetX = clientX - window.innerWidth / 2;
    const targetY = clientY - window.innerHeight / 2;
    mouseX.set(targetX);
    mouseY.set(targetY);
  };

  const springConfig = { damping: 50, stiffness: 400 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const parallaxX = useTransform(smoothMouseX, [-800, 800], [15, -15]);
  const parallaxY = useTransform(smoothMouseY, [-400, 400], [15, -15]);

  // ── Unicorn Studio — lazy load, show only on confirmed success ──────────
  const [unicornState, setUnicornState] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let mounted = true;
    // Hard timeout: if animation hasn't initialised in 9 s, fall back to avatar
    const clearTo = setTimeout(() => mounted && setUnicornState('failed'), 9000);

    const tryInit = () => {
      try {
        const us = (window as any).UnicornStudio;
        if (us && us.init) {
          us.init();
          // Give the animation ~900 ms to start rendering before we show it
          setTimeout(() => { mounted && setUnicornState('ready'); }, 900);
        } else {
          mounted && setUnicornState('failed');
        }
      } catch {
        mounted && setUnicornState('failed');
      }
      clearTimeout(clearTo);
    };

    // If script was already loaded by a previous render cycle, re-use it
    if ((window as any).UnicornStudio?.isInitialized) {
      clearTimeout(clearTo);
      mounted && setUnicornState('ready');
    } else {
      const script = document.createElement('script');
      script.src =
        'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.3/dist/unicornStudio.umd.js';
      script.onload = tryInit;
      script.onerror = () => {
        clearTimeout(clearTo);
        mounted && setUnicornState('failed');
      };
      (document.head || document.body).appendChild(script);
    }

    // ── Aggressively hide any Unicorn Studio watermark badge ──────────
    const hideBadge = () => {
      document.querySelectorAll('a, div, span, p, iframe, img').forEach((el) => {
        const htmlEl = el as HTMLElement;
        const text = htmlEl.innerText || el.textContent || '';
        const href = (el as HTMLAnchorElement).href || '';
        const src = (el as HTMLIFrameElement).src || '';
        if (
          text.toLowerCase().includes('unicorn.studio') ||
          href.toLowerCase().includes('unicorn.studio') ||
          href.toLowerCase().includes('unicornstudio') ||
          src.toLowerCase().includes('unicorn.studio') ||
          htmlEl.hasAttribute('data-us-badge') ||
          htmlEl.style?.zIndex === '99999'
        ) {
          htmlEl.style.cssText += ';display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;overflow:hidden!important;';
        }
      });
    };
    const badgeObserver = new MutationObserver(hideBadge);
    badgeObserver.observe(document.body, { childList: true, subtree: true });
    hideBadge();
    // Belt-and-suspenders: periodically re-check for late-injected badge
    const badgeInterval = setInterval(hideBadge, 800);

    return () => {
      mounted = false;
      clearTimeout(clearTo);
      clearInterval(badgeInterval);
      badgeObserver.disconnect();
    };
  }, []);

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex flex-col bg-white overflow-hidden"
    >
      {/* ── Unicorn Studio interactive background ─────────────────────── */}
      <div
        className={`absolute inset-0 z-0 overflow-hidden transition-opacity duration-1000 ${
          unicornState === 'ready' ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Animation container — fills the full hero height */}
        <div
          id="hero-animation"
          data-us-project="4EkUlO27FetnDjLXopdJ"
          data-us-production="true"
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
      </div>

      {/* Subtle grid — fades out when Unicorn animation is active */}
      <div
        className={`absolute inset-0 pointer-events-none grid-bg transition-opacity duration-700 ${
          unicornState === 'ready' ? 'opacity-0' : 'opacity-60'
        }`}
      />

      {/* Floating decorative dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { cx: '8%', cy: '20%', r: 3, delay: '0s' },
          { cx: '93%', cy: '15%', r: 2.5, delay: '0.4s' },
          { cx: '85%', cy: '75%', r: 4, delay: '0.8s' },
          { cx: '12%', cy: '80%', r: 2, delay: '1.2s' },
          { cx: '50%', cy: '90%', r: 2.5, delay: '0.2s' },
          { cx: '72%', cy: '35%', r: 2, delay: '0.6s' },
        ].map((dot, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 0.25, scale: 1 }}
            transition={{ delay: 1.2 + i * 0.15, duration: 0.5 }}
            style={{ left: dot.cx, top: dot.cy, width: dot.r * 2, height: dot.r * 2 }}
            className="absolute rounded-full bg-zinc-400"
          />
        ))}
      </div>

      {/* Top fade */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent z-10 pointer-events-none" />

      <div className="relative z-20 flex-1 max-w-[1400px] mx-auto w-full px-6 md:px-10 pt-32 pb-16 flex flex-col justify-center">

        {/* Availability badge */}
        <motion.div
          custom={0.2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex items-center gap-4 mb-10"
        >
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot inline-block" />
            Available for opportunities
          </span>
          <span className="hidden sm:block text-xs text-zinc-400 font-medium tracking-widest uppercase">
            Phagwara, India
          </span>
        </motion.div>

        {/* Main Hero Container */}
        <div className="w-full flex-1 flex flex-col justify-center items-center mt-12 md:mt-20">
          <div className="w-full flex flex-col items-center relative">
            {/* Top Label */}
            <motion.div
              custom={0.1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="w-full flex justify-between items-end mb-4 lg:mb-8"
            >
               <span className="font-display text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-zinc-500">
                01 / {personal.firstName} {personal.lastName}
              </span>
              <span className="hidden md:block font-display text-sm md:text-base font-semibold uppercase tracking-[0.2em] text-zinc-500">
                {personal.title || "ML ENGINEER"}
              </span>
            </motion.div>

            {/* Split Header Layout — 3-col grid: name | avatar | name */}
            <motion.div
              style={{ x: parallaxX, y: parallaxY }}
              className="relative w-full grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-center gap-0 lg:gap-12"
            >
              {/* Left Name */}
              <motion.h1
                custom={0.2}
                variants={heroTextAnim}
                initial="hidden"
                animate="visible"
                className="font-display font-black text-[22vw] sm:text-[20vw] lg:text-[14vw] xl:text-[220px] leading-[0.8] tracking-[-0.05em] text-zinc-900 select-none z-10 text-center lg:text-right"
              >
                {personal.firstName.toUpperCase()}
              </motion.h1>

              {/* Center Image — grid cell keeps avatar exactly centered */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 40, x: -12 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [8, 2, 8],
                  x: -12
                }}
                transition={{
                  opacity: { delay: 0.3, duration: 0.8 },
                  scale: { delay: 0.3, duration: 0.8 },
                  y: {
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  x: { delay: 0.3, duration: 0.8 },
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative z-20 mx-auto my-8 lg:my-0 w-[240px] h-[320px] sm:w-[280px] sm:h-[380px] lg:w-[320px] lg:h-[420px] lg:-mx-12 xl:-mx-16"
              >
                {/* Scroll-driven morph container — hidden when Unicorn Studio is active */}
                {unicornState !== 'ready' && (
                  <>
                    <motion.div
                      style={{ scale: containerScale, y: containerY }}
                      className="absolute inset-0"
                    >
                      {/* Profile photo card — materialises as a real card during scroll */}
                      <motion.div
                        style={{ opacity: photoOpacity }}
                        className="absolute inset-0 rounded-[2rem] overflow-hidden bg-zinc-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-zinc-200"
                      >
                        <Image
                          src={personal.profileImage}
                          alt={personal.name}
                          fill
                          className="object-cover object-top"
                          priority
                        />
                      </motion.div>
                    </motion.div>

                    {/* Avatar PNG — sharpened, floats, rotates + evaporates on scroll */}
                    <motion.div
                      style={{ opacity: avatarOpacity, rotate: avatarRotate, scale: avatarScale }}
                      className="absolute inset-0"
                    >
                      {/* Inner float loop — -6 px subtle professional float */}
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-full h-full"
                        style={{
                          filter: 'contrast(1.05) brightness(1.02) drop-shadow(0 20px 40px rgba(0,0,0,0.12))',
                        } as React.CSSProperties}
                      >
                        <Image
                          src="/avatar.png"
                          alt="avatar"
                          fill
                          className="object-contain"
                          style={{ imageRendering: 'auto' }}
                          priority
                          quality={100}
                        />
                      </motion.div>
                    </motion.div>
                  </>
                )}
              </motion.div>

              {/* Right Name + Bio container */}
              <div className="flex flex-col items-center lg:items-start z-10 w-full">
                <motion.h1
                  custom={0.4}
                  variants={heroTextAnim}
                  initial="hidden"
                  animate="visible"
                  className="font-display font-black text-[22vw] sm:text-[20vw] lg:text-[14vw] xl:text-[220px] leading-[0.8] tracking-[-0.05em] text-zinc-900 select-none text-center lg:text-left w-full"
                >
                  {personal.lastName.toUpperCase()}
                </motion.h1>
                
                {/* Tucked Bio Area — Subtitle belongs to right column */}
                <motion.div
                  custom={0.5}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="w-full max-w-[280px] sm:max-w-sm mt-6 lg:mt-4 text-center lg:text-left"
                >
                  <p className="text-zinc-500 text-sm sm:text-base leading-relaxed font-medium">
                    {personal.tagline || "I'm a US-based... joke — I'm an India-based ML engineer"}
                  </p>
                </motion.div>
              </div>

            </motion.div>

            {/* Interaction button — standalone, always below the name/avatar grid */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 20 }}
              className="flex justify-center mt-8 lg:mt-10 relative z-10"
            >
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleSmooth('#about')}
                className="relative group cursor-pointer"
                aria-label="Scroll to About section"
              >
                {/* Pulsing ambient ring */}
                <motion.div
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 rounded-full bg-indigo-400/35 pointer-events-none"
                />
                {/* Glass circle */}
                <div className="relative w-14 h-14 rounded-full bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.9)] flex items-center justify-center group-hover:shadow-[0_12px_40px_-6px_rgba(99,102,241,0.45)] group-hover:border-indigo-200/80 transition-all duration-300">
                  <motion.span
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-zinc-500 group-hover:text-indigo-500 transition-colors duration-300"
                  >
                    <ArrowDown size={18} strokeWidth={2} />
                  </motion.span>
                </div>
              </motion.button>
            </motion.div>

            {/* Action buttons — centered under the avatar column */}
            <motion.div
              custom={0.6}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mt-16 lg:mt-20 relative z-10"
            >
              <MagneticButton className="w-full sm:w-auto">
                <a
                  href={personal.resume}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-indigo-500 text-white font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-indigo-600 hover:scale-[1.03] active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/30"
                >
                  Download Resume
                </a>
              </MagneticButton>
              <MagneticButton className="w-full sm:w-auto">
                <a
                  href="#projects"
                  onClick={handleSmooth('#projects')}
                  className="w-full inline-flex items-center justify-center gap-2 border border-zinc-200 text-zinc-800 font-semibold text-sm px-8 py-3.5 rounded-xl bg-white shadow-sm hover:bg-zinc-900 hover:text-white hover:border-zinc-900 hover:scale-[1.03] active:scale-95 transition-all duration-200"
                >
                  View Projects
                </a>
              </MagneticButton>
            </motion.div>

          </div>
        </div>

        {/* Scroll indicator — minimal bottom hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16 flex items-center gap-3 self-center"
        >
          <div className="flex flex-col items-center gap-1">
            <motion.div
              animate={{ scaleY: [0.4, 1, 0.4], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-zinc-400 origin-top"
            />
          </div>
          <span className="text-[10px] text-zinc-400 font-medium tracking-[0.22em] uppercase">Scroll</span>
        </motion.div>
      </div>

      <div className="relative z-20 w-full border-t border-zinc-200" />
    </section>
  );
}
