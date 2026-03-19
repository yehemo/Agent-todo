import { create } from 'zustand'
import type { Priority, Status, TaskFilters } from '../types/task.types'

interface DeleteTarget {
  type: 'task' | 'category'
  id: number
}

interface UiStore {
  taskModalOpen: boolean
  categoryModalOpen: boolean
  deleteModalOpen: boolean
  editingTaskId: number | null
  editingCategoryId: number | null
  deletingTarget: DeleteTarget | null
  activeFilters: TaskFilters

  openTaskModal: (taskId?: number) => void
  closeTaskModal: () => void
  openCategoryModal: (categoryId?: number) => void
  closeCategoryModal: () => void
  openDeleteModal: (target: DeleteTarget) => void
  closeDeleteModal: () => void
  setFilter: (key: keyof TaskFilters, value: Priority | Status | string | number | null) => void
  clearFilters: () => void
}

const defaultFilters: TaskFilters = {
  category_id: null,
  status: null,
  priority: null,
  search: '',
  sort: 'created_at',
  per_page: 15,
  page: 1,
}

export const useUiStore = create<UiStore>((set) => ({
  taskModalOpen: false,
  categoryModalOpen: false,
  deleteModalOpen: false,
  editingTaskId: null,
  editingCategoryId: null,
  deletingTarget: null,
  activeFilters: defaultFilters,

  openTaskModal: (taskId) => set({ taskModalOpen: true, editingTaskId: taskId ?? null }),
  closeTaskModal: () => set({ taskModalOpen: false, editingTaskId: null }),
  openCategoryModal: (categoryId) => set({ categoryModalOpen: true, editingCategoryId: categoryId ?? null }),
  closeCategoryModal: () => set({ categoryModalOpen: false, editingCategoryId: null }),
  openDeleteModal: (target) => set({ deleteModalOpen: true, deletingTarget: target }),
  closeDeleteModal: () => set({ deleteModalOpen: false, deletingTarget: null }),
  setFilter: (key, value) =>
    set((state) => ({ activeFilters: { ...state.activeFilters, [key]: value, page: 1 } })),
  clearFilters: () => set({ activeFilters: defaultFilters }),
}))
