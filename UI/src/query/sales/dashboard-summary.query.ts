import { useQuery } from "@tanstack/react-query";
import { getSalesDashboardSummary } from "../../services/sales/dashboard-summary.service";
import {
  emptySalesDashboardSummaryData,
  type SalesDashboardSummaryData,
} from "../../types/sales/dashboard-summary.response";

export const salesDashboardSummaryQueryKeys = {
  all: ["sales-dashboard-summary"] as const,
};

export function useSalesDashboardSummaryQuery() {
  const query = useQuery({
    queryKey: salesDashboardSummaryQueryKeys.all,
    queryFn: (): Promise<SalesDashboardSummaryData> =>
      getSalesDashboardSummary(),
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
