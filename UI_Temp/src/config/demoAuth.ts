export type AuthUser = {
  id: string | null;
  username: string | null;
  email: string | null;
  displayName: string | null;
};

export type AuthSnapshot = {
  isAuthenticated: boolean;
  token: string | null;
  user: AuthUser | null;
  roles: string[];
};

export const DEMO_AUTH_EMAIL = "admin@navalt.in";
export const DEMO_AUTH_PASSWORD = "Admin@123";
export const DEMO_AUTH_TOKEN = "demo-hardcoded-access-token";
export const DEMO_AUTH_ROLES = ["admin"];

export function isDemoCredentials(email: string, password: string): boolean {
  return (
    email.trim().toLowerCase() === DEMO_AUTH_EMAIL &&
    password === DEMO_AUTH_PASSWORD
  );
}

export function buildDemoAuthSnapshot(email: string): AuthSnapshot {
  const normalizedEmail = email.trim().toLowerCase();
  const username = normalizedEmail.split("@")[0] ?? normalizedEmail;

  return {
    isAuthenticated: true,
    token: DEMO_AUTH_TOKEN,
    user: {
      id: normalizedEmail,
      username,
      email: normalizedEmail,
      displayName: "Demo Admin",
    },
    roles: DEMO_AUTH_ROLES,
  };
}
