import { useAuthStore } from '../../stores/authStore'
import { useLogout } from '../../hooks/useAuth'

export function UserMenu() {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()

  return (
    <div className="px-3 py-3 border-t border-indigo-800">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
          {user?.name?.[0]?.toUpperCase() ?? 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{user?.name}</p>
          <p className="text-xs text-indigo-300 truncate">{user?.email}</p>
        </div>
      </div>
      <button
        onClick={() => logout.mutate()}
        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-indigo-300 hover:bg-indigo-800 hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Sign out
      </button>
    </div>
  )
}
