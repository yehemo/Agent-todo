---
name: To-Do App Schema Design
description: Core schema decisions for the Laravel To-Do application — entities, FK behaviours, indexing, and ENUM choices
type: project
---

Schema designed on 2026-03-19 for a Laravel 11 To-Do application.

## Entities and their FKs

| Table | FK | ON DELETE |
|---|---|---|
| categories | user_id → users | CASCADE |
| tasks | user_id → users | CASCADE |
| tasks | category_id → categories | SET NULL (task is preserved) |

## Key decisions

**ENUM for priority and status** — user_id spec required fixed ENUM values. If the value set grows, migrate to FK lookup tables and use `pt-online-schema-change` to avoid locking.

**completed_at column** — stored explicitly on tasks (not derived from status) to support efficient range queries like "tasks completed this week". Must be populated/nulled by an Eloquent observer when status transitions to/from 'completed'.

**Soft deletes on all tables** — `deleted_at` on users, categories, tasks. Models must use the `SoftDeletes` trait.

**UNIQUE (user_id, name) on categories** — one category name per user. This unique index also serves as the composite index for (user_id, name) lookups.

## Index strategy

Critical composite indexes:
- `(user_id, status)` — "show my pending tasks" — primary dashboard query
- `(user_id, category_id)` — "show tasks in this category"

Standalone indexes: user_id, category_id, status, priority, due_date on tasks.

## Seeder

`DemoUserSeeder` creates: demo@example.com / password, 3 categories (Work/Personal/Shopping), 10 tasks (4 pending, 3 in-progress, 3 completed). Uses `firstOrCreate` for idempotency.
