---
name: Output as Laravel Migration Files
description: User expects schema output as Laravel 11 PHP migration files, factories, and seeders — not raw SQL DDL
type: feedback
---

Always deliver database schema designs as Laravel 11 migration files when working on this project.

**Why:** The project uses Laravel 11. Raw MySQL DDL is informational but not directly runnable in the project workflow.

**How to apply:** When the user asks for a schema or a table change, produce `Schema::create` / `Schema::table` migration files as the primary deliverable. Include factories and seeders when the user's request covers test data. Raw DDL may be included as a reference comment block but should not be the primary output.

Laravel 11 migration syntax notes this user confirmed:
- `$table->foreignId('col')->constrained('table')->cascadeOnDelete()` — FK with cascade
- `$table->foreignId('col')->nullable()->constrained('table')->nullOnDelete()` — nullable FK with SET NULL
- `$table->softDeletes()` — adds deleted_at
- `$table->timestamps()` — adds created_at and updated_at
- `$table->id()` — BIGINT UNSIGNED AUTO_INCREMENT PK
- `$table->enum('col', ['a','b'])` — ENUM column
