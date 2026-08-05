import { useQuery } from "@tanstack/react-query";
import { getSalesTeamMembers } from "../../services/sales/team-members.service";

export const salesTeamMembersQueryKeys = {
  all: ["sales-team-members"] as const,
  list: (teamId: number | null) =>
    [...salesTeamMembersQueryKeys.all, { teamId }] as const,
};

export function useSalesTeamMembersQuery(teamId: number | null) {
  const query = useQuery({
    queryKey: salesTeamMembersQueryKeys.list(teamId),
    queryFn: () => getSalesTeamMembers(teamId!),
    enabled: Boolean(teamId),
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
