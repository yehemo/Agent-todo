import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { Select } from '../ui/Select'
import { useUiStore } from '../../stores/uiStore'
import { useTask, useCreateTask, useUpdateTask } from '../../hooks/useTasks'
import { useCategories } from '../../hooks/useCategories'
import type { CreateTaskPayload } from '../../types/task.types'

export function TaskModal() {
  const { taskModalOpen, editingTaskId, closeTaskModal } = useUiStore()
  const { data: existingTask } = useTask(editingTaskId ?? 0)
  const { data: categories = [] } = useCategories()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateTaskPayload>({
    defaultValues: { priority: 'medium', status: 'pending' },
  })

  useEffect(() => {
    if (existingTask && editingTaskId) {
      reset({
        title: existingTask.title,
        description: existingTask.description ?? '',
        priority: existingTask.priority,
        status: existingTask.status,
        due_date: existingTask.due_date ?? '',
        category_id: existingTask.category?.id ?? null,
      })
    } else {
      reset({ priority: 'medium', status: 'pending', title: '', description: '' })
    }
  }, [existingTask, editingTaskId, reset])

  const onSubmit = handleSubmit(async (data) => {
    const payload = {
      ...data,
      category_id: data.category_id ? Number(data.category_id) : null,
      due_date: data.due_date || undefined,
    }
    if (editingTaskId) {
      await updateTask.mutateAsync({ id: editingTaskId, payload })
    } else {
      await createTask.mutateAsync(payload)
    }
    closeTaskModal()
  })

  const isLoading = createTask.isPending || updateTask.isPending

  return (
    <Modal
      open={taskModalOpen}
      onClose={closeTaskModal}
      title={editingTaskId ? 'Edit Task' : 'New Task'}
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="Task title..."
          error={errors.title?.message}
          {...register('title', { required: 'Title is required' })}
        />
        <Textarea
          label="Description"
          placeholder="Optional description..."
          {...register('description')}
        />
        <div className="grid grid-cols-2 gap-4">
          <Select label="Priority" {...register('priority')}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Select label="Status" {...register('status')}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Due Date"
            type="date"
            {...register('due_date')}
          />
          <Select label="Category" {...register('category_id')}>
            <option value="">No Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={closeTaskModal}>Cancel</Button>
          <Button type="submit" loading={isLoading}>
            {editingTaskId ? 'Save Changes' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
