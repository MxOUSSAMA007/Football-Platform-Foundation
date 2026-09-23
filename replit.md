# Football Platform

A multilingual football live-score platform foundation with a unified internal API, normalized provider data, and a responsive Matches shell.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run generate` — generate Prisma client
- `pnpm --filter @workspace/db run push` — sync the development schema
- `pnpm --filter @workspace/db run migrate -- --name <name>` — create/apply a named Prisma migration
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Prisma ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/football-platform` — responsive user-facing React app
- `artifacts/api-server/src/lib/football` — provider contracts, cache, health, normalization, and orchestration
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/prisma/schema.prisma` — normalized PostgreSQL schema
- `docs/` — architecture and extension documentation

## Architecture decisions

- Internal numeric IDs are always separate from provider IDs; `ExternalEntityMapping` bridges them.
- Provider priority is capability-specific and centralized, so adding a provider does not change UI or route code.
- The cache and request coalescing layers are interface-based; Phase 1 uses memory cache and can move to Redis.
- Development fixture data is explicit `MOCK` data and is disabled in production.

## Product

The Phase 1 shell provides date-based Matches, a clear data-source mode, loading/empty/error states, responsive navigation, English/French/Arabic labels with RTL support, light/dark themes, and an operations view for provider health.

## User preferences

The attached Phase 1 brief requires stopping after the foundation; do not implement Phase 2 features automatically.

## Gotchas

- Re-run API codegen after changing `lib/api-spec/openapi.yaml`.
- `artifact.toml` is managed by the artifact workflow; do not edit it directly.
- A Prisma migration was baselined after the initial development schema sync; do not reset the database to recreate it.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
