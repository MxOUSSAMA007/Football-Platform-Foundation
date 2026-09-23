# Architecture

The platform is split into five boundaries:

1. **Frontend** — React/Vite consumes generated hooks for the internal API.
2. **API** — Express validates inputs and outputs with generated Zod schemas.
3. **Application services** — Match orchestration selects providers, deduplicates requests, caches responses, and exposes data mode.
4. **Provider adapters** — Each provider implements internal interfaces and owns external API details.
5. **Persistence/cache** — Prisma stores normalized entities and mappings. Cache access goes through `CacheService`.

The browser must never call an external football or news provider directly. Provider order is configured per capability in `config.ts`, not spread across route handlers.

## Failure behavior

Provider requests record health and failure details. The orchestrator attempts enabled providers in configured priority order, deduplicates concurrent requests by cache key, and returns cached data when available. If nothing can answer, the API returns an explicit `UNAVAILABLE` response instead of silently fabricating results.
