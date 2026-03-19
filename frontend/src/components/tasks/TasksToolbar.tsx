import { useUiStore } from '../../stores/uiStore'
import { useCategories } from '../../hooks/useCategories'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'

export function TasksToolbar() {
  const { activeFilters, setFilter, clearFilters, openTaskModal } = useUiStore()
  const { data: categories = [] } = useCategories()

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Search tasks..."
          value={activeFilters.search ?? ''}
          onChange={(e) => setFilter('search', e.target.value)}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          }
        />
      </div>

      <Select
        value={activeFilters.status ?? ''}
        onChange={(e) => setFilter('status', e.target.value || null)}
        className="w-full sm:w-40"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </Select>

      <Select
        value={activeFilters.priority ?? ''}
        onChange={(e) => setFilter('priority', e.target.value || null)}
        className="w-full sm:w-36"
      >
        <option value="">All Priorities</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </Select>

      <Select
        value={activeFilters.category_id?.toString() ?? ''}
        onChange={(e) => setFilter('category_id', e.target.value ? Number(e.target.value) : null)}
        className="w-full sm:w-40"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </Select>

      <Select
        value={activeFilters.sort ?? 'created_at'}
        onChange={(e) => setFilter('sort', e.target.value)}
        className="w-full sm:w-36"
      >
        <option value="created_at">Newest</option>
        <option value="due_date">Due Date</option>
        <option value="priority">Priority</option>
      </Select>

      {(activeFilters.search || activeFilters.status || activeFilters.priority || activeFilters.category_id) && (
        <Button variant="ghost" onClick={clearFilters} size="md">
          Clear
        </Button>
      )}

      <Button onClick={() => openTaskModal()}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Task
      </Button>
    </div>
  )
}
