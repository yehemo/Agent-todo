import { useUiStore } from '../stores/uiStore'
import { useTasks } from '../hooks/useTasks'
import { TasksToolbar } from '../components/tasks/TasksToolbar'
import { TaskList } from '../components/tasks/TaskList'
import { Pagination } from '../components/ui/Pagination'

export function TasksPage() {
  const { activeFilters, setFilter } = useUiStore()
  const { data, isLoading } = useTasks(activeFilters)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {data?.meta.total ?? 0} task{(data?.meta.total ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      <TasksToolbar />

      <TaskList tasks={data?.data ?? []} loading={isLoading} />

      {data && (
        <Pagination
          currentPage={data.meta.current_page}
          lastPage={data.meta.last_page}
          onPageChange={(page) => setFilter('page', page)}
        />
      )}
    </div>
  )
}
