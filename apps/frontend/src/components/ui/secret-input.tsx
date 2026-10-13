"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

type SecretInputProps = Omit<ComponentProps<"input">, "type"> & {
  /** Accessible name for the toggle; defaults to “password”. */
  secretLabel?: string;
};

export function SecretInput({
  className,
  secretLabel = "password",
  ...props
}: SecretInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={cn(className, "pr-11")}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        className="absolute right-1.5 top-1/2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-app-muted outline-none transition hover:bg-app-bg/60 hover:text-app-text focus-visible:ring-2 focus-visible:ring-app-focus"
        aria-label={visible ? `Hide ${secretLabel}` : `Show ${secretLabel}`}
        aria-pressed={visible}
      >
        {visible ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  );
}
