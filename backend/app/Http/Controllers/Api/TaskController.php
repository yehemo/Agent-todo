<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Task\StoreTaskRequest;
use App\Http\Requests\Task\UpdateTaskRequest;
use App\Http\Requests\Task\UpdateTaskStatusRequest;
use App\Http\Resources\TaskCollection;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) ($request->per_page ?? 15), 100);

        $tasks = $request->user()
            ->tasks()
            ->with('category')
            ->when($request->status, fn ($q, $v) => $q->where('status', $v))
            ->when($request->priority, fn ($q, $v) => $q->where('priority', $v))
            ->when($request->category_id, fn ($q, $v) => $q->where('category_id', $v))
            ->when($request->search, fn ($q, $v) => $q->where(function ($q) use ($v) {
                $q->where('title', 'like', "%{$v}%")
                  ->orWhere('description', 'like', "%{$v}%");
            }))
            ->when($request->sort, function ($q, $sort) {
                return match ($sort) {
                    'due_date'   => $q->orderByRaw('due_date IS NULL, due_date ASC'),
                    'priority'   => $q->orderByRaw("FIELD(priority, 'high', 'medium', 'low')"),
                    default      => $q->latest(),
                };
            }, fn ($q) => $q->latest())
            ->paginate($perPage);

        return (new TaskCollection($tasks))->response();
    }

    public function store(StoreTaskRequest $request): JsonResponse
    {
        $task = $request->user()->tasks()->create($request->validated());
        $task->load('category');

        return response()->json(['data' => new TaskResource($task)], 201);
    }

    public function show(Request $request, Task $task): JsonResponse
    {
        $this->authorize('view', $task);
        $task->load('category');

        return response()->json(['data' => new TaskResource($task)]);
    }

    public function update(UpdateTaskRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task->update($request->validated());
        $task->load('category');

        return response()->json(['data' => new TaskResource($task->fresh(['category']))]);
    }

    public function destroy(Request $request, Task $task): JsonResponse
    {
        $this->authorize('delete', $task);
        $task->delete();

        return response()->json(null, 204);
    }

    public function updateStatus(UpdateTaskStatusRequest $request, Task $task): JsonResponse
    {
        $this->authorize('update', $task);

        $task->update(['status' => $request->validated('status')]);
        $task->load('category');

        return response()->json(['data' => new TaskResource($task->fresh(['category']))]);
    }
}
