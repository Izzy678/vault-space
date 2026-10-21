"use client";

import { useEffect, useRef, useState } from "react";
import { LandingBrand, LandingButton } from "./LandingUi";
import styles from "./landing.module.css";

const links = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Security", href: "#security" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setOpen(false);
    }
    const desktop = window.matchMedia("(min-width: 900px)");
    const onResize = () => { if (desktop.matches) setOpen(false); };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header ref={header} className={styles.header}>
      <div className={styles.navbar}>
        <LandingBrand />
        <nav className={styles.desktopNav} aria-label="Primary">
          {links.map((link) => <a key={link.href} href={link.href}>{link.label}</a>)}
        </nav>
        <div className={styles.navActions}>
          <LandingButton href="/login" secondary small>Sign in</LandingButton>
          <LandingButton href="/register" small>Create account</LandingButton>
        </div>
        <button
          ref={menuButton}
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setOpen(!open)}
        >{open ? "Close" : "Menu"}</button>
      </div>
      {open && (
        <nav id="landing-mobile-menu" className={styles.mobileMenu} aria-label="Mobile">
          {links.map((link) => <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>)}
          <div onClick={() => setOpen(false)}>
            <LandingButton href="/login" secondary small>Sign in</LandingButton>
            <LandingButton href="/register" small>Create account</LandingButton>
          </div>
        </nav>
      )}
    </header>
  );
}
