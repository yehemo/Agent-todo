import type { Category } from './category.types'

export type Priority = 'low' | 'medium' | 'high'
export type Status = 'pending' | 'in-progress' | 'completed'

export interface Task {
  id: number
  title: string
  description: string | null
  priority: Priority
  status: Status
  due_date: string | null
  completed_at: string | null
  category: Pick<Category, 'id' | 'name' | 'color'> | null
  created_at: string
  updated_at: string
}

export interface CreateTaskPayload {
  title: string
  description?: string
  priority: Priority
  status: Status
  due_date?: string
  category_id?: number | null
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

export interface UpdateStatusPayload {
  status: Status
}

export interface TaskFilters {
  category_id?: number | null
  status?: Status | null
  priority?: Priority | null
  search?: string
  sort?: 'due_date' | 'priority' | 'created_at'
  per_page?: number
  page?: number
}
