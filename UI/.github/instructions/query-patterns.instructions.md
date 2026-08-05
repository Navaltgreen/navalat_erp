---
applyTo: "src/query/**/*.ts"
description: "React Query hook, key, timing, and parameter rules"
---

## Scope

Defines React Query structure and behavior under `src/query`.

## Related Instruction Files

- `.github/instructions/project-structure-patterns.instructions.md` (overview and relationship map)
- `.github/instructions/service-patterns.instructions.md` (query calls services)
- `.github/instructions/store-patterns.instructions.md` (query-to-store sync)
- `.github/instructions/type-contracts.instructions.md` (typed query data contracts)

## Query Naming Rules

1. Use lowercase folders under `src/query`.
2. Use `query.ts` for hook and key helpers.
3. Use `use<Feature>Query` and `use<Feature>Mutation` hook names.
4. Use `<feature>QueryKeys` helper name.

## Query Key Rules

- Include every API-affecting parameter in `queryKey`.
- Use same parameters in `queryFn`.
- Parameter change must trigger new key and new request.

## Query Result Rules

- Return `loading`, `data`, `error`, and optional `refetch`.
- Default `data` to `[]` or `null` by feature.
- Default `error` to `null`.

## Query Remount And Cache Rules

- Use `refetchOnMount: false` to avoid unnecessary remount refetch for same key.
- Use `gcTime` to keep cache across module switch.
- Use `staleTime` based on freshness requirement.

## Timing Options

- `staleTime`
- `gcTime`
- `refetchOnMount`
- `refetchInterval`
- `retryDelay`
