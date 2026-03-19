---
name: test_structure
description: All test files in the project, their frameworks, and exact commands to run them
type: project
---

## Backend Tests (PHPUnit / Laravel)

**Location:** `D:/Code Project/AgentTesting/backend/tests/`

```
tests/
├── Feature/
│   ├── Auth/
│   │   ├── LoginTest.php           — login success, wrong password, missing fields
│   │   └── RegisterTest.php        — register success, duplicate email, validation
│   ├── Tasks/
│   │   ├── CreateTaskTest.php      — create with valid/invalid data, auth required
│   │   ├── ListTasksTest.php       — pagination, filters (status, priority, category, search), sort
│   │   ├── UpdateTaskTest.php      — update fields, cross-user 403
│   │   ├── UpdateTaskStatusTest.php — PATCH /tasks/{id}/status, completed_at auto-set
│   │   └── DeleteTaskTest.php      — soft delete, cross-user 403
│   ├── Categories/
│   │   └── CategoryCrudTest.php    — full CRUD, ownership check
│   └── Stats/
│       └── StatsTest.php           — stats response shape, counts accuracy
└── Unit/
    └── Models/
        └── TaskModelTest.php       — isOverdue(), boot() hook, completed_at behavior
```

**Run all backend tests:**
```bash
docker exec todo_app //bin//sh -c "php artisan test"
```

**Run specific test:**
```bash
docker exec todo_app //bin//sh -c "php artisan test --filter LoginTest"
docker exec todo_app //bin//sh -c "php artisan test tests/Feature/Tasks/CreateTaskTest.php"
```

**Run with coverage (if Xdebug available):**
```bash
docker exec todo_app //bin//sh -c "php artisan test --coverage"
```

## Frontend Tests (Vitest + React Testing Library)

**Location:** `D:/Code Project/AgentTesting/frontend/src/__tests__/`

```
__tests__/
├── setup.ts                              — Vitest + jsdom + Testing Library config
├── components/
│   ├── StatusBadge.test.tsx              — renders correct label and color per status
│   ├── PriorityBadge.test.tsx            — renders correct label and color per priority
│   └── DueDateLabel.test.tsx             — overdue, due today, future date rendering
└── utils/
    └── dates.test.ts                     — formatDate(), isOverdue() edge cases
```

**Run frontend tests (from host, requires Node.js):**
```bash
cd "D:/Code Project/AgentTesting/frontend" && npx vitest run
```

**Run in watch mode:**
```bash
cd "D:/Code Project/AgentTesting/frontend" && npx vitest
```

**With UI:**
```bash
cd "D:/Code Project/AgentTesting/frontend" && npx vitest --ui
```

## E2E Tests (Playwright)

**Location:** `D:/Code Project/AgentTesting/e2e/`

```
e2e/
├── playwright.config.ts                  — base URL: http://localhost:5173
├── fixtures/
│   └── auth.fixture.ts                   — shared login fixture
└── tests/
    ├── auth.spec.ts                      — login, register, logout flows
    ├── categories.spec.ts                — category CRUD via UI
    └── task-management.spec.ts           — task create, edit, delete, filter via UI
```

**Run E2E tests (requires both containers running):**
```bash
cd "D:/Code Project/AgentTesting" && npx playwright test
```

**Run specific spec:**
```bash
cd "D:/Code Project/AgentTesting" && npx playwright test e2e/tests/auth.spec.ts
```

**Run with UI:**
```bash
cd "D:/Code Project/AgentTesting" && npx playwright test --ui
```

## Test Data Notes

- Backend Feature tests use `RefreshDatabase` — they run against a real test database, not mocks
- Tests create their own users/tasks via factories — they do NOT depend on the demo seed data
- `TaskFactory` and `CategoryFactory` are in `backend/database/factories/`
