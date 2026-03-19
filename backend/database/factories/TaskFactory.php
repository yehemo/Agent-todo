<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    public function definition(): array
    {
        $status = fake()->randomElement(['pending', 'in-progress', 'completed']);

        return [
            'user_id'      => User::factory(),
            'category_id'  => null,
            'title'        => fake()->sentence(4),
            'description'  => fake()->boolean(70) ? fake()->paragraph() : null,
            'priority'     => fake()->randomElement(['low', 'medium', 'high']),
            'status'       => $status,
            'due_date'     => fake()->boolean(60) ? fake()->dateTimeBetween('-1 week', '+2 weeks')->format('Y-m-d') : null,
            'completed_at' => $status === 'completed' ? now() : null,
        ];
    }

    public function pending(): static
    {
        return $this->state(['status' => 'pending', 'completed_at' => null]);
    }

    public function inProgress(): static
    {
        return $this->state(['status' => 'in-progress', 'completed_at' => null]);
    }

    public function completed(): static
    {
        return $this->state(['status' => 'completed', 'completed_at' => now()]);
    }

    public function highPriority(): static
    {
        return $this->state(['priority' => 'high']);
    }

    public function lowPriority(): static
    {
        return $this->state(['priority' => 'low']);
    }

    public function overdue(): static
    {
        return $this->state([
            'due_date'  => now()->subDays(3)->toDateString(),
            'status'    => 'pending',
            'completed_at' => null,
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(['user_id' => $user->id]);
    }

    public function forCategory(Category $category): static
    {
        return $this->state(['category_id' => $category->id]);
    }
}
