import { useQuery } from "@tanstack/react-query";
import {
  getSalesDashboardPerformance,
  type DashboardModule,
} from "../../services/sales/dashboard-performance.service";
import type { DashboardPerformanceItemResponse } from "../../types/sales/dashboard-performance.response";

const DASHBOARD_MODULES: DashboardModule[] = [
  "lead",
  "proposal",
  "quotation",
  "purchase",
];

export type SalesDashboardPerformanceData = Record<
  DashboardModule,
  DashboardPerformanceItemResponse[]
>;

export const salesDashboardPerformanceQueryKeys = {
  all: ["sales-dashboard-performance"] as const,
};

export function useSalesDashboardPerformanceQuery() {
  const query = useQuery({
    queryKey: salesDashboardPerformanceQueryKeys.all,
    queryFn: async (): Promise<SalesDashboardPerformanceData> => {
      const results = await Promise.all(
        DASHBOARD_MODULES.map(async (module) => {
          const chartData = await getSalesDashboardPerformance(module);
          return [module, chartData] as const;
        }),
      );

      return Object.fromEntries(results) as SalesDashboardPerformanceData;
    },
    refetchOnMount: "always",
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    error: query.error ?? null,
    data: query.data ?? {
      lead: [],
      proposal: [],
      quotation: [],
      purchase: [],
    },
    refetch: query.refetch,
  };
}
