# Run Tests Skill

You are running all tests for the TaskFlow application and reporting results using the `qa` agent.

Target: $ARGUMENTS (if empty, run ALL tests)

Use the `qa` agent to:

1. **Check containers are running:**
   ```bash
   cd "D:/Code Project/AgentTesting" && docker compose ps
   ```

2. **Run backend tests (PHPUnit):**
   ```bash
   docker exec todo_app //bin//sh -c "php artisan test"
   ```
   If `$ARGUMENTS` specifies a filter: `php artisan test --filter <name>`

3. **Run frontend unit tests (Vitest):**
   ```bash
   cd "D:/Code Project/AgentTesting/frontend" && npx vitest run
   ```

4. **For E2E tests (Playwright)** — only if explicitly requested:
   ```bash
   cd "D:/Code Project/AgentTesting" && npx playwright test
   ```

5. **Report results in this format:**

   ```
   ## Test Results — [date]

   ### Backend (PHPUnit)
   ✅ Passed: X / Failed: Y / Skipped: Z
   [List any failures with test name + error message]

   ### Frontend (Vitest)
   ✅ Passed: X / Failed: Y
   [List any failures with file + assertion]

   ### E2E (Playwright) — if run
   ✅ Passed: X / Failed: Y
   ```

6. For each failure, use the bug report format:
   - **Title:** short description
   - **Severity:** Critical/High/Medium/Low
   - **Steps to reproduce**
   - **Expected vs Actual**
   - **Fix suggestion** (which file/line to look at)
