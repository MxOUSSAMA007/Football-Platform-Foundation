---
name: Prisma migration baseline
description: Why the initial football schema uses a baseline migration instead of resetting the development database.
---

The football platform uses Prisma as required by the product brief. The initial development database was synchronized before migration history existed, so the current schema is represented by a non-destructive baseline migration and marked applied.

**Why:** Resetting the managed development database would delete data and was not necessary; the schema was already correct after the initial sync.

**How to apply:** Keep future schema changes as named Prisma migrations. Do not reset the development database just to recreate the initial migration.