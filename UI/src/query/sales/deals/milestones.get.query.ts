import { useQuery } from "@tanstack/react-query";
import { getMileStones } from "../../../services/sales/deals/requestSalesMilestones.get.services";

export const milestoneQueryKeys = {
  all: ["milestones"] as const,
  list: (projectId: number) => [...milestoneQueryKeys.all, projectId] as const,
};

export function useMileStonesQuery(projectId: number) {
  const query = useQuery({
    queryKey: milestoneQueryKeys.list(projectId),
    // queryKey: ["milestones", projectId],
    queryFn: () => getMileStones(projectId),
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
