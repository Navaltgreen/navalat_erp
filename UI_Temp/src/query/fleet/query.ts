import { useQuery } from "@tanstack/react-query";
import { getFleets } from "../../services/fleet/service";

export const fleetQueryKeys = {
  all: ["fleets"] as const,
  list: () => [...fleetQueryKeys.all] as const,
};

export function useFleetsQuery() {
  const query = useQuery({
    queryKey: fleetQueryKeys.list(),
    queryFn: getFleets,
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
