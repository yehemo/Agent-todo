import { NavLinks } from './NavLinks'
import { UserMenu } from './UserMenu'
import { CategoryList } from '../categories/CategoryList'

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-indigo-900 flex flex-col h-full">
      <div className="px-4 py-5 border-b border-indigo-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white">TaskFlow</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavLinks />
        <CategoryList />
      </div>

      <UserMenu />
    </aside>
  )
}
