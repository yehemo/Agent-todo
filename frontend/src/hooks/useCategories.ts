import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { categoriesApi } from '../api/categories.api'
import { queryKeys } from '../utils/queryKeys'
import type { CreateCategoryPayload, UpdateCategoryPayload } from '../types/category.types'

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.lists(),
    queryFn: categoriesApi.getCategories,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateCategoryPayload) => categoriesApi.createCategory(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
      toast.success('Category created!')
    },
    onError: () => toast.error('Failed to create category'),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateCategoryPayload }) =>
      categoriesApi.updateCategory(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
      toast.success('Category updated!')
    },
    onError: () => toast.error('Failed to update category'),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
      toast.success('Category deleted')
    },
    onError: () => toast.error('Failed to delete category'),
  })
}
