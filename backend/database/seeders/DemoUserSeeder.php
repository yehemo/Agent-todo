<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoUserSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name'     => 'Demo User',
                'password' => Hash::make('password'),
            ]
        );

        $categories = [
            ['name' => 'Work',     'color' => '#f43f5e', 'description' => 'Work-related tasks'],
            ['name' => 'Personal', 'color' => '#6366f1', 'description' => 'Personal errands and goals'],
            ['name' => 'Learning', 'color' => '#10b981', 'description' => 'Study and self-improvement'],
        ];

        $createdCategories = [];
        foreach ($categories as $cat) {
            $createdCategories[] = Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $cat['name']],
                array_merge($cat, ['user_id' => $user->id])
            );
        }

        [$work, $personal, $learning] = $createdCategories;

        $tasks = [
            ['title' => 'Complete Q1 financial report',   'category_id' => $work->id,     'priority' => 'high',   'status' => 'in-progress', 'due_date' => now()->addDays(2)->toDateString()],
            ['title' => 'Review pull requests',           'category_id' => $work->id,     'priority' => 'high',   'status' => 'pending',     'due_date' => now()->addDay()->toDateString()],
            ['title' => 'Update team documentation',      'category_id' => $work->id,     'priority' => 'medium', 'status' => 'pending',     'due_date' => now()->addDays(5)->toDateString()],
            ['title' => 'Schedule dentist appointment',   'category_id' => $personal->id, 'priority' => 'low',    'status' => 'pending',     'due_date' => null],
            ['title' => 'Buy groceries',                  'category_id' => $personal->id, 'priority' => 'medium', 'status' => 'completed',   'due_date' => now()->toDateString(), 'completed_at' => now()],
            ['title' => 'Call mom',                       'category_id' => $personal->id, 'priority' => 'high',   'status' => 'pending',     'due_date' => now()->subDay()->toDateString()],
            ['title' => 'Finish Laravel course chapter 5','category_id' => $learning->id, 'priority' => 'medium', 'status' => 'in-progress', 'due_date' => now()->addWeek()->toDateString()],
            ['title' => 'Read Clean Code book',           'category_id' => $learning->id, 'priority' => 'low',    'status' => 'pending',     'due_date' => null],
            ['title' => 'Practice TypeScript exercises',  'category_id' => $learning->id, 'priority' => 'medium', 'status' => 'completed',   'due_date' => now()->toDateString(), 'completed_at' => now()],
            ['title' => 'Set up dev environment',         'category_id' => null,          'priority' => 'high',   'status' => 'completed',   'due_date' => null, 'completed_at' => now()],
        ];

        foreach ($tasks as $task) {
            Task::firstOrCreate(
                ['user_id' => $user->id, 'title' => $task['title']],
                array_merge($task, ['user_id' => $user->id])
            );
        }

        $this->command->info('Demo user seeded:');
        $this->command->table(
            ['Field', 'Value'],
            [['Email', 'demo@example.com'], ['Password', 'password'], ['Tasks', count($tasks)], ['Categories', count($categories)]]
        );
    }
}
