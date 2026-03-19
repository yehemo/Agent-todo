import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Textarea } from '../ui/Textarea'
import { useUiStore } from '../../stores/uiStore'
import { useCategories, useCreateCategory, useUpdateCategory } from '../../hooks/useCategories'
import type { CreateCategoryPayload } from '../../types/category.types'

const PRESET_COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']

export function CategoryModal() {
  const { categoryModalOpen, editingCategoryId, closeCategoryModal } = useUiStore()
  const { data: categories = [] } = useCategories()
  const existingCategory = categories.find((c) => c.id === editingCategoryId)
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<CreateCategoryPayload>({
    defaultValues: { color: '#6366f1' },
  })

  useEffect(() => {
    if (existingCategory) {
      reset({ name: existingCategory.name, color: existingCategory.color, description: existingCategory.description ?? '' })
    } else {
      reset({ name: '', color: '#6366f1', description: '' })
    }
  }, [existingCategory, reset])

  const onSubmit = handleSubmit(async (data) => {
    if (editingCategoryId) {
      await updateCategory.mutateAsync({ id: editingCategoryId, payload: data })
    } else {
      await createCategory.mutateAsync(data)
    }
    closeCategoryModal()
  })

  const isLoading = createCategory.isPending || updateCategory.isPending

  return (
    <Modal
      open={categoryModalOpen}
      onClose={closeCategoryModal}
      title={editingCategoryId ? 'Edit Category' : 'New Category'}
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Category name..."
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Textarea
          label="Description"
          placeholder="Optional description..."
          {...register('description')}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => field.onChange(color)}
                    className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${field.value === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={closeCategoryModal}>Cancel</Button>
          <Button type="submit" loading={isLoading}>
            {editingCategoryId ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
