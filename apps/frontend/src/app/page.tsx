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
 * To restore it, swap the import above for:
 *   import { LandingHeroLegacy as LandingHero } from "@/components/landing/LandingHero.legacy";
 * and remove the section components below if you only want the old single-hero page.
 */

export default function Home() {
  return (
    <div className="marketing-page min-h-[100dvh] bg-[var(--site-bg)] text-[var(--site-text)]">
      <LandingNav />
      <main>
        <LandingHero />
        <LandingFeatures />
        <LandingSecurity />
        <LandingHowItWorks />
      </main>
      <LandingFooter />
    </div>
  );
}
