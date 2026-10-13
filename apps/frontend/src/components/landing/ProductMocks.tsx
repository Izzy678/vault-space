import Image from "next/image";

/**
 * Real app screenshots (dark theme) captured from the running product.
 * Stored in /public/marketing/
 */

type ShotProps = {
  className?: string;
  priority?: boolean;
};

function ShotFrame({
  src,
  alt,
  className = "",
  priority = false,
  aspect = "video",
}: ShotProps & { src: string; alt: string; aspect?: "video" | "wide" }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-app-border bg-app-bg shadow-[0_28px_80px_rgb(16_24_40_/_18%)] dark:shadow-[0_28px_80px_rgb(0_0_0_/_45%)] ${className}`}
    >
      <div
        className={`relative w-full ${
          aspect === "wide" ? "aspect-[16/10]" : "aspect-[16/11]"
        }`}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className="object-cover object-top"
          sizes="(max-width: 768px) 100vw, 560px"
        />
      </div>
    </div>
  );
}

export function DashboardMock({ className = "", priority = false }: ShotProps) {
  return (
    <ShotFrame
      src="/marketing/marketing-dashboard-dark.png"
      alt="VaultSpace dashboard with encrypted files"
      className={className}
      priority={priority}
    />
  );
}

export function ShareMock({ className = "" }: ShotProps) {
  return (
    <ShotFrame
      src="/marketing/marketing-share-dark.png"
      alt="Share encrypted file by re-wrapping the key to a contact"
      className={className}
    />
  );
}

export function UnlockMock({ className = "" }: ShotProps) {
  return (
    <ShotFrame
      src="/marketing/marketing-unlock-dark.png"
      alt="Vault unlock flow — passphrase stays in the browser"
      className={className}
      aspect="wide"
    />
  );
}

export function EncryptFlowMock({ className = "" }: ShotProps) {
  return (
    <ShotFrame
      src="/marketing/marketing-file-detail-dark.png"
      alt="Encrypted files listed in the VaultSpace vault"
      className={className}
    />
  );
}

export function KeyMaterialMock({ className = "" }: ShotProps) {
  return (
    <ShotFrame
      src="/marketing/marketing-crypto-details-dark.png"
      alt="VaultSpace app showing encrypted storage overview"
      className={className}
      aspect="wide"
    />
  );
}

/** Layered hero composition like Payload — real dashboard + secondary pane */
export function HeroProductStack() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] lg:max-w-none">
      <div className="absolute -left-2 top-8 hidden w-[52%] max-w-[320px] -rotate-2 opacity-90 lg:block xl:-left-4">
        <div className="overflow-hidden rounded-xl border border-app-border shadow-[0_20px_60px_rgb(0_0_0_/_40%)]">
          <div className="relative aspect-[4/5] w-full">
            <Image
              src="/marketing/marketing-unlock-dark.png"
              alt=""
              fill
              className="object-cover object-left"
              sizes="320px"
              aria-hidden
            />
          </div>
        </div>
      </div>
      <div className="relative z-10 lg:ml-[6%]">
        <DashboardMock priority />
      </div>
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--marketing-glow-soft)" }}
        aria-hidden
      />
    </div>
  );
}
