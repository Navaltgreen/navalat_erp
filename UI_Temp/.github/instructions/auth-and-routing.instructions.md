---
applyTo: "src/**/*.{ts,tsx}"
description: "Auth flow, token refresh, route protection, and role-based access rules"
---

## Scope

Defines the authentication, token refresh, route protection, and role-based authorization system.

## Related Instruction Files

- `.github/instructions/store-patterns.instructions.md` (auth store shape)
- `.github/instructions/service-patterns.instructions.md` (auth and refresh services)
- `.github/instructions/component-structure.instructions.md` (Login and Layout components)
- `.github/instructions/project-structure-patterns.instructions.md` (overview and relationship map)

---

## Auth Flow

### Login

1. User submits `identifier` + `password` on the Login page.
2. `useLoginMutation` in `src/query/auth/query.ts` calls `loginUser` service.
3. `loginUser` in `src/services/auth/service.ts` POSTs to `VITE_AUTH_LOGIN_ENDPOINT` via `authApi`.
4. On 200 response:
   - Check `user.blocked` → if true, show error and **do not save token**.
   - Check `user.confirmed` → if false, show error and **do not save token**.
   - If clean: call `setAuth(jwt, refreshToken, user)` on the persisted auth store.
5. After `setAuth`, resolve redirect:
   - If `lastAttemptedPath` exists in store AND user role passes `hasRouteAccess` → navigate there and `setLastAttemptedPath(null)`.
   - Otherwise → navigate to `/dashboard`.

### Auth Store (`src/store/auth/store.ts`)

Persisted via Zustand `persist` middleware under localStorage key `auth-store`.

| Field               | Type                | Purpose                                         |
| ------------------- | ------------------- | ----------------------------------------------- |
| `jwt`               | `string \| null`    | Active access token                             |
| `refreshToken`      | `string \| null`    | Token used to get a new jwt                     |
| `user`              | `LoginUser \| null` | Full user object from login response            |
| `lastAttemptedPath` | `string \| null`    | Path user tried to access before login redirect |

Actions: `setAuth(jwt, refreshToken, user)`, `clearAuth()`, `setLastAttemptedPath(path \| null)`.

---

## Token Refresh

### When

Triggered automatically by the `dataApi` 401 response interceptor in `src/config/axios/dataApi.ts`.

### Flow

1. Any `dataApi` request receives a 401 response.
2. If `isRefreshing` is already true → queue the request in `failedQueue`.
3. If not refreshing → set `isRefreshing = true`, call `refreshTokenService({ refreshToken })`.
4. `refreshTokenService` uses a **raw axios instance** (no interceptors) to POST to `VITE_AUTH_REFRESH_ENDPOINT`. This avoids infinite loop.
5. On refresh **success**:
   - Call `setAuth(newJwt, newRefreshToken, user)` to update the store.
   - Call `processQueue(null, newJwt)` to retry all queued requests with new token.
   - Retry original request with new token.
6. On refresh **failure**:
   - Call `processQueue(error)` to reject all queued requests.
   - Call `setLastAttemptedPath(window.location.pathname)`.
   - Call `clearAuth()`.
   - Call `navigatorRef.navigate('/login')` to redirect.

### Concurrent 401 Safety

`isRefreshing` flag ensures only one refresh call is made even if multiple requests 401 simultaneously. All others are queued and resolved together after the single refresh completes.

---

## Routing

### Structure

```
/login          → LoginPage (public, no guard)
/*              → AuthGuard → AppShell layout → RoleGuard → Page
*               → redirect /dashboard (catch-all)
```

### AuthGuard (`src/router/guards/AuthGuard.tsx`)

- Reads `jwt` from auth store.
- If `jwt` is null: saves `window.location.pathname` via `setLastAttemptedPath`, redirects to `/login`.
- If `jwt` exists: renders `<Outlet />`.

### RoleGuard (`src/router/guards/RoleGuard.tsx`)

- Receives `allowedRoles: string[]` prop from route config.
- If `allowedRoles` is empty → allow all authenticated users through.
- If roles are defined → parse `user.role_uid` via `parseRoles`, check intersection with `hasRouteAccess`.
- If no access → redirect to `/dashboard`.

### AppRouter (`src/router/AppRouter.tsx`)

- Sets `navigatorRef.navigate = navigate` on mount so Axios interceptors can trigger navigation outside the React tree.
- Renders all routes from `appRoutes` wrapped in `AuthGuard` → `AppShell` → `RoleGuard`.

---

## Route Config (`src/router/routes.ts`)

**Single source of truth** for both React Router and the Ant Design sidebar.

```ts
type RouteConfig = {
  path: string;
  label: string;
  icon: ComponentType;
  roles: string[]; // empty = all authenticated users
  component: ComponentType;
  hideInMenu?: boolean; // exclude from sidebar
  children?: RouteConfig[];
};
```

### Rules

- Add every new page here. Do not define routes anywhere else.
- `roles: []` means any authenticated user can access the route.
- `roles: ["admin"]` means only users whose parsed `role_uid` contains `"admin"`.
- `hideInMenu: true` hides the route from the sidebar but still protects it via guards.

---

## Role Utilities (`src/utils/auth.ts`)

```ts
parseRoles(role_uid: string): string[]
```

- Splits `role_uid` on comma, trims each value, filters empty strings.
- Always use this; never split `role_uid` manually inline.

```ts
hasRouteAccess(userRoles: string[], routeRoles: string[]): boolean
```

- Returns `true` if `routeRoles` is empty.
- Returns `true` if any element in `routeRoles` exists in `userRoles`.

---

## Navigation Utility (`src/utils/navigate.ts`)

`navigatorRef.navigate(path)` is a singleton set by `AppRouter` on mount.

Use this **only** for navigation triggered outside the React component tree (e.g., Axios interceptors, service layer). Inside components, always use `useNavigate()`.

---

## Axios Clients

| Client                  | File                                  | Auth token injected          | Used for                                         |
| ----------------------- | ------------------------------------- | ---------------------------- | ------------------------------------------------ |
| `authApi`               | `src/config/axios/authApi.ts`         | No                           | Login only (pre-auth)                            |
| `dataApi`               | `src/config/axios/dataApi.ts`         | Yes, via request interceptor | All authenticated API calls                      |
| `refreshApi` (internal) | Inside `src/services/auth/service.ts` | No                           | Refresh token call only, avoids interceptor loop |

**Do not add auth token injection to `authApi`.** Login must not send a potentially stale token.

---

## Env Variables

| Variable                     | Purpose                                              |
| ---------------------------- | ---------------------------------------------------- |
| `VITE_AUTH_BASE_URL`         | Base URL for `authApi` and the internal `refreshApi` |
| `VITE_AUTH_LOGIN_ENDPOINT`   | Login endpoint path, default `/auth/local`           |
| `VITE_AUTH_REFRESH_ENDPOINT` | Refresh endpoint path, default `/auth/refresh-token` |
| `VITE_DATA_BASE_URL`         | Base URL for `dataApi`                               |

---

## Strict Rules

1. Never call `clearAuth` without also setting `lastAttemptedPath` when redirecting from a protected context (session expiry, refresh failure).
2. Never import `useNavigate` in service files or Axios config files. Use `navigatorRef.navigate` instead.
3. Never define route-to-component mappings outside `src/router/routes.ts`.
4. Always use `parseRoles` before any role comparison. Never compare raw `role_uid` string directly.
5. `refreshTokenService` must always use a raw axios instance. Never use `dataApi` or `authApi` for refresh calls.
