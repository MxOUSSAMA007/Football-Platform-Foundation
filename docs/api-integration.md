# API integration

The OpenAPI document in `lib/api-spec/openapi.yaml` drives both server validation and frontend hooks. After changing it:

```bash
pnpm --filter @workspace/api-spec run codegen
```

The frontend imports hooks from `@workspace/api-client-react`. The API server imports generated Zod validators from `@workspace/api-zod`.

Current routes:

- `GET /api/matches?date=YYYY-MM-DD` — normalized date-based matches
- `GET /api/operations/provider-health` — provider status and error snapshot
- `GET /api/operations/summary` — cache, provider, and architecture notices
- `GET /api/healthz` — basic service health

Responses explicitly include `dataMode` and `sourceLabel` where data may be mock or unavailable.