# New Database Migration Skill

You are designing and applying a new database schema change for the TaskFlow app using the `database` agent.

The user wants to: $ARGUMENTS

Use the `database` agent to:
1. Read the relevant existing migration files in `backend/database/migrations/` to understand the current schema
2. Design the schema change:
   - Normalize to at least 3NF
   - Add indexes for all FK columns and common query patterns
   - Use `deleted_at` for soft deletes if the entity will support soft deletion
   - Name the migration file `2026_03_19_<next_seq>_<description>.php` (next sequence after `000004` is `000005`)
3. Write the migration file using Laravel 11 Blueprint syntax
4. Update the relevant Eloquent model (fillable, casts, relationships, SoftDeletes trait if needed)
5. Update the factory if the model is used in tests
6. Apply the migration: `docker exec todo_app //bin//sh -c "php artisan migrate --force"`
7. Verify with: `docker exec todo_app //bin//sh -c "php artisan migrate:status"`
8. Report the full schema of the new/modified table with all columns and indexes
