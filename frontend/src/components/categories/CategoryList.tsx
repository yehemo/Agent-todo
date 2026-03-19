import { useCategories } from '../../hooks/useCategories'
import { useUiStore } from '../../stores/uiStore'

export function CategoryList() {
  const { data: categories = [] } = useCategories()
  const { activeFilters, setFilter } = useUiStore()

  if (categories.length === 0) return null

  return (
    <div className="mt-4">
      <p className="px-3 mb-1 text-xs font-semibold text-indigo-300 uppercase tracking-wider">Categories</p>
      <ul className="space-y-0.5">
        {categories.map((cat) => (
          <li key={cat.id}>
            <button
              onClick={() => setFilter('category_id', activeFilters.category_id === cat.id ? null : cat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeFilters.category_id === cat.id
                  ? 'bg-indigo-700 text-white'
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="truncate">{cat.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
