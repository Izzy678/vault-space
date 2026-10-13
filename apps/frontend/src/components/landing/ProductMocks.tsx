/**
 * Faithful static recreations of VaultSpace app chrome for the marketing page.
 * Uses the same app-* tokens as the real product so screenshots feel continuous.
 */

const DEMO_FILES = [
  { name: "Q4-board-deck.pdf", type: "PDF", size: "2.4 MB", when: "Today", cat: "documents" },
  { name: "passport-scan.png", type: "PNG", size: "1.1 MB", when: "Yesterday", cat: "images" },
  { name: "tax-2025.zip", type: "ZIP", size: "8.6 MB", when: "Mar 12", cat: "archives" },
  { name: "contract-final.docx", type: "DOC", size: "420 KB", when: "Mar 8", cat: "documents" },
];

const CAT_DOT: Record<string, string> = {
  documents: "bg-app-cat-documents",
  images: "bg-app-cat-images",
  archives: "bg-app-cat-archives",
  videos: "bg-app-cat-videos",
};

function ChromeDots() {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      <span className="h-2 w-2 rounded-full bg-app-muted-2/60" />
      <span className="h-2 w-2 rounded-full bg-app-muted-2/60" />
      <span className="h-2 w-2 rounded-full bg-app-muted-2/60" />
    </div>
  );
}

function SidebarMini({ active = "Dashboard" }: { active?: string }) {
  const items = ["Dashboard", "My files", "Keys", "Activity", "Settings"];
  return (
    <aside className="hidden w-[148px] shrink-0 flex-col border-r border-app-border bg-app-sidebar p-2.5 sm:flex">
      <div className="mb-3 flex items-center gap-1.5 px-1.5">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-app-border text-[8px] font-semibold text-app-text">
          V
        </span>
        <span className="text-[11px] font-semibold tracking-tight text-app-text">
          vaultspace
        </span>
      </div>
      <div className="mb-2 rounded-lg bg-app-bg px-2 py-1.5 text-[10px] text-app-muted-2">
        Search files…
      </div>
      <nav className="flex flex-col gap-0.5">
        {items.map((label) => (
          <div
            key={label}
            className={`rounded-lg px-2 py-1 text-[11px] font-medium ${
              label === active
                ? "bg-app-accent-soft text-app-text"
                : "text-app-muted"
            }`}
          >
            {label}
          </div>
        ))}
      </nav>
      <div className="mt-auto border-t border-app-border pt-2">
        <div className="mb-1 flex justify-between px-1 text-[9px] text-app-muted">
          <span>12.4 MB</span>
          <span>of 50 MB</span>
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-app-bg">
          <div className="h-full w-[25%] rounded-full bg-[#2dd4bf]" />
        </div>
      </div>
    </aside>
  );
}

