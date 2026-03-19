import type { Priority } from '../../types/task.types'

interface PriorityBadgeProps {
  priority: Priority
}

const styles: Record<Priority, string> = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const labels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${styles[priority]}`}>
      {labels[priority]}
    </span>
  )
}
