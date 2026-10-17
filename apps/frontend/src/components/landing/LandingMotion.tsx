"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Progressive enhancement: content stays visible without JavaScript or motion. */
export function LandingMotion({ children, className }: { children: ReactNode; className: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !window.IntersectionObserver || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(root.current.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.reveal = "visible";
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08 });

    for (const element of elements) {
      if (element.getBoundingClientRect().top > window.innerHeight) element.dataset.reveal = "pending";
      observer.observe(element);
    }
    root.current.dataset.motionReady = "true";
    return () => {
      observer.disconnect();
      for (const element of elements) element.dataset.reveal = "";
    };
  }, []);

  return <div ref={root} className={className} data-landing-theme="classic">{children}</div>;
}
