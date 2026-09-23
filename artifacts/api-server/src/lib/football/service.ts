import { cache } from "./cache";
import { cacheConfig, providerPriority } from "./config";
import { providerHealth } from "./health";
import { deduplicateMatches } from "./normalize";
import { providers } from "./providers";
import type { CacheService, NormalizedMatch } from "./types";

const inFlight = new Map<string, Promise<MatchesResult>>();

export interface MatchesResult {
  date: string;
  dataMode: "REAL" | "MOCK" | "UNAVAILABLE";
  providerMessage: string | null;
  matches: NormalizedMatch[];
  fetchedAt: Date;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

export async function getMatches(
  date: string,
  cacheService: CacheService = cache,
): Promise<MatchesResult> {
  if (!isValidDate(date)) {
    throw new Error("Date must use YYYY-MM-DD format.");
  }

  const key = `matches:${date}`;
  const cached = await cacheService.get<MatchesResult>(key);
  if (cached) return cached;

  const pending = inFlight.get(key);
  if (pending) return pending;

  const request = loadMatches(date, cacheService);
  inFlight.set(key, request);
  try {
    return await request;
  } finally {
    inFlight.delete(key);
  }
}

async function loadMatches(
  date: string,
  cacheService: CacheService,
): Promise<MatchesResult> {
  const errors: string[] = [];
  const configuredProviders = providerPriority.matches
    .map((name) => providers.find((provider) => provider.name === name))
    .filter((provider): provider is (typeof providers)[number] => Boolean(provider))
    .filter((provider) => provider.enabled);

  for (const provider of configuredProviders) {
    const startedAt = Date.now();
    try {
      const matches = deduplicateMatches(await provider.getMatches(date));
      providerHealth.recordSuccess(provider.name, Date.now() - startedAt);
      const result: MatchesResult = {
        date,
        dataMode: matches.some((match) => match.dataSource === "REAL")
          ? "REAL"
          : "MOCK",
        providerMessage:
          matches.some((match) => match.dataSource === "MOCK")
            ? "Development sample data is enabled. Connect a football provider for live data."
            : null,
        matches,
        fetchedAt: new Date(),
      };
      await cacheService.set(keyFor(date), result, cacheConfig.matchesTtlSeconds);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown provider error";
      errors.push(`${provider.displayName}: ${message}`);
      providerHealth.recordFailure(provider.name, { message });
    }
  }

  return {
    date,
    dataMode: "UNAVAILABLE",
    providerMessage:
      errors.length > 0
        ? `Football data providers are unavailable. ${errors.join(" ")}`
        : "Football data provider is not configured.",
    matches: [],
    fetchedAt: new Date(),
  };
}

function keyFor(date: string): string {
  return `matches:${date}`;
}

export function listProviderHealth() {
  return providerHealth.list();
}

export function getOperationsSummary() {
  const health = listProviderHealth();
  return {
    generatedAt: new Date(),
    providerCount: health.length,
    onlineProviderCount: health.filter((entry) => entry.status === "ONLINE").length,
    cacheEnabled: cacheConfig.enabled,
    architectureVersion: "phase-1",
    notices: [
      "External provider IDs are mapped to internal entity IDs.",
      "Provider order is configured centrally and fallback-safe.",
      "Mock data is visibly labeled and limited to development.",
    ],
  };
}