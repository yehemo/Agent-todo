<?php

namespace Tests\Feature\Tasks;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateTaskStatusTest extends TestCase
{
    use RefreshDatabase;

    public function test_setting_status_to_completed_sets_completed_at(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->pending()->create();

        $this->actingAs($user)->patchJson("/api/v1/tasks/{$task->id}/status", [
            'status' => 'completed',
        ])->assertStatus(200);

        $this->assertNotNull($task->fresh()->completed_at);
    }

    public function test_setting_status_from_completed_to_pending_clears_completed_at(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->completed()->create();

        $this->actingAs($user)->patchJson("/api/v1/tasks/{$task->id}/status", [
            'status' => 'pending',
        ])->assertStatus(200);

        $this->assertNull($task->fresh()->completed_at);
    }

    public function test_cannot_update_status_of_another_users_task(): void
    {
        $user      = User::factory()->create();
        $otherUser = User::factory()->create();
        $task      = Task::factory()->forUser($otherUser)->create();

        $this->actingAs($user)->patchJson("/api/v1/tasks/{$task->id}/status", [
            'status' => 'completed',
        ])->assertStatus(403);
    }

    public function test_invalid_status_value_returns_422(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->create();

        $this->actingAs($user)->patchJson("/api/v1/tasks/{$task->id}/status", [
            'status' => 'invalid-status',
        ])->assertStatus(422)->assertJsonValidationErrors('status');
    }
}
