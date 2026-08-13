import { useQuery } from "@tanstack/react-query";
import { getMileStones } from "../../../services/sales/deals/requestSalesMilestones.get.services";

export const milestoneQueryKeys = {
  all: ["milestones"] as const,
  list: (
    projectId: number,
    startDate?: string | null,
    endDate?: string | null,
  ) => [...milestoneQueryKeys.all, projectId, { startDate, endDate }] as const,
};

export function useMileStonesQuery(
  projectId: number,
  startDate?: string | null,
  endDate?: string | null,
) {
  const query = useQuery({
    // queryKey: milestoneQueryKeys.list(projectId),
    queryKey: ["milestones", projectId, startDate, endDate],
    queryFn: () =>
      startDate && endDate
        ? getMileStones(projectId, startDate, endDate)
        : getMileStones(projectId),
    // queryFn: () => getMileStones(projectId, startDate, endDate),
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
