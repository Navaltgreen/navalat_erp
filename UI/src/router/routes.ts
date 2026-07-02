import type { ComponentType } from "react";
import {
  Bug,
  SquareArrowUpLeft,
  ListTodo,BugPlay,
  // Activity,
  // BarChart3,
  // ClipboardList,
  Component,
  LayoutGrid,
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
import OceanixPage from "../pages/OceanixPage";
import Onboarding from "../components/Oceanix/Onboarding";
import WorkAdd from "../components/Oceanix/works/WorkAdd";
import WorkList from "../components/Oceanix/works/WorkList";
import DeveloperWorkList from "../components/Oceanix/works/DeveloperWorkList";

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
    icon: LayoutGrid,
    roles: ["root", "admin", "superadmin"],
    component: DashboardPage,
  },
  {
    path: "/sales",
    label: "Sales",
    icon: DiamondPercent,
    roles: ["root", "admin", "superadmin"],
    component: SalesPage,
    children: [
      {
        path: "dashboard",
        label: "Dashboard",
        icon: Component,
        roles: ["root", "admin", "superadmin"],
        component: SalesDashboard,
      },
      {
        path: "management",
        label: "Management",
        icon: SquareKanban,
        roles: ["root", "admin", "superadmin"],
        component: SalesManagement,
      },
    ],
  },
  {
    path: "onboarding",
    label: "Onboarding",
    icon: SquareArrowUpLeft,
    roles: ["root", "oceanix", "qseems", "manager", "admin"],
    component: Onboarding,
  },
  {
    path: "/task-management",
    label: "Task Management",
    icon: ListTodo,
    roles: ["root", "oceanix", "qseems", "manager", "admin"],
    component: OceanixPage,
    children: [
      {
        path: "add-task",
        label: "Add Task",
        icon: Bug,
        roles: ["root", "oceanix", "qseems", "manager", "admin"],
        component: WorkAdd,
      },
      {
        path: "view-tasks",
        label: "View Tasks",
        icon: BugPlay,
        roles: ["root", "oceanix", "qseems", "manager", "admin"],
        component: DeveloperWorkList,
      },
      {
        path: "manage-tasks",
        label: "Manage Tasks",
        icon: SquareKanban,
        roles: ["root", "oceanix", "qseems", "manager", "admin"],
        component: WorkList,
      },
    ],
  },
];
