---
applyTo: "src/services/**/*.ts"
description: "Service layer rules for API calls and mapping"
---

## Scope

Defines service layer rules for API calls in `src/services`.

## Related Instruction Files

- `.github/instructions/project-structure-patterns.instructions.md` (overview and relationship map)
- `.github/instructions/type-contracts.instructions.md` (response/request/mapper/model contracts)
- `.github/instructions/query-patterns.instructions.md` (query hooks call services)

## Service Naming Rules

1. Service folders should be lowercase.
2. Keep one service file per feature concern.
3. Use `service.ts` as public service entry.
4. Keep mapping in service/mapper layer, not in components.

## Service Pattern

- `src/services/<module>/service.ts`
- `src/services/<module>/<submodule>/service.ts`
- `src/services/<module>/index.ts`

## Service Flow

1. Call API client.
2. Read envelope (`data`, `error`).
3. Map `data` with mapper.
4. Return model to query layer.
