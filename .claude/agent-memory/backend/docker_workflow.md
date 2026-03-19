---
name: docker_workflow
description: All Docker commands for rebuilding, applying migrations, viewing logs, and running artisan on this project
type: project
---

**Project root:** `D:/Code Project/AgentTesting/`
**Backend container:** `todo_app` | **DB container:** `todo_db` | **Frontend:** `todo_frontend`

## Running Status

```bash
cd "D:/Code Project/AgentTesting" && docker compose ps
```

## Rebuild & Restart App

```bash
# Rebuild image (fast — uses layer cache if only entrypoint/app files changed)
cd "D:/Code Project/AgentTesting" && docker compose build app

# Restart container with new image
docker compose up -d app

# Check startup logs (migrations, seeder, server start)
docker compose logs app
```

## Apply a New Migration

Option A — without wipe (if migrations are additive):
```bash
docker exec todo_app //bin//sh -c "php artisan migrate --force"
```

Option B — fresh start (wipes all data, re-seeds):
```bash
cd "D:/Code Project/AgentTesting"
docker compose build app
docker exec todo_db mysql -u todo -psecret -e "DROP DATABASE todoapp; CREATE DATABASE todoapp;"
docker compose up -d app
# Wait ~20 seconds
docker compose logs app | tail -30
```

## Run Artisan Commands

```bash
# General pattern (Windows Git Bash requires //bin//sh -c)
docker exec todo_app //bin//sh -c "php artisan <command>"

# Examples
docker exec todo_app //bin//sh -c "php artisan route:list"
docker exec todo_app //bin//sh -c "php artisan migrate:status"
docker exec todo_app //bin//sh -c "php artisan db:seed --class=DemoUserSeeder --force"
docker exec todo_app //bin//sh -c "php artisan test"
docker exec todo_app //bin//sh -c "php artisan test --filter LoginTest"
```

## View Logs

```bash
cd "D:/Code Project/AgentTesting"
docker compose logs app              # all logs
docker compose logs app 2>&1 | tail -50   # last 50 lines
docker compose logs --follow app     # live follow
```

## Query the Database Directly

```bash
docker exec todo_db mysql -u todo -psecret todoapp -e "SELECT * FROM tasks LIMIT 5;"
docker exec todo_db mysql -u todo -psecret todoapp -e "SHOW TABLES;"
docker exec todo_db mysql -u todo -psecret todoapp -e "EXPLAIN SELECT * FROM tasks WHERE user_id=1 AND status='pending';"
```

## Port Mapping

| Service | Container Port | Host Port | Note |
|---------|---------------|-----------|------|
| MySQL | 3306 | **3307** | Changed from 3306 to avoid conflict with local MySQL |
| Laravel | 8000 | 8000 | |
| React | 5173 | 5173 | |

## docker-entrypoint.sh Behavior

On every container start:
1. Generates `.env` from Docker environment variables
2. Runs `php artisan key:generate`
3. Polls MySQL with PDO until connection succeeds
4. Runs `php artisan migrate --force`
5. Runs `php artisan db:seed --class=DemoUserSeeder --force`
6. Starts `php artisan serve --host=0.0.0.0 --port=8000`
