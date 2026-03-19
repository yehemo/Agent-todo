---
name: project_overview
description: TaskFlow backend — Laravel 11, Sanctum, PHP 8.2, full file tree, demo credentials
type: project
---

**App:** TaskFlow To-Do API. Laravel 11 + PHP 8.2 + MySQL 8.0. Runs in Docker.

## Tech Stack

- Laravel 11 (no `app/Http/Kernel.php` — middleware in `bootstrap/app.php`)
- PHP 8.2-cli (Docker image: `php:8.2-cli`)
- Laravel Sanctum — token-based auth (Bearer tokens, NOT cookie/session)
- MySQL 8.0 — database `todoapp`, user `todo`, pass `secret`

## Complete File Tree

```
backend/
├── Dockerfile
├── docker-entrypoint.sh        # generates .env, migrates, seeds, starts serve
├── .dockerignore
├── bootstrap/app.php           # middleware registered here (Laravel 11 style)
├── config/cors.php
├── routes/api.php
├── app/
│   ├── Models/
│   │   ├── User.php            # HasApiTokens, SoftDeletes
│   │   ├── Task.php            # SoftDeletes, boot() hook for completed_at
│   │   └── Category.php        # SoftDeletes
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── TaskController.php    # includes updateStatus() method
│   │   │   ├── CategoryController.php
│   │   │   └── StatsController.php   # invokable controller
│   │   ├── Middleware/
│   │   │   └── ForceJsonResponse.php
│   │   ├── Requests/
│   │   │   ├── Auth/LoginRequest.php
│   │   │   ├── Auth/RegisterRequest.php
│   │   │   ├── Task/StoreTaskRequest.php
│   │   │   ├── Task/UpdateTaskRequest.php
│   │   │   ├── Task/UpdateTaskStatusRequest.php
│   │   │   ├── Category/StoreCategoryRequest.php
│   │   │   └── Category/UpdateCategoryRequest.php
│   │   └── Resources/
│   │       ├── UserResource.php
│   │       ├── TaskResource.php
│   │       ├── TaskCollection.php
│   │       └── CategoryResource.php
│   ├── Policies/
│   │   ├── TaskPolicy.php
│   │   └── CategoryPolicy.php
│   └── Providers/AppServiceProvider.php
├── database/
│   ├── migrations/ (5 files — see database agent memory)
│   ├── factories/
│   │   ├── TaskFactory.php
│   │   └── CategoryFactory.php
│   └── seeders/DemoUserSeeder.php
└── tests/
    ├── Feature/Auth/       (LoginTest, RegisterTest)
    ├── Feature/Tasks/      (CreateTaskTest, DeleteTaskTest, ListTasksTest, UpdateTaskTest, UpdateTaskStatusTest)
    ├── Feature/Categories/ (CategoryCrudTest)
    ├── Feature/Stats/      (StatsTest)
    └── Unit/Models/        (TaskModelTest)
```

## Demo Credentials (seeded by DemoUserSeeder)

- Email: `demo@example.com` / Password: `password`
- 3 categories: Work (#f43f5e), Personal (#6366f1), Learning (#10b981)
- 10 tasks across categories, mixed statuses and priorities
