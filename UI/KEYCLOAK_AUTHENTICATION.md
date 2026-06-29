# Keycloak Authentication Guide

This project uses Keycloak (OIDC Authorization Code Flow with PKCE) for login, session management, and role-based route access.

## Architecture Overview

- Frontend login is redirect-based via Keycloak.
- Access token is attached to API requests through Axios.
- Token refresh is handled through Keycloak (`updateToken`) instead of a custom refresh API endpoint.
- Route access is controlled using roles extracted from Keycloak token claims.

Core implementation files:

- `src/config/keycloak.ts`
- `src/config/axios/dataApi.ts`
- `src/store/auth/store.ts`
- `src/router/guards/AuthGuard.tsx`
- `src/router/guards/RoleGuard.tsx`
- `public/silent-check-sso.html`

## Required Environment Variables

Set these in `.env`:

```env
VITE_KEYCLOAK_URL=http://localhost:8080
VITE_KEYCLOAK_REALM=testingrealm
VITE_KEYCLOAK_CLIENT_ID=testingclient
VITE_DATA_BASE_URL=http://192.168.54.151:8001
```

Notes:

- `VITE_KEYCLOAK_URL` must be the Keycloak base URL only (no realm path).
- `VITE_KEYCLOAK_REALM` must match an existing realm.
- `VITE_KEYCLOAK_CLIENT_ID` must match an existing client in that realm.

## Keycloak Client Configuration

In Keycloak Admin (`Realm: testingrealm`, `Client: testingclient`), configure:

1. Valid Redirect URIs

- `http://localhost:8000/*`
- `http://localhost:8000/silent-check-sso.html`

2. Web Origins

- `http://localhost:8000`

3. Post Logout Redirect URIs (if available)

- `http://localhost:8000/*`

4. Standard Flow

- Enabled

5. PKCE

- S256 (recommended/default for SPA)

If your app runs on another port (for example `5173`), add equivalent entries for that origin.

## Silent SSO Helper

File:

- `public/silent-check-sso.html`

Purpose:

- Used by Keycloak `check-sso` mode in an invisible iframe.
- Allows session detection without forcing visible login redirects.

This path must be allowed in Keycloak Valid Redirect URIs.

## Login and Logout Flow

### Login

1. User clicks login button in `src/components/Login/index.tsx`.
2. App calls `loginWithKeycloak(...)` from `src/config/keycloak.ts`.
3. Keycloak authenticates user and redirects back.
4. App initializes auth snapshot (`isAuthenticated`, `user`, `roles`) into Zustand store.

### Logout

1. App calls `logoutFromKeycloak(...)`.
2. Keycloak clears SSO session and redirects back to `/login`.
3. Local auth state is cleared in store.

## Token Handling for API Calls

File:

- `src/config/axios/dataApi.ts`

Behavior:

- Before each request, app calls `ensureKeycloakToken(30)`.
- If token is near expiry, Keycloak refreshes it automatically.
- Refreshed token is sent as `Authorization: Bearer <token>`.

401 behavior:

- Interceptor retries once after forcing token check.
- On failure, local auth is cleared and app redirects through Keycloak login.

## Role-Based Authorization

Store fields:

- `roles: string[]`
- `isAuthenticated: boolean`
- `isReady: boolean`

Role checks are used in:

- `src/router/guards/RoleGuard.tsx`
- `src/components/Layout/AppShellSiderMenu.tsx`

Roles are derived from Keycloak token claims in `src/config/keycloak.ts`:

- `realm_access.roles`
- `resource_access[clientId].roles`

## Troubleshooting

### Error: Invalid parameter: redirect_uri

Cause:

- Redirect URL used by app is not whitelisted in Keycloak client.

Fix:

- Add `http://localhost:8000/*` and `http://localhost:8000/silent-check-sso.html` to Valid Redirect URIs.
- Ensure Web Origins includes `http://localhost:8000`.

### Error: Realm not found / OIDC config not reachable

Check:

- `http://localhost:8080/realms/testingrealm/.well-known/openid-configuration`

If this fails, fix `VITE_KEYCLOAK_URL` and/or `VITE_KEYCLOAK_REALM`.

### Login loop / blank auth state

Check:

- `VITE_KEYCLOAK_CLIENT_ID` matches Keycloak client ID.
- Standard flow is enabled for the client.
- Browser cache/session issues: test in incognito.

## Security Notes

- Do not share admin credentials in chat/logs.
- Rotate exposed credentials if shared unintentionally.
- Prefer HTTPS for production Keycloak and app origins.
- Restrict redirect URIs and origins to known frontend hosts only.

## Legacy Auth Variables

These were used by previous custom auth flow and are not required for Keycloak login:

- `VITE_AUTH_BASE_URL`
- `VITE_AUTH_LOGIN_ENDPOINT`
- `VITE_AUTH_REFRESH_ENDPOINT`

Keep them only if some legacy endpoints are still in use elsewhere.
