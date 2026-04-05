export function formatPopulation(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(n);
}

export function formatArea(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M km²`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K km²`;
  return `${n} km²`;
}
