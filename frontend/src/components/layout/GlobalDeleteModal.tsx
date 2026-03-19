import { ConfirmDeleteModal } from '../ui/ConfirmDeleteModal'
import { useUiStore } from '../../stores/uiStore'
import { useDeleteTask } from '../../hooks/useTasks'
import { useDeleteCategory } from '../../hooks/useCategories'

export function GlobalDeleteModal() {
  const { deleteModalOpen, deletingTarget, closeDeleteModal } = useUiStore()
  const deleteTask = useDeleteTask()
  const deleteCategory = useDeleteCategory()

  const isLoading = deleteTask.isPending || deleteCategory.isPending

  const handleConfirm = async () => {
    if (!deletingTarget) return
    if (deletingTarget.type === 'task') {
      await deleteTask.mutateAsync(deletingTarget.id)
    } else {
      await deleteCategory.mutateAsync(deletingTarget.id)
    }
    closeDeleteModal()
  }

  return (
    <ConfirmDeleteModal
      open={deleteModalOpen}
      onClose={closeDeleteModal}
      onConfirm={handleConfirm}
      loading={isLoading}
      title={deletingTarget?.type === 'task' ? 'Delete Task' : 'Delete Category'}
      description={
        deletingTarget?.type === 'category'
          ? 'Delete this category? Tasks in this category will become uncategorized.'
          : 'Delete this task? This action cannot be undone.'
      }
    />
  )
}
