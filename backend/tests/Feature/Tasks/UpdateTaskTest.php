<?php

namespace Tests\Feature\Tasks;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UpdateTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_owner_can_update_task(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->create(['title' => 'Old Title']);

        $this->actingAs($user)->putJson("/api/v1/tasks/{$task->id}", [
            'title' => 'New Title',
        ])->assertStatus(200)
          ->assertJsonPath('data.title', 'New Title');
    }

    public function test_cannot_update_another_users_task(): void
    {
        $user      = User::factory()->create();
        $otherUser = User::factory()->create();
        $task      = Task::factory()->forUser($otherUser)->create();

        $this->actingAs($user)->putJson("/api/v1/tasks/{$task->id}", [
            'title' => 'Hacked',
        ])->assertStatus(403);
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $task = Task::factory()->create();

        $this->putJson("/api/v1/tasks/{$task->id}", ['title' => 'x'])->assertStatus(401);
    }
}
