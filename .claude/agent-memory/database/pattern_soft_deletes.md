---
name: Soft Delete Convention
description: All tables in this project use soft deletes via deleted_at; models must use the SoftDeletes trait
type: reference
---

All tables in this project include `$table->softDeletes()` in their migration.

Corresponding Eloquent models must use the `Illuminate\Database\Eloquent\SoftDeletes` trait.

Application queries must be reviewed to ensure they call `->withoutTrashed()` / `->onlyTrashed()` correctly.

Recommended maintenance: schedule a job to hard-delete rows where `deleted_at < NOW() - INTERVAL 90 DAY` to prevent table bloat on high-volume tables (especially `tasks`).
