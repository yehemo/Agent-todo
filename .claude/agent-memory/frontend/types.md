---
name: types
description: All TypeScript interfaces and exact union type values used across the frontend
type: project
---

## Critical: Exact Enum Values

```typescript
// STATUS — uses HYPHEN, not underscore
type TaskStatus = 'pending' | 'in-progress' | 'completed'
//                                  ↑ hyphen — matches the MySQL enum exactly

// PRIORITY
type Priority = 'low' | 'medium' | 'high'
```

**Why this matters:** Sending `'in_progress'` (underscore) to the API causes a 422 validation error.

## Auth Types (`auth.types.ts`)

```typescript
interface User { id: number; name: string; email: string; created_at: string }
interface AuthResponse { data: { token: string; user: User } }
interface LoginPayload { email: string; password: string }
interface RegisterPayload { name: string; email: string; password: string; password_confirmation: string }
```

## Task Types (`task.types.ts`)

```typescript
interface Task {
  id: number
  title: string
  description: string | null
  priority: Priority
  status: TaskStatus
  due_date: string | null        // "YYYY-MM-DD" date string
  completed_at: string | null    // ISO datetime — set automatically by backend
  category: Category | null      // nested object (eager loaded)
  created_at: string
  updated_at: string
}

interface TaskFilters {
  status?: TaskStatus
  priority?: Priority
  category_id?: number
  search?: string
  per_page?: number
  sort?: 'due_date' | 'priority' | 'created_at'
}
```

## Category Types (`category.types.ts`)

```typescript
interface Category {
  id: number
  name: string
  description: string | null
  color: string          // hex e.g. "#f43f5e" — use inline style, not Tailwind class
  created_at: string
  updated_at: string
}
```

## API Types (`api.types.ts`)

```typescript
interface PaginatedResponse<T> {
  data: T[]
  meta: { current_page: number; last_page: number; per_page: number; total: number }
}

interface StatsData {
  total: number
  pending: number
  in_progress: number      // NOTE: underscore here (JS object key, not enum value)
  completed: number
  overdue: number
  completion_rate: number
  by_priority: { low: number; medium: number; high: number }
  by_category: Array<{ id: number; name: string; color: string; total: number; completed: number }>
}
```
