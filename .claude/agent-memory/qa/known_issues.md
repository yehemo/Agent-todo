---
name: known_issues
description: Bugs found and fixed during initial project build — recurring risk areas to watch
type: project
---

## Fixed Issues (Risk Areas to Recheck)

### 1. Status Enum: Hyphen vs Underscore
**Risk:** HIGH — will reappear if any new code uses `'in_progress'`

The MySQL enum and TypeScript type both use `'in-progress'` (hyphen). Any code that uses `'in_progress'` (underscore) will cause a 422 validation error on the API or a TypeScript type error.

- Frontend: `task.types.ts` → `type TaskStatus = 'pending' | 'in-progress' | 'completed'`
- Backend: `StoreTaskRequest` / `UpdateTaskRequest` → `in:pending,in-progress,completed`
- Database: `ENUM('pending','in-progress','completed')`

**Test:** Send `{status: 'in_progress'}` to `POST /api/v1/tasks` → should return 422 (not 201).

---

### 2. Sanctum personal_access_tokens Table Missing
**Fixed by:** `2026_03_19_000004_create_personal_access_tokens_table.php`

When Sanctum is installed via `composer require`, its migration isn't always published automatically. The table was missing on first run, causing 500 errors on login. Manually added as a custom migration.

**Risk:** If database is wiped and migrations are re-run, this migration must exist or login will fail.

---

### 3. users.deleted_at Column Missing
**Fixed by:** `2026_03_19_000003_add_deleted_at_to_users_table.php`

The `User` model uses `SoftDeletes` trait, but the base Laravel `create_users_table` migration doesn't add `deleted_at`. Was causing "Unknown column 'users.deleted_at'" SQL errors during seeding.

---

### 4. MySQL Ready Check in Entrypoint
**Fixed in:** `backend/docker-entrypoint.sh`

Original check used `php artisan migrate:status` which returns exit code 1 ("migration table not found") even when MySQL IS ready, causing infinite loop. Fixed to use direct PDO connection check instead.

---

### 5. MySQL Port Conflict
**Fixed in:** `docker-compose.yml`

Local MySQL was running on port 3306, conflicting with the Docker MySQL. Changed host mapping to **3307:3306**. The app inside Docker still connects to port 3306 (internal). Only the host-facing port is 3307.

---

## Ongoing Risk Areas

| Area | Risk | How to Detect |
|------|------|--------------|
| Status enum value | Any new filter/form using `'in_progress'` | 422 on task create/update |
| Docker layer cache | Stale code in container after file changes | Rebuild with `docker compose build app` |
| Token revocation | Login doesn't revoke old tokens → old tokens still work | Check `personal_access_tokens` table count |
| Soft deletes | Deleted tasks appear if someone queries without Eloquent | Verify `deleted_at IS NULL` in raw SQL |
| Category SET NULL | Deleting category doesn't delete its tasks (intentional) | Tasks should show `category: null` |
