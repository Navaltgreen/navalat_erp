import { useQuery } from "@tanstack/react-query";
import { getLeadsRecords } from "../../../../services/sales/management/leads/service";

export const leadsQueryKeys = {
  all: ["leads"] as const,
  list: () => [...leadsQueryKeys.all] as const,
};

export function useLeadsQuery() {
  const query = useQuery({
    queryKey: leadsQueryKeys.list(),
    queryFn: getLeadsRecords,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    refetch: query.refetch,
  };
}
