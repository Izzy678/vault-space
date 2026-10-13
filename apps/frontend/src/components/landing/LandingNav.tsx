"use client";

import Link from "next/link";
import { useState } from "react";
import { LogoMark } from "@/components/app/icons";
import { useTheme } from "@/components/theme/ThemeProvider";

const links = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
  { label: "FAQ", href: "#faq" },
];

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.1 1.1M11.5 11.5l1.1 1.1M12.6 3.4l-1.1 1.1M4.5 11.5l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M13.2 9.2A5.5 5.5 0 0 1 6.8 2.8 5.6 5.6 0 1 0 13.2 9.2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function LandingNav() {
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-nav-border bg-[var(--marketing-glass)] backdrop-blur-xl">
      <div className="mx-auto flex h-[64px] max-w-[1280px] items-center justify-between gap-6 px-5 md:px-8 lg:px-10">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 text-nav-text transition-opacity hover:opacity-90"
        >
          <LogoMark />
          <span className="text-[17px] font-semibold tracking-tight">VaultSpace</span>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
          aria-label="Primary"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-nav-text transition-opacity hover:opacity-70"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-[8px] border border-nav-btn-border bg-nav-btn-bg px-4 text-[13px] font-medium text-nav-text transition-colors hover:bg-nav-text/5 active:scale-[0.98]"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex h-9 items-center justify-center rounded-[8px] bg-nav-cta-bg px-4 text-[13px] font-medium text-nav-cta-text transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Sign Up
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-nav-btn-border text-nav-text transition-colors hover:bg-nav-text/5 active:scale-[0.98]"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-nav-btn-border text-nav-text lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {open ? (
        <div
          id="mobile-nav"
          className="border-t border-nav-border bg-[var(--marketing-glass)] px-5 py-4 backdrop-blur-xl lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-[8px] px-3 py-2.5 text-[14px] font-medium text-nav-text hover:bg-nav-text/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex items-center gap-2.5 border-t border-nav-border pt-4">
            <Link
              href="/login"
              className="inline-flex h-9 flex-1 items-center justify-center rounded-[8px] border border-nav-btn-border text-[13px] font-medium text-nav-text"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex h-9 flex-1 items-center justify-center rounded-[8px] bg-nav-cta-bg text-[13px] font-medium text-nav-cta-text"
              onClick={() => setOpen(false)}
            >
              Sign Up
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-nav-btn-border text-nav-text"
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
