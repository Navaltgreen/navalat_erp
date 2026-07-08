---
applyTo: "src/components/**/*.tsx"
description: "Component module and UI structure rules"
---

## Scope

Defines module and submodule structure for `src/components`.

## Related Instruction Files

- `.github/instructions/project-structure-patterns.instructions.md` (overview and relationship map)
- `.github/instructions/type-contracts.instructions.md` (types used by components)
- `.github/instructions/query-patterns.instructions.md` (server-state hooks consumed by components)
- `.github/instructions/store-patterns.instructions.md` (Zustand state consumed by components)

## Strict Rule Before Writing Code

1. Before generating folders/files, confirm with the user:
   - top-level modules
   - submodules
   - tab modules
2. If not specified, ask first and wait.
3. Do not assume business domain names from examples.

## Naming And Entry Rules

1. Use PascalCase for all module and submodule folders.
2. Every module or standalone submodule must have `index.tsx`.
3. Default export in `index.tsx` must match folder name.

## Module Types

### Simple Module

- `src/components/<Module>/index.tsx`

### Module With Submodules

- `src/components/<ParentModule>/index.tsx`
- `src/components/<ParentModule>/<SubmoduleOne>/index.tsx`
- `src/components/<ParentModule>/<SubmoduleTwo>/index.tsx`

### Module With Tabs

- `src/components/<TabModule>/index.tsx`
- `src/components/<TabModule>/Tabs/index.tsx`
- `src/components/<TabModule>/Tabs/<TabOne>.tsx`
- `src/components/<TabModule>/Tabs/<TabTwo>.tsx`

## Internal Parts Rule

1. Prefer flat `.tsx` files for small internal parts.
2. Promote complex internal parts to their own folder with `index.tsx`.