function FrameShell({
  children,
  label = "VaultSpace",
  className = "",
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-app-border bg-app-bg shadow-[0_28px_80px_rgb(16_24_40_/_18%)] dark:shadow-[0_28px_80px_rgb(0_0_0_/_45%)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-app-border bg-app-sidebar px-3 py-2">
        <ChromeDots />
        <span className="ml-1 text-[10px] font-medium text-app-muted">{label}</span>
        <span className="ml-auto rounded-full bg-app-accent-soft px-2 py-0.5 text-[9px] font-medium text-app-muted">
          Encrypted session
        </span>
      </div>
      {children}
    </div>
  );
}

/** Full dashboard mock — hero front pane */
export function DashboardMock({ className = "" }: { className?: string }) {
  return (
    <FrameShell label="vaultspace.app / dashboard" className={className}>
      <div className="flex min-h-[280px] bg-app-bg sm:min-h-[320px]">
        <SidebarMini />
        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <p className="text-[9px] font-medium text-app-muted">Dashboard</p>
              <p className="mt-0.5 text-[13px] font-semibold tracking-tight text-app-text sm:text-[15px]">
                Good afternoon, Alex!
              </p>
              <p className="mt-0.5 text-[10px] text-app-muted sm:text-[11px]">
                Overview of your encrypted storage.
              </p>
            </div>
            <div className="flex shrink-0 gap-1.5">
              <span className="rounded-lg border border-app-border bg-app-surface px-2 py-1 text-[10px] font-medium text-app-text">
                Upload
              </span>
              <span className="rounded-lg bg-app-primary px-2 py-1 text-[10px] font-medium text-app-primary-fg">
                Encrypt & upload
              </span>
            </div>
          </div>

          <div className="mb-3 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
            {[
              { l: "Documents", n: "12", c: "bg-app-cat-documents" },
              { l: "Images", n: "8", c: "bg-app-cat-images" },
              { l: "Archives", n: "3", c: "bg-app-cat-archives" },
              { l: "Other", n: "2", c: "bg-app-cat-other" },
            ].map((card) => (
              <div
                key={card.l}
                className="rounded-lg border border-app-border bg-app-surface px-2 py-1.5 shadow-app"
              >
                <span className={`mb-1 inline-block h-1.5 w-1.5 rounded-full ${card.c}`} />
                <p className="text-[9px] text-app-muted">{card.l}</p>
                <p className="text-[12px] font-semibold text-app-text">{card.n}</p>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-app">
            <div className="flex items-center justify-between border-b border-app-border px-2.5 py-1.5">
              <span className="text-[11px] font-medium text-app-text">Recent files</span>
              <span className="text-[10px] text-app-muted">4 files</span>
            </div>
            <table className="w-full text-left text-[10px] sm:text-[11px]">
              <thead>
                <tr className="border-b border-app-border text-[9px] uppercase tracking-wide text-app-muted-2">
                  <th className="px-2.5 py-1.5 font-semibold">Name</th>
                  <th className="hidden px-2 py-1.5 font-semibold sm:table-cell">Type</th>
                  <th className="px-2 py-1.5 font-semibold">Size</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_FILES.map((f) => (
                  <tr key={f.name} className="border-b border-app-border last:border-0">
                    <td className="px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-1.5 w-1.5 shrink-0 rounded-full ${CAT_DOT[f.cat] ?? "bg-app-muted"}`}
                        />
                        <span className="truncate font-medium text-app-text">{f.name}</span>
                      </div>
                    </td>
                    <td className="hidden px-2 py-1.5 text-app-muted sm:table-cell">{f.type}</td>
                    <td className="px-2 py-1.5 text-app-muted">{f.size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FrameShell>
  );
}

/** Key material / crypto pane — hero back layer */
export function KeyMaterialMock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-app-border bg-app-surface shadow-[0_20px_60px_rgb(16_24_40_/_14%)] dark:shadow-[0_20px_60px_rgb(0_0_0_/_40%)] ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-app-border px-3 py-2">
        <ChromeDots />
        <span className="font-mono text-[10px] text-app-muted">wrapped-aes-key.json</span>
      </div>
      <pre className="overflow-hidden p-3 font-mono text-[9px] leading-relaxed text-app-muted sm:text-[10px]">
        {`{
  "alg": "RSA-OAEP",
  "hash": "SHA-256",
  "kdf": "PBKDF2-SHA256",
  "cipher": "AES-256-GCM",
  "wrappedKey": "a8f3c91e…9c2e",
  "iv": "7b2d…",
  "authTag": "e1a0…"
}`}
      </pre>
    </div>
  );
}

/** Unlock vault modal mock */
export function UnlockMock({ className = "" }: { className?: string }) {
  return (
    <FrameShell label="Unlock vault" className={className}>
      <div className="bg-app-bg p-5 sm:p-6">
        <div className="mx-auto max-w-[280px] rounded-xl border border-app-border bg-app-surface p-5 shadow-app">
          <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-app-accent-soft text-app-text">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-[14px] font-semibold text-app-text">Unlock your vault</p>
          <p className="mt-1 text-[11px] leading-relaxed text-app-muted">
            Your vault passphrase unwraps keys locally. It never leaves this device.
          </p>
          <div className="mt-4 rounded-lg border border-app-input-border bg-app-bg px-3 py-2 text-[12px] text-app-muted-2">
            ••••••••••••••••
          </div>
          <div className="mt-3 rounded-lg bg-app-primary py-2 text-center text-[12px] font-semibold text-app-primary-fg">
            Unlock
          </div>
        </div>
      </div>
    </FrameShell>
  );
}

/** Share / re-wrap mock */
export function ShareMock({ className = "" }: { className?: string }) {
  return (
    <FrameShell label="Share file · Q4-board-deck.pdf" className={className}>
      <div className="flex min-h-[240px] bg-app-bg">
        <div className="min-w-0 flex-1 border-r border-app-border p-3 sm:p-4">
          <p className="text-[10px] font-medium uppercase tracking-wide text-app-muted-2">
            File detail
          </p>
          <p className="mt-1 text-[13px] font-semibold text-app-text">Q4-board-deck.pdf</p>
          <p className="mt-0.5 text-[11px] text-app-muted">2.4 MB · AES-256-GCM</p>
          <dl className="mt-4 space-y-2 text-[11px]">
            <div className="flex justify-between gap-2 border-b border-app-border pb-2">
              <dt className="text-app-muted">Cipher</dt>
              <dd className="font-mono text-app-text">AES-256-GCM</dd>
            </div>
            <div className="flex justify-between gap-2 border-b border-app-border pb-2">
              <dt className="text-app-muted">Key wrap</dt>
              <dd className="font-mono text-app-text">RSA-OAEP</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-app-muted">Server sees</dt>
              <dd className="font-medium text-app-text">Ciphertext only</dd>
            </div>
          </dl>
        </div>
        <div className="w-[46%] shrink-0 p-3 sm:p-4">
          <p className="text-[11px] font-semibold text-app-text">Share with contact</p>
          <p className="mt-1 text-[10px] leading-relaxed text-app-muted">
            Re-wrap the file key to their public key. No plaintext leaves your browser.
          </p>
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-app-border bg-app-surface px-2.5 py-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-app-accent-soft text-[10px] font-semibold text-app-text">
              JM
            </span>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-medium text-app-text">Jordan Miles</p>
              <p className="truncate text-[9px] text-app-muted">jordan@studio.io</p>
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-app-primary py-2 text-center text-[11px] font-semibold text-app-primary-fg">
            Share encrypted
          </div>
        </div>
      </div>
    </FrameShell>
  );
}

/** Encrypt pipeline mock */
export function EncryptFlowMock({ className = "" }: { className?: string }) {
  return (
    <FrameShell label="Encrypt & upload" className={className}>
      <div className="space-y-2.5 bg-app-bg p-4 sm:p-5">
        {[
          { step: "01", title: "Read file in browser", state: "Done" },
          { step: "02", title: "AES-256-GCM seal", state: "Done" },
          { step: "03", title: "Wrap key with RSA-OAEP", state: "Active" },
          { step: "04", title: "Upload ciphertext + wrapped key", state: "Queued" },
        ].map((row) => (
          <div
            key={row.step}
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              row.state === "Active"
                ? "border-app-text/25 bg-app-surface shadow-app"
                : "border-app-border bg-app-surface/70"
            }`}
          >
            <span className="font-mono text-[10px] text-app-muted">{row.step}</span>
            <span className="flex-1 text-[12px] font-medium text-app-text">{row.title}</span>
            <span
              className={`text-[10px] font-medium ${
                row.state === "Done"
                  ? "text-app-muted"
                  : row.state === "Active"
                    ? "text-app-text"
                    : "text-app-muted-2"
              }`}
            >
              {row.state}
            </span>
          </div>
        ))}
      </div>
    </FrameShell>
  );
}

/** Layered hero composition like Payload */
export function HeroProductStack() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] lg:max-w-none">
      <div className="absolute -left-2 top-10 hidden w-[48%] max-w-[300px] -rotate-2 lg:block xl:-left-6">
        <KeyMaterialMock />
      </div>
      <div className="relative z-10 lg:ml-[8%]">
        <DashboardMock />
      </div>
      <div
        className="pointer-events-none absolute -bottom-10 left-1/2 h-32 w-[70%] -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: "var(--marketing-glow-soft)" }}
        aria-hidden
      />
    </div>
  );
}
