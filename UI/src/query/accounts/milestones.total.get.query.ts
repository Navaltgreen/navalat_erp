import { useQuery } from "@tanstack/react-query";
import { getMileStoneHistory } from "../../services/accounts/milestonehistorytotal.get.service";

export const MileStoneHistoryQueryKeys = {
  all: ["milestone-invoice-summary"] as const,
  list: (projectId: number | null) =>
    [...MileStoneHistoryQueryKeys.all, { projectId }] as const,
};

export function useMileStoneHistory(projectId: number | null) {
  const query = useQuery({
    queryKey: MileStoneHistoryQueryKeys.list(projectId),
    queryFn: () => getMileStoneHistory(projectId!),
    enabled: projectId !== null,
    refetchOnMount: false,
    gcTime: 1000 * 60 * 30,
  });

  return {
    loading: query.isLoading,
    data: query.data?.data ?? null,
    error: query.error ?? null,
    refetch: query.refetch,
  };
}
