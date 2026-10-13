/** Payload-style architectural grid + soft charcoal wash. Shared by landing sections. */
export function LandingAtmosphere({
  className = "",
  wash = "center",
}: {
  className?: string;
  wash?: "center" | "left" | "right" | "bottom";
}) {
  const washPos =
    wash === "left"
      ? "ellipse 55% 50% at 15% 40%"
      : wash === "right"
        ? "ellipse 55% 50% at 85% 45%"
        : wash === "bottom"
          ? "ellipse 70% 45% at 50% 100%"
          : "ellipse 60% 50% at 50% 35%";

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(${washPos}, var(--marketing-wash), transparent 70%),
            linear-gradient(180deg, var(--site-bg), var(--site-bg))
          `,
        }}
      />
      {/* Vertical architectural lines — Payload signature */}
      <div
        className="absolute inset-0 opacity-[0.9]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            to right,
            transparent 0,
            transparent calc(12.5% - 1px),
            var(--marketing-grid) calc(12.5% - 1px),
            var(--marketing-grid) 12.5%
          )`,
          maskImage:
            "linear-gradient(180deg, transparent 0%, black 12%, black 88%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.18]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "160px 160px",
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
