import Link from "next/link";
import { LogoMark } from "@/components/app/icons";

function AuthBrand({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`inline-flex w-fit items-center gap-2.5 rounded-sm text-app-text outline-none focus-visible:ring-2 focus-visible:ring-app-focus focus-visible:ring-offset-4 ${className}`}
    >
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight">VaultSpace</span>
    </Link>
  );
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="app-root flex min-h-[100dvh] bg-app-bg text-app-text">
      <aside className="hidden min-h-[100dvh] w-1/2 flex-col border-r border-app-border bg-app-sidebar px-8 py-10 lg:flex xl:px-12 2xl:px-16">
        <AuthBrand />

        <div className="flex flex-1 items-center py-12">
          <div className="w-full max-w-[560px]">
            <h2 className="text-[32px] font-semibold leading-[1.2] tracking-[-0.035em] xl:text-[36px] 2xl:text-[44px]">
              <span className="block">Your files are encrypted</span>
              <span className="block">before they leave</span>
              <span className="block">your browser.</span>
            </h2>

            <figure className="mt-8" aria-label="How your files are protected">
              <div className="space-y-2.5 text-xs xl:text-[13px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <code className="rounded-md border border-app-input-border px-2.5 py-1.5">file</code>
                  <span aria-hidden className="text-[#9CA3AF]">→</span>
                  <code className="rounded-md bg-app-accent-soft px-2.5 py-1.5 text-app-accent">AES-256-GCM</code>
                  <span aria-hidden className="text-[#9CA3AF]">→</span>
                  <code className="rounded-md border border-app-input-border px-2.5 py-1.5">ciphertext</code>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <code className="rounded-md border border-app-input-border px-2.5 py-1.5">file key</code>
                  <span aria-hidden className="text-[#9CA3AF]">→</span>
                  <code className="rounded-md bg-app-accent-soft px-2.5 py-1.5 text-app-accent">RSA-2048 public key</code>
                  <span aria-hidden className="text-[#9CA3AF]">→</span>
                  <code className="rounded-md border border-app-input-border px-2.5 py-1.5">wrapped key</code>
                </div>
              </div>
              <figcaption className="mt-7 max-w-[520px] text-sm leading-6 text-app-muted 2xl:text-base 2xl:leading-7">
                Each file gets its own AES key. That key is locked with your RSA
                public key, and only your private key can unlock it. Our servers
                store ciphertext and wrapped keys, never the plaintext.
              </figcaption>
            </figure>
          </div>
        </div>

        <p className="text-xs leading-5 text-app-subtle 2xl:text-sm">
          Zero-knowledge storage · Hybrid AES + RSA encryption
        </p>
      </aside>

      <main className="flex min-h-[100dvh] w-full flex-col px-6 py-8 sm:px-10 lg:w-1/2 lg:py-12">
        <AuthBrand className="mb-10 shrink-0 lg:hidden" />
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[380px] 2xl:max-w-[420px]">
            <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
            {subtitle ? (
              <p className="mt-2 text-sm leading-6 text-app-muted">{subtitle}</p>
            ) : null}
            <div className="mt-6">{children}</div>
            {footer ? <div className="mt-6 text-sm leading-6 text-app-muted">{footer}</div> : null}
          </div>
        </div>
      </main>
    </div>
  );
}

export function AuthField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm text-app-muted">
      <span>{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const authInputClass =
  "h-11 w-full rounded-[9px] border border-app-input-border bg-app-surface px-3.5 text-sm text-app-text shadow-[0_1px_2px_rgb(16_24_40/2%)] outline-none transition placeholder:text-app-muted-2 focus:border-app-focus focus:ring-2 focus:ring-app-focus/15";

export const authPrimaryBtnClass =
  "inline-flex h-11 w-full items-center justify-center rounded-[9px] bg-app-primary px-4 text-sm font-semibold text-white outline-none transition hover:bg-app-primary-hover focus-visible:ring-2 focus-visible:ring-app-focus focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60";

export const authLinkClass =
  "rounded-sm font-medium text-app-accent outline-none transition hover:text-app-accent-hover hover:underline focus-visible:ring-2 focus-visible:ring-app-focus focus-visible:ring-offset-2";
