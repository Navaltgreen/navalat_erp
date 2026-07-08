import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../../services/global/service";

export const globalQueryKeys = {
  all: ["global"] as const,
  teams: () => [...globalQueryKeys.all, "teams"] as const,
};

export function useTeamsQuery() {
  const query = useQuery({
    queryKey: globalQueryKeys.teams(),
    queryFn: getTeams,
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
