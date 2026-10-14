"use client";

import {
  evaluatePasswordStrength,
  PASSWORD_RULES,
  type PasswordStrength,
} from "@/lib/auth/passwordStrength";

const LEVEL_BAR: Record<
  Exclude<PasswordStrength["level"], "empty">,
  { width: string; color: string }
> = {
  weak: { width: "25%", color: "bg-app-danger" },
  fair: { width: "50%", color: "bg-amber-500" },
  good: { width: "75%", color: "bg-sky-500" },
  strong: { width: "100%", color: "bg-emerald-500" },
};

const LEVEL_TEXT: Record<
  Exclude<PasswordStrength["level"], "empty">,
  string
> = {
  weak: "text-app-danger",
  fair: "text-amber-600 dark:text-amber-400",
  good: "text-sky-600 dark:text-sky-400",
  strong: "text-emerald-600 dark:text-emerald-400",
};

export function PasswordStrengthPanel({ password }: { password: string }) {
  const strength = evaluatePasswordStrength(password);
  const showMeter = password.length > 0;
  const bar =
    strength.level === "empty" ? null : LEVEL_BAR[strength.level];

  return (
    <div className="space-y-2.5" aria-live="polite">
      {showMeter && bar ? (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-app-muted-2">Strength</span>
            <span
              className={`text-[11px] font-semibold ${LEVEL_TEXT[strength.level]}`}
            >
              {strength.label}
            </span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-app-bg"
            role="meter"
            aria-valuemin={0}
            aria-valuemax={strength.maxScore}
            aria-valuenow={strength.score}
            aria-label={`Password strength: ${strength.label}`}
          >
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-200 ${bar.color}`}
              style={{ width: bar.width }}
            />
          </div>
        </div>
      ) : null}

      <ul className="space-y-1">
        {PASSWORD_RULES.map((rule) => {
          const ok = strength.met[rule.id];
          return (
            <li
              key={rule.id}
              className={`flex items-center gap-2 text-[12px] transition-colors ${
                ok ? "text-emerald-600 dark:text-emerald-400" : "text-app-muted-2"
              }`}
            >
              <span
                className={`inline-flex size-3.5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold ${
                  ok
                    ? "border-emerald-500/40 bg-emerald-500/15"
                    : "border-app-border bg-transparent"
                }`}
                aria-hidden
              >
                {ok ? "✓" : ""}
              </span>
              <span>{rule.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
