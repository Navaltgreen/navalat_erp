---
applyTo: "src/**/*.{ts,tsx}"
description: "Overview and relationship map for project structure instruction files"
---

## Scope

This file is the index for all structure and pattern instruction files.

Use this file first to locate the correct focused instruction file.

## Instruction File Links

- `.github/instructions/component-structure.instructions.md`
- `.github/instructions/type-contracts.instructions.md`
- `.github/instructions/service-patterns.instructions.md`
- `.github/instructions/query-patterns.instructions.md`
- `.github/instructions/store-patterns.instructions.md`
- `.github/instructions/package.instructions.md`

## Relationship Map

1. Components consume query/store and render models.
2. Query calls services and returns server-state hook results.
3. Services call API client and map response contracts to models.
4. Types define response/request/mapper/model/state contracts.
5. Store keeps UI/shared state and optional mirrored result state.

Flow:

- API -> service -> mapper -> query -> store/component -> UI

## File Selection Rule

- Editing `src/components/**`: use component and store/query docs.
- Editing `src/types/**`: use type-contract docs.
- Editing `src/services/**`: use service and type-contract docs.
- Editing `src/query/**`: use query docs and related service/type docs.
- Editing `src/store/**`: use store docs and related query/type docs.

## Strict Rule

Before creating new modules/submodules/tabs, confirm names with user.
