"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useVault } from "@/lib/vault/VaultProvider";
import { apiJson } from "@/lib/api/client";
import {
  CATEGORY_META,
  SIDEBAR_FILE_TYPES,
  summarizeByCategory,
} from "@/lib/files/categories";
import type { FileRow } from "@/lib/files/types";
import { fullNameFromUser, initialsFromUser } from "@/lib/files/format";
import {
  IconActivity,
  IconFolder,
  IconGrid,
  IconKey,
  IconLock,
  IconSearch,
  IconSettings,
  IconSidebarToggle,
  LogoMark,
} from "./icons";

const navMain = [
  { href: "/dashboard", label: "Dashboard", icon: IconGrid },
  { href: "/files", label: "My files", icon: IconFolder, showCount: true },
  { href: "/keys", label: "Keys", icon: IconKey },
  { href: "/activity", label: "Activity", icon: IconActivity },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

const SIDEBAR_KEY = "vaultspace.sidebar.collapsed";
const SIDEBAR_EVENT = "vaultspace-sidebar-change";

function readSidebarCollapsed() {
  return window.localStorage.getItem(SIDEBAR_KEY) === "true";
}

function subscribeToSidebar(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(SIDEBAR_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(SIDEBAR_EVENT, onChange);
  };
}

function saveSidebarCollapsed(collapsed: boolean) {
  window.localStorage.setItem(SIDEBAR_KEY, String(collapsed));
  window.dispatchEvent(new Event(SIDEBAR_EVENT));
}

function navActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function AppShellInner({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const { unlocked, lock } = useVault();
  const [mobileNav, setMobileNav] = useState(false);
  const [files, setFiles] = useState<FileRow[]>([]);
  const collapsed = useSyncExternalStore(
    subscribeToSidebar,
    readSidebarCollapsed,
    () => false,
  );
  const sidebarId = useId();
  const mobileNavId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);

  const search = searchParams.get("q") ?? "";
  const typeFilter = searchParams.get("type");

  const initials = useMemo(() => initialsFromUser(user), [user]);
  const displayName = useMemo(() => fullNameFromUser(user), [user]);

  const counts = useMemo(() => summarizeByCategory(files), [files]);

  function lockVault() {
    lock();
    router.push("/security");
  }

  useEffect(() => {
    if (!token || !unlocked) {
      setFiles([]);
      return;
    }
    void apiJson<FileRow[]>("/files", { token })
      .then(setFiles)
      .catch(() => setFiles([]));
  }, [token, unlocked, pathname]);

  function setSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) params.set("q", value);
    else params.delete("q");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  function goTypeFilter(cat: string) {
    setMobileNav(false);
    router.push(`/files?type=${encodeURIComponent(cat)}`);
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      )
        return;
      e.preventDefault();
      if (window.matchMedia("(min-width: 1024px)").matches) {
        saveSidebarCollapsed(false);
        requestAnimationFrame(() => searchRef.current?.focus());
      } else {
        mobileSearchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const searchField = (inputRef: RefObject<HTMLInputElement | null>) => (
    <div className="relative">
      <IconSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-app-muted-2" />
      <input
        ref={inputRef}
        aria-label="Search files"
        type="search"
        placeholder="Search files..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full rounded-[10px] border border-transparent bg-app-bg py-1.5 pl-9 pr-10 text-[13px] outline-none placeholder:text-app-muted-2 focus:border-app-focus focus:bg-app-surface focus:ring-2 focus:ring-app-focus/15"
      />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-app-border bg-app-surface px-1.5 py-0.5 text-[10px] text-app-muted-2">
        /
      </kbd>
    </div>
  );

  const navLinks = (iconOnly = false) => (
    <>
      {navMain.map((item) => {
        const Icon = item.icon;
        const active = navActive(pathname, item.href);
        const count =
          "showCount" in item && item.showCount ? files.length : null;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileNav(false)}
            title={iconOnly ? item.label : undefined}
            aria-current={active ? "page" : undefined}
            className={`flex items-center rounded-[10px] text-[13px] font-medium transition ${iconOnly ? "h-10 justify-center" : "gap-2.5 px-3 py-1.5"} ${
              active
                ? "bg-app-accent-soft text-app-accent"
                : "text-app-muted hover:bg-app-bg hover:text-app-text"
            }`}
          >
            <Icon />
            <span className={iconOnly ? "sr-only" : undefined}>{item.label}</span>
            {!iconOnly && count != null ? (
              <span className="ml-auto text-app-muted-2">{count}</span>
            ) : null}
          </Link>
        );
      })}
    </>
  );

  const typeNav = !collapsed ? (
    <div className="mt-5 px-1">
      <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-app-muted-2">
        File type
      </p>
      <div className="flex flex-col gap-0.5">
        {SIDEBAR_FILE_TYPES.map((cat) => {
          const meta = CATEGORY_META[cat];
          const on =
            pathname === "/files" && typeFilter === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => goTypeFilter(cat)}
              className={`flex items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-left text-[13px] font-medium transition ${
                on
                  ? "bg-app-accent-soft text-app-text"
                  : "text-app-muted hover:bg-app-bg hover:text-app-text"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${meta.dotClass}`} />
              {meta.label}
              <span className="ml-auto text-app-muted-2">
                {counts[cat].count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  ) : null;

  return (
    <div className="app-root flex min-h-[100dvh] bg-app-bg text-app-text">
      <aside
        id={sidebarId}
        data-app-sidebar=""
        aria-label="Sidebar"
        className={`sticky top-0 hidden h-[100dvh] shrink-0 flex-col border-r border-app-border bg-app-sidebar px-3 py-4 transition-[width] duration-200 motion-reduce:transition-none lg:flex ${collapsed ? "w-[72px]" : "w-[224px]"}`}
      >
        <div
          className={`mb-4 flex items-center ${collapsed ? "flex-col gap-3" : "justify-between gap-2 pl-2"}`}
        >
          <Link
            href="/dashboard"
            aria-label="VaultSpace"
            title={collapsed ? "VaultSpace" : undefined}
            className="flex items-center gap-2.5"
          >
            <LogoMark />
            <span
              className={
                collapsed
                  ? "sr-only"
                  : "text-[15px] font-semibold tracking-tight"
              }
            >
              vaultspace
            </span>
          </Link>
          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            aria-controls={sidebarId}
            onClick={() => saveSidebarCollapsed(!collapsed)}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-app-muted transition hover:bg-app-bg hover:text-app-text"
          >
            <IconSidebarToggle collapsed={collapsed} />
          </button>
        </div>

        {collapsed ? (
          <button
            type="button"
            aria-label="Search files"
            title="Search files"
            onClick={() => {
              saveSidebarCollapsed(false);
              requestAnimationFrame(() => searchRef.current?.focus());
            }}
            className="mb-4 inline-flex h-10 w-full items-center justify-center rounded-[10px] bg-app-bg text-app-muted transition hover:text-app-text"
          >
            <IconSearch />
          </button>
        ) : (
          <div className="mb-4">{searchField(searchRef)}</div>
        )}

        <nav className="flex flex-col gap-0.5" aria-label="Primary">
          {navLinks(collapsed)}
        </nav>

        {typeNav}

        <div className="mt-auto border-t border-app-border pt-3">
          {collapsed ? (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/settings"
                title={displayName}
                aria-label={`Account · ${displayName}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-app-accent-soft text-xs font-semibold text-app-accent"
              >
                {initials}
              </Link>
              <button
                type="button"
                onClick={lockVault}
                title="Lock vault"
                aria-label="Lock vault"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-app-muted transition hover:bg-app-bg hover:text-app-text"
              >
                <IconLock />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-1">
              <Link
                href="/settings"
                className="flex min-w-0 flex-1 items-center gap-2 rounded-[10px] px-1 py-1 transition hover:bg-app-bg"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-app-accent-soft text-xs font-semibold text-app-accent">
                  {initials}
                </span>
                <span className="truncate text-[12px] font-medium text-app-text">
                  {displayName}
                </span>
              </Link>
              <button
                type="button"
                onClick={lockVault}
                className="shrink-0 rounded-md border border-app-border px-2 py-1 text-[11px] font-semibold text-app-muted transition hover:bg-app-bg hover:text-app-text"
              >
                Lock
              </button>
            </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-app-border bg-app-surface px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <LogoMark />
              <span className="text-sm font-semibold">vaultspace</span>
            </Link>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="rounded-[8px] border border-app-border px-2.5 py-1 text-[11px] font-semibold text-app-muted"
                onClick={() => setMobileNav((v) => !v)}
                aria-expanded={mobileNav}
                aria-controls={mobileNavId}
              >
                Menu
              </button>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-app-accent-soft text-xs font-semibold text-app-accent">
                {initials}
              </span>
            </div>
          </div>
          {searchField(mobileSearchRef)}
          {mobileNav ? (
            <nav
              id={mobileNavId}
              aria-label="Mobile"
              className="flex flex-col gap-0.5 border-t border-app-border pt-2"
            >
              {navLinks()}
              {SIDEBAR_FILE_TYPES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => goTypeFilter(cat)}
                  className="flex items-center gap-2.5 rounded-[10px] px-3 py-1.5 text-left text-[13px] font-medium text-app-muted"
                >
                  <span
                    className={`h-2 w-2 rounded-full ${CATEGORY_META[cat].dotClass}`}
                  />
                  {CATEGORY_META[cat].label}
                </button>
              ))}
            </nav>
          ) : null}
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="app-root flex min-h-[100dvh] bg-app-bg text-app-muted">
          <div className="hidden w-[224px] shrink-0 border-r border-app-border bg-app-sidebar lg:block" />
          <div className="flex flex-1 items-center justify-center text-sm">
            Loading…
          </div>
        </div>
      }
    >
      <AppShellInner>{children}</AppShellInner>
    </Suspense>
  );
}

export function AppHeaderActions({
  initials,
  uploadSlot,
}: {
  initials: string;
  uploadSlot: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="hidden h-8 w-8 items-center justify-center rounded-full bg-app-accent-soft text-xs font-semibold text-app-accent sm:inline-flex">
        {initials}
      </span>
      {uploadSlot}
    </div>
  );
}

export function AppPageLoading() {
  return (
    <div className="app-root flex min-h-[100dvh] items-center justify-center bg-app-bg text-app-muted">
      Loading…
    </div>
  );
}
