import type { ProviderPriorityConfig } from "./types";

export const providerPriority: ProviderPriorityConfig = {
  matches: ["football-data", "openligadb", "development-fixture"],
  lineups: ["football-data", "openligadb"],
  news: ["gnews", "newsdata", "rss"],
};

export const cacheConfig = {
  matchesTtlSeconds: 30,
  operationsTtlSeconds: 15,
  enabled: process.env.REDIS_URL !== undefined || process.env.NODE_ENV !== "production",
};
