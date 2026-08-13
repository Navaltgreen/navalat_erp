import { useQuery } from "@tanstack/react-query";
import { getLeadHistory } from "../../../../services/sales/management/leads/history.service";

export const leadHistoryQueryKeys = {
  all: ["lead-history"] as const,
  detail: (leadId: number | null) =>
    [...leadHistoryQueryKeys.all, { leadId }] as const,
};

export function useLeadHistoryQuery(leadId: number | null) {
  const query = useQuery({
    queryKey: leadHistoryQueryKeys.detail(leadId),
    queryFn: () => getLeadHistory(leadId!),
    enabled: leadId !== null,
    refetchOnMount: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data ?? [],
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
