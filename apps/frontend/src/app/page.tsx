import { brandFont } from "@/components/brand/font";
import { LandingContent } from "@/components/landing/LandingContent";
import { LandingMotion } from "@/components/landing/LandingMotion";
import { LandingNav } from "@/components/landing/LandingNav";
import styles from "@/components/landing/landing.module.css";

export default function Home() {
  return (
    <LandingMotion className={`${brandFont.variable} ${styles.page}`}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <LandingNav />
      <LandingContent />
    </LandingMotion>
  );
}
