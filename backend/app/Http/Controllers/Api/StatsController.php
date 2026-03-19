<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $user = $request->user();

        $statusCounts = $user->tasks()
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        $total      = array_sum($statusCounts);
        $pending    = (int) ($statusCounts['pending']      ?? 0);
        $inProgress = (int) ($statusCounts['in-progress']  ?? 0);
        $completed  = (int) ($statusCounts['completed']    ?? 0);

        $overdue = $user->tasks()
            ->whereIn('status', ['pending', 'in-progress'])
            ->whereNotNull('due_date')
            ->whereDate('due_date', '<', now()->toDateString())
            ->count();

        $completionRate = (float) ($total > 0 ? round(($completed / $total) * 100, 1) : 0);

        $priorityCounts = $user->tasks()
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->pluck('count', 'priority')
            ->toArray();

        $byPriority = [
            'low'    => (int) ($priorityCounts['low']    ?? 0),
            'medium' => (int) ($priorityCounts['medium'] ?? 0),
            'high'   => (int) ($priorityCounts['high']   ?? 0),
        ];

        $byCategory = $user->categories()
            ->with(['tasks' => fn ($q) => $q->select('id', 'category_id', 'status')])
            ->get()
            ->map(fn ($cat) => [
                'id'        => $cat->id,
                'name'      => $cat->name,
                'color'     => $cat->color,
                'total'     => $cat->tasks->count(),
                'completed' => $cat->tasks->where('status', 'completed')->count(),
            ])
            ->values()
            ->toArray();

        return response()->json([
            'data' => [
                'total'           => $total,
                'pending'         => $pending,
                'in_progress'     => $inProgress,
                'completed'       => $completed,
                'overdue'         => $overdue,
                'completion_rate' => $completionRate,
                'by_priority'     => $byPriority,
                'by_category'     => $byCategory,
            ],
        ], 200, [], JSON_PRESERVE_ZERO_FRACTION);
    }
}
