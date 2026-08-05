---
applyTo: "src/types/**/*.ts"
description: "Type contract and API response/mapper/model rules"
---

## Scope

Defines type contracts and API data modeling under `src/types`.

## Related Instruction Files

- `.github/instructions/project-structure-patterns.instructions.md` (overview and relationship map)
- `.github/instructions/component-structure.instructions.md` (component usage of types)
- `.github/instructions/service-patterns.instructions.md` (service mapping responsibility)
- `.github/instructions/query-patterns.instructions.md` (query result shape)
- `.github/instructions/store-patterns.instructions.md` (store data/error state shape)

## Types Naming Rules

1. Types folders should be lowercase under `src/types`.
2. Type names should be PascalCase.
3. Use concern-based files: `response.ts`, `request.ts`, `mapper.ts`, `model.ts`, `state.ts`, `form.ts`.
4. Add `index.ts` re-exports where needed.

## API Data Naming

1. `response.ts`: backend response envelope and payload contracts.
2. `request.ts`: outbound request payload contracts.
3. `mapper.ts`: converts `response.data` into app-friendly shape.
4. `model.ts`: UI/app-friendly shape after mapping.

## API Data Rules

- Treat backend envelope as `data` and `error`.
- Keep domain payload inside `data`.
- Always use mapper between response and model.
- Return `null` or empty state from mapper when `data` is null.
- Ignore `meta` in app model unless explicitly needed.
