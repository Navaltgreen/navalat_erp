import { Button, Result } from "antd";
import { Outlet } from "react-router-dom";
import { logoutFromKeycloak } from "../../config/keycloak";
import { useAuthStore } from "../../store/auth/store";

function AppAccessGuard() {
  const roles = useAuthStore((state) => state.roles);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  if (roles.length === 0) {
    return (
      <Result
        status="403"
        title="You have no access to analytics app"
        subTitle="Please contact your administrator to get role access."
        extra={
          <Button
            type="primary"
            onClick={async () => {
              clearAuth();
              await logoutFromKeycloak("/login");
            }}
          >
            Logout
          </Button>
        }
      />
    );
  }

  return <Outlet />;
}

export default AppAccessGuard;
