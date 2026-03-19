---
name: routes_and_controllers
description: All API routes, their controller methods, throttle groups, and auth patterns
type: project
---

## Route File: `routes/api.php`

```
PREFIX: /api/v1/

Auth group (throttle: 5 req/min):
  POST /auth/register       → AuthController::register()
  POST /auth/login          → AuthController::login()

  [auth:sanctum]:
    POST /auth/logout       → AuthController::logout()
    GET  /auth/user         → AuthController::user()

Protected group (throttle: 60 req/min, auth:sanctum):
  apiResource categories    → CategoryController (index, store, show, update, destroy)
  PATCH tasks/{task}/status → TaskController::updateStatus()   ← registered BEFORE apiResource
  apiResource tasks         → TaskController (index, store, show, update, destroy)
  GET stats                 → StatsController (invokable)
```

**Important:** `PATCH tasks/{task}/status` is registered before `apiResource tasks` to avoid route conflicts.

## Controller Patterns

### AuthController
- `register`: validate → `User::create()` → `createToken('api-token')` → return `{data: {user, token}}` 201
- `login`: `Auth::attempt()` → on fail return 422 → `$user->tokens()->delete()` (revoke old tokens) → `createToken()` → return `{data: {user, token}}`
- `logout`: `$request->user()->currentAccessToken()->delete()`
- `user`: return `{data: UserResource}`

### TaskController
- `index`: `$request->user()->tasks()->with('category')` → filter by status/priority/category_id/search → sort → paginate → `TaskCollection`
- `store`: `$request->user()->tasks()->create($request->validated())` → load category → 201
- `update`: `$this->authorize('update', $task)` → `$task->update($request->validated())`
- `updateStatus`: `$this->authorize('update', $task)` → `$task->update($request->validated())` (status only)
- `destroy`: `$this->authorize('delete', $task)` → soft delete via `$task->delete()`

### StatsController (invokable `__invoke`)
Returns: `{data: {total, pending, in_progress, completed, overdue, completion_rate, by_priority, by_category}}`

## Authorization (Policies)

`TaskPolicy` and `CategoryPolicy` check `$user->id === $model->user_id`.
Registered in `AppServiceProvider` or auto-discovered.
All non-index controller methods call `$this->authorize('view|update|delete', $model)`.

## Response Format

```php
// Single resource
return response()->json(['data' => new TaskResource($task)]);
return response()->json(['data' => new TaskResource($task)], 201);  // created

// Collection (via TaskCollection)
return (new TaskCollection($tasks))->response();

// Error (auto from Form Request)
// 422: { message: "...", errors: { field: ["message"] } }

// 401 from login failure
return response()->json(['message' => '...', 'errors' => ['email' => ['...']]], 422);
```

## Middleware Registration (Laravel 11 — bootstrap/app.php)

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->prepend(ForceJsonResponse::class);
    $middleware->statefulApi();
})
```

No `app/Http/Kernel.php` in Laravel 11 — never reference it.
