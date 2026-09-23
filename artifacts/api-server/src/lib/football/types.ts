export type ProviderStatus =
  | "ONLINE"
  | "DEGRADED"
  | "RATE_LIMITED"
  | "OFFLINE"
  | "DISABLED";

export type DataSource = "REAL" | "MOCK";

export type MatchStatus =
  | "UPCOMING"
  | "LIVE"
  | "HALFTIME"
  | "FULL_TIME"
  | "POSTPONED"
  | "CANCELLED";

export interface TeamSummary {
  id: number;
  name: string;
  shortName: string | null;
  countryName: string | null;
  logoUrl: string | null;
}

export interface NormalizedMatch {
  id: number;
  kickoff: Date;
  status: MatchStatus;
  minute: number | null;
  leagueName: string;
  leagueCountry: string | null;
  round: string | null;
  homeTeam: TeamSummary;
  awayTeam: TeamSummary;
  score: { home: number | null; away: number | null };
  dataSource: DataSource;
  sourceLabel: string;
}

export interface ProviderHealth {
  provider: string;
  displayName: string;
  status: ProviderStatus;
  enabled: boolean;
  lastSuccessfulRequest: Date | null;
  lastFailedRequest: Date | null;
  lastError: string | null;
  responseTimeMs: number | null;
  rateLimited: boolean;
  failureCount: number;
}

export interface FootballDataProvider {
  readonly name: string;
  readonly displayName: string;
  readonly enabled: boolean;
  getMatches(date: string): Promise<NormalizedMatch[]>;
}

export interface CacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface ProviderPriorityConfig {
  matches: string[];
  lineups: string[];
  news: string[];
}
