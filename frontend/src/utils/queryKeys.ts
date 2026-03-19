import type { TaskFilters } from '../types/task.types'

export const queryKeys = {
  tasks: {
    all: ['tasks'] as const,
    lists: () => ['tasks', 'list'] as const,
    list: (filters: TaskFilters) => ['tasks', 'list', filters] as const,
    detail: (id: number) => ['tasks', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    lists: () => ['categories', 'list'] as const,
    detail: (id: number) => ['categories', 'detail', id] as const,
  },
  stats: ['stats'] as const,
}
