# New API Endpoint Skill

You are adding a new API endpoint to the TaskFlow Laravel backend using the `backend` agent.

The user wants to add: $ARGUMENTS

Use the `backend` agent to:
1. Read `routes/api.php` and the relevant controller to understand existing patterns
2. Create or update the following in order:
   - **Form Request** in `app/Http/Requests/` (validate all inputs, use `in:pending,in-progress,completed` for status — hyphen!)
   - **Controller method** using `$request->validated()`, scoped to `$request->user()`, with `$this->authorize()` if needed
   - **API Resource** if the response shape is new
   - **Route** in `routes/api.php` inside the appropriate `auth:sanctum` group
3. Verify the route is registered: `docker exec todo_app //bin//sh -c "php artisan route:list --path=v1"`
4. Test the endpoint with curl from inside or outside Docker
5. Report the new endpoint URL, required headers, request body, and example response
