import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithKeycloak } from "../../config/keycloak";
import { appRoutes } from "../../router/routes";
import { useAuthStore } from "../../store/auth/store";
import { hasRouteAccess } from "../../utils/auth";

function findRouteByPath(path: string) {
  const stack = [...appRoutes];

  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) {
      continue;
    }

    if (current.path === path) {
      return current;
    }

    if (current.children?.length) {
      const parentPath = current.path.endsWith("/")
        ? current.path.slice(0, -1)
        : current.path;

      for (const child of current.children) {
        const childPath = child.path.startsWith("/")
          ? child.path
          : `${parentPath}/${child.path}`;

        stack.push({ ...child, path: childPath });
      }
    }
  }

  return null;
}

function Login() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isReady = useAuthStore((state) => state.isReady);
  const user = useAuthStore((state) => state.user);
  const roles = useAuthStore((state) => state.roles);
  const lastAttemptedPath = useAuthStore((state) => state.lastAttemptedPath);
  const setLastAttemptedPath = useAuthStore(
    (state) => state.setLastAttemptedPath,
  );
  const navigate = useNavigate();
  const [localError, setLocalError] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    if (!isReady || !isAuthenticated || !user) return;

    if (lastAttemptedPath) {
      const route = findRouteByPath(lastAttemptedPath);
      if (route && hasRouteAccess(roles, route.roles)) {
        setLastAttemptedPath(null);
        navigate(lastAttemptedPath, { replace: true });
        return;
      }
    }

    navigate("/dashboard", { replace: true });
  }, [
    isReady,
    isAuthenticated,
    user,
    roles,
    lastAttemptedPath,
    navigate,
    setLastAttemptedPath,
  ]);

  const handleKeycloakLogin = async () => {
    if (!isReady || isAuthenticated) return;

    const redirectPath = lastAttemptedPath ?? "/dashboard";

    setLocalError(null);
    setIsRedirecting(true);

    try {
      await loginWithKeycloak(redirectPath);
    } catch {
      setLocalError("Unable to redirect to Keycloak. Please try again.");
      setIsRedirecting(false);
    }
  };

  useEffect(() => {
    if (!isReady || isAuthenticated) return;

    void handleKeycloakLogin();
  }, [isReady, isAuthenticated, lastAttemptedPath]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "24px",
      }}
      aria-live="polite"
    >
      <section style={{ textAlign: "center" }}>
        <p>
          {isRedirecting ? "Redirecting to Keycloak..." : "Sign-in required"}
        </p>
        {localError ? (
          <>
            <p>{localError}</p>
            <button type="button" onClick={handleKeycloakLogin}>
              Retry Keycloak Login
            </button>
          </>
        ) : null}
      </section>
    </main>
  );
}

export default Login;
