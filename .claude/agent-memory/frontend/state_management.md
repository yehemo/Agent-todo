---
name: state_management
description: Zustand stores structure, React Query patterns, and queryKeys factory used in the project
type: project
---

## Two State Layers

| Layer | Tool | What it manages |
|-------|------|----------------|
| Server state | TanStack Query v5 | Tasks, categories, stats (anything from API) |
| Client state | Zustand | Auth token/user, UI state (modals, delete dialogs) |

**Why:** Never use `useEffect + fetch` for API data — always TanStack Query. Never put server data in Zustand.

## Zustand Stores

### `src/stores/authStore.ts`
```typescript
interface AuthStore {
  token: string | null
  user: User | null
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  isAuthenticated: () => boolean
}
```
- Uses `persist` middleware → stored in `localStorage` under key `auth-storage`
- `isAuthenticated()` is a getter — checks `!!token`
- Token is read by the Axios interceptor via `useAuthStore.getState().token` (outside React)

### `src/stores/uiStore.ts`
- Manages modal open/close state and delete dialog target item
- Used by `GlobalDeleteModal` in AppShell

## React Query Keys

All query keys live in `src/utils/queryKeys.ts`. Always use this factory — never create ad-hoc strings.

```typescript
// Pattern used:
queryKeys.tasks.all        // invalidate all task queries
queryKeys.tasks.list(filters)  // specific filtered list
queryKeys.categories.all
queryKeys.stats
```

After any mutation (create/update/delete), invalidate the relevant query key with `queryClient.invalidateQueries()`.

## useTasks Hook Pattern

```typescript
// useQuery for list
const { data, isLoading, isError } = useQuery({
  queryKey: queryKeys.tasks.list(filters),
  queryFn: () => getTasks(filters),
})

// useMutation for changes
const { mutate: createTask } = useMutation({
  mutationFn: createTask,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
})
```
