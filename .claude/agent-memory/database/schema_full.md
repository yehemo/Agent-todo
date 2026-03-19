---
name: schema_full
description: Complete current schema for all 5 tables — columns, types, indexes, and which migration file created each
type: project
---

**Database:** `todoapp` | **Charset:** `utf8mb4` / `utf8mb4_unicode_ci` | **Engine:** InnoDB

## Migration Files

| File | Creates/Modifies |
|------|-----------------|
| `0001_01_01_000000_create_users_table.php` | `users`, `cache`, `jobs` (Laravel default) |
| `2026_03_19_000001_create_categories_table.php` | `categories` |
| `2026_03_19_000002_create_tasks_table.php` | `tasks` |
| `2026_03_19_000003_add_deleted_at_to_users_table.php` | adds `deleted_at` to `users` |
| `2026_03_19_000004_create_personal_access_tokens_table.php` | `personal_access_tokens` (Sanctum) |

All files in: `D:/Code Project/AgentTesting/backend/database/migrations/`

## Table: `users`

```sql
id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
name              VARCHAR(255) NOT NULL
email             VARCHAR(255) NOT NULL UNIQUE
email_verified_at TIMESTAMP NULL
password          VARCHAR(255) NOT NULL
remember_token    VARCHAR(100) NULL
deleted_at        TIMESTAMP NULL          -- soft deletes (migration 000003)
created_at        TIMESTAMP NULL
updated_at        TIMESTAMP NULL
```

## Table: `categories`

```sql
id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
user_id     BIGINT UNSIGNED NOT NULL  -- FK → users.id CASCADE DELETE
name        VARCHAR(255) NOT NULL
description TEXT NULL
color       VARCHAR(7) NOT NULL DEFAULT '#6366f1'   -- hex "#RRGGBB"
created_at  TIMESTAMP NULL
updated_at  TIMESTAMP NULL

INDEX(user_id)
FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
```

## Table: `tasks`

```sql
id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
user_id     BIGINT UNSIGNED NOT NULL   -- FK → users.id CASCADE DELETE
category_id BIGINT UNSIGNED NULL       -- FK → categories.id SET NULL
title       VARCHAR(255) NOT NULL
description TEXT NULL
status      ENUM('pending','in-progress','completed') NOT NULL DEFAULT 'pending'
priority    ENUM('low','medium','high') NOT NULL DEFAULT 'medium'
due_date    DATE NULL
completed_at TIMESTAMP NULL            -- managed by Task model boot() hook
deleted_at  TIMESTAMP NULL             -- soft deletes
created_at  TIMESTAMP NULL
updated_at  TIMESTAMP NULL

INDEX(user_id)
INDEX(category_id)
INDEX(user_id, status)     -- composite: filtered task list by user + status
INDEX(user_id, priority)   -- composite: filtered task list by user + priority
INDEX(due_date)            -- for overdue detection queries
FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
```

**Critical:** `status` enum uses HYPHEN: `'in-progress'` NOT `'in_progress'`

## Table: `personal_access_tokens` (Sanctum)

```sql
id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
tokenable_type VARCHAR(255) NOT NULL
tokenable_id   BIGINT UNSIGNED NOT NULL
name           VARCHAR(255) NOT NULL
token          VARCHAR(64) NOT NULL UNIQUE
abilities      TEXT NULL
last_used_at   TIMESTAMP NULL
expires_at     TIMESTAMP NULL
created_at     TIMESTAMP NULL
updated_at     TIMESTAMP NULL

INDEX(tokenable_type, tokenable_id)
```

## Relationships (ERD Summary)

```
users (1) ──< tasks (N)       [user_id FK, CASCADE DELETE]
users (1) ──< categories (N)  [user_id FK, CASCADE DELETE]
categories (1) ──< tasks (N)  [category_id FK, SET NULL on category delete]
users (1) ──< personal_access_tokens (N) [polymorphic via tokenable]
```

## Soft Delete Summary

| Table | Has deleted_at | Eloquent Trait |
|-------|---------------|---------------|
| users | ✅ | `SoftDeletes` |
| tasks | ✅ | `SoftDeletes` |
| categories | ✅ | `SoftDeletes` |
| personal_access_tokens | ❌ | — |

## Next Available Migration Sequence

Next custom migration should use: `2026_03_19_000005_...`
