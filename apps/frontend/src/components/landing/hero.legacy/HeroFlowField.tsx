"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { createOrbitRenderer } from "./orbitRenderer";
import { useTheme } from "@/components/theme/ThemeProvider";

const FRAME_INTERVAL = 1000 / 60;

function entrance(time: number, start: number, end: number) {
  const progress = Math.max(0, Math.min(1, (time - start) / (end - start)));
  return progress * progress * (3 - 2 * progress);
}

export function HeroFlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const elapsedRef = useRef(0);
  const reduce = useReducedMotion();
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const hero = canvas.closest("section");
    let renderer: ReturnType<typeof createOrbitRenderer> = null;
    let frame = 0;
    let elapsed = elapsedRef.current;
    let previousTime = 0;
    let previousDraw = 0;
    let inView = true;
    let contextLost = false;
    const reducedMotion =
      reduce ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0, strength: 0 };
    let pointerStrength = 0;

    const draw = () => {
      renderer?.draw(elapsed, pointer, {
        strands: reducedMotion ? 1 : entrance(elapsed, 0, 2),
        dots: reducedMotion ? 1 : entrance(elapsed, 1.2, 3),
        comets: reducedMotion ? 1 : entrance(elapsed, 3, 5),
      });
    };
    const tick = (time: number) => {
      frame = 0;
      if (!renderer || document.hidden || !inView || contextLost || reducedMotion)
        return;
      const delta = previousTime
        ? Math.min((time - previousTime) / 1000, 0.1)
        : 0;
      elapsed += delta;
      elapsedRef.current = elapsed;
      pointer.strength +=
        (pointerStrength - pointer.strength) * Math.min(1, delta * 12);
      previousTime = time;
      if (!previousDraw || time - previousDraw >= FRAME_INTERVAL) {
        draw();
        previousDraw = time - ((time - previousDraw) % FRAME_INTERVAL);
      }
      frame = requestAnimationFrame(tick);
    };
    const updatePlayback = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previousTime = previousDraw = 0;
      if (renderer && !document.hidden && inView && !contextLost && !reducedMotion) {
        frame = requestAnimationFrame(tick);
      }
    };
    const resize = () => {
      renderer?.resize();
      draw();
    };
    const initialize = () => {
      renderer?.dispose();
      try {
        renderer = createOrbitRenderer(canvas);
      } catch (error) {
        console.warn("The hero orbit could not initialize", error);
        renderer = null;
      }
      resize();
      updatePlayback();
    };
    const onPointerMove = (event: PointerEvent) => {
      if (reducedMotion || event.pointerType === "touch") return;
      const bounds = canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = 1 - ((event.clientY - bounds.top) / bounds.height) * 2;
      pointerStrength = 0.045;
    };
    const onPointerLeave = () => {
      pointerStrength = 0;
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      updatePlayback();
    };
    const onContextRestored = () => {
      contextLost = false;
      initialize();
    };

    initialize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });
    intersectionObserver.observe(canvas);
    document.addEventListener("visibilitychange", updatePlayback);
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    hero?.addEventListener("pointermove", onPointerMove);
    hero?.addEventListener("pointerleave", onPointerLeave);
    hero?.addEventListener("pointercancel", onPointerLeave);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      hero?.removeEventListener("pointermove", onPointerMove);
      hero?.removeEventListener("pointerleave", onPointerLeave);
      hero?.removeEventListener("pointercancel", onPointerLeave);
      renderer?.dispose();
    };
  }, [reduce, theme]);

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
