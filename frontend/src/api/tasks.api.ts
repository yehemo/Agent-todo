import api from './axios'
import type { Task, CreateTaskPayload, UpdateTaskPayload, UpdateStatusPayload, TaskFilters } from '../types/task.types'
import type { PaginatedResponse } from '../types/api.types'

export const tasksApi = {
  getTasks: (filters: TaskFilters = {}) => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== null && v !== undefined && v !== '')
    )
    return api.get<PaginatedResponse<Task>>('/api/v1/tasks', { params }).then((r) => r.data)
  },

  getTask: (id: number) =>
    api.get<{ data: Task }>(`/api/v1/tasks/${id}`).then((r) => r.data.data),

  createTask: (payload: CreateTaskPayload) =>
    api.post<{ data: Task }>('/api/v1/tasks', payload).then((r) => r.data.data),

  updateTask: (id: number, payload: UpdateTaskPayload) =>
    api.put<{ data: Task }>(`/api/v1/tasks/${id}`, payload).then((r) => r.data.data),

  deleteTask: (id: number) => api.delete(`/api/v1/tasks/${id}`),

  updateTaskStatus: (id: number, payload: UpdateStatusPayload) =>
    api.patch<{ data: Task }>(`/api/v1/tasks/${id}/status`, payload).then((r) => r.data.data),
}
