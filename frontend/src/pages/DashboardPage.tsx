import { useStats } from '../hooks/useStats'
import { StatsBar } from '../components/dashboard/StatsBar'
import { ProgressRing } from '../components/dashboard/ProgressRing'
import { CategoryProgressList } from '../components/dashboard/CategoryProgressList'
import { RecentTasksList } from '../components/dashboard/RecentTasksList'
import { Spinner } from '../components/ui/Spinner'

export function DashboardPage() {
  const { data: stats, isLoading } = useStats()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="w-8 h-8 text-indigo-600" />
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Your task management overview</p>
      </div>

      <StatsBar stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <ProgressRing percentage={stats.completion_rate} />
        </div>
        <div className="lg:col-span-2">
          <CategoryProgressList categories={stats.by_category} />
        </div>
      </div>

      <RecentTasksList />
    </div>
  )
}
