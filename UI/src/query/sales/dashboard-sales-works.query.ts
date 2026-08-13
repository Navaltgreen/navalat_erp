import { useQuery } from "@tanstack/react-query";
import { getSalesDashboardWorks } from "../../services/sales/dashboard-sales-works.service";
import type { SalesWorkItem } from "../../types/sales/dashboard-sales-works.response";

export const salesDashboardWorksQueryKeys = {
  all: ["sales-dashboard-works"] as const,
};

export function useSalesDashboardWorksQuery() {
  const query = useQuery({
    queryKey: salesDashboardWorksQueryKeys.all,
    queryFn: (): Promise<SalesWorkItem[]> => getSalesDashboardWorks(),
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
