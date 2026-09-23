import type {
  FootballDataProvider,
  NormalizedMatch,
  TeamSummary,
} from "./types";
import { providerHealth } from "./health";

const team = (
  id: number,
  name: string,
  shortName: string,
  countryName: string,
): TeamSummary => ({
  id,
  name,
  shortName,
  countryName,
  logoUrl: null,
});

function developmentMatches(date: string): NormalizedMatch[] {
  const day = new Date(`${date}T00:00:00.000Z`);
  return [
    {
      id: 9001,
      kickoff: new Date(day.getTime() + 18 * 60 * 60 * 1000),
      status: "UPCOMING",
      minute: null,
      leagueName: "Development Fixture",
      leagueCountry: "International",
      round: "Phase 1",
      homeTeam: team(101, "Northbridge FC", "Northbridge", "England"),
      awayTeam: team(102, "Atlas United", "Atlas", "France"),
      score: { home: null, away: null },
      dataSource: "MOCK",
      sourceLabel: "Development sample",
    },
    {
      id: 9002,
      kickoff: new Date(day.getTime() + 20 * 60 * 60 * 1000),
      status: "LIVE",
      minute: 63,
      leagueName: "Development Fixture",
      leagueCountry: "International",
      round: "Phase 1",
      homeTeam: team(103, "Harbor City", "Harbor", "Spain"),
      awayTeam: team(104, "Redwood Athletic", "Redwood", "Portugal"),
      score: { home: 2, away: 1 },
      dataSource: "MOCK",
      sourceLabel: "Development sample",
    },
  ];
}

export class DevelopmentFixtureProvider implements FootballDataProvider {
  readonly name = "development-fixture";
  readonly displayName = "Development fixture";
  readonly enabled = process.env.NODE_ENV !== "production";

  constructor() {
    providerHealth.register(this);
  }

  async getMatches(date: string): Promise<NormalizedMatch[]> {
    if (!this.enabled) {
      throw new Error("Development fixture provider is disabled in production.");
    }
    return developmentMatches(date);
  }
}

export const providers: FootballDataProvider[] = [
  new DevelopmentFixtureProvider(),
];
