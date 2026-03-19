---
name: api_endpoints_checklist
description: Every API endpoint with ready-to-paste curl commands for manual verification
type: reference
---

Base URL: `http://localhost:8000/api/v1`

## Step 1 — Get Token

```bash
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo "Token: $TOKEN"
```

## Auth Endpoints

```bash
# ✅ Register (new user)
curl -s -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@qa.com","password":"password","password_confirmation":"password"}'
# Expected: 201, {data: {user, token}}

# ✅ Login
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password"}'
# Expected: 200, {data: {user, token}}

# ❌ Wrong password
curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"wrong"}'
# Expected: 422, {message, errors}

# ✅ Get current user
curl -s http://localhost:8000/api/v1/auth/user -H "Authorization: Bearer $TOKEN"
# Expected: 200, {data: User}

# ✅ Logout
curl -s -X POST http://localhost:8000/api/v1/auth/logout -H "Authorization: Bearer $TOKEN"
# Expected: 200, {message: "Successfully logged out."}
```

## Task Endpoints

```bash
# ✅ List all tasks
curl -s http://localhost:8000/api/v1/tasks -H "Authorization: Bearer $TOKEN"
# Expected: 200, {data: [...], meta: {current_page, last_page, per_page, total}}

# ✅ Filter by status (NOTE: 'in-progress' with hyphen)
curl -s "http://localhost:8000/api/v1/tasks?status=in-progress" -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:8000/api/v1/tasks?status=pending" -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:8000/api/v1/tasks?status=completed" -H "Authorization: Bearer $TOKEN"

# ❌ Invalid status (underscore) — should return 422
curl -s "http://localhost:8000/api/v1/tasks?status=in_progress" -H "Authorization: Bearer $TOKEN"

# ✅ Filter by priority
curl -s "http://localhost:8000/api/v1/tasks?priority=high" -H "Authorization: Bearer $TOKEN"

# ✅ Search
curl -s "http://localhost:8000/api/v1/tasks?search=report" -H "Authorization: Bearer $TOKEN"

# ✅ Sort
curl -s "http://localhost:8000/api/v1/tasks?sort=due_date" -H "Authorization: Bearer $TOKEN"
curl -s "http://localhost:8000/api/v1/tasks?sort=priority" -H "Authorization: Bearer $TOKEN"

# ✅ Create task
curl -s -X POST http://localhost:8000/api/v1/tasks \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"QA Test Task","priority":"medium","status":"pending"}'
# Expected: 201, {data: Task}

# ✅ Update task (replace 1 with actual ID)
curl -s -X PUT http://localhost:8000/api/v1/tasks/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","priority":"high"}'

# ✅ Update status only (dedicated endpoint)
curl -s -X PATCH http://localhost:8000/api/v1/tasks/1/status \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
# Expected: completed_at is automatically set in response

# ✅ Delete task
curl -s -X DELETE http://localhost:8000/api/v1/tasks/1 -H "Authorization: Bearer $TOKEN"
# Expected: 204 No Content

# ❌ No auth — should 401
curl -s http://localhost:8000/api/v1/tasks
```

## Category Endpoints

```bash
# ✅ List categories
curl -s http://localhost:8000/api/v1/categories -H "Authorization: Bearer $TOKEN"

# ✅ Create category
curl -s -X POST http://localhost:8000/api/v1/categories \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"QA Category","color":"#3b82f6","description":"For testing"}'
# Expected: 201, {data: Category}

# ✅ Update category
curl -s -X PUT http://localhost:8000/api/v1/categories/1 \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"Updated Work","color":"#ef4444"}'

# ✅ Delete category
curl -s -X DELETE http://localhost:8000/api/v1/categories/1 -H "Authorization: Bearer $TOKEN"
# Expected: 204; tasks in this category have category_id set to null
```

## Stats Endpoint

```bash
# ✅ Dashboard stats
curl -s http://localhost:8000/api/v1/stats -H "Authorization: Bearer $TOKEN"
# Expected: {data: {total, pending, in_progress, completed, overdue, completion_rate, by_priority, by_category}}
```

## Security Checks

```bash
# ❌ Access without token — expect 401
curl -s http://localhost:8000/api/v1/tasks

# ❌ Cross-user access — need 2 users' tokens then try to access each other's tasks
# Get user2 token: register + login as different email
# Try: curl -X DELETE /api/v1/tasks/<user1_task_id> with user2 token → expect 403
```
