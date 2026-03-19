---
name: project_overview
description: TaskFlow frontend — tech stack versions, pages, Docker context, demo credentials
type: project
---

Full-stack To-Do app called **TaskFlow**. Frontend is a React + TypeScript SPA served via Docker.

**Why:** Built as a demonstration multi-role project (frontend / backend / database / QA agents).
**How to apply:** Always assume the app is running in Docker at localhost:5173 talking to the API at localhost:8000.

## Tech Stack (exact versions)

| Package | Version |
|---------|---------|
| React | 18.2.0 |
| TypeScript | 5.2.2 |
| Vite | 5.0.8 |
| Tailwind CSS | 3.4.0 |
| TanStack Query | 5.17.0 |
| Zustand | 4.4.7 |
| React Router | 6.21.0 |
| react-hook-form | 7.49.0 |
| Axios | 1.6.0 |
| react-hot-toast | 2.4.1 |
| Vitest | 1.1.0 |
| Playwright | 1.40.1 |

## Pages & Routes

| Path | Page | Notes |
|------|------|-------|
| `/login` | LoginPage | Public only (PublicRoute) |
| `/register` | RegisterPage | Public only (PublicRoute) |
| `/dashboard` | DashboardPage | Protected (PrivateRoute) |
| `/tasks` | TasksPage | Protected |
| `/categories` | CategoriesPage | Protected |
| `/` | → /dashboard | Redirect |
| `*` | → /dashboard | Redirect |

## Docker

- Frontend runs in `todo_frontend` container, port **5173**
- API base URL injected as `VITE_API_BASE_URL=http://localhost:8000` via docker-compose.yml
- Rebuild: `cd "D:/Code Project/AgentTesting" && docker compose build frontend`
- Restart: `docker compose up -d frontend`

## Demo Credentials

Email: `demo@example.com` / Password: `password`
