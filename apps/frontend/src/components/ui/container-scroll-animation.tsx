"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import styles from "./container-scroll-animation.module.css";

const mobileQuery = "(max-width: 768px)";
function subscribeToViewport(callback: () => void) {
  const query = window.matchMedia(mobileQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getMobileSnapshot = () => window.matchMedia(mobileQuery).matches;
const getServerSnapshot = () => false;

export function ContainerScroll({ titleComponent, children, className }: {
  titleComponent: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useSyncExternalStore(subscribeToViewport, getMobileSnapshot, getServerSnapshot);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Complete the tilt while the product is still comfortably in view.
    offset: ["start start", "end center"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const rotate = useTransform(progress, [0, 1], isMobile ? [8, 0] : [20, 0]);
  const scale = useTransform(progress, [0, 1], isMobile ? [0.98, 1] : [1.04, 1]);
  const translate = useTransform(progress, [0, 1], isMobile ? [8, -12] : [20, -36]);
  const titleTranslate = useTransform(progress, [0, 1], [0, -28]);

  return (
    <div ref={containerRef} className={cn(styles.container, className)} data-ui="container-scroll">
      <Header translate={titleTranslate} reduceMotion={!!reduceMotion} titleComponent={titleComponent} />
      <div className={styles.perspective}>
        <Card rotate={rotate} scale={scale} translate={translate} reduceMotion={!!reduceMotion}>
          {children}
        </Card>
      </div>
    </div>
  );
}

export function Header({ translate, titleComponent, reduceMotion = false }: {
  translate: MotionValue<number>;
  titleComponent: ReactNode;
  reduceMotion?: boolean;
}) {
  return <motion.div className={styles.header} style={{ y: reduceMotion ? 0 : translate }}>{titleComponent}</motion.div>;
}

export function Card({ rotate, scale, translate, children, reduceMotion = false }: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: ReactNode;
  reduceMotion?: boolean;
}) {
  return (
    <motion.div
      className={styles.card}
      data-ui="scroll-card"
      style={{ rotateX: reduceMotion ? 0 : rotate, scale: reduceMotion ? 1 : scale, y: reduceMotion ? 0 : translate }}
    >
      {children}
    </motion.div>
  );
}
