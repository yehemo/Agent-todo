import type { Status } from '../../types/task.types'
import { formatDueDate, getDueDateColor } from '../../utils/dates'

interface DueDateLabelProps {
  dueDate: string | null
  status: Status
}

export function DueDateLabel({ dueDate, status }: DueDateLabelProps) {
  if (!dueDate) return null
  return (
    <span className={`text-xs flex items-center gap-1 ${getDueDateColor(dueDate, status)}`}>
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {formatDueDate(dueDate)}
    </span>
  )
}
