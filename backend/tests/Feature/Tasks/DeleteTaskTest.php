<?php

namespace Tests\Feature\Tasks;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeleteTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_delete_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->create();

        $this->actingAs($user)->deleteJson("/api/v1/tasks/{$task->id}")
            ->assertStatus(204);

        $this->assertSoftDeleted('tasks', ['id' => $task->id]);
    }

    public function test_cannot_delete_another_users_task(): void
    {
        $user      = User::factory()->create();
        $otherUser = User::factory()->create();
        $task      = Task::factory()->forUser($otherUser)->create();

        $this->actingAs($user)->deleteJson("/api/v1/tasks/{$task->id}")
            ->assertStatus(403);
    }
}
