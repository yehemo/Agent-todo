# New Component Skill

You are creating a new React component for the TaskFlow frontend using the `frontend` agent.

The user wants to add: $ARGUMENTS

Use the `frontend` agent to:
1. Read any related existing components first to follow established patterns
2. Create the component file in the correct `src/components/<category>/` directory
3. Use the existing UI primitives (`Button`, `Input`, `Modal`, `Badge`, `Spinner`, `Select`) — don't reinvent them
4. Use Tailwind CSS with the project's design tokens (indigo-600 primary, rounded-xl cards, etc.)
5. If the component fetches data, use TanStack Query via the appropriate hook
6. If the component has a form, use react-hook-form
7. Export the component as a named export
8. Run `npx tsc --noEmit` to confirm no TypeScript errors
9. Report the file path created and any related files that need to be updated (e.g., parent component that renders it)
