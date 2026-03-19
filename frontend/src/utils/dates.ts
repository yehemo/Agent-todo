import type { Status } from '../types/task.types'

export function isOverdue(dueDate: string | null, status: Status): boolean {
  if (!dueDate || status === 'completed') return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

export function formatDueDate(dueDate: string | null): string {
  if (!dueDate) return ''
  const date = new Date(dueDate)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getDueDateColor(dueDate: string | null, status: Status): string {
  if (!dueDate) return 'text-gray-400'
  if (isOverdue(dueDate, status)) return 'text-red-500'
  const daysUntilDue = Math.ceil((new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  if (daysUntilDue <= 2) return 'text-orange-500'
  return 'text-gray-500'
}
