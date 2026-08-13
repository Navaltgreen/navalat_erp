import { useQuery } from "@tanstack/react-query";
import { getProposalsRecords } from "../../../../services/sales/management/proposal/fetchData.service";

export const proposalsQueryKeys = {
  all: ["proposal"] as const,
  list: () => [...proposalsQueryKeys.all] as const,
};

export function useLeadsQuery() {
  const query = useQuery({
    queryKey: proposalsQueryKeys.list(),
    queryFn: getProposalsRecords,
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
