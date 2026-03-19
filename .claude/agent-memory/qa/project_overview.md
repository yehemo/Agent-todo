---
name: project_overview
description: TaskFlow QA context — running Docker services, ports, demo credentials, container commands
type: project
---

**App:** TaskFlow To-Do application. Full stack running in Docker.

## Running Services

| Container | Service | Host Port | URL |
|-----------|---------|-----------|-----|
| `todo_app` | Laravel 11 API | 8000 | http://localhost:8000 |
| `todo_frontend` | React 18 SPA | 5173 | http://localhost:5173 |
| `todo_db` | MySQL 8.0 | **3307** | user: `todo`, pass: `secret`, db: `todoapp` |

**Note:** MySQL maps to host port **3307** (not 3306) to avoid conflict with local MySQL.

## Demo Credentials

| Field | Value |
|-------|-------|
| Email | `demo@example.com` |
| Password | `password` |

Seeded data: 3 categories (Work, Personal, Learning), 10 tasks with mixed statuses and priorities.

## Check Services Are Running

```bash
cd "D:/Code Project/AgentTesting" && docker compose ps
```

Expected: all 3 containers `Up`, `todo_db` showing `(healthy)`.

## View Logs

```bash
cd "D:/Code Project/AgentTesting" && docker compose logs app 2>&1 | tail -30
cd "D:/Code Project/AgentTesting" && docker compose logs frontend 2>&1 | tail -20
```

## Restart If Down

```bash
cd "D:/Code Project/AgentTesting" && docker compose up -d
```

## Get a Token for API Testing

```bash
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}' | grep -o '"token":"[^"]*"'
```
