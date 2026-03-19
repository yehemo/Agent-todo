# TaskFlow — Full-Stack To-Do Application

A production-ready task management application built with **React + TypeScript** on the frontend and **Laravel 11** on the backend, fully containerized with **Docker Compose**.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Tailwind CSS v3, Vite |
| State | TanStack Query v5, Zustand |
| Backend | Laravel 11, PHP 8.2, Laravel Sanctum |
| Database | MySQL 8.0 |
| Auth | Token-based (Sanctum Bearer tokens) |
| Testing | Vitest, PHPUnit, Playwright |
| DevOps | Docker, Docker Compose |

---

## Features

- **Authentication** — Register, login, logout with Sanctum token auth
- **Task Management** — Create, edit, delete tasks with title, description, priority, status, due date, and category
- **Categories** — Organize tasks by color-coded categories
- **Dashboard** — Stats overview with completion rate, priority breakdown, category progress
- **Filtering & Search** — Filter by status, priority, category; search by keyword; sort by due date or priority
- **Responsive UI** — Mobile-first design with Tailwind CSS
- **Sub-Agent System** — 4 specialized Claude Code agents (frontend, backend, database, qa)

---

## Project Structure

```
AgentTesting/
├── frontend/               # React + TypeScript SPA
│   ├── src/
│   │   ├── api/            # Axios instance + API calls
│   │   ├── components/     # UI components (tasks, categories, dashboard, layout)
│   │   ├── hooks/          # TanStack Query hooks
│   │   ├── pages/          # Page components
│   │   ├── stores/         # Zustand state (auth, ui)
│   │   ├── types/          # TypeScript interfaces
│   │   └── utils/          # Helpers, query keys
│   └── Dockerfile
├── backend/                # Laravel 11 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/   # Auth, Task, Category, Stats
│   │   │   ├── Requests/          # Form request validation
│   │   │   └── Resources/         # API response formatting
│   │   ├── Models/                # User, Task, Category
│   │   └── Policies/              # Authorization policies
│   ├── database/
│   │   ├── migrations/
│   │   ├── factories/
│   │   └── seeders/
│   ├── routes/api.php
│   ├── Dockerfile
│   └── docker-entrypoint.sh
├── e2e/                    # Playwright end-to-end tests
├── .claude/                # Claude Code sub-agents, skills, memory
└── docker-compose.yml
```

---

## Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git

### 1. Clone the repository

```bash
git clone git@github.com:yehemo/Agent-todo.git
cd Agent-todo
```

### 2. Start all services

```bash
docker compose up --build
```

This single command:
- Builds the Laravel backend image (installs PHP, Composer, Laravel)
- Builds the React frontend image (installs Node.js dependencies)
- Starts MySQL 8.0
- Runs database migrations automatically
- Seeds demo data

> First build takes ~5–10 minutes depending on your internet speed.

### 3. Open the app

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| MySQL | localhost:**3307** (user: `todo`, pass: `secret`) |

### 4. Login with demo account

```
Email:    demo@example.com
Password: password
```

---

## API Reference

All endpoints are prefixed with `/api/v1/`.

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login, returns Bearer token |
| `POST` | `/auth/logout` | Logout (invalidates token) |
| `GET` | `/auth/user` | Get current user |

### Tasks _(requires Bearer token)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | List tasks (filterable, paginated) |
| `POST` | `/tasks` | Create task |
| `PUT` | `/tasks/{id}` | Update task |
| `PATCH` | `/tasks/{id}/status` | Update status only |
| `DELETE` | `/tasks/{id}` | Delete task (soft delete) |

**Query params for `GET /tasks`:** `status`, `priority`, `category_id`, `search`, `sort`, `per_page`

### Categories _(requires Bearer token)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | List all categories |
| `POST` | `/categories` | Create category |
| `PUT` | `/categories/{id}` | Update category |
| `DELETE` | `/categories/{id}` | Delete category |

### Stats _(requires Bearer token)_

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/stats` | Dashboard stats (totals, completion rate, by priority/category) |

---

## Database Schema

```
users          → id, name, email, password, deleted_at
categories     → id, user_id, name, description, color
tasks          → id, user_id, category_id, title, description,
                 status (pending|in-progress|completed),
                 priority (low|medium|high),
                 due_date, completed_at, deleted_at
personal_access_tokens  → Sanctum auth tokens
```

Relationships:
- `User` → has many `Tasks`, has many `Categories`
- `Category` → belongs to `User`, has many `Tasks`
- `Task` → belongs to `User`, belongs to `Category` (nullable)

---

## Running Tests

### Backend (PHPUnit)

```bash
docker exec todo_app //bin//sh -c "php artisan test"
```

### Frontend (Vitest)

```bash
cd frontend && npx vitest run
```

### E2E (Playwright)

```bash
npx playwright test
```

---

## Useful Commands

```bash
# Start all services (detached)
docker compose up -d

# Stop all services
docker compose down

# View backend logs
docker compose logs app

# Run artisan commands
docker exec todo_app //bin//sh -c "php artisan <command>"

# Query the database
docker exec todo_db mysql -u todo -psecret todoapp -e "SELECT * FROM tasks;"

# Rebuild after code changes
docker compose build app
docker compose up -d app
```

---

## Environment Variables

The backend `.env` is auto-generated by `docker-entrypoint.sh` from Docker Compose environment variables. To customize, edit the `environment:` section in `docker-compose.yml`.

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `db` | MySQL container hostname |
| `DB_DATABASE` | `todoapp` | Database name |
| `DB_USERNAME` | `todo` | Database user |
| `DB_PASSWORD` | `secret` | Database password |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Frontend API base URL |

---

## Sub-Agent System (Claude Code)

This project includes 4 specialized Claude Code sub-agents in `.claude/agents/`:

| Agent | Responsibility |
|-------|---------------|
| `frontend` | React + TypeScript + Tailwind UI work |
| `backend` | Laravel API, routes, controllers, migrations |
| `database` | MySQL schema design, indexes, migrations |
| `qa` | Testing, debugging, API verification |

**Skills** available via `/skill-name`:

| Skill | What it does |
|-------|-------------|
| `/new-component` | Scaffold a new React component |
| `/new-endpoint` | Add a new Laravel API endpoint |
| `/new-migration` | Design and apply a DB migration |
| `/run-tests` | Run all tests and report results |
| `/check-api` | Verify all API endpoints are working |
| `/daily-report` | Generate a daily activity report |

---

## Deployment

To deploy on a VPS or cloud server:

1. Clone the repo on the server
2. Update `VITE_API_BASE_URL` in `docker-compose.yml` to your server IP or domain
3. Run `docker compose up -d --build`

For production, consider:
- Adding an Nginx reverse proxy
- Using HTTPS (Let's Encrypt / Certbot)
- Setting `APP_ENV=production` and `APP_DEBUG=false`

---

## License

MIT
