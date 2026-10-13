"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties } from "react";

type FileKind = "document" | "image" | "folder" | "locked";

type FloatingFileProps = {
  kind: FileKind;
  className?: string;
  style?: CSSProperties;
  duration?: number;
  delay?: number;
};

function DocumentGlyph({ locked = false }: { locked?: boolean }) {
  return (
    <svg viewBox="0 0 64 80" className="h-full w-full" aria-hidden>
      <path
        d="M12 4h28l12 12v56a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
        fill="#151515"
        stroke="#8A8A8A"
        strokeWidth="1.4"
      />
      <path d="M40 4v12h12" fill="none" stroke="#8A8A8A" strokeWidth="1.4" />
      {locked ? (
        <>
          <rect x="24" y="38" width="16" height="14" rx="2" fill="#1a1a1a" stroke="#A52632" strokeWidth="1.3" />
          <path d="M28 38v-5a4 4 0 0 1 8 0v5" fill="none" stroke="#A52632" strokeWidth="1.3" />
        </>
      ) : (
        <>
          <line x1="16" y1="32" x2="44" y2="32" stroke="#6A6A6A" strokeWidth="1.4" />
          <line x1="16" y1="40" x2="40" y2="40" stroke="#6A6A6A" strokeWidth="1.4" />
          <line x1="16" y1="48" x2="36" y2="48" stroke="#6A6A6A" strokeWidth="1.4" />
          <text x="16" y="66" fill="#6A6A6A" fontSize="7" fontFamily="ui-sans-serif, system-ui">
            .pdf
          </text>
        </>
      )}
    </svg>
  );
}

function ImageGlyph() {
  return (
    <svg viewBox="0 0 72 56" className="h-full w-full" aria-hidden>
      <rect x="2" y="2" width="68" height="52" rx="4" fill="#151515" stroke="#8A8A8A" strokeWidth="1.4" />
      <path d="M8 40l14-14 10 10 8-8 16 16" fill="none" stroke="#6A6A6A" strokeWidth="1.4" />
      <circle cx="52" cy="16" r="5" fill="none" stroke="#6A6A6A" strokeWidth="1.4" />
    </svg>
  );
}

function FolderGlyph() {
  return (
    <svg viewBox="0 0 72 56" className="h-full w-full" aria-hidden>
      <path
        d="M4 16h20l6 6h38v28a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V16z"
        fill="#151515"
        stroke="#7A7A7A"
        strokeWidth="1.4"
      />
      <path d="M4 16V12a4 4 0 0 1 4-4h12l4 8" fill="none" stroke="#7A7A7A" strokeWidth="1.4" />
    </svg>
  );
}

export function FloatingFile({
  kind,
  className = "",
  style,
  duration = 16,
  delay = 0,
}: FloatingFileProps) {
  const reduce = useReducedMotion();

  const body =
    kind === "image" ? (
      <ImageGlyph />
    ) : kind === "folder" ? (
      <FolderGlyph />
    ) : (
      <DocumentGlyph locked={kind === "locked"} />
    );

  return (
    <motion.div
      className={`pointer-events-none absolute ${className}`}
      style={style}
      aria-hidden
      initial={reduce ? false : { opacity: 0 }}
      animate={
        reduce
          ? { opacity: 0.7 }
          : {
              opacity: [0.45, 0.85, 0.55, 0.8],
              y: [0, -10, 4, 0],
              x: [0, 6, -4, 0],
            }
      }
      transition={
        reduce
          ? { duration: 0.4 }
          : {
              duration,
              delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      {body}
    </motion.div>
  );
}
