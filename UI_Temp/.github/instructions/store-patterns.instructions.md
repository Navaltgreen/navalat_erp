---
applyTo: "src/store/**/*.ts"
description: "Zustand store shape and query synchronization rules"
---

## Scope

Defines Zustand store structure and query-sync behavior under `src/store`.

## Related Instruction Files

- `.github/instructions/project-structure-patterns.instructions.md` (overview and relationship map)
- `.github/instructions/query-patterns.instructions.md` (query result source)
- `.github/instructions/type-contracts.instructions.md` (data/error types)

## Store Naming Rules

1. Use lowercase folders under `src/store`.
2. Use `store.ts` as state entry.
3. Keep server-state source in query.
4. If mirroring API results, include `data`, `error`, and `reset` actions.

## Store Pattern

- `src/store/<module>/store.ts`
- `src/store/<module>/<submodule>/store.ts`
- `src/store/<module>/index.ts`

## Query To Store Rules

- Sync query result to store manually in component or bridge hook.
- On success, replace store data.
- On error, clear stale data and set error.
- Do not skip store update when result is empty.
- Prefer reusable bridge hook (e.g., `useQueryToStoreSync`) for scalability.
