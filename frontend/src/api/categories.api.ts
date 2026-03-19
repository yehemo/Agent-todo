import api from './axios'
import type { Category, CreateCategoryPayload, UpdateCategoryPayload } from '../types/category.types'

export const categoriesApi = {
  getCategories: () =>
    api.get<{ data: Category[] }>('/api/v1/categories').then((r) => r.data.data),

  getCategory: (id: number) =>
    api.get<{ data: Category }>(`/api/v1/categories/${id}`).then((r) => r.data.data),

  createCategory: (payload: CreateCategoryPayload) =>
    api.post<{ data: Category }>('/api/v1/categories', payload).then((r) => r.data.data),

  updateCategory: (id: number, payload: UpdateCategoryPayload) =>
    api.put<{ data: Category }>(`/api/v1/categories/${id}`, payload).then((r) => r.data.data),

  deleteCategory: (id: number) => api.delete(`/api/v1/categories/${id}`),
}
