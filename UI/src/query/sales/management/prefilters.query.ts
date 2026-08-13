import { useQuery } from "@tanstack/react-query";
import { getSalesPrefilters } from "../../../services/sales/management/prefilters.service";

export const salesPrefiltersQueryKeys = {
  all: ["sales-prefilters"] as const,
  byModule: (module: string) =>
    [...salesPrefiltersQueryKeys.all, { module }] as const,
};

export function useSalesPrefiltersQuery(module: string) {
  const query = useQuery({
    queryKey: salesPrefiltersQueryKeys.byModule(module),
    queryFn: () => getSalesPrefilters(module),
    enabled: module.trim().length > 0,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  return {
    loading: query.isLoading,
    data: query.data ?? {
      division: [],
      client: [],
      picForProposal: [],
    },
    error: query.error ?? null,
  };
}
