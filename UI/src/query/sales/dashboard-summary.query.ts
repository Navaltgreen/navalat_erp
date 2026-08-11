import { useQuery } from "@tanstack/react-query";
import { getSalesDashboardSummary } from "../../services/sales/dashboard-summary.service";
import {
  emptySalesDashboardSummaryData,
  type SalesDashboardSummaryData,
} from "../../types/sales/dashboard-summary.response";
import { useDashboardFilterStore } from "../../store/sales/dashboard/dashboard-filter.store";
import { getDateRangeForFilters } from "../../store/sales/dashboard/dashboard-filter.utils";

export const salesDashboardSummaryQueryKeys = {
  all: ["sales-dashboard-summary"] as const,
  byRange: (startDate: string, endDate: string) =>
    [...salesDashboardSummaryQueryKeys.all, startDate, endDate] as const,
};

export function useSalesDashboardSummaryQuery() {
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
    queryKey: salesDashboardSummaryQueryKeys.byRange(start_date, end_date),
    queryFn: (): Promise<SalesDashboardSummaryData> =>
      getSalesDashboardSummary(start_date, end_date),
    refetchOnMount: "always",
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    error: query.error ?? null,
    data: query.data ?? emptySalesDashboardSummaryData,
    refetch: query.refetch,
  };
}
