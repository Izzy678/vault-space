"use client";

import { motion, useReducedMotion } from "motion/react";

export function ProtectedCore() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-none absolute left-1/2 top-[54%] z-[2] h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 md:h-[180px] md:w-[180px]"
      aria-hidden
      initial={reduce ? false : { opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="absolute inset-[-18%] rounded-full bg-[radial-gradient(circle,rgba(165,38,50,0.18),transparent_68%)] blur-md" />
      <svg viewBox="0 0 180 180" className="h-full w-full">
        <defs>
          <radialGradient id="core-fill" cx="34%" cy="28%" r="70%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="45%" stopColor="#121212" />
            <stop offset="100%" stopColor="#050505" />
          </radialGradient>
          <linearGradient id="core-sheen" x1="20%" y1="10%" x2="70%" y2="80%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.28)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(165,38,50,0.2)" />
          </linearGradient>
        </defs>
        <circle cx="90" cy="90" r="54" fill="url(#core-fill)" />
        <circle cx="90" cy="90" r="54" fill="url(#core-sheen)" />
        <circle cx="90" cy="90" r="54" fill="none" stroke="rgba(181,181,181,0.35)" strokeWidth="1" />
        <circle cx="90" cy="90" r="40" fill="none" stroke="rgba(165,38,50,0.35)" strokeWidth="1" />
        <circle cx="90" cy="90" r="10" fill="#0a0a0a" stroke="rgba(181,181,181,0.4)" strokeWidth="1" />
      </svg>
    </motion.div>
  );
}
