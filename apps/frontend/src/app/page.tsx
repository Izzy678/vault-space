import { LandingHeroLegacy as LandingHero } from "@/components/landing/LandingHero.legacy";
import { LandingNav } from "@/components/landing/LandingNav";

export default function Home() {
  return (
    <div className="marketing-page min-h-[100dvh] bg-[var(--site-bg)] text-[var(--site-text)]">
      <LandingNav />
      <main>
        <LandingHero />
      </main>
    </div>
  );
}
