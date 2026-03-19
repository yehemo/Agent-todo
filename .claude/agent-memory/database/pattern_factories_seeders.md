---
name: Factory and Seeder Conventions
description: Patterns used in this project for Eloquent factories (named states) and seeders (firstOrCreate idempotency)
type: reference
---

## Factories

- Factories include named state methods for common test scenarios (e.g., `pending()`, `completed()`, `highPriority()`, `overdue()`).
- Factories include `forUser(User $user)` and `forCategory(Category $category)` state methods to associate with existing models without creating new ones.
- `completed()` state always populates `completed_at`; non-completed states always null it.

## Seeders

- All seeders use `Model::firstOrCreate(uniqueKey, attributes)` to be fully idempotent — safe to run multiple times without duplicating data.
- `DemoUserSeeder` uses email as the unique key for users and (user_id, title) for tasks.
- Seeders output a summary table to the console via `$this->command->table()` for quick verification.

## Demo user credentials

- Email: demo@example.com
- Password: password
