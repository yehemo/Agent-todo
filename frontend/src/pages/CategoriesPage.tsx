import { useCategories } from '../hooks/useCategories'
import { CategoryGrid } from '../components/categories/CategoryGrid'
import { Button } from '../components/ui/Button'
import { useUiStore } from '../stores/uiStore'

export function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories()
  const { openCategoryModal } = useUiStore()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-0.5">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <Button onClick={() => openCategoryModal()}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Category
        </Button>
      </div>

      <CategoryGrid categories={categories} loading={isLoading} />
    </div>
  )
}
