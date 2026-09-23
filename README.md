# Football Platform

Phase 1 foundation for a multilingual football live-score platform. The frontend only consumes the internal API; provider-specific calls belong behind the backend integration layer.

## Architecture

```text
React + Vite
    ↓
Express internal API (/api)
    ↓
Application services
    ↓
Provider adapters + cache + health tracking
    ↓
PostgreSQL via Prisma
```

The Phase 1 UI intentionally stops at the Matches shell and operational foundation. It distinguishes REAL, MOCK, and UNAVAILABLE data and never exposes provider credentials to the browser.

## Project structure

- `artifacts/football-platform` — responsive web app and navigation shell
- `artifacts/api-server` — internal REST API, provider orchestration, fallback behavior
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/api-client-react` — generated React Query hooks
- `lib/api-zod` — generated request/response validation schemas
- `lib/db/prisma/schema.prisma` — normalized database schema and internal IDs
- `docs/` — architecture, providers, database, and API integration guides

## Development

```bash
pnpm install
pnpm --filter @workspace/db run generate
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-spec run codegen
pnpm run typecheck
```

Use the configured workflows for the API and web preview. The development fixture is enabled outside production so the Matches UI can be exercised without pretending it is live provider data.

## API

- `GET /api/healthz`
- `GET /api/matches?date=YYYY-MM-DD`
- `GET /api/operations/provider-health`
- `GET /api/operations/summary`

Add providers by implementing `FootballDataProvider`, registering the adapter, and adding it to the central capability priority list. Do not place provider calls in React components.

## Database

The Prisma schema uses internal auto-incrementing IDs for every domain entity. `ExternalEntityMapping` stores provider, external ID, entity type, and the mapped internal record. A provider ID is never used as an internal primary key.

For development schema changes:

```bash
pnpm --filter @workspace/db run migrate -- --name phase1_change
```

## Environment variables

Copy `.env.example` into the workspace environment. Only server-side provider variables belong there. `REDIS_URL` is optional; Phase 1 falls back to the cache abstraction's in-process implementation.

## Phase 2

Phase 2 can add real football provider adapters, entity reconciliation workflows, scheduled ingestion, authenticated favorites, news ingestion, match details, and richer statistics. Those should be added through the existing interfaces rather than by coupling UI code to a provider.
