export type PasswordRuleId =
  | "length"
  | "lower"
  | "upper"
  | "digit"
  | "symbol";

export type PasswordRule = {
  id: PasswordRuleId;
  label: string;
  test: (password: string) => boolean;
};

/** Account-password rules enforced on register and password change. */
export const PASSWORD_RULES: PasswordRule[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (p) => p.length >= 8,
  },
  {
    id: "lower",
    label: "One lowercase letter",
    test: (p) => /[a-z]/.test(p),
  },
  {
    id: "upper",
    label: "One uppercase letter",
    test: (p) => /[A-Z]/.test(p),
  },
  {
    id: "digit",
    label: "One number",
    test: (p) => /\d/.test(p),
  },
  {
    id: "symbol",
    label: "One symbol (e.g. !@#$%)",
    test: (p) => /[^A-Za-z0-9]/.test(p),
  },
];

export type PasswordStrengthLevel = "empty" | "weak" | "fair" | "good" | "strong";

export type PasswordStrength = {
  score: number;
  maxScore: number;
  level: PasswordStrengthLevel;
  label: string;
  met: Record<PasswordRuleId, boolean>;
  allMet: boolean;
  unmetLabels: string[];
};

export function evaluatePasswordStrength(password: string): PasswordStrength {
  const met = Object.fromEntries(
    PASSWORD_RULES.map((rule) => [rule.id, rule.test(password)]),
  ) as Record<PasswordRuleId, boolean>;

  const score = PASSWORD_RULES.reduce(
    (n, rule) => n + (met[rule.id] ? 1 : 0),
    0,
  );
  const maxScore = PASSWORD_RULES.length;
  const allMet = score === maxScore;
  const unmetLabels = PASSWORD_RULES.filter((r) => !met[r.id]).map(
    (r) => r.label,
  );

  let level: PasswordStrengthLevel = "empty";
  let label = "";
  if (password.length === 0) {
    level = "empty";
    label = "";
  } else if (score <= 2) {
    level = "weak";
    label = "Weak";
  } else if (score === 3) {
    level = "fair";
    label = "Fair";
  } else if (score === 4) {
    level = "good";
    label = "Good";
  } else {
    level = "strong";
    label = "Strong";
  }

  return { score, maxScore, level, label, met, allMet, unmetLabels };
}

export const STRONG_PASSWORD_HINT =
  "Use at least 8 characters with upper and lowercase letters, a number, and a symbol.";
