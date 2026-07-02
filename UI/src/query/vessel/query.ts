import { useQuery } from "@tanstack/react-query";
import { getVessels } from "../../services/vessel/service";

export const vesselQueryKeys = {
  all: ["vessels"] as const,
  list: () => [...vesselQueryKeys.all] as const,
};

export function useVesselsQuery() {
  const query = useQuery({
    queryKey: vesselQueryKeys.list(),
    queryFn: getVessels,
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
