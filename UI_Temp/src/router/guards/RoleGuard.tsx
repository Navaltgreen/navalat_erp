import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/auth/store";
import { hasRouteAccess } from "../../utils/auth";

type RoleGuardProps = {
  allowedRoles: string[];
};

function RoleGuard({ allowedRoles }: RoleGuardProps) {
  const roles = useAuthStore((state) => state.roles);

  if (allowedRoles.length === 0) {
    return <Outlet />;
  }

  if (!hasRouteAccess(roles, allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default RoleGuard;
