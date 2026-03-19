---
name: component_patterns
description: UI primitives, form patterns, modal/delete flow, and Tailwind conventions used in the project
type: project
---

## UI Primitives (always use these, don't create duplicates)

Located in `src/components/ui/`:
- `Button` — variants: primary, secondary, danger
- `Input` — form input with label/error display
- `Textarea` — multiline input
- `Select` — dropdown with typed options
- `Modal` — base modal wrapper
- `Badge` — generic colored badge
- `Spinner` — loading spinner
- `Pagination` — page controls
- `ConfirmDeleteModal` — single-use delete confirmation

## Form Pattern (react-hook-form)

All forms use react-hook-form. Never use raw `useState` for form fields.

```typescript
const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
  defaultValues: { ... }
})
```
- Pre-populate edit forms via `defaultValues` or `reset(task)` when data loads
- Show field errors from `errors.fieldName.message`
- Call `reset()` on modal close

## Modal Pattern

- Use `Modal` base component as wrapper
- `TaskModal` handles both create and edit — receives `task?: Task` prop (undefined = create mode)
- `CategoryModal` same pattern
- Modals are controlled by `uiStore` state

## Delete Flow

All deletes go through `GlobalDeleteModal` in `AppShell.tsx`:
1. User clicks delete → set target item in `uiStore`
2. `GlobalDeleteModal` reads from `uiStore`, shows confirmation
3. On confirm → call delete mutation → clear `uiStore` target

**Do NOT add inline delete without confirmation.** Always use this flow.

## Category Colors

Categories have a `color` hex string (e.g. `"#f43f5e"`). Render with inline style:
```tsx
<span style={{ backgroundColor: category.color }} className="w-3 h-3 rounded-full" />
```
Never try to map hex to a Tailwind class — use inline style.

## Tailwind Conventions

- Cards: `bg-white rounded-xl shadow-sm border border-gray-100 p-6`
- Primary button: `bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors`
- Danger button: `bg-red-600 hover:bg-red-700 text-white ...`
- Input: `border border-gray-300 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500`
- Status colors: pending=gray, in-progress=blue, completed=green
- Priority colors: high=red-500, medium=yellow-500, low=green-500

## Toast Notifications

Use `react-hot-toast`:
```typescript
import toast from 'react-hot-toast'
toast.success('Task created!')
toast.error('Something went wrong.')
```
