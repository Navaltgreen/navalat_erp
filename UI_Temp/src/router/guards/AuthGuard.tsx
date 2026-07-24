import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth/store";

function AuthGuard() {
  const isReady = useAuthStore((state) => state.isReady);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setLastAttemptedPath = useAuthStore(
    (state) => state.setLastAttemptedPath,
  );

  if (!isReady) {
    return null;
  }

  if (!isAuthenticated) {
    setLastAttemptedPath(window.location.pathname);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default AuthGuard;
