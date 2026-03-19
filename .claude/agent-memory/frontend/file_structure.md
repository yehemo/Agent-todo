---
name: file_structure
description: Complete src/ directory — every file and its role in the frontend
type: project
---

**Root:** `D:/Code Project/AgentTesting/frontend/src/`

## api/
| File | Purpose |
|------|---------|
| `axios.ts` | Axios instance. Reads token from `useAuthStore.getState().token`, attaches as Bearer. On 401 calls `clearAuth()` then redirects to `/login`. |
| `auth.api.ts` | `login()`, `register()`, `logout()`, `getUser()` |
| `tasks.api.ts` | `getTasks(filters)`, `createTask()`, `updateTask()`, `deleteTask()`, `updateTaskStatus()` |
| `categories.api.ts` | `getCategories()`, `createCategory()`, `updateCategory()`, `deleteCategory()` |
| `stats.api.ts` | `getStats()` |

## types/
| File | Exports |
|------|---------|
| `auth.types.ts` | `User`, `AuthResponse`, `LoginPayload`, `RegisterPayload` |
| `task.types.ts` | `Task`, `Priority` (`'low'\|'medium'\|'high'`), `TaskStatus` (`'pending'\|'in-progress'\|'completed'`), `TaskFilters`, `CreateTaskPayload`, `UpdateTaskPayload` |
| `category.types.ts` | `Category`, `CreateCategoryPayload`, `UpdateCategoryPayload` |
| `api.types.ts` | `PaginatedResponse<T>`, `ApiError`, `StatsData` |

## stores/
| File | Purpose |
|------|---------|
| `authStore.ts` | Zustand + `persist` middleware. Holds `token`, `user`. Methods: `setAuth(token, user)`, `clearAuth()`, `isAuthenticated()`. Persisted to `localStorage` under key `auth-storage`. |
| `uiStore.ts` | UI state — modal open/close, delete dialog target |

## hooks/
| File | Purpose |
|------|---------|
| `useAuth.ts` | Wraps login/register/logout mutations |
| `useTasks.ts` | `useQuery` for task list, `useMutation` for create/update/delete/status |
| `useCategories.ts` | `useQuery` + mutations for categories |
| `useStats.ts` | `useQuery` for stats data |

## routes/
| File | Purpose |
|------|---------|
| `AppRouter.tsx` | `createBrowserRouter` with public + private route groups |
| `PrivateRoute.tsx` | Checks `isAuthenticated()`, redirects to `/login` if false |
| `PublicRoute.tsx` | Checks `isAuthenticated()`, redirects to `/dashboard` if true |

## components/layout/
| File | Purpose |
|------|---------|
| `AppShell.tsx` | Sidebar + `<Outlet />` layout wrapper |
| `Sidebar.tsx` | Left nav with links to Dashboard, Tasks, Categories |
| `NavLinks.tsx` | Navigation items |
| `UserMenu.tsx` | User avatar/name + logout button |
| `GlobalDeleteModal.tsx` | Shared delete confirmation used by tasks and categories |

## components/tasks/
| File | Purpose |
|------|---------|
| `TaskList.tsx` | Grid/list of TaskCards |
| `TaskCard.tsx` | Card showing title, status, priority, due date, category badge. Edit/delete buttons. |
| `TaskModal.tsx` | Create/edit form (react-hook-form). Status, priority, due date, category fields. |
| `TasksToolbar.tsx` | Search input + status/priority/category filters |
| `StatusBadge.tsx` | Color-coded status pill |
| `PriorityBadge.tsx` | Color-coded priority pill |
| `DueDateLabel.tsx` | Formatted due date, red if overdue |

## components/categories/
| File | Purpose |
|------|---------|
| `CategoryList.tsx` | List of CategoryCards |
| `CategoryCard.tsx` | Shows name, color swatch, task count, edit/delete |
| `CategoryModal.tsx` | Create/edit form with color picker |
| `CategoryGrid.tsx` | Grid layout wrapper |
| `CategoryBadge.tsx` | Inline badge for task cards |

## components/dashboard/
| File | Purpose |
|------|---------|
| `StatsBar.tsx` | Row of summary stat cards (total, pending, in-progress, completed, overdue) |
| `StatCard.tsx` | Single stat card |
| `ProgressRing.tsx` | SVG circular progress chart for completion rate |
| `RecentTasksList.tsx` | Last N tasks widget |
| `CategoryProgressList.tsx` | Per-category completion bars |

## components/ui/
Reusable primitives: `Button`, `Input`, `Textarea`, `Select`, `Modal`, `Badge`, `Pagination`, `Spinner`, `ConfirmDeleteModal`

## utils/
| File | Purpose |
|------|---------|
| `dates.ts` | `formatDate()`, `isOverdue()`, relative date display |
| `queryKeys.ts` | React Query key factory — use these, don't create ad-hoc keys |

## __tests__/
| File | Covers |
|------|--------|
| `setup.ts` | Vitest + Testing Library setup |
| `components/StatusBadge.test.tsx` | Status badge rendering |
| `components/PriorityBadge.test.tsx` | Priority badge rendering |
| `components/DueDateLabel.test.tsx` | Due date label states |
| `utils/dates.test.ts` | Date utility functions |
