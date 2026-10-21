"use client";

import { useRef, useSyncExternalStore, type ReactNode } from "react";
import {
  motion, useScroll, useTransform, type MotionValue,
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

const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeToMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
const getMotionSnapshot = () => window.matchMedia(motionQuery).matches;
const getMotionServerSnapshot = () => false;

export function ContainerScroll({ titleComponent, children, caption, className }: {
  titleComponent: ReactNode;
  children: ReactNode;
  caption?: ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useSyncExternalStore(subscribeToViewport, getMobileSnapshot, getServerSnapshot);
  const reduceMotion = useSyncExternalStore(subscribeToMotion, getMotionSnapshot, getMotionServerSnapshot);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    // The card is upright when its bottom reaches the viewport's bottom.
    offset: ["start end", "end end"],
  });
  // Follow scrolling directly so a spring cannot leave a visible card tilted.
  const rotate = useTransform(scrollYProgress, [0, 1], isMobile ? [8, 0] : [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.98, 1] : [0.96, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], isMobile ? [8, 0] : [20, 0]);
  const titleTranslate = useTransform(scrollYProgress, [0, 1], [0, -28]);

  return (
    <div className={cn(styles.container, className)} data-ui="container-scroll">
      <Header translate={titleTranslate} reduceMotion={!!reduceMotion} titleComponent={titleComponent} />
      <figure className={styles.figure}>
        <div ref={cardRef} className={styles.perspective}>
          <Card rotate={rotate} scale={scale} translate={translate} reduceMotion={!!reduceMotion}>
            {children}
          </Card>
        </div>
        {caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
      </figure>
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
