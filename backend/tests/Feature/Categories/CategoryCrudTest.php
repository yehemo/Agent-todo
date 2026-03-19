<?php

namespace Tests\Feature\Categories;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryCrudTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_category(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/v1/categories', [
            'name'  => 'Work',
            'color' => '#f43f5e',
        ])->assertStatus(201)->assertJsonPath('data.name', 'Work');
    }

    public function test_cannot_create_duplicate_category_name_for_same_user(): void
    {
        $user = User::factory()->create();
        Category::factory()->forUser($user)->create(['name' => 'Work']);

        $this->actingAs($user)->postJson('/api/v1/categories', [
            'name' => 'Work',
        ])->assertStatus(422)->assertJsonValidationErrors('name');
    }

    public function test_can_create_same_category_name_for_different_user(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        Category::factory()->forUser($user1)->create(['name' => 'Work']);

        $this->actingAs($user2)->postJson('/api/v1/categories', [
            'name' => 'Work',
        ])->assertStatus(201);
    }

    public function test_can_update_category(): void
    {
        $user     = User::factory()->create();
        $category = Category::factory()->forUser($user)->create(['name' => 'Old']);

        $this->actingAs($user)->putJson("/api/v1/categories/{$category->id}", [
            'name' => 'New',
        ])->assertStatus(200)->assertJsonPath('data.name', 'New');
    }

    public function test_can_delete_category_and_tasks_become_uncategorized(): void
    {
        $user     = User::factory()->create();
        $category = Category::factory()->forUser($user)->create();
        $task     = Task::factory()->forUser($user)->forCategory($category)->create();

        $this->actingAs($user)->deleteJson("/api/v1/categories/{$category->id}")
            ->assertStatus(204);

        $this->assertNull($task->fresh()->category_id);
    }

    public function test_cannot_access_another_users_category(): void
    {
        $user      = User::factory()->create();
        $otherUser = User::factory()->create();
        $category  = Category::factory()->forUser($otherUser)->create();

        $this->actingAs($user)->getJson("/api/v1/categories/{$category->id}")
            ->assertStatus(403);
    }
}
