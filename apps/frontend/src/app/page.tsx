import { LandingFAQ } from "@/components/landing/LandingFAQ";
import { LandingFeatures } from "@/components/landing/LandingFeatures";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingHowItWorks } from "@/components/landing/LandingHowItWorks";
import { LandingNav } from "@/components/landing/LandingNav";
import { LandingSecurity } from "@/components/landing/LandingSecurity";

/*
 * LEGACY HERO FALLBACK
 * --------------------
 * Previous orbit hero lives at:
 *   @/components/landing/LandingHero.legacy
 *   @/components/landing/hero.legacy/*
 *
 * To restore it, swap LandingHero for LandingHeroLegacy and trim sections below.
 */

export default function Home() {
  return (
    <div className="marketing-page min-h-[100dvh] bg-[var(--site-bg)] text-[var(--site-text)]">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingHowItWorks />
        <LandingSecurity />
        <LandingFAQ />
      </main>
      <LandingFooter />
    </div>
  );
}
