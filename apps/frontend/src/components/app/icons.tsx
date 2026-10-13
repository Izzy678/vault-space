import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#1e3a5f] text-white ${className ?? ""}`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M4.5 10.5c0-2.2 1.6-4 3.5-4s3.5 1.8 3.5 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M3 11.5h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="8" cy="5.5" r="1.4" fill="currentColor" />
      </svg>
    </span>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconSidebarToggle({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
      <rect x="2" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M7 3v12" stroke="currentColor" strokeWidth="1.3" />
      <path d={collapsed ? "m10 7 2 2-2 2" : "m12 7-2 2 2 2"} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGrid(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M2.5 4.5A1.5 1.5 0 0 1 4 3h2.2l1.2 1.5H12a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 12 13.5H4A1.5 1.5 0 0 1 2.5 12V4.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 5v3.2l2 1.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconLock(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <rect x="3.5" y="7" width="9" height="6.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M5.5 7V5.5a2.5 2.5 0 0 1 5 0V7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSettings(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 2.5v1.2M8 12.3v1.2M2.5 8h1.2M12.3 8h1.2M4.1 4.1l.85.85M11.05 11.05l.85.85M11.9 4.1l-.85.85M4.95 11.05l-.85.85"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconKey(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <circle cx="5.5" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M7.8 8h5.2M11.2 8v2.2M12.8 8v1.4"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconActivity(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path
        d="M2 8h2.2l1.4-3.2L8.2 12l1.6-4H14"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconUpload(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <path d="M8 11V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 6l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 12.5h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell(props: IconProps) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden {...props}>
      <path
        d="M9 2.5a4.5 4.5 0 0 1 4.5 4.5v2.2l1.2 2.3H3.3L4.5 9.2V7A4.5 4.5 0 0 1 9 2.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M7.2 14.2a1.8 1.8 0 0 0 3.6 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function IconMore(props: IconProps) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden {...props}>
      <circle cx="8" cy="3.5" r="1.1" fill="currentColor" />
      <circle cx="8" cy="8" r="1.1" fill="currentColor" />
      <circle cx="8" cy="12.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

/** Inspo-style “full” folder: back flap + paper stack + front flap. */
export function IconFolderLarge({
  className,
  gradId = "folderGrad",
}: {
  className?: string;
  gradId?: string;
}) {
  return (
    <svg
      className={className}
      width="148"
      height="142"
      viewBox="0 0 148 142"
      fill="none"
      aria-hidden
    >
      <defs>
        <linearGradient id={gradId} x1="74" y1="63" x2="74" y2="130" gradientUnits="userSpaceOnUse">
          <stop stopColor="#687C8E" />
          <stop offset="1" stopColor="#A9B2BA" />
        </linearGradient>
        <linearGradient id={`${gradId}-back`} x1="74" y1="12" x2="74" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5F7386" />
          <stop offset="1" stopColor="#8C99A5" />
        </linearGradient>
        <filter id={`${gradId}-shadow`} x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>
      <ellipse cx="74" cy="132" rx="49" ry="5" fill="#788693" opacity="0.18" filter={`url(#${gradId}-shadow)`} />
      <path
        d="M38 17a5 5 0 0 1 5-5h19c2 0 3 .6 4.2 2.1l2.8 3.3H103a6 6 0 0 1 6 5.1l6 64H32L38 17Z"
        fill={`url(#${gradId}-back)`}
      />
      {[0, 1, 2, 3, 4, 5].map((sheet) => {
        const x = 36 - sheet * 4;
        const y = 24 + sheet * 8;
        const width = 76 + sheet * 8;
        return (
          <g key={sheet}>
            <rect x={x} y={y} width={width} height="22" rx="6" fill="#FCFCFD" stroke="#E5E7EB" />
            <path d={`M${x + 5} ${y + 6}h${width - 10}`} stroke="#EFF0F2" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      })}
      <path
        d="M17 71h21c2.7 0 4.1-.7 6-2.6l3.1-3.1c1.5-1.5 3.1-2.3 5.4-2.3h43c2.3 0 3.9.8 5.4 2.3l3.1 3.1c1.9 1.9 3.3 2.6 6 2.6h21c5.2 0 8.4 4.1 7.4 9.2l-8.2 43.5c-.7 3.8-3.3 6.3-7.4 6.3H25.7c-4.1 0-6.7-2.5-7.4-6.3L10.1 80.2C9.1 75.1 12.3 71 17.5 71Z"
        fill={`url(#${gradId})`}
        stroke="#647587"
        strokeOpacity="0.2"
      />
      <path d="M18 72h20c3 0 4.6-.9 6.7-3l3.1-3.1c1.4-1.4 2.8-2 4.8-2h43c2 0 3.4.6 4.8 2l3.1 3.1c2.1 2.1 3.7 3 6.7 3h20" stroke="white" strokeOpacity="0.28" />
    </svg>
  );
}
