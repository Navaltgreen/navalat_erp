import { useQuery } from "@tanstack/react-query";
import { getSalesDashboardLogs } from "../../services/sales/dashboard-logs.service";
import type {
  SalesLogItem,
  SalesLogModule,
} from "../../types/sales/dashboard-logs.response";

export const salesDashboardLogsQueryKeys = {
  all: ["sales-dashboard-logs"] as const,
  byModule: (module: SalesLogModule) =>
    [...salesDashboardLogsQueryKeys.all, { module }] as const,
};

export function useSalesDashboardLogsQuery(module: SalesLogModule) {
  const query = useQuery({
    queryKey: salesDashboardLogsQueryKeys.byModule(module),
    queryFn: (): Promise<SalesLogItem[]> => getSalesDashboardLogs(module),
    refetchOnMount: "always",
    staleTime: 0,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    error: query.error ?? null,
    data: query.data ?? [],
    refetch: query.refetch,
  };
}
