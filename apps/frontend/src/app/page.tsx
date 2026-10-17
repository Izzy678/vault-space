import localFont from "next/font/local";
import { LandingContent } from "@/components/landing/LandingContent";
import { LandingMotion } from "@/components/landing/LandingMotion";
import { LandingNav } from "@/components/landing/LandingNav";
import styles from "@/components/landing/landing.module.css";

const inter = localFont({
  src: "../components/landing/fonts/Inter-Latin.woff2",
  variable: "--font-landing-inter",
  weight: "100 900",
  style: "normal",
  display: "swap",
});

export default function Home() {
  return (
    <LandingMotion className={`${inter.variable} ${styles.page}`}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <LandingNav />
      <LandingContent />
    </LandingMotion>
  );
}
