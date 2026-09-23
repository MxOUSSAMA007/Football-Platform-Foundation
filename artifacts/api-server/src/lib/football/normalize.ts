import type { NormalizedMatch, TeamSummary } from "./types";

export function normalizeName(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function resolveTeamIdentity(
  candidates: Array<TeamSummary & { aliases?: string[] }>,
): TeamSummary | null {
  if (candidates.length === 0) return null;
  const first = candidates[0];
  const firstKey = normalizeName(first.name);
  const sameIdentity = candidates.every((candidate) => {
    const candidateKey = normalizeName(candidate.name);
    return (
      candidateKey === firstKey ||
      candidate.aliases?.some((alias) => normalizeName(alias) === firstKey)
    );
  });

  return sameIdentity ? first : null;
}

export function deduplicateMatches(matches: NormalizedMatch[]): NormalizedMatch[] {
  const unique = new Map<string, NormalizedMatch>();
  for (const match of matches) {
    const home = normalizeName(match.homeTeam.name);
    const away = normalizeName(match.awayTeam.name);
    const key = `${match.kickoff.toISOString()}-${home}-${away}`;
    if (!unique.has(key)) unique.set(key, match);
  }
  return Array.from(unique.values()).sort(
    (a, b) => a.kickoff.getTime() - b.kickoff.getTime(),
  );
}
