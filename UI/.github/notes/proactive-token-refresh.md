# Proactive Token Refresh on Resume

## Status

Pending implementation.

## Problem

Current reactive flow waits for a real API call to return 401, then refreshes:

```
User clicks → API call → 401 → refresh → retry → data loads (slight delay/flicker)
```

When a user closes their laptop overnight and opens it next morning, the jwt will
be expired. The first API call will silently fail with 401 before the refresh kicks in.
This causes a visible delay or brief error flash on the first action.

## Solution

Listen for the `visibilitychange` event. When the page becomes visible again (lid
opens, tab switch back), proactively refresh the token BEFORE any API call fires.

```
Lid opens → visibilitychange → refresh immediately → API calls proceed normally
```

## Implementation Plan

### 1. Create the hook

**File:** `src/hooks/useTokenRefreshOnResume.ts`

```ts
import { useEffect } from "react";
import { refreshTokenService } from "../services/auth/service";
import { useAuthStore } from "../store/auth/store";
import { navigatorRef } from "../utils/navigate";

export function useTokenRefreshOnResume() {
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState !== "visible") return;

      const {
        jwt,
        refreshToken,
        user,
        setAuth,
        clearAuth,
        setLastAttemptedPath,
      } = useAuthStore.getState();

      if (!jwt || !refreshToken || !user) return;

      try {
        const data = await refreshTokenService({ refreshToken });
        setAuth(data.jwt, refreshToken, user);
      } catch {
        setLastAttemptedPath(window.location.pathname);
        clearAuth();
        navigatorRef.navigate("/login");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);
}
```

### 2. Mount in AppRouter

**File:** `src/router/AppRouter.tsx`

Add inside the `AppRouter` function body:

```ts
useTokenRefreshOnResume();
```

## Flow

```
visibilityState = "visible"
        │
        ▼
jwt + refreshToken in store?
        │
   No ──┴── Yes
   │         │
   │         ▼
   │   POST /auth/refresh { refreshToken }
   │         │
   │    ┌────┴────┐
   │  Success   Failure
   │    │         │
   │    ▼         ▼
   │  Update   setLastAttemptedPath
   │  jwt in   clearAuth
   │  store    navigate /login
   │
   ▼
 Do nothing (user not logged in)
```

## Behaviour Comparison

| Scenario           | Reactive (current)                          | Proactive (this feature)                           |
| ------------------ | ------------------------------------------- | -------------------------------------------------- |
| Token still valid  | Works normally                              | Refresh called unnecessarily (minor extra request) |
| Token expired      | First API call fails, then retries silently | Refresh before any API call fires                  |
| Refresh fails      | clearAuth + redirect                        | clearAuth + redirect                               |
| User not logged in | Nothing happens                             | Nothing happens                                    |

## Notes

- Uses `refreshTokenService` directly (raw axios instance, no interceptor loop risk).
- Does not block the UI while refreshing — hook runs async in background.
- The unnecessary refresh on a still-valid token is acceptable (one extra request on
  wake). If needed, add a `lastRefreshedAt` timestamp check to skip if refreshed
  recently (e.g. within last 5 minutes).
- `navigatorRef.navigate` is used instead of `useNavigate` because this runs inside
  an async event handler, not a render cycle.
