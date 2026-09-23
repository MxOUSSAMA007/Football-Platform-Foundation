import assert from "node:assert/strict";
import test from "node:test";
import { cache } from "./cache";
import { deduplicateMatches, normalizeName, resolveTeamIdentity } from "./normalize";
import { getMatches } from "./service";

test("normalizes provider names without collapsing distinct words", () => {
  assert.equal(normalizeName("Real Madrid CF"), "real madrid cf");
  assert.equal(normalizeName("Club de Fútbol"), "club de futbol");
});

test("resolves provider aliases to one internal team candidate", () => {
  const resolved = resolveTeamIdentity([
    {
      id: 15,
      name: "Real Madrid",
      shortName: "Real",
      countryName: "Spain",
      logoUrl: null,
    },
    {
      id: 15,
      name: "Real Madrid CF",
      shortName: "Real",
      countryName: "Spain",
      logoUrl: null,
      aliases: ["Real Madrid"],
    },
  ]);

  assert.equal(resolved?.id, 15);
});

test("deduplicates the same normalized match", () => {
  const match = {
    id: 1,
    kickoff: new Date("2026-09-23T18:00:00.000Z"),
    status: "UPCOMING" as const,
    minute: null,
    leagueName: "Test League",
    leagueCountry: "Test",
    round: null,
    homeTeam: { id: 1, name: "Home", shortName: null, countryName: null, logoUrl: null },
    awayTeam: { id: 2, name: "Away", shortName: null, countryName: null, logoUrl: null },
    score: { home: null, away: null },
    dataSource: "MOCK" as const,
    sourceLabel: "Test",
  };

  assert.equal(deduplicateMatches([match, { ...match, id: 2 }]).length, 1);
});

test("coalesces the development match request through the cache", async () => {
  await cache.delete("matches:2026-09-23");
  const first = await getMatches("2026-09-23");
  const second = await getMatches("2026-09-23");

  assert.equal(first.dataMode, "MOCK");
  assert.equal(first.matches.length, 2);
  assert.equal(second.fetchedAt.getTime(), first.fetchedAt.getTime());
});