import type { Status } from '../../types/task.types'

interface StatusBadgeProps {
  status: Status
}

const styles: Record<Status, string> = {
  pending: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
}

const labels: Record<Status, string> = {
  pending: 'Pending',
  'in-progress': 'In Progress',
  completed: 'Completed',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
