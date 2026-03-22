'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1, y: 0 }}
          exit={{ 
            y: "-100%",
            transition: { 
              duration: 1, 
              ease: [0.76, 0, 0.24, 1] // Custom cubic-bezier for 'Executive' feel
            }
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
          {/* Main content container */}
          <div className="relative flex flex-col items-center">
            
            {/* Minimalist Top Segment */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="flex flex-col items-center gap-2 mb-12"
            >
              <h2 className="font-display font-extrabold text-3xl md:text-5xl uppercase tracking-tighter text-zinc-900">
                AKSHIT JAIN
              </h2>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-[1px] bg-zinc-200" />
                 <span className="text-[10px] uppercase tracking-[0.6em] font-bold text-zinc-400">
                   Software Engineer
                 </span>
                 <div className="w-8 h-[1px] bg-zinc-200" />
              </div>
            </motion.div>

            {/* Elegant Line Loader */}
            <div className="w-48 md:w-64 h-[2px] bg-zinc-50 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute top-0 left-0 h-full bg-zinc-900"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>

            {/* Bottom Versioning / Branding */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-[-15vh] whitespace-nowrap"
            >
              <span className="text-[9px] uppercase tracking-[0.3em] font-medium text-zinc-500">
                Strategic Implementation • v2.0.24
              </span>
            </motion.div>
          </div>

          {/* Luxury exit overlays */}
          <motion.div 
            initial={{ opacity: 0 }}
            exit={{ 
              opacity: 1,
              transition: { duration: 0.3 }
            }}
            className="absolute inset-0 bg-white z-[-1]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
