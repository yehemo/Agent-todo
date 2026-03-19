<?php

namespace Tests\Feature\Tasks;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ListTasksTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_only_authenticated_users_tasks(): void
    {
        $user      = User::factory()->create();
        $otherUser = User::factory()->create();

        Task::factory()->forUser($user)->count(3)->create();
        Task::factory()->forUser($otherUser)->count(5)->create();

        $response = $this->actingAs($user)->getJson('/api/v1/tasks');

        $response->assertStatus(200);
        $this->assertCount(3, $response->json('data'));
    }

    public function test_filter_by_status_works(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->pending()->count(2)->create();
        Task::factory()->forUser($user)->completed()->count(3)->create();

        $response = $this->actingAs($user)->getJson('/api/v1/tasks?status=pending');
        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_filter_by_priority_works(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->highPriority()->count(2)->create();
        Task::factory()->forUser($user)->lowPriority()->count(4)->create();

        $response = $this->actingAs($user)->getJson('/api/v1/tasks?priority=high');
        $response->assertStatus(200);
        $this->assertCount(2, $response->json('data'));
    }

    public function test_search_by_title_works(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->create(['title' => 'Buy groceries today']);
        Task::factory()->forUser($user)->create(['title' => 'Write report']);

        $response = $this->actingAs($user)->getJson('/api/v1/tasks?search=groceries');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_pagination_returns_correct_meta(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->count(20)->create();

        $response = $this->actingAs($user)->getJson('/api/v1/tasks?per_page=5');
        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 20)
            ->assertJsonPath('meta.per_page', 5)
            ->assertJsonPath('meta.last_page', 4);
    }

    public function test_unauthenticated_request_returns_401(): void
    {
        $this->getJson('/api/v1/tasks')->assertStatus(401);
    }
}
