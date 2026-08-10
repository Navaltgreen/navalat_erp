import { useQuery } from "@tanstack/react-query";
import { getMileStoneHistory } from "../../services/accounts/milestonehistory.get.service";

export const MileStoneHistoryQueryKeys = {
  all: ["milestone-history-total"] as const,
  list: (milestoneId: number | null) =>
    [...MileStoneHistoryQueryKeys.all, { milestoneId }] as const,
};

export function useMileStoneHistory(milestoneId: number | null) {
  const query = useQuery({
    // queryKey: MileStoneHistoryQueryKeys.list(milestoneId),
    queryFn: () => getMileStoneHistory(milestoneId!),
    queryKey: ["milestone-history", milestoneId],
    enabled: milestoneId !== null,
    refetchOnMount: false,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data ?? [],
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
