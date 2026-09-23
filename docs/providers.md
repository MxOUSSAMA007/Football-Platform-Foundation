# Providers

## Adding a football provider

1. Implement `FootballDataProvider`.
2. Map provider responses into `NormalizedMatch`, `TeamSummary`, and the other internal types.
3. Register the adapter in the provider registry.
4. Add its name to the relevant capability priority list.
5. Add server-only credentials to the environment and document them in `.env.example`.
6. Record success/failure through `ProviderHealthService`.
7. Add tests for provider mapping, invalid responses, rate limits, and fallback.

Provider IDs belong in `ExternalEntityMapping`. They do not become internal primary keys. If a team cannot be reconciled confidently, mark the mapping for review rather than creating a duplicate entity.

## Current adapter

The development fixture is intentionally labeled `MOCK` and is enabled only outside production. It exists to exercise the shell and data states until a real provider is configured.
