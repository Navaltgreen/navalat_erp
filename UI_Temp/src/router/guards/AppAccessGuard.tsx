import { Button, Result } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth/store";

function AppAccessGuard() {
  const roles = useAuthStore((state) => state.roles);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

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
              navigate("/login", { replace: true });
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
