import type { Country } from "./types";

export type OddFlagRule = {
  code: string;
  prompt: string;
  className: string;
};

export const oddFlagRules: Record<string, OddFlagRule> = {
  vn: {
    code: "vn",
    prompt: "Look closely at the star.",
    className: "flag-vn",
  },
  th: {
    code: "th",
    prompt: "Look closely at the blue stripe.",
    className: "flag-th",
  },
  id: {
    code: "id",
    prompt: "Look closely at the stripe sizes.",
    className: "flag-id",
  },
  my: {
    code: "my",
    prompt: "Look closely at the moon and star.",
    className: "flag-my",
  },
  sg: {
    code: "sg",
    prompt: "Look closely at the crescent.",
    className: "flag-sg",
  },
  ph: {
    code: "ph",
    prompt: "Look closely at the triangle and sun.",
    className: "flag-ph",
  },
  kh: {
    code: "kh",
    prompt: "Look closely at the temple.",
    className: "flag-kh",
  },
  la: {
    code: "la",
    prompt: "Look closely at the white circle.",
    className: "flag-la",
  },
  mm: {
    code: "mm",
    prompt: "Look closely at the white star.",
    className: "flag-mm",
  },
  bn: {
    code: "bn",
    prompt: "Look closely at the diagonal stripe.",
    className: "flag-bn",
  },
};

export function getOddFlagRule(country: Country) {
  return oddFlagRules[country.code] ?? {
    code: country.code,
    prompt: "Look closely at the colors.",
    className: "flag-fallback",
  };
}

export function calculateOddFlagStars(mistakes: number, elapsedMs: number): 0 | 1 | 2 | 3 {
  if (mistakes === 0 && elapsedMs <= 8000) return 3;
  if (mistakes <= 1 && elapsedMs <= 12000) return 2;
  return 1;
}

export function calculateOddFlagScore(mistakes: number, secondsLeft: number) {
  return Math.max(100, 300 - mistakes * 50 - Math.max(0, 10 - secondsLeft) * 8);
}
