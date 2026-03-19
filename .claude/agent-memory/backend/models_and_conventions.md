---
name: models_and_conventions
description: Model behaviors, Task boot() hook, soft deletes on all 3 models, fillable/casts, relationships
type: project
---

## Critical: Status Enum Uses Hyphens

```php
// tasks.status enum: 'pending', 'in-progress', 'completed'
// The hyphen is intentional — matches the frontend TypeScript union type
// NEVER change to 'in_progress' (underscore)
```

## Task Model (`app/Models/Task.php`)

**Traits:** `HasFactory`, `SoftDeletes`

**Fillable:** `user_id`, `category_id`, `title`, `description`, `priority`, `status`, `due_date`, `completed_at`

**Casts:** `due_date` → `date`, `completed_at` → `datetime`

**boot() hook — auto-manages completed_at:**
```php
static::saving(function (Task $task) {
    if ($task->isDirty('status')) {
        $task->completed_at = $task->status === 'completed'
            ? ($task->completed_at ?? now())
            : null;
    }
});
```
- When status changes TO `completed`: sets `completed_at = now()` (if not already set)
- When status changes AWAY from `completed`: clears `completed_at = null`
- **Do NOT manually set `completed_at` in controllers or seeders** — let the model handle it

**`isOverdue()` method:** Returns `true` if `due_date` is past and status is not `completed`.

**Relationships:** `belongsTo User`, `belongsTo Category (nullable)`

## User Model (`app/Models/User.php`)

**Traits:** `HasApiTokens`, `HasFactory`, `Notifiable`, `SoftDeletes`

**Note:** `SoftDeletes` on User requires the `deleted_at` column — added via migration `2026_03_19_000003_add_deleted_at_to_users_table.php`

**Relationships:** `hasMany Task`, `hasMany Category`

## Category Model (`app/Models/Category.php`)

**Traits:** `HasFactory`, `SoftDeletes`

**Fillable:** `user_id`, `name`, `description`, `color`

**Relationships:** `belongsTo User`, `hasMany Task`

## Eager Loading

Always eager load `category` when returning tasks:
```php
$task->load('category');
// or in query:
->with('category')
```
Prevents N+1 queries. TaskResource expects `category` to be loaded.

## User Scoping

All queries must scope to the authenticated user:
```php
$request->user()->tasks()      // NOT Task::where('user_id', ...)
$request->user()->categories()
```

## Soft Deletes Behavior

Soft-deleted records have `deleted_at` set. Eloquent automatically excludes them from queries. Deleted tasks/categories are NOT shown in API responses — Eloquent handles this transparently.
