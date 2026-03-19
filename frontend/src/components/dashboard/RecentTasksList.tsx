import { useTasks } from '../../hooks/useTasks'
import { StatusBadge } from '../tasks/StatusBadge'
import { PriorityBadge } from '../tasks/PriorityBadge'

export function RecentTasksList() {
  const { data } = useTasks({ sort: 'created_at', per_page: 5 })
  const tasks = data?.data ?? []

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Recent Tasks</h3>
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between gap-3">
              <p className={`text-sm flex-1 truncate ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </p>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
