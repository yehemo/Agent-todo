<?php

namespace Tests\Feature\Stats;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StatsTest extends TestCase
{
    use RefreshDatabase;

    public function test_returns_correct_status_counts(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->pending()->count(3)->create();
        Task::factory()->forUser($user)->inProgress()->count(2)->create();
        Task::factory()->forUser($user)->completed()->count(4)->create();

        $this->actingAs($user)->getJson('/api/v1/stats')
            ->assertStatus(200)
            ->assertJsonPath('data.total', 9)
            ->assertJsonPath('data.pending', 3)
            ->assertJsonPath('data.in_progress', 2)
            ->assertJsonPath('data.completed', 4);
    }

    public function test_overdue_count_only_includes_non_completed_tasks_with_past_due_date(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->overdue()->count(2)->create();
        Task::factory()->forUser($user)->completed()->create([
            'due_date' => now()->subDays(5)->toDateString(),
        ]);

        $this->actingAs($user)->getJson('/api/v1/stats')
            ->assertStatus(200)
            ->assertJsonPath('data.overdue', 2);
    }

    public function test_completion_rate_is_calculated_correctly(): void
    {
        $user = User::factory()->create();
        Task::factory()->forUser($user)->completed()->count(3)->create();
        Task::factory()->forUser($user)->pending()->count(7)->create();

        $this->actingAs($user)->getJson('/api/v1/stats')
            ->assertStatus(200)
            ->assertJsonPath('data.completion_rate', 30.0);
    }

    public function test_returns_zero_stats_for_user_with_no_tasks(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->getJson('/api/v1/stats')
            ->assertStatus(200)
            ->assertJsonPath('data.total', 0)
            ->assertJsonPath('data.completion_rate', 0.0);
    }

    public function test_by_category_breakdown_is_accurate(): void
    {
        $user     = User::factory()->create();
        $category = Category::factory()->forUser($user)->create(['name' => 'Work']);
        Task::factory()->forUser($user)->forCategory($category)->completed()->count(2)->create();
        Task::factory()->forUser($user)->forCategory($category)->pending()->count(3)->create();

        $response = $this->actingAs($user)->getJson('/api/v1/stats');
        $response->assertStatus(200);

        $catStats = collect($response->json('data.by_category'))->firstWhere('name', 'Work');
        $this->assertEquals(5, $catStats['total']);
        $this->assertEquals(2, $catStats['completed']);
    }
}
