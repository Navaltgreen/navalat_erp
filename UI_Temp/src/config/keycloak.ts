import Keycloak from "keycloak-js";

export type AuthUser = {
  id: string | null;
  username: string | null;
  email: string | null;
  displayName: string | null;
};

export type KeycloakAuthSnapshot = {
  isAuthenticated: boolean;
  user: AuthUser | null;
  roles: string[];
};

function getEnvValue(name: string): string {
  const value = import.meta.env[name as keyof ImportMetaEnv];

  if (!value || typeof value !== "string") {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const keycloakClientId = getEnvValue("VITE_KEYCLOAK_CLIENT_ID");

export const keycloak = new Keycloak({
  url: getEnvValue("VITE_KEYCLOAK_URL"),
  realm: getEnvValue("VITE_KEYCLOAK_REALM"),
  clientId: keycloakClientId,
});

let keycloakInitPromise: Promise<boolean> | null = null;

export async function initKeycloak(): Promise<boolean> {
  if (!keycloakInitPromise) {
    keycloakInitPromise = keycloak.init({
      onLoad: "check-sso",
      pkceMethod: "S256",
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });
  }

  return keycloakInitPromise;
}

function getRolesFromToken(): string[] {
  const parsed = keycloak.tokenParsed as
    | {
        realm_access?: { roles?: string[] };
        resource_access?: Record<string, { roles?: string[] }>;
      }
    | undefined;

  const realmRoles = parsed?.realm_access?.roles ?? [];
  const clientRoles = parsed?.resource_access?.[keycloakClientId]?.roles ?? [];

  return Array.from(new Set([...realmRoles, ...clientRoles]));
}

export function getKeycloakAuthSnapshot(): KeycloakAuthSnapshot {
  const isAuthenticated = Boolean(keycloak.authenticated);

  if (!isAuthenticated) {
    return {
      isAuthenticated: false,
      user: null,
      roles: [],
    };
  }

  return {
    isAuthenticated: true,
    user: {
      id: keycloak.subject ?? null,
      username: keycloak.tokenParsed?.preferred_username ?? null,
      email: keycloak.tokenParsed?.email ?? null,
      displayName: keycloak.tokenParsed?.name ?? null,
    },
    roles: getRolesFromToken(),
  };
}

export async function ensureKeycloakToken(
  minValidity = 30,
): Promise<string | null> {
  if (!keycloak.authenticated) {
    return null;
  }

  await keycloak.updateToken(minValidity);
  return keycloak.token ?? null;
}

export async function loginWithKeycloak(redirectPath?: string): Promise<void> {
  const safePath = redirectPath?.startsWith("/") ? redirectPath : "/dashboard";

  await keycloak.login({
    redirectUri: `${window.location.origin}${safePath}`,
  });
}

export async function logoutFromKeycloak(
  redirectPath = "/login",
): Promise<void> {
  const safePath = redirectPath.startsWith("/") ? redirectPath : "/login";

  await keycloak.logout({
    redirectUri: `${window.location.origin}${safePath}`,
  });
}
