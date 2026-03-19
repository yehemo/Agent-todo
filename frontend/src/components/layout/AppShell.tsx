import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TaskModal } from '../tasks/TaskModal'
import { CategoryModal } from '../categories/CategoryModal'
import { GlobalDeleteModal } from './GlobalDeleteModal'

export function AppShell() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
      <TaskModal />
      <CategoryModal />
      <GlobalDeleteModal />
    </div>
  )
}
