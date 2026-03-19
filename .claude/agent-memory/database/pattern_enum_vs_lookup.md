---
name: ENUM vs FK Lookup Tables
description: Decision record for when to use MySQL ENUMs vs. FK-backed lookup tables in this project
type: reference
---

## Current decision (as of 2026-03-19)

`priority` ('low', 'medium', 'high') and `status` ('pending', 'in-progress', 'completed') on the `tasks` table are stored as MySQL ENUMs per user spec.

## Trade-offs

| Aspect | ENUM | FK Lookup Table |
|---|---|---|
| Adding a new value | Requires ALTER TABLE (use pt-osc on large tables) | INSERT only — no DDL |
| Query readability | Self-documenting | Requires JOIN |
| Validation | DB-enforced | DB-enforced via FK |
| Runtime flexibility | None | Full |

## When to migrate to lookup tables

If the business requires adding priority/status values without a deployment (e.g., admin-configurable workflows), migrate `priority` and `status` to lookup tables with a FK reference. Use `pt-online-schema-change` or `gh-ost` to perform the ALTER on the live `tasks` table.
