<?php

namespace Tests\Unit\Models;

use App\Models\Task;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_completed_at_is_set_when_status_transitions_to_completed(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->pending()->create();

        $this->assertNull($task->completed_at);

        $task->update(['status' => 'completed']);

        $this->assertNotNull($task->fresh()->completed_at);
    }

    public function test_completed_at_is_null_when_status_is_pending(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->completed()->create();

        $this->assertNotNull($task->completed_at);

        $task->update(['status' => 'pending']);

        $this->assertNull($task->fresh()->completed_at);
    }

    public function test_is_overdue_returns_true_for_past_due_date_with_pending_status(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->create([
            'status'   => 'pending',
            'due_date' => now()->subDays(2)->toDateString(),
        ]);

        $this->assertTrue($task->isOverdue());
    }

    public function test_is_overdue_returns_false_for_completed_task_regardless_of_due_date(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->completed()->create([
            'due_date' => now()->subDays(5)->toDateString(),
        ]);

        $this->assertFalse($task->isOverdue());
    }

    public function test_is_overdue_returns_false_when_no_due_date(): void
    {
        $user = User::factory()->create();
        $task = Task::factory()->forUser($user)->pending()->create(['due_date' => null]);

        $this->assertFalse($task->isOverdue());
    }
}
