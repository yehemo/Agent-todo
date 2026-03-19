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

---

## Open Bugs (found 2026-03-19, test run)

### BUG-001: Logout does not revoke token — authenticated requests succeed after logout
- Test: `LoginTest::test_logout_revokes_token`
- Root cause: `Category` model uses `SoftDeletes`. `$category->delete()` issues a soft-delete, which sets `deleted_at` but leaves `category_id` FK on tasks intact. The migration has `nullOnDelete()` which fires on hard delete only (MySQL FK constraint). Because the record is only soft-deleted, the FK constraint never fires, so `category_id` is not nulled.
- Actually: separate issue. `AuthController::logout` calls `currentAccessToken()->delete()` — this should work. Likely a Sanctum guard config issue in test environment where `actingAs()` bypasses token auth entirely, so there is no "current access token" to delete — the second request (after logout) goes through `actingAs()` session guard and still returns 200.
- Fix location: `AuthController.php:53` — investigate whether `withToken()` in tests uses the Sanctum token guard. May need `sanctum` guard explicitly on the `/user` route.

### BUG-002: Deleting a category does not null category_id on owned tasks
- Test: `CategoryCrudTest::test_can_delete_category_and_tasks_become_uncategorized`
- Root cause: `Category` model uses `SoftDeletes`. `$category->delete()` performs a soft-delete (sets `deleted_at`). MySQL's `nullOnDelete()` FK constraint only fires on a hard DELETE SQL statement. Soft-delete issues an UPDATE, not a DELETE, so the FK constraint never triggers and `category_id` remains set.
- Fix location: `backend/app/Http/Controllers/Api/CategoryController.php:49` — `destroy()` must explicitly null `category_id` on related tasks before (or instead of) soft-deleting the category, OR the Category model needs a `deleting` boot hook to null the FK.

### BUG-003: completion_rate returned as integer 30 instead of float 30.0 (and 0 instead of 0.0)
- Tests: `StatsTest::test_completion_rate_is_calculated_correctly`, `StatsTest::test_returns_zero_stats_for_user_with_no_tasks`
- Root cause: PHP's `round()` returns a float only when the result has a fractional part. `round(30.0, 1)` returns `float(30)` which JSON-encodes as `30`, not `30.0`. The zero case: `0.0` literal in PHP is cast to int 0 in the ternary because the `?:` branch returns `0.0` but PHP's json_encode serialises it as `0` when the value is effectively zero.
- Fix location: `backend/app/Http/Controllers/Api/StatsController.php:33` — cast result to float: `(float) round(...)` and ensure the zero branch also returns `(float) 0`.

### BUG-004: Tests missing from Docker image (infrastructure gap)
- Dockerfile does not COPY `tests/` directory — only `app/`, `database/`, `routes/`, `config/cors.php`, `bootstrap/app.php` are copied.
- Tests must be copied manually with `docker cp` before each test run, or the Dockerfile must be updated.
- Fix location: `backend/Dockerfile` — add `COPY tests/ tests/` after the existing COPY lines.
