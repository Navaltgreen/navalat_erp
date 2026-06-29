import React from "react";
import { Layout, Menu, type MenuProps } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth/store";
import { useThemeStore } from "../../store/theme";
import { hasRouteAccess } from "../../utils/auth";
import { appRoutes, type RouteConfig } from "../../router/routes";
import { Typography } from "antd";

const { Sider } = Layout;
const { Title } = Typography;

const siderStyle: React.CSSProperties = {
  overflow: "auto",
  height: "100vh",
  position: "sticky",
  insetInlineStart: 0,
  top: 0,
  scrollbarWidth: "thin",
  scrollbarGutter: "stable",
};

const siderWidth = 280;

function buildPath(parentPath: string, path: string): string {
  if (path.startsWith("/")) {
    return path;
  }
  const normalizedParent = parentPath.endsWith("/")
    ? parentPath.slice(0, -1)
    : parentPath;
  return `${normalizedParent}/${path}`;
}

function buildMenuItems(
  routes: RouteConfig[],
  userRoles: string[],
  parentPath = "",
): MenuProps["items"] {
  return routes
    .filter(
      (route) => !route.hideInMenu && hasRouteAccess(userRoles, route.roles),
    )
    .map((route) => {
      const fullPath = buildPath(parentPath, route.path);
      const children = route.children
        ? buildMenuItems(route.children, userRoles, fullPath)
        : undefined;

      return {
        key: fullPath,
        icon: React.createElement(route.icon),
        label: route.label,
        children: children && children.length > 0 ? children : undefined,
      };
    });
}

function AppShellSiderMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const roles = useAuthStore((state) => state.roles);
  const mode = useThemeStore((state) => state.mode);

  const items = buildMenuItems(appRoutes, roles);

  const rootOpenKey = appRoutes.find(
    (route) =>
      route.path !== "/" &&
      location.pathname.startsWith(route.path) &&
      route.children &&
      route.children.length > 0,
  )?.path;

  return (
    <Sider width={siderWidth} style={siderStyle}>
      <div style={{ padding: "2px", textAlign: "center" }}>
        <Title level={3}>Navix</Title>
      </div>
      <Menu
        className="app-sider-menu"
        theme={mode}
        mode="inline"
        selectedKeys={[location.pathname]}
        defaultOpenKeys={rootOpenKey ? [rootOpenKey] : []}
        onClick={({ key }) => navigate(String(key))}
        items={items}
      />
    </Sider>
  );
}

export default AppShellSiderMenu;
