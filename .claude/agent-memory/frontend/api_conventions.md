---
name: api_conventions
description: Axios instance setup, interceptors, all API endpoints and response shapes
type: project
---

## Axios Instance (`src/api/axios.ts`)

```typescript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,  // "http://localhost:8000" in Docker
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})
```

**Request interceptor:** Reads `useAuthStore.getState().token` and attaches `Authorization: Bearer <token>`.
**Response interceptor:** On 401 → `clearAuth()` then `window.location.href = '/login'`.

Always use this shared instance. Never import raw `axios` directly for API calls.

## All Endpoints

Base: `http://localhost:8000/api/v1`

### Auth
| Method | Path | Body | Response |
|--------|------|------|---------|
| POST | `/auth/login` | `{email, password}` | `{data: {user, token}}` |
| POST | `/auth/register` | `{name, email, password, password_confirmation}` | `{data: {user, token}}` 201 |
| POST | `/auth/logout` | — | `{message: "..."}` |
| GET | `/auth/user` | — | `{data: User}` |

### Tasks
| Method | Path | Notes |
|--------|------|-------|
| GET | `/tasks` | Query params: `status`, `priority`, `category_id`, `search`, `per_page`, `sort` |
| POST | `/tasks` | Body: `{title, description?, priority, status, due_date?, category_id?}` → 201 |
| GET | `/tasks/{id}` | Single task |
| PUT | `/tasks/{id}` | Full update |
| PATCH | `/tasks/{id}/status` | Body: `{status}` only — dedicated status endpoint |
| DELETE | `/tasks/{id}` | 204 No Content |

### Categories
| Method | Path | Notes |
|--------|------|-------|
| GET | `/categories` | All user categories |
| POST | `/categories` | `{name, description?, color}` → 201 |
| PUT | `/categories/{id}` | Update |
| DELETE | `/categories/{id}` | 204 No Content |

### Stats
| Method | Path | Response |
|--------|------|---------|
| GET | `/stats` | `{data: StatsData}` |

## Response Envelope

All successful responses: `{ data: T }` or `{ data: T[], meta: {...} }`
Errors: `{ message: string, errors?: { field: string[] } }`

## Rate Limiting

Auth routes: throttle 5 req/min. All other protected routes: 60 req/min.
On 429 the API returns a standard Laravel throttle response.
