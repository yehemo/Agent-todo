import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { tasksApi } from '../api/tasks.api'
import { queryKeys } from '../utils/queryKeys'
import type { CreateTaskPayload, UpdateTaskPayload, UpdateStatusPayload, TaskFilters } from '../types/task.types'

export function useTasks(filters: TaskFilters = {}) {
  return useQuery({
    queryKey: queryKeys.tasks.list(filters),
    queryFn: () => tasksApi.getTasks(filters),
  })
}

export function useTask(id: number) {
  return useQuery({
    queryKey: queryKeys.tasks.detail(id),
    queryFn: () => tasksApi.getTask(id),
    enabled: !!id,
  })
}

export function useCreateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => tasksApi.createTask(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Task created!')
    },
    onError: () => toast.error('Failed to create task'),
  })
}

export function useUpdateTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateTaskPayload }) =>
      tasksApi.updateTask(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Task updated!')
    },
    onError: () => toast.error('Failed to update task'),
  })
}

export function useDeleteTask() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tasksApi.deleteTask(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
      toast.success('Task deleted')
    },
    onError: () => toast.error('Failed to delete task'),
  })
}

export function useUpdateTaskStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateStatusPayload }) =>
      tasksApi.updateTaskStatus(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all })
      qc.invalidateQueries({ queryKey: queryKeys.stats })
    },
    onError: () => toast.error('Failed to update status'),
  })
}
