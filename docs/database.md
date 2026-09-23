# Database

`lib/db/prisma/schema.prisma` is the source of truth for the normalized PostgreSQL model.

All football entities use internal auto-incrementing IDs. Provider identifiers are stored in `ExternalEntityMapping` with a provider name and `EntityType`. Team identity also has normalized names and aliases, while reconciliation remains explicit and reviewable.

The schema covers:

- users and notifications
- countries, leagues, seasons, teams, players
- matches, events, lineups, standings, and statistics
- news sources and articles
- favorites
- provider mappings, provider configuration, and health snapshots

Run `pnpm --filter @workspace/db run generate` after schema changes, then use `migrate` for a named development migration or `push` for a direct development sync.
