<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'category_id', 'title', 'description',
        'priority', 'status', 'due_date', 'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'due_date'     => 'date',
            'completed_at' => 'datetime',
        ];
    }

    protected static function boot(): void
    {
        parent::boot();

        static::saving(function (Task $task) {
            if ($task->isDirty('status')) {
                if ($task->status === 'completed') {
                    $task->completed_at = $task->completed_at ?? now();
                } else {
                    $task->completed_at = null;
                }
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function isOverdue(): bool
    {
        if (! $this->due_date || $this->status === 'completed') {
            return false;
        }

        return $this->due_date->isPast();
    }
}
