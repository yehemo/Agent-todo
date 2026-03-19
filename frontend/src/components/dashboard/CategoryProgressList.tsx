import type { StatsData } from '../../types/api.types'

interface CategoryProgressListProps {
  categories: StatsData['by_category']
}

export function CategoryProgressList({ categories }: CategoryProgressListProps) {
  if (categories.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4">Progress by Category</h3>
      <div className="space-y-4">
        {categories.map((cat) => {
          const pct = cat.total > 0 ? Math.round((cat.completed / cat.total) * 100) : 0
          return (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-sm text-gray-700">{cat.name}</span>
                </div>
                <span className="text-xs text-gray-500">{cat.completed}/{cat.total}</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: cat.color }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
