import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import AppShell from "../components/Layout/AppShell";
import LoginPage from "../pages/LoginPage";
import { navigatorRef } from "../utils/navigate";
import AppAccessGuard from "./guards/AppAccessGuard";
import AuthGuard from "./guards/AuthGuard";
import RoleGuard from "./guards/RoleGuard";
import { appRoutes, type RouteConfig } from "./routes";

function renderRoute(route: RouteConfig) {
  const hasChildren = Boolean(route.children?.length);

  return (
    <Route key={route.path} element={<RoleGuard allowedRoles={route.roles} />}>
      <Route path={route.path} element={<route.component />}>
        {hasChildren
          ? route.children?.map((child) => renderRoute(child))
          : null}
        {hasChildren ? (
          <Route
            index
            element={<Navigate to={route.children![0].path} replace />}
          />
        ) : null}
      </Route>
    </Route>
  );
}

function AppRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    navigatorRef.navigate = (path: string) => navigate(path);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<AuthGuard />}>
        <Route element={<AppAccessGuard />}>
          <Route element={<AppShell />}>
            {appRoutes.map((route) => renderRoute(route))}
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default AppRouter;
