<?php

namespace Tests\Feature\Tasks;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreateTaskTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_task_with_all_fields(): void
    {
        $user     = User::factory()->create();
        $category = Category::factory()->forUser($user)->create();

        $this->actingAs($user)->postJson('/api/v1/tasks', [
            'title'       => 'My Task',
            'description' => 'A description',
            'priority'    => 'high',
            'status'      => 'pending',
            'due_date'    => now()->addDays(5)->toDateString(),
            'category_id' => $category->id,
        ])->assertStatus(201)
          ->assertJsonPath('data.title', 'My Task')
          ->assertJsonPath('data.priority', 'high');
    }

    public function test_can_create_task_without_category(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/tasks', [
            'title' => 'No Category Task',
        ])->assertStatus(201)
          ->assertJsonPath('data.category', null);
    }

    public function test_cannot_create_task_with_another_users_category(): void
    {
        $user      = User::factory()->create();
        $otherUser = User::factory()->create();
        $category  = Category::factory()->forUser($otherUser)->create();

        $this->actingAs($user)->postJson('/api/v1/tasks', [
            'title'       => 'My Task',
            'category_id' => $category->id,
        ])->assertStatus(422)->assertJsonValidationErrors('category_id');
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->postJson('/api/v1/tasks', ['title' => 'Task'])->assertStatus(401);
    }

    public function test_missing_title_returns_422(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/tasks', [
            'priority' => 'high',
        ])->assertStatus(422)->assertJsonValidationErrors('title');
    }

    public function test_invalid_priority_returns_422(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/tasks', [
            'title'    => 'Task',
            'priority' => 'critical',
        ])->assertStatus(422)->assertJsonValidationErrors('priority');
    }
}
