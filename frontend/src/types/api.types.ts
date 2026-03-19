export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface StatsData {
  total: number
  pending: number
  in_progress: number
  completed: number
  overdue: number
  completion_rate: number
  by_priority: {
    low: number
    medium: number
    high: number
  }
  by_category: Array<{
    id: number
    name: string
    color: string
    total: number
    completed: number
  }>
}
