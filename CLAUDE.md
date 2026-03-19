# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TaskFlow is a full-stack task management app: **React + TypeScript + Tailwind CSS** frontend, **Laravel 11** backend, **MySQL 8.0** database, fully containerized with Docker Compose.

---

## Commands

### Start / Stop

```bash
docker compose up --build        # First run — builds images, migrates, seeds
docker compose up -d             # Start (containers already built)
docker compose down              # Stop all services
```

### Rebuild after code changes

```bash
# Backend
docker compose build app && docker compose up -d app

# Frontend
docker compose build frontend && docker compose up -d frontend
```

### Backend (Laravel) — always via Docker exec

```bash
docker exec todo_app //bin//sh -c "php artisan test"           # Run all tests
docker exec todo_app //bin//sh -c "php artisan test --filter TaskTest"  # Single test
docker exec todo_app //bin//sh -c "php artisan <command>"      # Any artisan command
docker exec todo_db mysql -u todo -psecret todoapp -e "SELECT * FROM tasks;"
```

### Frontend

```bash
cd frontend
npx vitest run          # Unit tests (headless)
npx vitest              # Unit tests (watch mode)
npx tsc --noEmit        # TypeScript check
npx playwright test     # E2E tests
```

---

## Architecture

### Services (docker-compose.yml)

| Container | Port | Notes |
|-----------|------|-------|
| `todo_app` (service: `app`) | 8000 | Laravel PHP 8.2 |
| `todo_db` (service: `db`) | **3307**:3306 | MySQL 8.0 — mapped to 3307 to avoid local MySQL conflict |
| `todo_frontend` (service: `frontend`) | 5173 | React/Vite dev server |

### Backend Dockerfile — overlay pattern

The Dockerfile creates a **fresh Laravel 11 skeleton** via `composer create-project`, then **overlays** only the custom application files on top. Only these directories are copied into the image: `app/`, `database/`, `routes/`, `config/cors.php`, `bootstrap/app.php`, `tests/`. Everything else (vendor, framework config, etc.) comes from the skeleton. When adding new config files, they must be explicitly added to the Dockerfile `COPY` block.

### docker-entrypoint.sh startup sequence

On every container start:
1. Generates `.env` from Docker Compose env vars
2. Runs `php artisan key:generate`
3. Waits for MySQL via PDO loop (not `migrate:status` — that returns exit code 1 until migrations run)
4. Runs `php artisan migrate --force`
5. Seeds demo data via `DemoUserSeeder`
6. Starts `php artisan serve --host=0.0.0.0 --port=8000`

Demo credentials: `demo@example.com` / `password`

---

## Critical Conventions

### Status enum uses hyphens
```
'pending' | 'in-progress' | 'completed'   ✓
'in_progress'                              ✗
```
This applies everywhere: backend migrations, validation, frontend TypeScript types, query filters.

### Laravel 11 base Controller
Laravel 11 ships with an empty `Controller` base class — it does **not** include `AuthorizesRequests` by default. The project's `app/Http/Controllers/Controller.php` explicitly adds `use AuthorizesRequests`. All API controllers extend this and use `$this->authorize()`.

### SoftDeletes + FK constraint
`Category` and `Task` both use `SoftDeletes`. The `tasks.category_id` FK is defined with `nullOnDelete()`, but MySQL's `ON DELETE SET NULL` only fires on hard `DELETE`, not soft-delete (`UPDATE SET deleted_at`). Therefore `CategoryController::destroy()` manually runs `$category->tasks()->update(['category_id' => null])` before `$category->delete()`.

### TanStack Query cache on auth changes
`queryClient.clear()` is called in all three auth transitions (login, register, logout) inside `frontend/src/hooks/useAuth.ts`. This prevents stale user data leaking between sessions or accounts.

### Remember Me token storage
`frontend/src/stores/authStore.ts` implements manual storage switching:
- **Remember Me = true** → `localStorage` (survives browser close)
- **Remember Me = false** → `sessionStorage` (cleared on browser close)
- On write, the other storage is always cleared to prevent conflicts.
- Email is separately saved to `localStorage` under `taskflow-saved-email` for form pre-fill.

### StatsController float precision
`completion_rate` must be cast to `(float)` explicitly and the response uses `JSON_PRESERVE_ZERO_FRACTION` to prevent PHP serializing `30.0` as integer `30`.

---

## API Routes

All routes prefixed `/api/v1/`. Auth routes throttled at 5 req/min; protected routes at 60 req/min.

**Public:** `POST /auth/register`, `POST /auth/login`

**Requires Sanctum token:**
- `GET|POST /auth/logout`, `GET /auth/user`
- `GET|POST|PUT|DELETE /categories`
- `GET|POST|PUT|DELETE /tasks`, `PATCH /tasks/{id}/status`
- `GET /stats`

---

## Sub-Agents & Skills

Four specialized agents in `.claude/agents/`: `frontend`, `backend`, `database`, `qa`. Each is fully autonomous — reads files, makes changes, verifies (tsc / docker build / artisan test), then reports back.

Skills: `/new-component`, `/new-endpoint`, `/new-migration`, `/run-tests`, `/check-api`, `/daily-report`
