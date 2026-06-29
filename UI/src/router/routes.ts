import type { ComponentType } from "react";
import {
  // Activity,
  // BarChart3,
  // ClipboardList,
  Gauge,
  LayoutDashboardIcon,
  // LineChart,
  // Scale,
  // TrendingUp,
} from "lucide-react";
import { DiamondPercent, SquareKanban } from "lucide-react";

// Pages
import DashboardPage from "../pages/DashboardPage";
import SalesDashboard from "../components/Sales/Dashboard/DashboardOptimized";
import SalesManagement from "../components/Sales/Management/ManagementOptimized";
import SalesPage from "../pages/SalesPage";

export type RouteConfig = {
  path: string;
  label: string;
  icon: ComponentType;
  roles: string[];
  component: ComponentType;
  hideInMenu?: boolean;
  children?: RouteConfig[];
};

export const appRoutes: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    roles: ["admin", "superadmin"],
    component: DashboardPage,
  },
  {
    path: "/sales",
    label: "Sales",
    icon: DiamondPercent,
    roles: ["admin", "superadmin"],
    component: SalesPage,
    children: [
      {
        path: "dashboard",
        label: "Dashboard",
        icon: Gauge,
        roles: ["admin", "superadmin"],
        component: SalesDashboard,
      },
      {
        path: "management",
        label: "Management",
        icon: SquareKanban,
        roles: ["admin", "superadmin"],
        component: SalesManagement,
      },
    ],
  },
];
