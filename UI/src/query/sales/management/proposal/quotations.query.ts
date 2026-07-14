import { useQuery } from "@tanstack/react-query";
import { getProposalQuotationsRecords } from "../../../../services/sales/management/proposal/fetchProposalQuotations.service";

export const proposalQuotationsQueryKeys = {
  all: ["proposal-quotations"] as const,
  list: (proposalId: number) =>
    [...proposalQuotationsQueryKeys.all, proposalId] as const,
};

export function useProposalQuotationsQuery(proposalId: number | null) {
  const query = useQuery({
    queryKey:
      proposalId === null
        ? proposalQuotationsQueryKeys.all
        : proposalQuotationsQueryKeys.list(proposalId),
    queryFn: () => getProposalQuotationsRecords(proposalId as number),
    enabled: proposalId !== null,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  return {
    loading: query.isLoading,
    data: query.data,
    error: query.error,
    refetch: query.refetch,
  };
}
