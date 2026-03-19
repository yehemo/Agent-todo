# Check API Skill

You are verifying the TaskFlow API is working correctly using the `qa` agent.

Scope: $ARGUMENTS (if empty, check all endpoints)

Use the `qa` agent to:

1. **Verify containers are up:**
   ```bash
   cd "D:/Code Project/AgentTesting" && docker compose ps
   ```
   If any container is down, restart: `docker compose up -d`

2. **Get a fresh auth token** from the demo user

3. **Test each endpoint group** using curl:
   - Auth: register, login (valid + wrong password), get user, logout
   - Tasks: list, filter by status/priority/search, create, update, patch status, delete
   - Categories: list, create, update, delete
   - Stats: get stats and verify shape

4. **For each endpoint report:**
   ```
   [METHOD] /path
   Status: ✅ 200 OK  or  ❌ 500 Internal Server Error
   Response shape: correct / unexpected
   Note: (any observation)
   ```

5. **Security spot-checks:**
   - Hit a protected endpoint without token → expect 401
   - Send `status: "in_progress"` (underscore) to create task → expect 422

6. **Final summary:**
   ```
   Total endpoints tested: N
   ✅ Passing: X
   ❌ Failing: Y
   ⚠️  Warnings: Z
   ```
   List each failure with the structured bug report format.
