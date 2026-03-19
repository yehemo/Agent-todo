<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    private static array $colors = [
        '#6366f1', '#f43f5e', '#f59e0b', '#10b981',
        '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
        '#f97316', '#06b6d4',
    ];

    public function definition(): array
    {
        return [
            'user_id'     => User::factory(),
            'name'        => fake()->unique()->words(2, true),
            'color'       => fake()->randomElement(self::$colors),
            'description' => fake()->boolean(60) ? fake()->sentence() : null,
        ];
    }

    public function forUser(User $user): static
    {
        return $this->state(['user_id' => $user->id]);
    }
}
