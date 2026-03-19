---
name: request_resources
description: Form request validation rules and API Resource response shapes for all endpoints
type: project
---

## Form Requests

### Auth
```php
// LoginRequest
'email'    => 'required|email'
'password' => 'required|string'

// RegisterRequest
'name'                  => 'required|string|max:255'
'email'                 => 'required|email|unique:users'
'password'              => 'required|string|min:8|confirmed'
'password_confirmation' => 'required'
```

### Task
```php
// StoreTaskRequest
'title'       => 'required|string|max:255'
'description' => 'nullable|string'
'priority'    => 'required|in:low,medium,high'
'status'      => 'required|in:pending,in-progress,completed'   // hyphen!
'due_date'    => 'nullable|date'
'category_id' => 'nullable|exists:categories,id'

// UpdateTaskRequest — all nullable/sometimes for partial update
'title'       => 'sometimes|string|max:255'
'description' => 'nullable|string'
'priority'    => 'sometimes|in:low,medium,high'
'status'      => 'sometimes|in:pending,in-progress,completed'
'due_date'    => 'nullable|date'
'category_id' => 'nullable|exists:categories,id'

// UpdateTaskStatusRequest
'status' => 'required|in:pending,in-progress,completed'
```

### Category
```php
// StoreCategoryRequest
'name'        => 'required|string|max:255'
'description' => 'nullable|string'
'color'       => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/'

// UpdateCategoryRequest — same but all sometimes
```

## API Resources

### UserResource
```json
{ "id": 1, "name": "Demo User", "email": "demo@example.com", "created_at": "..." }
```

### TaskResource
```json
{
  "id": 1,
  "title": "Complete Q1 report",
  "description": null,
  "priority": "high",
  "status": "in-progress",
  "due_date": "2026-03-21",
  "completed_at": null,
  "category": { "id": 1, "name": "Work", "description": "...", "color": "#f43f5e", "created_at": "...", "updated_at": "..." },
  "created_at": "...",
  "updated_at": "..."
}
```
Note: `category` is null if task has no category (not omitted).

### TaskCollection (paginated)
```json
{
  "data": [ ...TaskResource array... ],
  "meta": { "current_page": 1, "last_page": 1, "per_page": 15, "total": 10 }
}
```

### CategoryResource
```json
{ "id": 1, "name": "Work", "description": "Work-related tasks", "color": "#f43f5e", "created_at": "...", "updated_at": "..." }
```
