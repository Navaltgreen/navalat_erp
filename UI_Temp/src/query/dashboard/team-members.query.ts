import { useQuery } from "@tanstack/react-query";
import { getDashboardTeamMembers } from "../../services/dashboard/team-members.service";

export const dashboardTeamMembersQueryKeys = {
  all: ["dashboard-team-members"] as const,
  list: () => [...dashboardTeamMembersQueryKeys.all, "list"] as const,
};

export function useDashboardTeamMembersQuery() {
  const query = useQuery({
    queryKey: dashboardTeamMembersQueryKeys.list(),
    queryFn: getDashboardTeamMembers,
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
