import { useQuery } from "@tanstack/react-query";
import {
  getSalesDashboardPerformance,
  type DashboardModule,
} from "../../services/sales/dashboard-performance.service";
import type { DashboardPerformanceItemResponse } from "../../types/sales/dashboard-performance.response";
import { useDashboardFilterStore } from "../../store/sales/dashboard/dashboard-filter.store";
import { getDateRangeForFilters } from "../../store/sales/dashboard/dashboard-filter.utils";

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
  byRange: (startDate: string, endDate: string) =>
    [...salesDashboardPerformanceQueryKeys.all, startDate, endDate] as const,
};

export function useSalesDashboardPerformanceQuery() {
    const year = useDashboardFilterStore((state) => state.year);
    const periodType = useDashboardFilterStore((state) => state.periodType);
    const month = useDashboardFilterStore((state) => state.month);
    const quarter = useDashboardFilterStore((state) => state.quarter);
  
    const { start_date, end_date } = getDateRangeForFilters({
      year,
      periodType,
      month,
      quarter,
    });
  const query = useQuery({
    queryKey: salesDashboardPerformanceQueryKeys.byRange(start_date, end_date),
    queryFn: async (): Promise<SalesDashboardPerformanceData> => {
      const results = await Promise.all(
        DASHBOARD_MODULES.map(async (module) => {
          const chartData = await getSalesDashboardPerformance(
            module,
            start_date,
            end_date,
          );
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
