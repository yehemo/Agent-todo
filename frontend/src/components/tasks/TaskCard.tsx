import type { Task, Status } from '../../types/task.types'
import { PriorityBadge } from './PriorityBadge'
import { StatusBadge } from './StatusBadge'
import { DueDateLabel } from './DueDateLabel'
import { CategoryBadge } from '../categories/CategoryBadge'
import { useUiStore } from '../../stores/uiStore'
import { useUpdateTaskStatus } from '../../hooks/useTasks'

interface TaskCardProps {
  task: Task
}

const nextStatus: Record<Status, Status> = {
  pending: 'in-progress',
  'in-progress': 'completed',
  completed: 'pending',
}

const nextStatusLabel: Record<Status, string> = {
  pending: 'Start',
  'in-progress': 'Complete',
  completed: 'Reopen',
}

export function TaskCard({ task }: TaskCardProps) {
  const { openTaskModal, openDeleteModal } = useUiStore()
  const updateStatus = useUpdateTaskStatus()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-medium text-gray-900 truncate ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-1 text-xs text-gray-500 line-clamp-2">{task.description}</p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            {task.category && <CategoryBadge name={task.category.name} color={task.category.color} />}
            <DueDateLabel dueDate={task.due_date} status={task.status} />
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => updateStatus.mutate({ id: task.id, payload: { status: nextStatus[task.status] } })}
            title={nextStatusLabel[task.status]}
            className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
          <button
            onClick={() => openTaskModal(task.id)}
            title="Edit"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => openDeleteModal({ type: 'task', id: task.id })}
            title="Delete"
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
